---
name: team-status
description: "Teamstatus fra GitHub Projects-tavla — ukesoversikt, tertialstatus mot teamets mål og prioriteringsunderlag på tvers av repos. Leser felter dynamisk og teamets tavle-guide. Brukes via /team-status ved «hva jobber vi med», «hvordan ligger vi an» og prioritering."
---

# Teamstatus

Bygg statusrapporter fra teamets GitHub Projects-tavle: ukesoversikt, tertialstatus og prioriteringsunderlag. Tavla oppdages dynamisk — anta aldri noe om hvilket prosjekt, hvilke kolonner eller hvilke felter teamet bruker.

## Arbeidsflyt

### 1. Finn tavla

Les `projects:`-linjen i repoets issue-maler under `.github/ISSUE_TEMPLATE/` (format `projects: ["owner/nummer"]`) og parse owner og prosjektnummer.

- ✅ `projects: ["min-org/42"]` → owner `min-org`, prosjekt `42`
- ❌ Anta et prosjektnummer fordi du har sett det i et annet repo

Mangler `projects:`-linjen i alle malene → spør brukeren hvilken tavle teamet bruker.

### 2. Forstå tavla

Hent felter og opsjoner dynamisk fra prosjektet (oppskrifter i `references/projects-v2.md`). **Aldri hardkodede felt-ID-er, opsjon-ID-er eller statusnavn** — samme regel som i issue-management-skillen. Hvilke status-, mål-, tertial- og size-felter som finnes varierer per team og leses ved kjøring.

Feltene sier hva tavla *inneholder*. Semantikken — hva kolonnene og feltene *betyr* — kommer fra teamets tavle-guide:

- Finnes ingen tavle-guide eller måldokument du har fått oppgitt: spør brukeren om teamet har en tavle-guide, og hvor den bor.

#### Tavle-guide mangler?

Tilby et kort intervju og lag førsteutkastet:

1. Kolonnene, én og én: «Hva betyr X-kolonnen hos dere? Hva skiller den fra Y?»
2. Feltene: hvilke brukes til hva (mål, tertial, prioritet, størrelse)?
3. Skriv utkast til tavle-guide og lever det som issue eller PR til fellesrepoet — **spør først**.

### 3. Bygg rapporten brukeren ba om

Tre rapportformer — maler og utfyllingsregler i `references/rapportmaler.md`:

| Rapport | Innhold | Passer når |
|---|---|---|
| **Ukesoversikt** | I arbeid / klart til plukking / blokkert / stale / nylig ferdig | «Hva jobber vi med?», ukesstart, standup-underlag |
| **Tertialstatus** | Issues gruppert på målfelt × status × tertial; flagger mål uten issues og issues uten mål | «Hvordan ligger vi an?», tertialsjekk, målgjennomgang |
| **Prioriteringsunderlag** | Kandidater analysert mot mål, kapasitet og beslutningskriterier | «Hva bør vi ta tak i?», backlog-gjennomgang |

For prioriteringsunderlag: sparringsfasen FØR analysen (anledning, mål, beslutningskriterier, kapasitet) eies av agenten som ruter hit — denne skillen eier analysen. Mangler du svar fra sparringen, hent dem fra brukeren før du analyserer.

Uansett rapportform: skill tydelig mellom hva tavla faktisk sier og hva som er dine tolkninger.

## Teknisk tilgang

- **Foretrukket:** GitHub MCP `projects`-toolset (`projects_list`, `projects_get`, `projects_write`)
- **Fallback:** `gh`-CLI (`gh project view` / `item-list` / `field-list`)

Konkrete kommandoer, GraphQL-fallgruver og feilsøking: `references/projects-v2.md`.

Får du ikke tilgang til tavla i det hele tatt: si det, be brukeren lime inn det relevante fra tavla, og bygg rapporten fra det.

## Grenser

### ✅ Alltid
- Les fritt fra tavla, issues og tavle-guiden
- Oppdag felter og opsjoner dynamisk ved hver kjøring
- Skill mellom hva tavla sier og egne tolkninger

### ⚠️ Spør først
- Sette felter eller status på enkelt-issues
- Levere tavle-guide-utkast som issue/PR til fellesrepoet

### 🚫 Aldri
- Endre feltdefinisjoner eller opsjoner på tavla — API-et støtter det ikke; foreslå teksten og pek på at et menneske må legge den inn manuelt
