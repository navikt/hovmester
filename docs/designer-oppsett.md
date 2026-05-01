# Copilot for designere — kom i gang

Denne guiden hjelper deg med å sette opp VS Code og GitHub Copilot slik at du kan bruke **@designer** i Nav-repoene.

Du trenger ikke kunne kode. Alt du trenger er VS Code, en Copilot-lisens og tilgang til GitHub.

## 1. Installer VS Code

Last ned og installer [Visual Studio Code](https://code.visualstudio.com/).

Åpne VS Code etter installasjon og bli litt kjent — du trenger ikke kunne noe annet enn å åpne det.

## 2. Installer Git

Git er verktøyet som henter kode fra GitHub til maskinen din. Du trenger det, men du trenger ikke lære det — Copilot håndterer resten.

**Mac:**

Åpne Terminal (søk etter "Terminal" i Spotlight) og skriv:

```
xcode-select --install
```

Klikk «Installer» i dialogboksen som dukker opp. Når det er ferdig, er Git installert.

**Sjekk at det funker:**

```
git --version
```

Du bør se noe som `git version 2.x.x`.

## 3. Skaff GitHub-tilgang

Du trenger en GitHub-konto som er koblet til Nav.

1. Gå til [myapps.microsoft.com](https://myapps.microsoft.com) og finn **GitHub.com**
2. Klikk på den — dette kobler Nav-kontoen din til GitHub
3. Gå til [github.com](https://github.com) og logg inn

> Spør teamlead eller tech lead hvis du har problemer med tilgangen.

## 4. Installer GitHub Copilot

1. Åpne VS Code
2. Klikk på Extensions-ikonet i sidepanelet (eller trykk `⇧⌘X`)
3. Søk etter **GitHub Copilot** og klikk **Install**
4. Du blir bedt om å logge inn med GitHub — bruk kontoen fra steg 3
5. Copilot-ikonet dukker opp i sidepanelet når det er klart

> Copilot krever en lisens. Nav-organisasjonen på GitHub har lisenser tilgjengelig. Kontakt tech lead hvis du ikke får tilgang.

## 5. Legg til en app

Nå kan du legge til en app du vil jobbe med. Klikk en av lenkene under — VS Code åpner seg og laster ned appen automatisk.

> **Første gang:** VS Code spør hvor du vil lagre. Velg en mappe du husker, for eksempel `Dokumenter/Nav-apper/`. Etter det er appen klar.

Lenkene finner du på teamets docs-side (f.eks. team-esyfo VitePress), eller du kan få dem fra tech lead.

Formatet er: `vscode://vscode.git/clone?url=https://github.com/navikt/<appnavn>.git`

## 6. Åpne en app du allerede har

Etter første gang trenger du ikke lenken igjen. Bare:

1. Åpne **VS Code**
2. Du ser en liste over nylig åpnede apper — klikk på den du vil jobbe med

Ferdig! Du er i appen.

## 7. Start @designer

1. Åpne Copilot Chat-panelet (klikk Copilot-ikonet i sidepanelet, eller trykk `⌃⌘I`)
2. Skriv `@designer` etterfulgt av hva du vil gjøre, for eksempel:

> @designer Jeg vil utforske hvordan vi kan forenkle sykmeldingsskjemaet

Designeren hjelper deg med å utforske, skissere i Figma og levere designartefakter — alt uten at du trenger å skrive kode.

## Tips

- **@designer holder appen oppdatert** — du trenger ikke tenke på det
- **Figma-lenker:** Hvis du allerede har en Figma-skisse, kan du lime inn lenken i chatten
- **Prøv ulike inngangsord:** "utforsk", "skissér", "forbedre", "redesign"
- **Spør om hjelp:** @designer forstår designspråk — bruk ordene du er vant til

## Noe som ikke funker?

| Problem | Løsning |
|---|---|
| VS Code spør etter passord/token | Logg inn på GitHub via VS Code (Accounts-ikonet nede til venstre) |
| Copilot-ikonet mangler | Sjekk at extensionen er installert og at du er logget inn |
| Finner ikke appen i Recent | Åpne VS Code → File → Open Recent |
| @designer svarer ikke | Sjekk at Copilot Chat-panelet er åpent, og at du har en aktiv lisens |

> Ved andre problemer: spør tech lead eller i teamets Slack-kanal.
