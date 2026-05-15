---
name: migrate-to-hovmester
description: "Migrering til hovmester fra legacy esyfo-cli/copilot-config-sync, eller oppsett av hovmester på repos uten eksisterende konfigurasjon. Brukes via /migrate-to-hovmester ved onboarding eller opprydding i legacy oppsett."
---

# Migrer til hovmester

Setter opp hovmester-sync på et navikt-repo. Håndterer tre scenarier:
1. **Migrering fra legacy esyfo-cli** — repo har esyfo-cli (`copilot-config-auto-approve.yml` og eventuelt annet `copilot-config-sync`-oppsett) → erstatt med hovmester
2. **Nytt oppsett** — repo har ingenting → legg til hovmester
3. **Allerede migrert** — repo har `hovmester-sync.yml` → ingenting å gjøre

`esyfo-cli` og `copilot-kitchen` er deprecated. Ikke behold legacy sync/auto-approve-oppsett parallelt med hovmester, og ikke planlegg videre drift på gammel sync-logikk.

## Teamkonstanter

| Verdi | Bruk |
|---|---|
| App ID: `2906300` | `pr_app_id` i hovmester-sync.yml |
| Bot: `teamesyfo-automerge[bot]` | `EXPECTED_PR_AUTHOR` i hovmester-verify.yml |
| Secret: `AUTOMERGE_APP_PRIVATE_KEY` | Allerede på plass via dependabot-automerge |
| GitHub Project: `navikt/157` | `github_project` i hovmester-sync.yml |

## Arbeidsflyt

### 1. Klon og analyser

```bash
REPO="<repo-navn>"
gh repo clone "navikt/${REPO}" "/tmp/${REPO}" -- --depth 1
cd "/tmp/${REPO}"
```

Sjekk status:
- `copilot-config-auto-approve.yml` finnes? → Migrering
- Legacy `copilot-config-sync`-oppsett finnes? → Migrering, ikke parallelldrift
- `hovmester-sync.yml` finnes? → Allerede migrert, stopp
- Ingen av delene? → Nytt oppsett

### 2. Detekter collection

| Signal | Collection |
|---|---|
| `build.gradle.kts` finnes | `"backend"` |
| `package.json` med `next`, `vite`, `react` i deps | `"frontend"` |
| Begge | `"backend,frontend"` |
| Ingen av delene | `"hovmester"` (kun base) |

Sjekk `package.json` dependencies for frontend-signaler:
```bash
# Backend?
[ -f build.gradle.kts ] && IS_BACKEND=true
# Frontend?
grep -qE '"(next|vite|react)"' package.json 2>/dev/null && IS_FRONTEND=true
```

Vis forslag og bekreft med brukeren.

### 3. Opprett branch og gjør endringer

```bash
git checkout -b hovmester-migration
```

**Slett legacy auto-approve-workflow** (kun ved migrering):
```bash
rm -f .github/workflows/copilot-config-auto-approve.yml
```

Dette er et påkrevd steg ved migrering fra esyfo-cli. Workflowen er legacy og skal ikke beholdes sammen med hovmester.

**Opprett `.github/workflows/hovmester-sync.yml`:**

Se [REFERENCE.md](REFERENCE.md) for komplett workflow-innhold. Sett `collections` basert på detektert stack.

Hovmester bruker branch/navn `hovmester-sync`. Ikke viderefør legacy `copilot-config-sync`-oppsett eller annen esyfo-cli auto-approve parallelt med dette. Hovmester rydder heller ikke opp eller migrerer gamle `copilot-kitchen`-manifest eller esyfo-markører for deg.

**Opprett `.github/workflows/hovmester-verify.yml`:**

Se [REFERENCE.md](REFERENCE.md) for komplett workflow-innhold.

### 4. Commit, push og opprett PR

```bash
git add .github/workflows/
git commit -m "chore: migrer til hovmester-sync fra esyfo-cli"
# eller for nytt oppsett:
git commit -m "chore: sett opp hovmester-sync"
git push --set-upstream origin hovmester-migration
```

Opprett PR med `gh pr create`. PR-body skal forklare:
- Hva som endres (hvilke workflow-filer)
- At legacy esyfo-cli-oppsett fjernes og ikke skal leve videre parallelt med hovmester
- At `AUTOMERGE_APP_PRIVATE_KEY` allerede er på plass
- At `verify-hovmester-sync` må legges til som required check etter merge

### 5. Påminnelse til brukeren

Etter PR er opprettet, minn brukeren på:

> ⚠️ **Etter merge:** Legg til `verify-hovmester-sync` som required status check på default branch i repoets branch protection settings. Uten dette vil ikke auto-merge fungere.

Hvis repoet **ikke** har `AUTOMERGE_APP_PRIVATE_KEY` som repository secret (sjekk om `dependabot-automerge.yml` bruker den):

> ⚠️ **Secret mangler:** Legg til `AUTOMERGE_APP_PRIVATE_KEY` som repository secret. Hent verdien fra teamets delte hemmeligheter.

## Grenser

### Alltid
- Bekreft detektert collection med brukeren før endring
- Sjekk at `hovmester-sync.yml` ikke allerede finnes (unngå duplikat)
- Behandle esyfo-cli som legacy ved migrering
- Slett `copilot-config-auto-approve.yml` ved migrering
- Ikke behold legacy `copilot-config-sync`/esyfo-cli auto-approve parallelt med hovmester

### Spør først
- Om collection-valget er usikkert (f.eks. monorepo)
- Om `github_project` skal være noe annet enn `navikt/157`

### Aldri
- Endre andre workflow-filer enn de tre nevnte
- Endre branch protection programmatisk
- Committe secrets
