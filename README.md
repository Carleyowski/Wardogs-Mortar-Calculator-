# WARDOGS Mortar Bot

Discord bot z komendą `/licz`, który wylicza azymut i dystans dla moździerza na podstawie
współrzędnych z mapy w WARDOGS — dokładnie tak, jak liczyliśmy ręcznie w rozmowie.

## Wymagania

- [Node.js](https://nodejs.org/) w wersji 18 lub nowszej
- Konto Discord Developer + utworzona aplikacja/bot

## Konfiguracja bota w Discord Developer Portal

1. Wejdź na https://discord.com/developers/applications i kliknij **New Application**.
2. W zakładce **Bot** kliknij **Reset Token** / **Copy** — to jest Twój `DISCORD_TOKEN`.
3. W zakładce **General Information** skopiuj **Application ID** — to jest Twój `CLIENT_ID`.
4. W zakładce **OAuth2 -> URL Generator** zaznacz scope `bot` i `applications.commands`,
   w uprawnieniach zaznacz minimum **Send Messages** i **Use Slash Commands**, wygenerowanym
   linkiem zaproś bota na swój serwer.

## Instalacja

```bash
cd mortar-bot
npm install
cp .env.example .env
```

Otwórz plik `.env` i uzupełnij `DISCORD_TOKEN`, `CLIENT_ID` oraz opcjonalnie `GUILD_ID`
(ID serwera testowego — z nim komenda pojawi się natychmiast; bez niego rejestracja jest
globalna i może zająć do ok. godziny).

## Uruchomienie

```bash
npm start
```

W konsoli powinno pojawić się `Zalogowano jako TwójBot#1234` oraz potwierdzenie rejestracji
komend.

## Użycie na Discordzie

```
/licz m: 71.67 / 78.64  b: 68.40 / 82.24
```

Akceptowane formaty współrzędnych (obie opcje `m` i `b`):

- `71.67 / 78.64`
- `y71.67 x78.64`
- `y:71.67, x:78.64`
- `71.67,78.64`

Bot odpowie osadzoną wiadomością (embed) z:
- azymutem w stopniach + kierunkiem kompasowym (np. „127° (SE)”),
- dystansem w metrach,
- ostrzeżeniem, jeśli cel jest poza typowym zasięgiem moździerza L81 (132–684 m).

## Zmiana zasięgu broni / dodanie kolejnej

W pliku `index.js` na górze znajduje się:

```js
const MORTAR_RANGE = { min: 132, max: 684, name: 'L81 Mortar' };
```

Zmień te liczby, jeśli społeczność zmierzy dokładniejsze wartości, albo rozbuduj kod o
wybór broni przez dodatkową opcję komendy (np. `/licz broń:L52 Cannon`), jeśli chcesz
wspierać też cięższą artylerię (orientacyjnie 780–2629 m).

## Uwaga dot. konwencji współrzędnych

Bot zakłada kolejność **Y, X** przy braku jawnych etykiet — czyli tak jak w tej rozmowie
i jak pokazuje własny odczyt gry. Jeśli w Twojej drużynie ktoś zawsze pisze X przed Y,
zmień kolejność w funkcji `parsePosition` w `index.js` (sekcja "brak etykiet - zakładamy
kolejność Y, X").
