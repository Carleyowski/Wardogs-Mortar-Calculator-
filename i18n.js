// i18n.js
// Translation dictionary for all bot-facing text.
// Supported languages: en, pl, es, fr, pt, de
// Command NAMES stay in English across all languages (/mortar, /artillery, /help,
// /language) - only descriptions, embeds, and messages are translated.

const LANGUAGES = {
  en: { code: 'en', nativeName: 'English', flag: '🇬🇧' },
  pl: { code: 'pl', nativeName: 'Polski', flag: '🇵🇱' },
  es: { code: 'es', nativeName: 'Español', flag: '🇪🇸' },
  fr: { code: 'fr', nativeName: 'Français', flag: '🇫🇷' },
  pt: { code: 'pt', nativeName: 'Português', flag: '🇵🇹' },
  de: { code: 'de', nativeName: 'Deutsch', flag: '🇩🇪' },
};

const DEFAULT_LANGUAGE = 'en';

const STRINGS = {
  en: {
    commands: {
      mortar: 'Calculate azimuth and distance for the L81 Mortar',
      artillery: 'Calculate azimuth and distance for the Artillery Tank',
      help: 'Show usage instructions for /mortar and /artillery (visible only to you)',
      language: "Choose the bot's language for this server",
      optionA: 'Your weapon position (Y / X), e.g. "71.67 / 78.64"',
      optionB: 'Target / enemy base position (Y / X), e.g. "68.40 / 82.24"',
    },
    fireMission: {
      title: '🎯 Fire Mission - {weapon}',
      requestedBy: '{user} requested a fire mission:',
      weaponPos: 'Weapon position (a)',
      targetPos: 'Target position (b)',
      azimuth: 'Azimuth',
      distance: 'Distance',
    },
    warnings: {
      tooClose: '⚠️ The target is CLOSER than the minimum range of {weapon} ({min} m) — the weapon may not be able to hit it / risk of friendly fire.',
      tooFar: '⚠️ The target is FARTHER than the maximum range of {weapon} ({max} m) — move the weapon closer or use a longer-range option.',
      nearUpper: 'ℹ️ Target is near the upper range limit — set the barrel as flat as possible and confirm with a ranging shot.',
      nearLower: 'ℹ️ Target is near the lower range limit — set a high barrel elevation.',
      comfortable: '✅ Distance comfortably fits within the {weapon} range ({min}-{max} m).',
    },
    errors: {
      noPosition: 'No position provided.',
      parseFail: 'Could not read coordinates from: "{raw}". Use a format like "71.67 / 78.64" or "y71.67 x78.64".',
    },
    help: {
      title: '📖 Wardogs Calculator - Help',
      intro: 'This bot calculates the azimuth (bearing) and distance you need to hit a target with indirect fire in WARDOGS.',
      mortarFieldName: '/mortar a:<position> b:<position>',
      mortarFieldValue: 'Calculates the firing solution for the **L81 Mortar** (range {min}-{max} m).',
      artilleryFieldName: '/artillery a:<position> b:<position>',
      artilleryFieldValue: 'Calculates the firing solution for the **Artillery Tank** (range {min}-{max} m).',
      whatIsAName: 'What is "a"?',
      whatIsAValue: 'The position of **your own weapon** (mortar or artillery tank), read from the in-game map, in "Y / X" format.',
      whatIsBName: 'What is "b"?',
      whatIsBValue: 'The position of the **target** (enemy base, spotted enemy, etc.), read from the in-game map, in "Y / X" format.',
      formatsName: 'Accepted coordinate formats',
      formatsValue: '`71.67 / 78.64` · `y71.67 x78.64` · `y:71.67, x:82.24` · `71.67,78.64`',
    },
    language: {
      pickerTitle: '🌐 Choose the bot language for this server',
      confirmation: '✅ Language set to {name}.',
      permissionDenied: '❌ Only server administrators can change the bot\'s language.',
    },
    footer: 'Bot created by luis ramirez',
  },

  pl: {
    commands: {
      mortar: 'Oblicz azymut i dystans dla moździerza L81',
      artillery: 'Oblicz azymut i dystans dla Artillery Tank',
      help: 'Pokaż instrukcję użycia komend /mortar i /artillery (widoczna tylko dla Ciebie)',
      language: 'Wybierz język bota dla tego serwera',
      optionA: 'Pozycja Twojej broni (Y / X), np. "71.67 / 78.64"',
      optionB: 'Pozycja celu / bazy wroga (Y / X), np. "68.40 / 82.24"',
    },
    fireMission: {
      title: '🎯 Zlecenie ostrzału - {weapon}',
      requestedBy: '{user} zlecił(a) ostrzał:',
      weaponPos: 'Pozycja broni (a)',
      targetPos: 'Pozycja celu (b)',
      azimuth: 'Azymut',
      distance: 'Dystans',
    },
    warnings: {
      tooClose: '⚠️ Cel jest BLIŻEJ niż minimalny zasięg {weapon} ({min} m) — broń może nie dosięgnąć / ryzyko friendly fire.',
      tooFar: '⚠️ Cel jest DALEJ niż maksymalny zasięg {weapon} ({max} m) — przesuń broń bliżej albo użyj broni o większym zasięgu.',
      nearUpper: 'ℹ️ Cel blisko górnej granicy zasięgu — ustaw lufę maksymalnie płasko i sprawdź próbnym strzałem.',
      nearLower: 'ℹ️ Cel blisko dolnej granicy zasięgu — ustaw lufę wysoko (duży kąt podniesienia).',
      comfortable: '✅ Dystans mieści się wygodnie w zasięgu {weapon} ({min}-{max} m).',
    },
    errors: {
      noPosition: 'Nie podano pozycji.',
      parseFail: 'Nie udało się odczytać współrzędnych z: "{raw}". Użyj formatu np. "71.67 / 78.64" albo "y71.67 x78.64".',
    },
    help: {
      title: '📖 Wardogs Calculator - Pomoc',
      intro: 'Ten bot wylicza azymut i dystans potrzebny do trafienia celu ostrzałem pośrednim w WARDOGS.',
      mortarFieldName: '/mortar a:<pozycja> b:<pozycja>',
      mortarFieldValue: 'Wylicza dane ostrzału dla **moździerza L81** (zasięg {min}-{max} m).',
      artilleryFieldName: '/artillery a:<pozycja> b:<pozycja>',
      artilleryFieldValue: 'Wylicza dane ostrzału dla **Artillery Tank** (zasięg {min}-{max} m).',
      whatIsAName: 'Czym jest "a"?',
      whatIsAValue: 'Pozycja **Twojej własnej broni** (moździerz lub Artillery Tank), odczytana z mapy w grze, w formacie "Y / X".',
      whatIsBName: 'Czym jest "b"?',
      whatIsBValue: 'Pozycja **celu** (baza wroga, namierzony przeciwnik itp.), odczytana z mapy w grze, w formacie "Y / X".',
      formatsName: 'Akceptowane formaty współrzędnych',
      formatsValue: '`71.67 / 78.64` · `y71.67 x78.64` · `y:71.67, x:82.24` · `71.67,78.64`',
    },
    language: {
      pickerTitle: '🌐 Wybierz język bota dla tego serwera',
      confirmation: '✅ Ustawiono język: {name}.',
      permissionDenied: '❌ Tylko administrator serwera może zmienić język bota.',
    },
    footer: 'Bot stworzony przez luis ramirez',
  },

  es: {
    commands: {
      mortar: 'Calcula el azimut y la distancia para el Mortero L81',
      artillery: 'Calcula el azimut y la distancia para el Artillery Tank',
      help: 'Muestra las instrucciones de uso de /mortar y /artillery (visible solo para ti)',
      language: 'Elige el idioma del bot para este servidor',
      optionA: 'Posición de tu arma (Y / X), ej. "71.67 / 78.64"',
      optionB: 'Posición del objetivo / base enemiga (Y / X), ej. "68.40 / 82.24"',
    },
    fireMission: {
      title: '🎯 Misión de fuego - {weapon}',
      requestedBy: '{user} solicitó una misión de fuego:',
      weaponPos: 'Posición del arma (a)',
      targetPos: 'Posición del objetivo (b)',
      azimuth: 'Azimut',
      distance: 'Distancia',
    },
    warnings: {
      tooClose: '⚠️ El objetivo está MÁS CERCA que el alcance mínimo de {weapon} ({min} m) — el arma podría no alcanzarlo / riesgo de fuego amigo.',
      tooFar: '⚠️ El objetivo está MÁS LEJOS que el alcance máximo de {weapon} ({max} m) — acerca el arma o usa una opción de mayor alcance.',
      nearUpper: 'ℹ️ El objetivo está cerca del límite superior de alcance — coloca el cañón lo más plano posible y confirma con un disparo de prueba.',
      nearLower: 'ℹ️ El objetivo está cerca del límite inferior de alcance — usa una elevación de cañón alta.',
      comfortable: '✅ La distancia encaja cómodamente dentro del alcance de {weapon} ({min}-{max} m).',
    },
    errors: {
      noPosition: 'No se proporcionó ninguna posición.',
      parseFail: 'No se pudieron leer las coordenadas de: "{raw}". Usa un formato como "71.67 / 78.64" o "y71.67 x78.64".',
    },
    help: {
      title: '📖 Wardogs Calculator - Ayuda',
      intro: 'Este bot calcula el azimut y la distancia necesarios para alcanzar un objetivo con fuego indirecto en WARDOGS.',
      mortarFieldName: '/mortar a:<posición> b:<posición>',
      mortarFieldValue: 'Calcula la solución de disparo para el **Mortero L81** (alcance {min}-{max} m).',
      artilleryFieldName: '/artillery a:<posición> b:<posición>',
      artilleryFieldValue: 'Calcula la solución de disparo para el **Artillery Tank** (alcance {min}-{max} m).',
      whatIsAName: '¿Qué es "a"?',
      whatIsAValue: 'La posición de **tu propia arma** (mortero o artillery tank), leída del mapa del juego, en formato "Y / X".',
      whatIsBName: '¿Qué es "b"?',
      whatIsBValue: 'La posición del **objetivo** (base enemiga, enemigo detectado, etc.), leída del mapa del juego, en formato "Y / X".',
      formatsName: 'Formatos de coordenadas aceptados',
      formatsValue: '`71.67 / 78.64` · `y71.67 x78.64` · `y:71.67, x:82.24` · `71.67,78.64`',
    },
    language: {
      pickerTitle: '🌐 Elige el idioma del bot para este servidor',
      confirmation: '✅ Idioma establecido a {name}.',
      permissionDenied: '❌ Solo los administradores del servidor pueden cambiar el idioma del bot.',
    },
    footer: 'Bot creado por luis ramirez',
  },

  fr: {
    commands: {
      mortar: "Calcule l'azimut et la distance pour le Mortier L81",
      artillery: "Calcule l'azimut et la distance pour l'Artillery Tank",
      help: "Affiche les instructions d'utilisation de /mortar et /artillery (visible uniquement pour vous)",
      language: 'Choisissez la langue du bot pour ce serveur',
      optionA: 'Position de votre arme (Y / X), ex. "71.67 / 78.64"',
      optionB: 'Position de la cible / base ennemie (Y / X), ex. "68.40 / 82.24"',
    },
    fireMission: {
      title: '🎯 Mission de tir - {weapon}',
      requestedBy: '{user} a demandé une mission de tir :',
      weaponPos: "Position de l'arme (a)",
      targetPos: 'Position de la cible (b)',
      azimuth: 'Azimut',
      distance: 'Distance',
    },
    warnings: {
      tooClose: "⚠️ La cible est PLUS PROCHE que la portée minimale de {weapon} ({min} m) — l'arme risque de ne pas l'atteindre / risque de tir ami.",
      tooFar: "⚠️ La cible est PLUS ÉLOIGNÉE que la portée maximale de {weapon} ({max} m) — rapprochez l'arme ou utilisez une option à plus longue portée.",
      nearUpper: 'ℹ️ La cible est proche de la limite supérieure de portée — réglez le canon aussi à plat que possible et confirmez avec un tir de réglage.',
      nearLower: "ℹ️ La cible est proche de la limite inférieure de portée — utilisez une élévation de canon élevée.",
      comfortable: '✅ La distance se situe confortablement dans la portée de {weapon} ({min}-{max} m).',
    },
    errors: {
      noPosition: 'Aucune position fournie.',
      parseFail: 'Impossible de lire les coordonnées de : "{raw}". Utilisez un format comme "71.67 / 78.64" ou "y71.67 x78.64".',
    },
    help: {
      title: '📖 Wardogs Calculator - Aide',
      intro: "Ce bot calcule l'azimut et la distance nécessaires pour atteindre une cible avec un tir indirect dans WARDOGS.",
      mortarFieldName: '/mortar a:<position> b:<position>',
      mortarFieldValue: 'Calcule la solution de tir pour le **Mortier L81** (portée {min}-{max} m).',
      artilleryFieldName: '/artillery a:<position> b:<position>',
      artilleryFieldValue: "Calcule la solution de tir pour l'**Artillery Tank** (portée {min}-{max} m).",
      whatIsAName: 'Qu\'est-ce que "a" ?',
      whatIsAValue: "La position de **votre propre arme** (mortier ou artillery tank), lue sur la carte du jeu, au format \"Y / X\".",
      whatIsBName: 'Qu\'est-ce que "b" ?',
      whatIsBValue: "La position de la **cible** (base ennemie, ennemi repéré, etc.), lue sur la carte du jeu, au format \"Y / X\".",
      formatsName: 'Formats de coordonnées acceptés',
      formatsValue: '`71.67 / 78.64` · `y71.67 x78.64` · `y:71.67, x:82.24` · `71.67,78.64`',
    },
    language: {
      pickerTitle: '🌐 Choisissez la langue du bot pour ce serveur',
      confirmation: '✅ Langue définie sur {name}.',
      permissionDenied: "❌ Seuls les administrateurs du serveur peuvent changer la langue du bot.",
    },
    footer: 'Bot créé par luis ramirez',
  },

  pt: {
    commands: {
      mortar: 'Calcula o azimute e a distância para o Morteiro L81',
      artillery: 'Calcula o azimute e a distância para o Artillery Tank',
      help: 'Mostra as instruções de uso de /mortar e /artillery (visível apenas para você)',
      language: 'Escolha o idioma do bot para este servidor',
      optionA: 'Posição da sua arma (Y / X), ex. "71.67 / 78.64"',
      optionB: 'Posição do alvo / base inimiga (Y / X), ex. "68.40 / 82.24"',
    },
    fireMission: {
      title: '🎯 Missão de tiro - {weapon}',
      requestedBy: '{user} solicitou uma missão de tiro:',
      weaponPos: 'Posição da arma (a)',
      targetPos: 'Posição do alvo (b)',
      azimuth: 'Azimute',
      distance: 'Distância',
    },
    warnings: {
      tooClose: '⚠️ O alvo está MAIS PERTO do que o alcance mínimo de {weapon} ({min} m) — a arma pode não conseguir atingi-lo / risco de fogo amigo.',
      tooFar: '⚠️ O alvo está MAIS LONGE do que o alcance máximo de {weapon} ({max} m) — aproxime a arma ou use uma opção de maior alcance.',
      nearUpper: 'ℹ️ O alvo está perto do limite superior de alcance — ajuste o cano o mais plano possível e confirme com um tiro de ajuste.',
      nearLower: 'ℹ️ O alvo está perto do limite inferior de alcance — use uma elevação de cano alta.',
      comfortable: '✅ A distância se encaixa confortavelmente no alcance de {weapon} ({min}-{max} m).',
    },
    errors: {
      noPosition: 'Nenhuma posição fornecida.',
      parseFail: 'Não foi possível ler as coordenadas de: "{raw}". Use um formato como "71.67 / 78.64" ou "y71.67 x78.64".',
    },
    help: {
      title: '📖 Wardogs Calculator - Ajuda',
      intro: 'Este bot calcula o azimute e a distância necessários para atingir um alvo com fogo indireto no WARDOGS.',
      mortarFieldName: '/mortar a:<posição> b:<posição>',
      mortarFieldValue: 'Calcula a solução de tiro para o **Morteiro L81** (alcance {min}-{max} m).',
      artilleryFieldName: '/artillery a:<posição> b:<posição>',
      artilleryFieldValue: 'Calcula a solução de tiro para o **Artillery Tank** (alcance {min}-{max} m).',
      whatIsAName: 'O que é "a"?',
      whatIsAValue: 'A posição da **sua própria arma** (morteiro ou artillery tank), lida no mapa do jogo, no formato "Y / X".',
      whatIsBName: 'O que é "b"?',
      whatIsBValue: 'A posição do **alvo** (base inimiga, inimigo avistado, etc.), lida no mapa do jogo, no formato "Y / X".',
      formatsName: 'Formatos de coordenadas aceitos',
      formatsValue: '`71.67 / 78.64` · `y71.67 x78.64` · `y:71.67, x:82.24` · `71.67,78.64`',
    },
    language: {
      pickerTitle: '🌐 Escolha o idioma do bot para este servidor',
      confirmation: '✅ Idioma definido para {name}.',
      permissionDenied: '❌ Somente administradores do servidor podem mudar o idioma do bot.',
    },
    footer: 'Bot criado por luis ramirez',
  },

  de: {
    commands: {
      mortar: 'Berechnet Azimut und Entfernung für den L81 Mörser',
      artillery: 'Berechnet Azimut und Entfernung für den Artillery Tank',
      help: 'Zeigt die Nutzungsanleitung für /mortar und /artillery (nur für dich sichtbar)',
      language: 'Wähle die Sprache des Bots für diesen Server',
      optionA: 'Position deiner Waffe (Y / X), z. B. "71.67 / 78.64"',
      optionB: 'Position des Ziels / der gegnerischen Basis (Y / X), z. B. "68.40 / 82.24"',
    },
    fireMission: {
      title: '🎯 Feuerauftrag - {weapon}',
      requestedBy: '{user} hat einen Feuerauftrag angefordert:',
      weaponPos: 'Waffenposition (a)',
      targetPos: 'Zielposition (b)',
      azimuth: 'Azimut',
      distance: 'Entfernung',
    },
    warnings: {
      tooClose: '⚠️ Das Ziel ist NÄHER als die Mindestreichweite von {weapon} ({min} m) — die Waffe erreicht es eventuell nicht / Gefahr von Freundlichem Feuer.',
      tooFar: '⚠️ Das Ziel ist WEITER entfernt als die maximale Reichweite von {weapon} ({max} m) — bringe die Waffe näher heran oder nutze eine Waffe mit größerer Reichweite.',
      nearUpper: 'ℹ️ Das Ziel liegt nahe der oberen Reichweitengrenze — stelle das Rohr so flach wie möglich ein und bestätige mit einem Einschussschuss.',
      nearLower: 'ℹ️ Das Ziel liegt nahe der unteren Reichweitengrenze — stelle eine hohe Rohrerhöhung ein.',
      comfortable: '✅ Die Entfernung liegt bequem innerhalb der Reichweite von {weapon} ({min}-{max} m).',
    },
    errors: {
      noPosition: 'Keine Position angegeben.',
      parseFail: 'Koordinaten konnten nicht gelesen werden aus: "{raw}". Verwende ein Format wie "71.67 / 78.64" oder "y71.67 x78.64".',
    },
    help: {
      title: '📖 Wardogs Calculator - Hilfe',
      intro: 'Dieser Bot berechnet Azimut und Entfernung, die du brauchst, um ein Ziel mit indirektem Feuer in WARDOGS zu treffen.',
      mortarFieldName: '/mortar a:<position> b:<position>',
      mortarFieldValue: 'Berechnet die Feuerlösung für den **L81 Mörser** (Reichweite {min}-{max} m).',
      artilleryFieldName: '/artillery a:<position> b:<position>',
      artilleryFieldValue: 'Berechnet die Feuerlösung für den **Artillery Tank** (Reichweite {min}-{max} m).',
      whatIsAName: 'Was ist "a"?',
      whatIsAValue: 'Die Position **deiner eigenen Waffe** (Mörser oder Artillery Tank), von der Spielkarte abgelesen, im Format "Y / X".',
      whatIsBName: 'Was ist "b"?',
      whatIsBValue: 'Die Position des **Ziels** (gegnerische Basis, entdeckter Gegner usw.), von der Spielkarte abgelesen, im Format "Y / X".',
      formatsName: 'Akzeptierte Koordinatenformate',
      formatsValue: '`71.67 / 78.64` · `y71.67 x78.64` · `y:71.67, x:82.24` · `71.67,78.64`',
    },
    language: {
      pickerTitle: '🌐 Wähle die Sprache des Bots für diesen Server',
      confirmation: '✅ Sprache auf {name} gesetzt.',
      permissionDenied: '❌ Nur Server-Administratoren können die Sprache des Bots ändern.',
    },
    footer: 'Bot erstellt von luis ramirez',
  },
};

// Fetches a translated string by dot-path (e.g. "help.title") and substitutes
// {placeholders} with the given vars. Falls back to English, then to the raw key.
function t(lang, path, vars = {}) {
  const dict = STRINGS[lang] || STRINGS[DEFAULT_LANGUAGE];
  const parts = path.split('.');
  let node = dict;
  for (const p of parts) node = node && node[p];

  if (node === undefined) {
    // Fallback to English if the key is missing in the target language.
    let fallbackNode = STRINGS[DEFAULT_LANGUAGE];
    for (const p of parts) fallbackNode = fallbackNode && fallbackNode[p];
    node = fallbackNode !== undefined ? fallbackNode : path;
  }

  return String(node).replace(/\{(\w+)\}/g, (_, key) => (vars[key] !== undefined ? vars[key] : `{${key}}`));
}

module.exports = { LANGUAGES, DEFAULT_LANGUAGE, t };
