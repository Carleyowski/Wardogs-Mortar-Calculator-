# Wardogs Calculator

A Discord bot that calculates the azimuth (bearing) and distance needed to hit a target
with indirect fire (Mortar / Artillery Tank) in WARDOGS, based on map coordinates —
with a language picker so each server can use the bot in its own language.

## Commands

- `/mortar a:<position> b:<position>` — firing solution for the **L81 Mortar** (range 132–684 m)
- `/artillery a:<position> b:<position>` — firing solution for the **Artillery Tank** (range 780–2600 m)
- `/help` — usage instructions (visible only to the person who ran the command)
- `/language` — pick this server's language via buttons: English, Polski, Español,
  Français, Português, Deutsch. Requires the **Manage Server** permission to change.

Where:
- **a** = your weapon's position (Y / X), read from the in-game map
- **b** = the target's position (Y / X), read from the in-game map

Accepted coordinate formats: `71.67 / 78.64`, `y71.67 x78.64`, `y:71.67, x:82.24`, `71.67,78.64`

### About localization
- Command **names** stay in English on every server (`/mortar`, `/artillery`, `/help`,
  `/language`) for consistency — only descriptions, embeds, warnings, and errors are
  translated.
- The bot's activity status (the "Playing ..." line under its name) is a single global
  Discord setting and cannot be different per server.
- The selected language is stored **per server**, in a small local file
  (`data/languages.json`) created automatically the first time the bot runs.

---

## ⚠️ Security warning

- **Never commit your real `.env` file to GitHub.** It contains your bot's secret token.
  Anyone who gets that token can fully control your bot.
- This repo includes a `.gitignore` that excludes `.env`, `node_modules/`, and `data/` —
  make sure it stays in place.
- **When deploying to a hosting platform (e.g. Railway), do NOT paste your real token
  into an `.env` file in the repo.** Instead, set `DISCORD_TOKEN`, `CLIENT_ID`, and
  `GUILD_ID` as **environment variables directly in the hosting platform's dashboard**
  (see the Railway section below). The `.env` file is only ever meant to exist on your
  own local machine, never inside the Git repository.
- If you ever accidentally pushed a real token to GitHub (even briefly), consider it
  compromised: go to the Discord Developer Portal and reset the token immediately.

---

## Option A — Run locally on your computer

### Requirements
- [Node.js](https://nodejs.org/) version 18 or newer
- A Discord account + a registered application/bot

### 1. Set up the bot in the Discord Developer Portal
1. Go to https://discord.com/developers/applications and click **New Application**.
2. In the **Bot** tab, click **Reset Token** / **Copy** — this is your `DISCORD_TOKEN`.
3. In the **General Information** tab, copy the **Application ID** — this is your `CLIENT_ID`.
4. In **OAuth2 → URL Generator**, check the `bot` and `applications.commands` scopes,
   and under permissions check at least **Send Messages** and **Use Slash Commands**.
   Use the generated link to invite the bot to your server.

### 2. Install dependencies
```bash
npm install
```

### 3. Create your `.env` file
Copy `.env.example` to a new file named exactly `.env` (in the same folder as `index.js`),
and fill in your own values:
```
DISCORD_TOKEN=your_real_token
CLIENT_ID=your_real_application_id
GUILD_ID=your_test_server_id   (optional, only used as a first-run fallback)
```

**You must create and fill in this file yourself — it is never included in the repo
for security reasons.**

### 4. Run the bot
```bash
npm start
```

You should see `Logged in as YourBot#1234` in the console, plus a confirmation that
commands were registered for each server the bot is in. On Discord, try:
```
/language
/mortar a: 71.67 / 78.64  b: 68.40 / 82.24
```

---

## Option B — Deploy on Railway (no need to keep your PC running)

1. Push this project to a GitHub repository (make sure `.env` and `data/` are **not**
   included — check that `.gitignore` covers them before you commit).
2. Go to [railway.app](https://railway.app) and sign in with GitHub.
3. Click **New Project → Deploy from GitHub repo**, and select your repository.
4. Open the **Variables** tab and add these environment variables **directly in
   Railway's dashboard** (do not put them in a file in the repo):
   - `DISCORD_TOKEN` = your real bot token
   - `CLIENT_ID` = your real application ID
   - `GUILD_ID` = your test server ID (optional)
5. Railway automatically detects `package.json` and runs `npm start`.
6. Check the **Deployments → Logs** tab to confirm you see `Logged in as YourBot#1234`.

### ⚠️ Important: saved languages and Railway's filesystem
This bot stores each server's chosen language in a local file (`data/languages.json`).
On Railway's free/default setup, the filesystem is **ephemeral** — it resets on every
redeploy, so saved languages would revert to English after you push an update. If you
want language choices to survive redeploys, add a **Volume** in Railway (Project →
Settings → Volumes) mounted at `/app/data`, so `data/languages.json` persists across
deployments. Without a Volume, servers will just need to run `/language` again after
you redeploy — everything else keeps working normally.

---

## Changing weapon ranges

At the top of `index.js`:
```js
const WEAPONS = {
  mortar: { min: 132, max: 684, name: 'L81 Mortar' },
  artillery: { min: 780, max: 2600, name: 'Artillery Tank' },
};
```
Adjust these numbers if the community measures more precise values, or add new weapons
by adding another entry, a matching slash command, and translations in `i18n.js`.

## Adding another language

Add a new entry to `LANGUAGES` and a matching block in `STRINGS` inside `i18n.js`,
following the structure of the existing languages. The new language will automatically
appear as a button under `/language`.

---

Bot created by luis ramirez.
