# Presentasjoner

Tekniske presentasjoner fra hovmester-prosjektet, drevet av **deck-stage** — en repo-eid runtime uten eksterne avhengigheter.

## Katalogstruktur

```
presentations/
├── index.html              ← Forside for GitHub Pages
├── decks.json              ← Publiseringsmetadata (hvilke decks som vises)
├── _shared/                ← Delt runtime og verktøy
│   ├── deck-stage.js       ← Bygd runtime (IIFE-bundle)
│   └── present.sh          ← Lokal server med nettleser-åpning
├── _template/              ← Startpunkt for nye decks
│   ├── index.html          ← HTML-skal som laster runtime + slides
│   ├── slides.js           ← Bygd fra src/_template/slides.jsx
│   └── styles.css          ← Design tokens og slide-layouts
├── src/                    ← Kildekode som bygges med esbuild
│   ├── deck-stage/         ← Runtime-kilde (canvas, navigasjon, input)
│   └── _template/          ← JSX-kilde for template-slidene
│       ├── slides.jsx      ← Slide-definisjoner med JSX
│       └── jsx-runtime.js  ← Minimal JSX → DOM factory (ingen React)
└── 2026-04-16-fagtorsdag/
    └── html/               ← Legacy Reveal.js-deck (uendret)
```

## Kom i gang

### Første gang

```bash
cd presentations
npm install
```

### Bygg

```bash
npm run build
```

Bygger DeckStage-runtime til `_shared/deck-stage.js` og template-slides til `_template/slides.js`.

### Kjør lokalt

Presentasjoner må kjøres via HTTP-server — `file://`-protokollen støttes ikke fordi nettlesere blokkerer modul-lasting og CORS fra filsystemet.

```bash
# Åpne forsiden (alle decks)
./_shared/present.sh

# Åpne template-decken
./_shared/present.sh _template

# Åpne legacy Reveal-decken
./_shared/present.sh 2026-04-16-fagtorsdag/html
```

`present.sh` finner en ledig port, starter `python3 -m http.server` og åpner nettleseren automatisk. Ctrl+C stopper serveren.

## Lage ny presentasjon

1. **Kopier templaten:**

   ```bash
   cp -r _template/ YYYY-MM-DD-navn/
   ```

2. **Lag JSX-kilde:**

   Opprett `src/YYYY-MM-DD-navn/slides.jsx` etter mønsteret i `src/_template/slides.jsx`. Kopier `jsx-runtime.js` dit eller importer relativt.

3. **Legg til build-script i `package.json`:**

   ```json
   "build:navn": "esbuild src/YYYY-MM-DD-navn/slides.jsx --bundle --format=iife --jsx-factory=h --jsx-fragment=Fragment --outfile=YYYY-MM-DD-navn/slides.js --target=es2020 --minify"
   ```

   Oppdater `build`-scriptet til å inkludere det nye steget.

4. **Bygg og test:**

   ```bash
   npm run build
   ./_shared/present.sh YYYY-MM-DD-navn
   ```

5. **Publiser:**

   Legg til oppføring i `decks.json` når decken er klar (se [Metadatafelter](#metadatafelter-i-decksjson)).

## Metadatafelter i `decks.json`

Forsiden (`index.html`) leser `decks.json` for å vise publiserte presentasjoner.

```json
{
  "title": "Presentasjonstittel",
  "description": "Kort beskrivelse av innholdet.",
  "event": "Fagtorsdag",
  "date": "2026-04-16",
  "engine": "deck-stage",
  "path": "YYYY-MM-DD-navn/",
  "status": "published",
  "tags": ["emne", "tema"]
}
```

| Felt          | Beskrivelse                                                        |
|---------------|--------------------------------------------------------------------|
| `title`       | Tittel vist på forsiden                                            |
| `description` | Kort beskrivelse                                                   |
| `event`       | Arrangement eller kontekst                                         |
| `date`        | ISO-dato (brukes til sortering)                                    |
| `engine`      | `deck-stage` for nye decks, `reveal` for legacy                    |
| `path`        | Eksplisitt sti til deck-katalogen, relativt til `presentations/`   |
| `status`      | Sett til `published` for at decken vises på forsiden               |
| `tags`        | Stikkord for filtrering                                            |

## DeckStage-funksjoner

Runtime gir en fast **16:9 canvas** (1920 × 1080 referansepunkter) som skaleres med CSS transform for å fylle vinduet uten å endre innholdslayout.

### Navigasjon

| Handling                 | Taster / interaksjon                            |
|--------------------------|-------------------------------------------------|
| Neste slide              | → ↓ Space PageDown, klikk/tap høyre halvdel     |
| Forrige slide            | ← ↑ Backspace PageUp, klikk/tap venstre halvdel |
| Første slide             | Home                                            |
| Siste slide              | End                                             |
| Reset                    | R                                               |

### Andre funksjoner

- **URL-hash** — Slide-posisjon lagres i `#slide-id` for direktelenking og refresh.
- **Feilvisning** — Runtime-feil i en slide vises som tydelig feilmelding i canvas, uten å krasje presentasjonen.
- **Print/PDF** — `@media print`-regler fjerner skalering og skjuler teller, slik at slides kan skrives ut eller eksporteres til PDF via nettleserens utskriftsfunksjon.

## GitHub Pages-publisering

Workflowen `.github/workflows/pages.yml` deployer hele `presentations/`-katalogen til GitHub Pages **kun fra `main`-branchen**.

- **Rot** → forsiden (`index.html` med kortoversikt over alle decks)
- **`/2026-04-16-fagtorsdag/html/`** → legacy Reveal.js-deck
- **`/_template/`** → template-decken (tilgjengelig som referanse)

Push til `main` med endringer under `presentations/` trigger automatisk deploy. Manuell deploy er også mulig via `workflow_dispatch`.

## Importgate for eksterne decks

Før en ekstern eller tidligere presentasjon legges inn i `presentations/` for publisering, sjekk:

- [ ] **PII og interninformasjon** — Fjern personnummer, navn på enkeltpersoner, interne URLer og annen sensitiv informasjon.
- [ ] **Screenshots og opplastede filer** — Kontroller at bilder ikke viser sensitiv informasjon, intern UI eller konfidensielle data.
- [ ] **Rettigheter og lisens** — Har du rett til å publisere innholdet? Sjekk bilder, fonter og tredjepartsinnhold.
- [ ] **Offentlig publisering** — Er dette innhold som faktisk skal være offentlig tilgjengelig? GitHub Pages er åpent.

## Fremtidige muligheter

En egen `/presentation-platform`-skill kan vurderes etter at standarden er validert i praksis. Det er ikke et krav nå.
