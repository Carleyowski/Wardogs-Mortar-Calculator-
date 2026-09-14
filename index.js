// index.js
// Bot Discord z komendą /licz do wyliczania azymutu i dystansu dla moździerza w WARDOGS.
//
// Zasada liczenia (jak w rozmowie):
// - Współrzędne podajemy w formacie "Y, X" (jednostka mapy = 100 m w grze).
// - dx = Xcel - Xmozdzierz   (dodatnie = na wschód)
// - dy = Ycel - Ymozdzierz   (dodatnie = na północ)
// - dystans (m) = sqrt(dx^2 + dy^2) * 100
// - azymut = atan2(dx, dy) w stopniach, znormalizowany do zakresu 0-360 (0° = północ, 90° = wschód)
//
// Bot dodatkowo ostrzega, jeśli dystans wypada poza typowym zasięgiem moździerza L81 (132-684 m).

const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // opcjonalnie - do szybkiej rejestracji komend na jednym serwerze

// Zasięg moździerza L81 (możesz zmienić/dodać kolejne bronie poniżej)
const MORTAR_RANGE = { min: 132, max: 684, name: 'L81 Mortar' };

// --- Parsowanie współrzędnych ---
// Akceptuje formaty typu:
//   "71.67 / 78.64"
//   "y71.67 x78.64"
//   "y:71.67, x:78.64"
//   "71,67 78,64"   (przecinek jako separator dziesiętny)
//   "71.67,78.64"
// Zwraca { y, x } jako liczby.
function parsePosition(raw) {
  if (!raw) throw new Error('Brak podanej pozycji.');

  let str = raw.trim().toLowerCase();

  // Jeśli są jawne etykiety y i x, wyciągamy je po literach.
  const yMatch = str.match(/y\s*:?\s*(-?\d+[.,]?\d*)/);
  const xMatch = str.match(/x\s*:?\s*(-?\d+[.,]?\d*)/);

  if (yMatch && xMatch) {
    return {
      y: parseFloat(yMatch[1].replace(',', '.')),
      x: parseFloat(xMatch[1].replace(',', '.')),
    };
  }

  // Brak etykiet - zakładamy kolejność "Y, X" (tak jak w tej rozmowie),
  // rozdzielone spacją, ukośnikiem lub przecinkiem (ale nie przecinkiem dziesiętnym).
  // Usuwamy litery x/y jeśli się gdzieś zawieruszyły pojedynczo.
  str = str.replace(/[xy:]/g, ' ');

  // Rozbijamy po separatorach "/", spacji - liczby mogą mieć przecinek jako separator dziesiętny.
  const parts = str
    .split(/[\/\s]+/)
    .filter(Boolean)
    .map(p => p.replace(/,(?=\d{1,2}\b)/, '.')); // przecinek przed 1-2 cyframi traktujemy jako część liczby

  // Jeśli po podziale zostały dokładnie 2 kawałki - super.
  let nums = parts.map(p => parseFloat(p)).filter(n => !isNaN(n));

  if (nums.length !== 2) {
    // Ostatnia deska ratunku: spróbuj rozdzielić po przecinku traktowanym jako separator wartości
    const altParts = raw.trim().split(',').map(p => p.trim());
    if (altParts.length === 2) {
      nums = altParts.map(p => parseFloat(p.replace(',', '.')));
    }
  }

  if (nums.length !== 2 || nums.some(isNaN)) {
    throw new Error(`Nie udało się odczytać współrzędnych z: "${raw}". Użyj formatu np. "71.67 / 78.64" albo "y71.67 x78.64".`);
  }

  return { y: nums[0], x: nums[1] };
}

// --- Liczenie azymutu i dystansu ---
function calculate(mortar, target) {
  const dx = target.x - mortar.x;
  const dy = target.y - mortar.y;

  const distanceUnits = Math.sqrt(dx * dx + dy * dy);
  const distanceMeters = distanceUnits * 100;

  let azimuth = Math.atan2(dx, dy) * (180 / Math.PI);
  if (azimuth < 0) azimuth += 360;

  return { distanceMeters, azimuth, dx, dy };
}

function bearingToCompass(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(deg / 22.5) % 16;
  return dirs[idx];
}

function rangeWarning(distance) {
  if (distance < MORTAR_RANGE.min) {
    return `⚠️ Cel jest BLIŻEJ niż minimalny zasięg ${MORTAR_RANGE.name} (${MORTAR_RANGE.min} m) — moździerz może nie dosięgnąć / ryzyko friendly fire.`;
  }
  if (distance > MORTAR_RANGE.max) {
    return `⚠️ Cel jest DALEJ niż maksymalny zasięg ${MORTAR_RANGE.name} (${MORTAR_RANGE.max} m) — trzeba przesunąć moździerz bliżej albo użyć cięższej artylerii.`;
  }
  if (distance > MORTAR_RANGE.max - 30) {
    return `ℹ️ Cel blisko górnej granicy zasięgu — ustaw lufę maksymalnie płasko i sprawdź próbnym strzałem.`;
  }
  if (distance < MORTAR_RANGE.min + 30) {
    return `ℹ️ Cel blisko dolnej granicy zasięgu — ustaw lufę wysoko (duży kąt podniesienia).`;
  }
  return `✅ Dystans mieści się wygodnie w zasięgu ${MORTAR_RANGE.name} (${MORTAR_RANGE.min}-${MORTAR_RANGE.max} m).`;
}

// --- Rejestracja komendy slash ---
const commands = [
  new SlashCommandBuilder()
    .setName('licz')
    .setDescription('Liczy azymut i dystans dla moździerza w WARDOGS')
    .addStringOption(option =>
      option.setName('m')
        .setDescription('Pozycja moździerza, np. "71.67 / 78.64" (Y / X)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('b')
        .setDescription('Pozycja celu / bazy, np. "68.40 / 82.24" (Y / X)')
        .setRequired(true)),
].map(cmd => cmd.toJSON());

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    if (GUILD_ID) {
      // Rejestracja na jednym serwerze - komendy pojawiają się natychmiast, dobre do testów.
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
      console.log('Zarejestrowano komendy na serwerze testowym.');
    } else {
      // Rejestracja globalna - może zająć do ~1h zanim się rozpropaguje.
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
      console.log('Zarejestrowano komendy globalnie.');
    }
  } catch (err) {
    console.error('Błąd rejestracji komend:', err);
  }
}

// --- Klient Discord ---
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'licz') return;

  const mRaw = interaction.options.getString('m');
  const bRaw = interaction.options.getString('b');

  try {
    const mortar = parsePosition(mRaw);
    const target = parsePosition(bRaw);
    const { distanceMeters, azimuth } = calculate(mortar, target);
    const compass = bearingToCompass(azimuth);
    const warning = rangeWarning(distanceMeters);

    const embed = new EmbedBuilder()
      .setTitle('🎯 Wyliczenie ostrzału')
      .setColor(0x2b6cb0)
      .addFields(
        { name: 'Moździerz (Y/X)', value: `${mortar.y} / ${mortar.x}`, inline: true },
        { name: 'Cel (Y/X)', value: `${target.y} / ${target.x}`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: 'Azymut', value: `${azimuth.toFixed(1)}° (${compass})`, inline: true },
        { name: 'Dystans', value: `${distanceMeters.toFixed(0)} m`, inline: true },
      )
      .setDescription(warning);

    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    await interaction.reply({ content: `❌ ${err.message}`, ephemeral: true });
  }
});

// Rejestrujemy komendy przy starcie, potem logujemy bota.
registerCommands().then(() => client.login(TOKEN));
