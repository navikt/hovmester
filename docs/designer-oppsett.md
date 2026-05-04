# Copilot for designere — kom i gang

Denne guiden setter opp VS Code og GitHub Copilot slik at du kan bruke **@designer** i Nav-repoene.

> **Forutsetning:** Appen du skal jobbe med må ha `@designer` satt opp (via hovmester `frontend`-collectionen).

> 💡 **Tips:** Står du fast underveis? Spør en utvikler på teamet — oppsettet tar 10–15 minutter med litt hjelp.

## 1. Installer VS Code

Last ned og installer [Visual Studio Code](https://code.visualstudio.com/).

## 2. Installer Git

Git henter kode fra GitHub til maskinen din. Du trenger det installert, men du trenger ikke lære det — Copilot håndterer resten.

Åpne Terminal (`⌘ + mellomrom`, søk etter "Terminal") og sjekk om Git allerede er installert:

```
git --version
```

Hvis du ser et versjonsnummer (f.eks. `git version 2.x.x`) er Git allerede klart — gå videre til steg 3.

Hvis du får en feilmelding, kjør:

```
xcode-select --install
```

Klikk «Installer» i dialogboksen som dukker opp, og vent til den er ferdig.

## 3. Installer Node.js

Node.js trengs for Playwright (verktøyet som lar @designer se og navigere nettsider).

Last ned **LTS-versjonen** fra [nodejs.org](https://nodejs.org/) og kjør installeren (.pkg-filen).

**Sjekk at det funker** (skriv i Terminal):

```
node --version
```

Du bør se et versjonsnummer (f.eks. `v22.x.x`).

## 4. Koble GitHub til Nav

Du trenger en GitHub-konto koblet til Nav. Hvis du ikke allerede har det:

1. Gå til [github.com/signup](https://github.com/signup) og opprett en konto med **nav.no-e-posten** din
2. Gå til [myapps.microsoft.com](https://myapps.microsoft.com) og finn **GitHub.com**
3. Klikk på den — dette kobler Nav-kontoen din til GitHub
4. Gå til [github.com](https://github.com) og logg inn

> Hvis du allerede har en GitHub-konto med nav.no-e-post, start fra punkt 2.

## 5. Aktiver Copilot-abonnement

1. Gå til [min-copilot.ansatt.nav.no/abonnement](https://min-copilot.ansatt.nav.no/abonnement)
2. Klikk **Aktiver Copilot**
3. Vent noen sekunder og oppdater siden — du skal se at abonnementet er aktivt

## 6. Installer GitHub Copilot i VS Code

1. Åpne VS Code
2. Klikk Extensions-ikonet i sidepanelet (eller trykk `⇧⌘X`)
3. Søk etter **GitHub Copilot Chat** og klikk **Install**
4. Logg inn med GitHub-kontoen fra steg 4 når du blir bedt om det
5. Copilot-ikonet dukker opp i sidepanelet når det er klart

## 7. Legg til MCP-servere

MCP-servere gir Copilot tilgang til Figma og nettleser.

**Figma MCP** — Kopier denne lenken og lim inn i nettleseren din. VS Code åpner seg og legger til serveren:

```
vscode:mcp/mcp-registry.nav.no/v0.1/servers/com.figma%2Ffigma-mcp/versions/latest
```

**Playwright MCP** — Samme fremgangsmåte:

```
vscode:mcp/mcp-registry.nav.no/v0.1/servers/com.microsoft%2Fplaywright-mcp/versions/latest
```

> Første gang du bruker en MCP-server blir du bedt om å godkjenne tilgangen. Klikk «Tillat».

<details>
<summary>Alternativ: legg til via Terminal</summary>

```bash
code --add-mcp '{"name":"figma-mcp","type":"http","url":"https://mcp.figma.com/mcp"}'
code --add-mcp '{"name":"playwright-mcp","command":"npx","args":["-y","@playwright/mcp","--isolated","--caps","core","--blocked-origins","*.intern.nav.no,*.intern.dev.nav.no,*.ansatt.nav.no,*.ansatt.dev.nav.no,*.ekstern.dev.nav.no,*.nav.no,*.nais.io,*.adeo.no","--block-service-workers","--save-trace"]}'
```

</details>

## 8. Hent en app fra GitHub

1. Åpne VS Code
2. Trykk `Cmd+Shift+P` og skriv **Git: Clone**
3. Lim inn repo-URL fra teamet ditt, for eksempel:
   `https://github.com/navikt/appnavn`
4. Velg en mappe du husker (for eksempel `Dokumenter/Nav-apper/`)
5. Klikk «Open» når VS Code spør om du vil åpne prosjektet

> Spør en utvikler på teamet om URL-en til appen du skal jobbe med.

## 9. Åpne en app du allerede har lagt til

1. Åpne VS Code
2. Klikk på appen i listen over nylig åpnede prosjekter

## 10. Start @designer

Sørg for at appen fra steg 8 er åpnet i VS Code (sjekk mappenavnet i tittellinjen).

1. Åpne Copilot Chat (klikk Copilot-ikonet i sidepanelet, eller trykk `⌃⌘I`)
2. Skriv `@designer` etterfulgt av hva du vil gjøre:

> @designer Jeg vil utforske hvordan vi kan forenkle sykmeldingsskjemaet

Designeren hjelper deg med å utforske, skissere i Figma og levere ferdige design.

## Sjekk at alt funker

Etter oppsett kan du verifisere med denne meldingen:

> @designer Kan du bekrefte at du har tilgang til Figma?

Hvis @designer svarer at Figma er tilgjengelig, er alt klart.

## Tips

- **@designer holder appen oppdatert** — du trenger ikke tenke på git
- **Figma-lenker:** Lim inn en Figma-lenke i chatten hvis du allerede har en skisse
- **Designspråk fungerer:** «utforsk», «skissér», «forbedre», «redesign» — bruk ordene du er vant til
- **Lokal kjøring:** Hvis @designer trenger å vise appen i nettleseren kan det kreve oppsett. Spør en utvikler på teamet hvis det ikke fungerer automatisk.

## Feilsøking

| Problem | Løsning |
|---|---|
| VS Code spør etter passord/token | Logg inn på GitHub via Accounts-ikonet (nede til venstre i VS Code) |
| Copilot-ikonet mangler | Sjekk at extensionen er installert og at du er logget inn |
| «Du har ikke tilgang» | Sjekk at abonnementet er aktivt på [min-copilot.ansatt.nav.no](https://min-copilot.ansatt.nav.no) |
| `@designer` finnes ikke | Appen mangler hovmester-oppsett med `frontend`-collectionen |
| Figma åpner seg ikke | Sjekk at Figma MCP er lagt til (steg 7) og at du har godkjent tilgangen |
| @designer kan ikke se appen lokalt | Sjekk at Node.js er installert (steg 3) og at Playwright MCP er lagt til (steg 7) |
| Finner ikke appen | VS Code → File → Open Recent |
| @designer svarer ikke | Sjekk at Copilot Chat-panelet er åpent (`⌃⌘I`) |

> Ved andre problemer: spør i teamets Slack-kanal.
