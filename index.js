// index.js
// Wardogs Calculator - Discord bot that calculates azimuth (bearing) and distance
// for indirect-fire weapons (Mortar / Artillery Tank) in WARDOGS, with per-server
// language selection via /language.
//
// Calculation rule:
// - Coordinates are given as "X, Y" (map unit = 100 m in-game).
// - dx = X_target - X_weapon   (positive = east)
// - dy = Y_target - Y_weapon   (positive = north)
// - distance (m) = sqrt(dx^2 + dy^2) * 100
// - azimuth = atan2(dx, dy) in degrees, normalized to 0-360 (0° = North, 90° = East)
//
// Commands:
//   /mortar a:<weapon position> b:<target position>     -> L81 Mortar (range 132-684 m)
//   /artillery a:<weapon position> b:<target position>  -> Artillery Tank (range 780-2600 m)
//   /help                                                -> usage guide (visible only to the requester)
//   /language                                            -> pick this server's language (buttons)
//
// NOTE on localization scope:
// - Command NAMES stay in English on every server for consistency (/mortar, /artillery,
//   /help, /language). Only descriptions, embeds, and messages are translated.
// - The bot's activity status (the "Playing ..." line under its name) is a single
//   global setting in Discord and cannot differ per server.

const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder,
  ActivityType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require('discord.js');
require('dotenv').config();

const { LANGUAGES, t } = require('./i18n');
const { getLanguage, setLanguage } = require('./languageStore');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // optional legacy single-guild fallback, see registerCommandsForGuild below

// Weapon ranges. Add more weapons here if needed.
const WEAPONS = {
  mortar: { min: 132, max: 684, name: 'L81 Mortar' },
  artillery: { min: 780, max: 2600, name: 'Artillery Tank' },
};

// Link shown by /tip. Replace this with your own Buy Me a Coffee / Ko-fi /
// PayPal.me link - this is the only thing you need to change.
const TIP_URL = 'https://buymeacoffee.com/your-username';

// --- Coordinate parsing ---
// Accepts formats such as:
//   "71.67 / 78.64"
//   "y71.67 x78.64"
//   "y:71.67, x:82.24"
//   "71,67 78,64"   (comma as decimal separator)
//   "71.67,78.64"
// Returns { y, x } as numbers.
function parsePosition(raw, lang) {
  if (!raw) throw new Error(t(lang, 'errors.noPosition'));

  let str = raw.trim().toLowerCase();

  const yMatch = str.match(/y\s*:?\s*(-?\d+[.,]?\d*)/);
  const xMatch = str.match(/x\s*:?\s*(-?\d+[.,]?\d*)/);

  if (yMatch && xMatch) {
    return {
      y: parseFloat(yMatch[1].replace(',', '.')),
      x: parseFloat(xMatch[1].replace(',', '.')),
    };
  }

  str = str.replace(/[xy:]/g, ' ');

  const parts = str
    .split(/[\/\s]+/)
    .filter(Boolean)
    .map(p => p.replace(/,(?=\d{1,2}\b)/, '.'));

  let nums = parts.map(p => parseFloat(p)).filter(n => !isNaN(n));

  if (nums.length !== 2) {
    const altParts = raw.trim().split(',').map(p => p.trim());
    if (altParts.length === 2) {
      nums = altParts.map(p => parseFloat(p.replace(',', '.')));
    }
  }

  if (nums.length !== 2 || nums.some(isNaN)) {
    throw new Error(t(lang, 'errors.parseFail', { raw }));
  }

  return { x: nums[0], y: nums[1] };
}

// --- Azimuth / distance calculation ---
function calculate(weapon, target) {
  const dx = target.x - weapon.x;
  const dy = target.y - weapon.y;

  const distanceUnits = Math.sqrt(dx * dx + dy * dy);
  const distanceMeters = distanceUnits * 100;

  let azimuth = Math.atan2(dx, dy) * (180 / Math.PI);
  if (azimuth < 0) azimuth += 360;

  return { distanceMeters, azimuth };
}

function bearingToCompass(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const idx = Math.round(deg / 22.5) % 16;
  return dirs[idx];
}

function rangeWarning(distance, weaponRange, lang) {
  const vars = { weapon: weaponRange.name, min: weaponRange.min, max: weaponRange.max };
  if (distance < weaponRange.min) return t(lang, 'warnings.tooClose', vars);
  if (distance > weaponRange.max) return t(lang, 'warnings.tooFar', vars);
  if (distance > weaponRange.max - 30) return t(lang, 'warnings.nearUpper', vars);
  if (distance < weaponRange.min + 30) return t(lang, 'warnings.nearLower', vars);
  return t(lang, 'warnings.comfortable', vars);
}

