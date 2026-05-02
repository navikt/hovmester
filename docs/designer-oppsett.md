# Copilot for designere — kom i gang

Du trenger ikke kunne kode. Denne guiden setter opp VS Code og GitHub Copilot slik at du kan bruke **@designer** i Nav-repoene.

## 1. Installer VS Code

Last ned og installer [Visual Studio Code](https://code.visualstudio.com/).

## 2. Installer Git

Git henter kode fra GitHub til maskinen din. Du trenger det installert, men du trenger ikke lære det — Copilot håndterer resten.

Åpne Terminal (`⌘ + mellomrom`, søk etter "Terminal") og kjør:

```
xcode-select --install
```

Klikk «Installer» i dialogboksen som dukker opp.

**Sjekk at det funker:**

```
git --version
```

Du bør se noe som `git version 2.x.x`.

## 3. Koble GitHub til Nav

1. Gå til [myapps.microsoft.com](https://myapps.microsoft.com) og finn **GitHub.com**
2. Klikk på den — dette kobler Nav-kontoen din til GitHub
3. Gå til [github.com](https://github.com) og logg inn

> Spør tech lead hvis du ikke finner GitHub i applikasjonsportalen.

## 4. Aktiver Copilot-abonnement

1. Gå til [min-copilot.ansatt.nav.no/abonnement](https://min-copilot.ansatt.nav.no/abonnement)
2. Klikk **Aktiver Copilot**
3. Vent noen sekunder og oppdater siden — du skal se at abonnementet er aktivt

## 5. Installer GitHub Copilot i VS Code

1. Åpne VS Code
2. Klikk Extensions-ikonet i sidepanelet (eller trykk `⇧⌘X`)
3. Søk etter **GitHub Copilot** og klikk **Install**
4. Logg inn med GitHub-kontoen fra steg 3 når du blir bedt om det
5. Copilot-ikonet dukker opp i sidepanelet når det er klart

## 6. Legg til en app

Klikk en vscode-lenke for appen du vil jobbe med — VS Code åpner seg og laster ned appen automatisk.

> **Første gang:** Nettleseren spør om du vil åpne VS Code — klikk «Åpne». VS Code spør hvor du vil lagre — velg en mappe du husker, for eksempel `Dokumenter/Nav-apper/`.

Lenkene finner du på teamets dokumentasjonsside, eller du kan få dem fra tech lead. Formatet er:

```
vscode://vscode.git/clone?url=https://github.com/navikt/<appnavn>.git
```

## 7. Åpne en app du allerede har lagt til

1. Åpne VS Code
2. Klikk på appen i listen over nylig åpnede prosjekter

## 8. Start @designer

1. Åpne Copilot Chat (klikk Copilot-ikonet i sidepanelet, eller trykk `⌃⌘I`)
2. Skriv `@designer` etterfulgt av hva du vil gjøre:

> @designer Jeg vil utforske hvordan vi kan forenkle sykmeldingsskjemaet

Designeren hjelper deg med å utforske, skissere i Figma og levere ferdige design.

> **Figma-tilgang:** Første gang @designer bruker Figma-verktøy, blir du bedt om å godkjenne tilgangen. Klikk «Tillat» — dette trenger du bare gjøre én gang.

## Tips

- **@designer holder appen oppdatert** — du trenger ikke tenke på git
- **Figma-lenker:** Lim inn en Figma-lenke i chatten hvis du allerede har en skisse
- **Designspråk fungerer:** «utforsk», «skissér», «forbedre», «redesign» — bruk ordene du er vant til

## Feilsøking

| Problem | Løsning |
|---|---|
| VS Code spør etter passord/token | Logg inn på GitHub via Accounts-ikonet (nede til venstre i VS Code) |
| Copilot-ikonet mangler | Sjekk at extensionen er installert og at du er logget inn |
| «Du har ikke tilgang» | Sjekk at abonnementet er aktivt på [min-copilot.ansatt.nav.no](https://min-copilot.ansatt.nav.no) |
| Finner ikke appen | VS Code → File → Open Recent |
| @designer svarer ikke | Sjekk at Copilot Chat-panelet er åpent (`⌃⌘I`) |

> Ved andre problemer: spør tech lead eller i teamets Slack-kanal.
