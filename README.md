# copilot-kitchen 🍽️

Distribuerer Copilot-tilpasninger (agenter, skills, instructions) til repoer via GitHub Actions.

## Agenter

Bruk **@hovmester** for alle oppgaver — den koordinerer planlegging, implementasjon og kodegjennomgang automatisk.

```
                        ┌─────────────┐
                        │  Hovmester  │ Orkestrator (Opus)
                        │     🍽️      │ Tar imot bestillingen
                        └──────┬──────┘
                               │
                    ┌──────────┼──────────┐
                    ▼                     ▼
             ┌────────────┐        ┌────────────┐
             │  Souschef  │        │ Brainstorm  │
             │     📋     │        │     💡      │
             │ Planlegger │        │ Utforsker   │
             │   (Opus)   │        │   (skill)   │
             └─────┬──────┘        └─────────────┘
                   │
          ┌────────┴────────┐
          ▼                 ▼
   ┌────────────┐    ┌────────────┐
   │    Kokk    │    │  Konditor  │
   │    👨‍🍳     │    │     🎂     │
   │  Backend   │    │  Frontend  │
   │   (GPT)    │    │   (Opus)   │
   └─────┬──────┘    └──────┬─────┘
         │                  │
         └────────┬─────────┘
                  ▼
   ┌──────────────────────────┐
   │  Kryssmodell-inspeksjon  │
   │         🔍 🔍            │
   │ Claude inspects GPT work │
   │ GPT inspects Opus work   │
   └──────────┬───────────────┘
              ▼
       ┌────────────┐
       │  Hovmester  │
       │ konsoliderer│
       │ 😊 😐 😞   │
       └────────────┘
```

| Agent | Rolle | Modell |
|-------|-------|--------|
| **@hovmester** 🍽️ | Orkestrator — tar imot bestillingen, delegerer, konsoliderer inspeksjon | Opus |
| **@kokk** 👨‍🍳 | Backend — API, tjenester, database, Kafka, infrastruktur | GPT |
| **@konditor** 🎂 | Frontend — UI, Aksel, tilgjengelighet, state | Opus |
| *@souschef* 📋 | *(internt)* Planlegger — lager implementasjonsplaner | Opus |
| *@inspektør-claude* 🔬 | *(internt)* Kryssmodell-reviewer for GPT-arbeid | Opus |
| *@inspektør-gpt* 🔬 | *(internt)* Kryssmodell-reviewer for Opus-arbeid | GPT |

> Oppgaver delegeres som vertikale funksjonssnitt — én agent eier hele funksjonen. Kryssmodell-review fanger blindsoner: Opus gjennomgår GPT-kode, GPT gjennomgår Opus-kode.

## Kom i gang

Legg til workflowen i repoet ditt:

```yaml
# .github/workflows/copilot-sync.yml
name: Copilot Config Sync
on:
  schedule:
    - cron: '0 5 * * *'
  workflow_dispatch:
jobs:
  sync:
    uses: navikt/copilot-kitchen/.github/workflows/copilot-sync.yml@main
    with:
      collections: "esyfo,backend"   # Eller "esyfo,frontend", "backend", etc.
    secrets:
      APP_PRIVATE_KEY: ${{ secrets.AUTOMERGE_APP_PRIVATE_KEY }}  # Valgfritt — gir auto-merge
    permissions:
      contents: write
      pull-requests: write
```

Kjør manuelt: `Actions` > `Copilot Config Sync` > `Run workflow`.

**Med `APP_PRIVATE_KEY`:** PR opprettes, godkjennes og merges automatisk.
**Uten:** PR opprettes, men krever manuell review og merge.

## Collections

| Collection | Innhold |
|---|---|
| `common` (alltid inkludert) | 6 agenter, 3 instructions, 10 skills, PR-mal, issue-config |
| `esyfo` | Issue-maler (feature, bug, story, task, epic) |
| `backend` | Kotlin instruction + 7 backend-skills |
| `frontend` | Accessibility instruction + 3 frontend-skills |

Eksempler:
- `"esyfo,backend"` — Team eSyfo backend-repo
- `"esyfo,frontend"` — Team eSyfo frontend-repo
- `"backend"` — annet team, backend-repo
- `"backend,frontend"` — annet team, fullstack-repo

## Hva som synkes

```
dist/
├── agents/          → .github/agents/          6 agenter (multi-agent pipeline)
├── instructions/    → .github/instructions/    Auto-lastes basert på filtype
├── skills/          → .github/skills/          On-demand, lastes ved behov
├── issue-templates/ → .github/ISSUE_TEMPLATE/  Issue-maler
└── PULL_REQUEST_TEMPLATE.md → .github/         PR-mal
```

### Instructions — alltid-på regler

| Instruction | Lastes for | Innhold |
|---|---|---|
| `security` | Alle filer | NAIS accessPolicy, hemmeligheter, PII |
| `docker` | Dockerfiler | Chainguard images, multi-stage builds |
| `github-actions` | Workflow-filer | SHA-pinning, permissions, Nais deploy |
| `kotlin` | Kotlin-filer | Gradle, Flyway, logging, metrikker |
| `accessibility` | React-komponenter | WCAG 2.1 AA, Aksel UU-mønstre |

### Skills — on-demand veiledning

Lastes kun når oppgaven krever det. Sparer plass i kontekstvinduet.

**Common:** brainstorm, conventional-commit, grill-me, issue-management, klarsprak, nais-manifest, observability-setup, pull-request, security-review, tdd

**Backend:** api-design, auth-overview, flyway-migration, kafka-topic, kotlin-ktor, kotlin-spring, postgresql-review

**Frontend:** aksel-design, auth-overview, lumi-survey

## Auto-merge

Krever `AUTOMERGE_APP_PRIVATE_KEY` som **Actions secret** (ikke Dependabot secret):

1. **App-token** oppretter PR (trigger build via push)
2. **GITHUB_TOKEN** godkjenner PR (annen aktør enn appen)
3. **App-token** aktiverer auto-merge (trigger merge queue)

## Migrering fra esyfo-cli

1. Legg til workflowen og kjør manuelt
2. Første sync rydder opp `Managed by esyfo-cli`-filer automatisk
3. Slett `.github/workflows/copilot-config-auto-approve.yml`
4. Legg til `AUTOMERGE_APP_PRIVATE_KEY` som Actions secret

## Slik fungerer det

1. Kloner dette repoet (shallow)
2. Velger filer basert på collections
3. Sammenligner SHA-256-hasher, kopierer endrede filer, fjerner utdaterte via manifest
4. Oppretter eller oppdaterer PR på `copilot-config-sync`-branch
5. Godkjenner og merger automatisk (hvis secret er konfigurert)

Synkede filer forvaltes av copilot-kitchen — ikke rediger dem manuelt. Lag egne filer for repo-spesifikke tilpasninger.