// --- Shared handler for /mortar and /artillery ---
async function handleFireMission(interaction, weaponKey) {
  const lang = getLanguage(interaction.guildId);
  const weaponRange = WEAPONS[weaponKey];
  const aRaw = interaction.options.getString('a');
  const bRaw = interaction.options.getString('b');

  try {
    const weaponPos = parsePosition(aRaw, lang);
    const targetPos = parsePosition(bRaw, lang);
    const { distanceMeters, azimuth } = calculate(weaponPos, targetPos);
    const compass = bearingToCompass(azimuth);
    const warning = rangeWarning(distanceMeters, weaponRange, lang);

    const embed = new EmbedBuilder()
      .setTitle(t(lang, 'fireMission.title', { weapon: weaponRange.name }))
      .setColor(0x2b6cb0)
      .addFields(
        { name: t(lang, 'fireMission.weaponPos'), value: `${weaponPos.x} / ${weaponPos.y}`, inline: true },
        { name: t(lang, 'fireMission.targetPos'), value: `${targetPos.x} / ${targetPos.y}`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: t(lang, 'fireMission.azimuth'), value: `${azimuth.toFixed(1)}° (${compass})`, inline: true },
        { name: t(lang, 'fireMission.distance'), value: `${distanceMeters.toFixed(0)} m`, inline: true },
      )
      .setDescription(warning)
      .setFooter({ text: t(lang, 'footer') });

    await interaction.reply({
      content: t(lang, 'fireMission.requestedBy', { user: interaction.user.toString() }),
      embeds: [embed],
    });
  } catch (err) {
    await interaction.reply({ content: `❌ ${err.message}`, ephemeral: true });
  }
}

async function handleHelp(interaction) {
  const lang = getLanguage(interaction.guildId);

  const embed = new EmbedBuilder()
    .setTitle(t(lang, 'help.title'))
    .setColor(0x2b6cb0)
    .setDescription(t(lang, 'help.intro'))
    .addFields(
      { name: t(lang, 'help.mortarFieldName'), value: t(lang, 'help.mortarFieldValue', { min: WEAPONS.mortar.min, max: WEAPONS.mortar.max }) },
      { name: t(lang, 'help.artilleryFieldName'), value: t(lang, 'help.artilleryFieldValue', { min: WEAPONS.artillery.min, max: WEAPONS.artillery.max }) },
      { name: t(lang, 'help.whatIsAName'), value: t(lang, 'help.whatIsAValue') },
      { name: t(lang, 'help.whatIsBName'), value: t(lang, 'help.whatIsBValue') },
      { name: t(lang, 'help.formatsName'), value: t(lang, 'help.formatsValue') },
    )
    .setFooter({ text: t(lang, 'footer') });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleTip(interaction) {
  const lang = getLanguage(interaction.guildId);

  const embed = new EmbedBuilder()
    .setTitle(t(lang, 'tip.title'))
    .setDescription(t(lang, 'tip.description', { url: TIP_URL }))
    .setColor(0x2b6cb0)
    .setFooter({ text: t(lang, 'footer') });

  // Ephemeral - only the person who ran /tip sees it, so it doesn't clutter the channel.
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

function buildLanguageRows() {
  const codes = Object.keys(LANGUAGES);
  const rows = [];
  for (let i = 0; i < codes.length; i += 5) {
    const row = new ActionRowBuilder();
    for (const code of codes.slice(i, i + 5)) {
      const lang = LANGUAGES[code];
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`lang_${code}`)
          .setLabel(`${lang.flag} ${lang.nativeName}`)
          .setStyle(ButtonStyle.Secondary)
      );
    }
    rows.push(row);
  }
  return rows;
}

async function handleLanguagePicker(interaction) {
  const lang = getLanguage(interaction.guildId);
  const embed = new EmbedBuilder()
    .setTitle(t(lang, 'language.pickerTitle'))
    .setColor(0x2b6cb0)
    .setFooter({ text: t(lang, 'footer') });

  await interaction.reply({ embeds: [embed], components: buildLanguageRows() });
}

async function handleLanguageButton(interaction) {
  const selectedCode = interaction.customId.replace('lang_', '');
  const selectedLang = LANGUAGES[selectedCode];
  if (!selectedLang) return;

  // Only server admins may change the language (matches the command-level
  // restriction above). This check still matters even though the command
  // itself is admin-only, because the message with buttons is visible to
  // everyone on the channel, not just the person who ran /language.
  const canManage = interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator);
  if (!canManage) {
    const currentLang = getLanguage(interaction.guildId);
    await interaction.reply({ content: t(currentLang, 'language.permissionDenied'), ephemeral: true });
    return;
  }

  // Acknowledge the click immediately - the interaction token is only valid for a
  // few seconds, and registering guild commands below can take longer than that.
  await interaction.deferUpdate();

  setLanguage(interaction.guildId, selectedCode);
  await registerCommandsForGuild(interaction.guildId, selectedCode);

  const embed = new EmbedBuilder()
    .setTitle(t(selectedCode, 'language.pickerTitle'))
    .setDescription(t(selectedCode, 'language.confirmation', { name: `${selectedLang.flag} ${selectedLang.nativeName}` }))
    .setColor(0x2b6cb0)
    .setFooter({ text: t(selectedCode, 'footer') });

  await interaction.editReply({ embeds: [embed], components: [] });
}

