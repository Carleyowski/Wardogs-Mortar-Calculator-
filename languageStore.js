// languageStore.js
// Very simple per-guild language storage backed by a local JSON file.
// Good enough for a single-instance bot. Note: on some hosting platforms
// (e.g. Railway without a mounted Volume) the filesystem resets on every
// redeploy, so saved languages would reset too - see README for details.

const fs = require('fs');
const path = require('path');
const { DEFAULT_LANGUAGE } = require('./i18n');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'languages.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '{}', 'utf8');
}

function readAll() {
  ensureFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (err) {
    console.error('Failed to read language store, resetting it:', err);
    return {};
  }
}

function writeAll(data) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function getLanguage(guildId) {
  if (!guildId) return DEFAULT_LANGUAGE;
  const data = readAll();
  return data[guildId] || DEFAULT_LANGUAGE;
}

function setLanguage(guildId, lang) {
  if (!guildId) return;
  const data = readAll();
  data[guildId] = lang;
  writeAll(data);
}

module.exports = { getLanguage, setLanguage };
