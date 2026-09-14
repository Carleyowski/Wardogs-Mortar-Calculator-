# Wardogs Calculator

Bot Discord, który wylicza azymut i dystans potrzebny do trafienia celu ostrzałem
pośrednim (Moździerz / Artillery Tank) w WARDOGS, na podstawie współrzędnych z mapy.

## Komendy

- `/mortar a:<pozycja> b:<pozycja>` — wyliczenie dla **L81 Mortar** (zasięg 132–684 m)
- `/artillery a:<pozycja> b:<pozycja>` — wyliczenie dla **Artillery Tank** (zasięg 780–2600 m)
- `/help` — instrukcja użycia (widoczna tylko dla osoby, która wpisała komendę)

Gdzie:
- **a** = pozycja Twojej broni (Y / X), odczytana z mapy w grze
- **b** = pozycja celu (Y / X), odczytana z mapy w grze

Akceptowane formaty współrzędnych: `71.67 / 78.64`, `y71.67 x78.64`, `y:71.67, x:82.24`, `71.67,78.64`

---

## ⚠️ Ostrzeżenie dot. bezpieczeństwa

- **Nigdy nie wrzucaj prawdziwego pliku `.env` na GitHuba.** Zawiera on tajny token
  Twojego bota — kto go zdobędzie, może w pełni przejąć kontrolę nad botem.
- To repozytorium zawiera plik `.gitignore`, który wyklucza `.env` z commitów —
  upewnij się, że tam zostaje.
- **Wrzucając bota na hosting (np. Railway), NIE wklejaj prawdziwego tokena do pliku
  `.env` w repozytorium.** Zamiast tego ustaw `DISCORD_TOKEN`, `CLIENT_ID` i `GUILD_ID`
  jako **zmienne środowiskowe bezpośrednio w panelu hostingu** (patrz sekcja Railway
  poniżej). Plik `.env` powinien istnieć wyłącznie na Twoim lokalnym komputerze —
  nigdy w repozytorium Git.
- Jeśli kiedykolwiek przypadkiem wypchnąłeś prawdziwy token na GitHuba (nawet na
  chwilę), uznaj go za skompromitowany: wejdź do Discord Developer Portal i natychmiast
  zresetuj token.

---

## Opcja A — Uruchomienie lokalnie na komputerze

### Wymagania
- [Node.js](https://nodejs.org/) w wersji 18 lub nowszej
- Konto Discord + zarejestrowana aplikacja/bot

### 1. Skonfiguruj bota w Discord Developer Portal
1. Wejdź na https://discord.com/developers/applications i kliknij **New Application**.
2. W zakładce **Bot** kliknij **Reset Token** / **Copy** — to Twój `DISCORD_TOKEN`.
3. W zakładce **General Information** skopiuj **Application ID** — to Twój `CLIENT_ID`.
4. W **OAuth2 → URL Generator** zaznacz scope `bot` i `applications.commands`,
   a w uprawnieniach minimum **Send Messages** i **Use Slash Commands**. Wygenerowanym
   linkiem zaproś bota na swój serwer.

### 2. Zainstaluj zależności
```bash
npm install
```

### 3. Utwórz plik `.env`
Skopiuj `.env.example` do nowego pliku o dokładnej nazwie `.env` (w tym samym folderze
co `index.js`) i uzupełnij własnymi wartościami:
```
DISCORD_TOKEN=twoj_prawdziwy_token
CLIENT_ID=twoje_prawdziwe_application_id
GUILD_ID=id_twojego_serwera_testowego   (opcjonalne, zostaw puste dla rejestracji globalnej)
```

**Ten plik musisz utworzyć i uzupełnić samodzielnie — nigdy nie jest dołączany do
repozytorium ze względów bezpieczeństwa.**

### 4. Uruchom bota
```bash
npm start
```

W konsoli powinno pojawić się `Logged in as TwójBot#1234`. Na Discordzie spróbuj:
```
/mortar a: 71.67 / 78.64  b: 68.40 / 82.24
```

---

## Opcja B — Wdrożenie na Railway (bez konieczności trzymania włączonego PC)

1. Wypchnij projekt do repozytorium na GitHubie (upewnij się, że `.env` **nie** jest
   dołączony — sprawdź, czy `.gitignore` zawiera `.env`, zanim zrobisz commit).
2. Wejdź na [railway.app](https://railway.app) i zaloguj się przez GitHub.
3. Kliknij **New Project → Deploy from GitHub repo** i wybierz swoje repozytorium.
4. Po utworzeniu projektu otwórz zakładkę **Variables** i dodaj te zmienne środowiskowe
   **bezpośrednio w panelu Railway** (nie w pliku w repozytorium):
   - `DISCORD_TOKEN` = Twój prawdziwy token bota
   - `CLIENT_ID` = Twoje prawdziwe Application ID
   - `GUILD_ID` = ID Twojego serwera testowego (opcjonalne)
5. Railway automatycznie wykryje `package.json` i uruchomi `npm start`.
6. Sprawdź zakładkę **Deployments → Logs**, żeby potwierdzić, że widzisz
   `Logged in as TwójBot#1234`.

To wszystko — bot działa teraz cały czas na Railway i możesz zamknąć VS Code /
wyłączyć komputer, a bot pozostanie online.

---

## Zmiana zasięgu broni

Na górze pliku `index.js`:
```js
const WEAPONS = {
  mortar: { min: 132, max: 684, name: 'L81 Mortar' },
  artillery: { min: 780, max: 2600, name: 'Artillery Tank' },
};
```
Zmień te liczby, jeśli społeczność zmierzy dokładniejsze wartości, albo dodaj kolejną
broń przez dopisanie nowego wpisu i odpowiadającej mu komendy slash.

---

Bot stworzony przez luis ramirez.
