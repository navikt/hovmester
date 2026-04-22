---
name: readme-update
description: Opprett eller oppdater README-filer for Nav-repoer basert på faktisk kode, stack, NAIS-manifest og integrasjoner. Brukes når bruker vil lage README, oppdatere README eller dokumentere et repo.
---

# README-oppdatering for Nav-repoer

Bruk denne skillen når README skal opprettes eller oppdateres i et Nav-repo. README-en skal speile det repoet faktisk gjør i dag — ikke fylle ut en generisk mal.

## Steg 1: Les repoet først

Les faktiske kilder før du skriver én linje README:

1. **Eksisterende README** — bevar manuelt innhold, lenker, Slack-kanaler og lokale kjørekommandoer som fortsatt er riktige.
2. **Stack og bygg** — les `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `build.gradle.kts`, `pom.xml`, `Dockerfile` eller tilsvarende.
3. **NAIS-manifest** — les `.nais/` for miljøer, `ingresses`, databaser, Kafka, `accessPolicy`, TokenX/Azure/ID-porten og eventuelle eksterne avhengigheter.
4. **Kode** — les `src/`, `app/`, `server/`, `api/` eller tilsvarende for endepunkter, konsumenter, produsenter, databaser og frontend/backend-koblinger.
5. **CI/CD** — les `.github/workflows/` for workflow-navn som kan brukes i badge eller utviklingsseksjon.
6. **Docs** — les `docs/`, `README`-filer i undermapper og arkitektur-notater, og lenk heller enn å duplisere lange forklaringer.

Avklar minst dette før du skriver:

- Hva er repoets hovedformål?
- Er dette frontend, backend eller monorepo?
- Hvilke miljøer finnes faktisk?
- Eksponerer repoet REST/GraphQL/API?
- Konsumerer eller produserer det Kafka?
- Hvilke andre apper/tjenester er sentrale?

## Steg 2: Velg relevante seksjoner

| Seksjon | Når | Hva du må hente fra repoet |
|---|---|---|
| Tittel + badges | Alltid | Repo-navn, workflow-navn, faktisk stack |
| Formålet med repoet | Alltid | Kort oppgavebeskrivelse fra kode, docs og manifest |
| Mermaid-diagram | Hvis integrasjoner, auth eller flyt mellom tjenester | Faktiske flyter: bruker, app, API, Kafka, DB, TokenX |
| Miljølenker | Hvis frontend med deploy | `ingresses`, docs eller eksisterende README |
| Backend-API / backend-referanse | Hvis frontend | Hvilken backend som kalles, viktige endepunkter og auth |
| API-oversikt | Hvis repoet eksponerer API | Metode, sti, beskrivelse, auth-info |
| Kafka | Hvis consumer/producer | Topics, retning, lagring/videre publisering |
| Mikrofronter-tabell | Hvis monorepo | App-navn, backend, deploybar enhet |
| Utviklerverktøy (mise) | Hvis `.mise.toml`, `mise.toml` eller `.tool-versions` finnes | Verktøyversjoner, `mise install`-instruksjon |
| Utvikling | Alltid | Kommandoer, lokal URL, test/lint/verifisering |
| Les mer | Hvis docs finnes | Lenker til `docs/`, arkitektur og workflow-dokumentasjon |
| For Nav-ansatte | Alltid | Slack-kanal, team-info eller intern lenke hvis kjent |

### Betingede råd

- **Frontend-repo:** prioriter miljølenker, backend-avhengigheter, lokal kjøring og hvordan appen nås.
- **Backend-repo:** prioriter API, Kafka, database, auth og hvordan andre tjenester kaller appen.
- **Monorepo:** vis struktur først, deretter tabell over delapper/mikrofronter og felles docs-lenker.

## Steg 3: Generer eller oppdater

### Ved oppdatering

- Behold seksjoner som fortsatt er riktige.
- Oppdater bare foreldet innhold; ikke skriv om alt uten grunn.
- Bevar manuelle detaljer som Slack-kanaler, wiki-lenker og driftstips hvis de fortsatt stemmer.
- Hvis eksisterende README har nyttige seksjoner som ikke finnes i denne skillen, behold dem når de gir verdi.

### Ved ny README

- Start med det viktigste: tittel, badges, formål, diagram og utvikling.
- Ta kun med seksjoner som repoet faktisk trenger.
- Bruk repoets egne navn på apper, topics, databaser og miljøer.

### Kvalitetsregler

- Ikke finn på miljølenker, topics, API-er eller Slack-kanaler.
- Ikke påstå auth-oppsett uten å ha sett det i kode eller manifest.
- Hvis info mangler for en "alltid"-seksjon, bevar eksisterende tekst eller spør brukeren.
- Skriv kort og konkret; README er inngangsport, ikke komplett internwiki.

## Badges

Bruk badges som speiler faktisk stack og workflows. CI-badge med repoets workflow-navn:

```md
[![CI](https://github.com/navikt/<repo>/actions/workflows/<workflow>.yaml/badge.svg)](https://github.com/navikt/<repo>/actions/workflows/<workflow>.yaml)
```

Legg til teknologi-badges for repoets faktiske stack (shields.io med logo). Ta bare med det repoet bruker — ikke lag en komplett liste.

## Mermaid-diagrammer

Tilpass diagrammet til repoets faktiske arkitektur.

### Frontend

```mermaid
flowchart LR
  U[Bruker] --> A[Frontend-app]
  A -->|TokenX / cookies| B[Backend]
  B --> D[(Data / eksterne tjenester)]
```

### Backend

```mermaid
flowchart LR
  K[Kafka-topics] --> A[Backend-app]
  A --> DB[(PostgreSQL)]
  A --> API[REST API]
  F[Frontend / andre tjenester] -->|TokenX / Azure AD| API
```

### Monorepo / mikrofronter

```mermaid
flowchart LR
  U[Bruker] --> D[nav-dekoratøren]
  D --> P[Vertsapp / Min side]
  P --> M1[Mikrofrontend A]
  P --> M2[Mikrofrontend B]
  M1 -->|TokenX| B1[Backend A]
  M2 -->|TokenX| B2[Backend B]
```

## Eksempler fra malrepoer

Bruk disse som mønstre, ikke som rigid mal:

- **`esyfo-microfrontends`**: kombiner CI- og teknologibadges med mikrofront-tabell, Storybook/Grafana-lenker, "Les mer"-seksjon og Slack-info.
- **`narmesteleder-frontend`**: fremhev miljølenker, formål, backend-API og lokal utvikling for en enkelt frontend-app.
- **`aktivitetskrav-backend`**: vis backendens ansvar i diagrammet: Kafka inn/ut, database, API og hvilke klienter som kaller den via TokenX/Azure.

Lån strukturgrepene, men fyll dem med repoets egne navn, lenker og integrasjoner.

## Grafana og observability

Hvis repoet har dashboards, lenk til dem i README. Nav bruker `https://grafana.nav.cloud.nais.io/` med team-spesifikke dashboards. Sjekk `.nais/`-manifest eller eksisterende README for dashboard-URLer — ikke konstruer URLer du ikke har verifisert.

## Grenser

### Alltid

- Les faktisk repo-innhold før du skriver README.
- Kryssjekk README-tekst mot kode, `.nais/` og workflows.
- Bevar manuelt innhold som fortsatt er riktig.
- Tilpass seksjoner til frontend, backend eller monorepo.
- Beskriv auth og integrasjoner med Nav-kontekst når de finnes: TokenX, `accessPolicy`, Kafka-topics, databaser.

### Spør først

- Hvis du må gjette på miljølenker, Slack-kanal eller teamnavn.
- Hvis README mangler viktig produktkontekst som ikke kan utledes fra repoet.
- Hvis du vurderer å fjerne store manuelle seksjoner som kan være bevisst skrevet.
- Hvis flere backender eller deploy-mål gjør strukturen tvetydig.

### Aldri

- Skriv en generisk README uten å lese repoet.
- Finn på API-er, topics, dashboards, auth eller miljøer.
- Overskriv manuelt innhold ukritisk.
- Dokumenter "ønsket fremtid" som om den allerede er implementert.
- Lær bort generell Markdown- eller Mermaid-syntax i README-skillen.
