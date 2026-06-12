# Copilot for produktledere — kom i gang

Denne guiden setter opp VS Code og GitHub Copilot slik at du kan bruke **@doctor-who** i Nav-repoene.

> **Forutsetning:** Repoet du skal jobbe i må ha hovmester-sync satt opp. Alle repos som synkroniseres fra hovmester har `@doctor-who` automatisk.

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

## 3. Koble GitHub til Nav

Du trenger en GitHub-konto koblet til Nav. Hvis du ikke allerede har det:

1. Gå til [github.com/signup](https://github.com/signup) og opprett en konto med **nav.no-e-posten** din
2. Gå til [myapps.microsoft.com](https://myapps.microsoft.com) og finn **GitHub.com**
3. Klikk på den — dette kobler Nav-kontoen din til GitHub
4. Gå til [github.com](https://github.com) og logg inn

> Hvis du allerede har en GitHub-konto med nav.no-e-post, start fra punkt 2.

## 4. Aktiver Copilot-abonnement

1. Gå til [min-copilot.ansatt.nav.no/abonnement](https://min-copilot.ansatt.nav.no/abonnement)
2. Klikk **Aktiver Copilot**
3. Vent noen sekunder og oppdater siden — du skal se at abonnementet er aktivt

## 5. Installer GitHub Copilot i VS Code

1. Åpne VS Code
2. Klikk Extensions-ikonet i sidepanelet (eller trykk `⇧⌘X`)
3. Søk etter **GitHub Copilot Chat** og klikk **Install**
4. Logg inn med GitHub-kontoen fra steg 3 når du blir bedt om det
5. Copilot-ikonet dukker opp i sidepanelet når det er klart

## 6. Legg til GitHub MCP

GitHub MCP gir @doctor-who tilgang til prosjekttavla og issues på tvers av repos — det er dette som lar agenten svare på «hva jobber vi med?» og «hvordan ligger vi an?».

1. Gå til Navs MCP-katalog: [min-copilot.ansatt.nav.no/verktoy](https://min-copilot.ansatt.nav.no/verktoy)
2. Finn **GitHub MCP** i katalogen
3. Følg installasjonsknappen/-lenken der — VS Code åpner seg og legger til serveren

> Første gang du bruker en MCP-server blir du bedt om å godkjenne tilgangen. Klikk «Tillat».

> ℹ️ **To ting må være på plass for at tavla skal virke:**
>
> 1. Prosjekttavle-verktøyene (`projects`) må være aktivert i serveroppsettet
> 2. GitHub-tilgangen må inkludere prosjekt-tilgang (project-scope)
>
> Ser ikke @doctor-who tavla, er det nesten alltid en av disse som mangler — be en utvikler sjekke.

## 7. Hent en app fra GitHub

1. Åpne VS Code
2. Trykk `Cmd+Shift+P` og skriv **Git: Clone**
3. Lim inn repo-URL fra teamet ditt, for eksempel:
   `https://github.com/navikt/appnavn`
4. Velg en mappe du husker (for eksempel `Dokumenter/Nav-apper/`)
5. Klikk «Open» når VS Code spør om du vil åpne prosjektet

> Spør en utvikler på teamet om URL-en til appen du skal jobbe med.

> 💡 Teamets fellesrepo — for eksempel team-repoet med dokumentasjon og mål — kan også klones på samme måte. Det er et fint sted å jobbe fra når oppgaven ikke handler om en bestemt app, som målarbeid, retro eller statusrapporter.

## 8. Åpne en app du allerede har lagt til

1. Åpne VS Code
2. Klikk på appen i listen over nylig åpnede prosjekter

## 9. Start @doctor-who

Sørg for at repoet fra steg 7 er åpnet i VS Code (sjekk mappenavnet i tittellinjen).

1. Åpne Copilot Chat (klikk Copilot-ikonet i sidepanelet, eller trykk `⌃⌘I`)
2. Skriv `@doctor-who` etterfulgt av hva du vil gjøre — agenten dukker opp i lista når du skriver `@`

For eksempel:

> @doctor-who hva jobber vi med denne uka?

> @doctor-who hjelp meg å formulere tertialmål

> @doctor-who design en retro for neste uke

@doctor-who hjelper deg med status og prioritering på tvers av repos og prosjekttavla, oppgaver, mål og OKR, workshops, retro og teamhelse.

## Sjekk at alt funker

Etter oppsett kan du verifisere med denne meldingen:

> @doctor-who kan du se prosjekttavla vår?

Hvis @doctor-who svarer med innhold fra tavla, er alt klart.

## Tips

- **Lim inn helsesjekk-resultater fra Slack** — så tolker @doctor-who trender og foreslår hva dere bør snakke om
- **@doctor-who endrer aldri tavla eller oppretter issues uten at du godkjenner** — du får alltid se et utkast først
- **Den skriver ikke kode** — trenger du noe implementert, be @hovmester om det
- **Forretningsspråk fungerer:** «hva bør vi prioritere», «lag en oppgave», «hvordan ligger vi an» — bruk ordene du er vant til

## Feilsøking

| Problem | Løsning |
|---|---|
| `@doctor-who` finnes ikke i lista | Repoet mangler hovmester-sync — be en utvikler sette det opp |
| Tavla er utilgjengelig | Projects-verktøyene eller prosjekt-tilgangen mangler — se steg 6 og be en utvikler sjekke |
| Agenten kjenner ikke teamets mål | Teamets fellesrepo er ikke konfigurert i sync-oppsettet — be en utvikler legge til `team_repo` i hovmester-workflowen |
| VS Code spør etter passord/token | Logg inn på GitHub via Accounts-ikonet (nede til venstre i VS Code) |
| Copilot-ikonet mangler | Sjekk at extensionen er installert og at du er logget inn |
| «Du har ikke tilgang» | Sjekk at abonnementet er aktivt på [min-copilot.ansatt.nav.no](https://min-copilot.ansatt.nav.no) |

> Ved andre problemer: spør i teamets Slack-kanal.
