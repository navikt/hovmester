---
name: improve-codebase-architecture
description: "Brukes når arkitekturen skal forbedres — finne deepening-kandidater, gjøre grunne moduler dypere, konsolidere tett koblede moduler, gjøre koden mer testbar og navigerbar. 'Forbedre arkitekturen', 'denne koden er rotete', 'for mange tynne lag', 'rute → service → klient-kjedene er uoversiktlige'. Kalles via /improve-codebase-architecture."
---

# improve-codebase-architecture

Avdekk arkitektonisk friksjon i dette repoet og foreslå **fordypningsmuligheter** — refaktoreringer som gjør grunne moduler dype. Målet er testbarhet og at både mennesker og AI lett kan navigere koden.

**Rolle:** dette _finner_ kandidater (oppdagelse). Designe grensesnittet på en valgt kandidat = `/codebase-design`; avhøre valget = `/grill-with-docs`; formalisere et tungt valg som ADR = `/nav-architecture-review`.

Skillen er **informert av** domenemodellen og besluttede valg, og bygger på et delt arkitekturvokabular:

- `docs/GLOSSARY.md` gir navn til gode sømmer i domenet; `docs/CONTEXT.md` gir den valgte tilnærmingen; ADR-er i `docs/adr/` er besluttede valg du **ikke** skal re-litigere uten grunn.
- Dette er @grillmester sin oppdagelsesfase: funn herfra mates inn i grilling (`/grill-with-docs`), plan (`.grill/PLAN.md`) og verifisering (`.grill/VERIFICATION.md`).

## Vokabular

Dette bruker dyp-modul-vokabularet som `/codebase-design` eier — **modul**, **grensesnitt**, **implementasjon**, **dybde** (dyp/grunn), **søm** (seam, ikke «boundary»), **adapter**, **lokalitet**, **leverage**. Bruk ordene presist; ikke drift til «komponent», «service», «lag» eller «API». Full definisjon av hvert: `/codebase-design`.

**Slettetesten** (det operative verktøyet for oppdagelse): ville det å slette modulen *konsentrere* kompleksitet (bra — den var grunn) eller bare flytte den (da var den ekte)? Et «ja, konsentrerer» er signalet du jakter på.

## Prosess

### 1. Utforsk

Les `docs/CONTEXT.md`, `docs/GLOSSARY.md` og relevante ADR-er i `docs/adr/` **først**.

Gå så gjennom kodebasen organisk — ikke følg rigide heuristikker. Noter hvor du opplever friksjon. I et Ktor-backend ser fordypningsmuligheter typisk slik ut:

- **Tynne lag i kjede:** `Route { } → Service → Repository → klient` der hvert ledd nesten bare videresender. Slå sammen til én dyp modul.
- **DTO-mappere ekstrahert kun for testbarhet:** `toDto()` / `fromDb()`-funksjoner som er rene, men der de ekte feilene sitter i hvordan de kalles (ingen lokalitet).
- **Grunne klient-wrappere:** en `HttpClient`-kall pakket i en klasse som ikke gjemmer noe — TokenX/Azure AD-token, retry og feilkontrakt lekker ut til kallstedet.
- **Spredt Kafka-logikk:** konsument, deserialisering, idempotens/replay-håndtering og forretningslogikk fordelt over flere moduler uten én søm.
- **Lekkende databaselag:** SQL/`DataSource`/Flyway-detaljer som siver ut av repository-modulen.
- **Vanskelig å teste gjennom grensesnittet:** moduler som krever oppspinning av halve Ktor-stacken for å testes — tegn på at sømmen sitter feil sted.

Bruk slettetesten på alt du mistenker er grunt.

### 2. Presenter kandidatene som en HTML-rapport

Skriv en selvstendig HTML-fil til OS-temp slik at ingenting havner i repoet. Resolv temp-katalog fra `$TMPDIR` med `/tmp` som fallback, og skriv til `<tmpdir>/arkitektur-review-<timestamp>.html`. Åpne den for brukeren (`open <sti>` på macOS, `xdg-open <sti>` på Linux) og oppgi den absolutte stien.

Hver kandidat får et kort med: **Filer**, **Problem** (én setning), **Løsning** (én setning), **Gevinster** (punktliste i vokabularet — lokalitet/leverage/testflate), **Før/etter-diagram**, og **Anbefalingsstyrke** (`Sterk`, `Verdt å utforske`, `Spekulativ`). Avslutt med en **Topp-anbefaling**: hvilken du ville tatt først og hvorfor.

Bruk **`docs/GLOSSARY.md`-vokabular for domenet** og arkitekturvokabularet over for strukturen. Heter konseptet "Sykmelding-inntak" i glossaret, snakk om "Sykmelding-inntak-modulen" — ikke "SykmeldingHandler" og ikke "Sykmelding-servicen".

**ADR-konflikt:** hvis en kandidat motsier en eksisterende ADR, ta den kun opp når friksjonen er ekte nok til å forsvare å gjenåpne valget. Merk det tydelig i kortet (gul callout: _"motsier ADR-0007 — men verdt å gjenåpne fordi…"_). Ikke list opp enhver teoretisk refaktorering en ADR forbyr.

Se [references/html-report.md](references/html-report.md) for fullt HTML-stillas, diagrammønstre og stilguide.

**Ikke** foreslå konkrete grensesnitt ennå. Etter at fila er skrevet, spør brukeren: "Hvilken av disse vil du utforske?"

### 3. Grilling-løkke

Når brukeren har valgt en kandidat, kjør `/grill-with-docs` for å gå ned beslutningstreet sammen med dem — begrensninger, avhengigheter, formen på den fordypede modulen, hva som ligger bak sømmen, hvilke tester som overlever. Dette er @grillmester fase 1–2.

Sideeffekter skjer **løpende** mens beslutninger faller på plass:

- **Navngir du en fordypet modul etter et konsept som ikke står i `docs/GLOSSARY.md`?** Legg termen til der (bruk `/domain-modeling`). Opprett fila lazy hvis den mangler.
- **Skjerper du en uklar term underveis?** Oppdater `docs/GLOSSARY.md` med en gang.
- **Forkaster brukeren kandidaten av en bærende grunn?** Tilby en ADR: _"Vil du at jeg skriver dette som ADR i `docs/adr/` så fremtidige arkitektur-review ikke foreslår det på nytt?"_ Tilby kun når grunnen faktisk trengs av en fremtidig utforsker — hopp over flyktige ("ikke verdt det nå") og selvinnlysende grunner. Utløs via `/nav-architecture-review` ved reell arkitekturbeslutning.
- **Vil du utforske alternative grensesnitt for den fordypede modulen?** Kjør `/codebase-design` (design-it-twice — alternativene lages sekvensielt inline, aldri over parallelle agenter).

### 4. Koble til faseløkka

Når den valgte fordypningen er gjennomgrillet:

- Skriv den valgte tilnærmingen til `docs/CONTEXT.md` og besluttede valg til `docs/adr/`.
- Bryt fordypningen ned i en trygg, inkrementell refaktoreringsplan i `.grill/PLAN.md` (plan-fasen; evt. videre til `/to-issues` for plukkbare snitt).
- Definer hva som beviser at fordypningen lyktes (tester gjennom ett grensesnitt, søm bekreftet av to adaptere) i `.grill/VERIFICATION.md`.