// --- Slash command registration (per guild, so each server can have its own language) ---
function buildCommandsForLanguage(lang) {
  const positionOptions = (builder) =>
    builder
      .addStringOption(option =>
        option.setName('a')
          .setDescription(t(lang, 'commands.optionA'))
          .setRequired(true))
      .addStringOption(option =>
        option.setName('b')
          .setDescription(t(lang, 'commands.optionB'))
          .setRequired(true));

  return [
    positionOptions(new SlashCommandBuilder().setName('mortar').setDescription(t(lang, 'commands.mortar'))),
    positionOptions(new SlashCommandBuilder().setName('artillery').setDescription(t(lang, 'commands.artillery'))),
    new SlashCommandBuilder().setName('help').setDescription(t(lang, 'commands.help')),
    new SlashCommandBuilder().setName('tip').setDescription(t(lang, 'commands.tip')),
    new SlashCommandBuilder()
      .setName('language')
      .setDescription(t(lang, 'commands.language'))
      // Only members with the Administrator permission can see/use this command
      // by default. Server owners can still widen this later via
      // Server Settings -> Integrations -> Wardogs Calculator -> /language.
      .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  ].map(cmd => cmd.toJSON());
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

// In-memory cache of the last language we actually registered commands for,
// per guild - avoids redundant PUT requests (and the rate-limit risk that
// comes with them) when the language hasn't actually changed.
const lastRegisteredLanguage = new Map();

// Per-guild lock so two overlapping registration calls (e.g. two fast clicks)
// never race each other - the second one just waits for the first to finish.
const registrationLocks = new Map();

async function registerCommandsForGuild(guildId, lang, { force = false } = {}) {
  if (!force && lastRegisteredLanguage.get(guildId) === lang) {
    // Already registered in this language - nothing to do.
    return;
  }

  const previousLock = registrationLocks.get(guildId) || Promise.resolve();
  const thisRegistration = previousLock
    .catch(() => {}) // don't let a previous failure block this one
    .then(async () => {
      try {
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), { body: buildCommandsForLanguage(lang) });
        lastRegisteredLanguage.set(guildId, lang);
        console.log(`Commands registered for guild ${guildId} in "${lang}".`);
      } catch (err) {
        console.error(`Command registration error for guild ${guildId}:`, err);
      }
    });

  registrationLocks.set(guildId, thisRegistration);
  return thisRegistration;
}

// --- Discord client ---
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('clientReady', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  client.user.setPresence({
    activities: [{ name: '/help - Your Wardog Friend', type: ActivityType.Playing }],
    status: 'online',
  });

  // Register commands for every guild the bot is currently in, using each
  // guild's previously saved language (defaults to English if none saved yet).
  for (const guild of client.guilds.cache.values()) {
    const lang = getLanguage(guild.id);
    await registerCommandsForGuild(guild.id, lang);
  }

  // Legacy fallback: if GUILD_ID is set in .env and the bot somehow has no
  // guilds cached yet (e.g. very first run), register there too.
  if (GUILD_ID && !client.guilds.cache.has(GUILD_ID)) {
    await registerCommandsForGuild(GUILD_ID, getLanguage(GUILD_ID));
  }
});

// When the bot is invited to a new server, register English commands there by default.
client.on('guildCreate', async (guild) => {
  await registerCommandsForGuild(guild.id, getLanguage(guild.id));
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'mortar') return await handleFireMission(interaction, 'mortar');
      if (interaction.commandName === 'artillery') return await handleFireMission(interaction, 'artillery');
      if (interaction.commandName === 'help') return await handleHelp(interaction);
      if (interaction.commandName === 'tip') return await handleTip(interaction);
      if (interaction.commandName === 'language') return await handleLanguagePicker(interaction);
      return;
    }

    if (interaction.isButton() && interaction.customId.startsWith('lang_')) {
      return await handleLanguageButton(interaction);
    }
  } catch (err) {
    // Never let a single bad interaction (e.g. an expired token, a Discord API
    // hiccup) crash the whole bot process - just log it and move on.
    console.error('Unhandled interaction error:', err);
    try {
      const payload = { content: '❌ Something went wrong handling that. Please try again.', ephemeral: true };
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(payload);
      } else {
        await interaction.reply(payload);
      }
    } catch (followUpErr) {
      // If we can't even send an error message (e.g. interaction truly expired),
      // there's nothing more we can do - just log it.
      console.error('Failed to notify user about the error:', followUpErr);
    }
  }
});

// Catch client-level errors (e.g. WebSocket hiccups) without crashing the process.
client.on('error', (err) => {
  console.error('Discord client error:', err);
});

// Catch anything that slips through unhandled promise rejections anywhere else
// in the bot, so the whole process doesn't go down over one bad request.
process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
});

client.login(TOKEN);
