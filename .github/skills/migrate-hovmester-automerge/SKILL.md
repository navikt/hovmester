---
name: migrate-hovmester-automerge
description: "Migrerer consumer-repoer fra pull_request_target-basert hovmester-automerge til verify/automerge-splitt med merge queue-støtte. Brukes når et repo skal rulles over til `hovmester-verify.yml` på `pull_request` + `merge_group` og `hovmester-automerge.yml` på `workflow_run`."
---

# Migrer hovmester-automerge

Repo-lokal rollout-skill for hovmester-operatører. Bruk den når et consumer-repo skal flyttes fra gammel kombinert `pull_request_target`-workflow til delt verify/automerge-modell dokumentert i repoets `README.md` og referansemalene under `templates/hovmester-automerge/`.

## Hurtigstart

1. Les repoets eksisterende `hovmester-verify.yml`, `hovmester-sync.yml`, branch protection, merge queue/rulesets, CODEOWNERS og App-oppsett.
2. Stopp ved ukjent App/bot-login, flere sync-workflows, manglende merge queue-info eller uavklart required check-oppsett.
3. Migrer til to workflows ved å starte fra referansemalene i `templates/hovmester-automerge/`:
   - `hovmester-verify.yml` på `pull_request` + `merge_group`
   - `hovmester-automerge.yml` på `workflow_run`
4. Test med en faktisk hovmester-sync PR etter at workflow-filene er merget til default branch.

## Arbeidsflyt

### 1. Kartlegg før endring

- Finn gammel `pull_request_target`-basert verify/automerge-løsning og noter hva som må erstattes.
- Bekreft at repoet bruker hovmester-sync via GitHub App, ikke PAT eller ukjent bot.
- Bekreft hvilken secret-variant som brukes: `APP_PRIVATE_KEY` eller `HOVMESTER_APP_PRIVATE_KEY`.
- Bekreft bot-login og at App-installasjonen har minst `contents: write` og `pull-requests: write`.

### 2. Migrer workflowene

- Kopier fra `templates/hovmester-automerge/` i dette repoet, ikke fra gamle README-utdrag eller eldre consumer-repoer.
- Bytt ut plassholderne for GitHub App-bot, App-ID og secret-navn før du committer.
- `hovmester-verify.yml` skal trigges på `pull_request` og `merge_group`.
- Workflowen skal være read-only: `contents: read`, `pull-requests: read`, ingen secrets og ingen write-token.
- Behold job/check-navnet `verify-hovmester-sync`.
- `hovmester-automerge.yml` skal trigges via `workflow_run` og re-verifisere fail closed fra default branch før approval og `gh pr merge --auto --squash --match-head-commit`.
- Forventet PR-forfatter er GitHub App-boten som oppretter hovmester-sync-PRer.
- Approval kommer normalt fra `github-actions[bot]` via `GITHUB_TOKEN`.
- Merge eller auto-merge settes med GitHub App-token.

### 3. Kontroller repo-oppsett

- `verify-hovmester-sync` må være required check.
- Automerge-workflowen skal ikke være required.
- Alle andre required checks som treffer merge queue må støtte `merge_group`.
- CODEOWNERS og branch protection må tillate approval fra `github-actions[bot]` for hovmester-forvaltede paths.
- PR-forfatteren skal samtidig fortsatt være forventet GitHub App-bot.

### 4. Rull ut trygt

- Merge workflow-filene til default branch før første automerge-forsøk.
- Lag egen PR per consumer-repo.
- Regn med at første PR normalt merges manuelt før automerge kan verifiseres.
- Test etter rollout med en ekte hovmester-sync PR og bekreft verify, approval, auto-merge eller merge queue.

## Boundaries

### Alltid

- Følg referansemalene i `templates/hovmester-automerge/` som startpunkt for YAML, og bruk repoets `README.md` for sikkerhetsmodell, merge queue og rollout-rekkefølge.
- Feil lukkes fail closed hvis App, bot, rulesets eller required checks ikke kan verifiseres.
- Dokumenter hva som ble kontrollert og hva som fortsatt må avklares.

### Spør først

- Hvis repoet har flere sync-workflows eller avvikende hovmester-oppsett.
- Hvis det er uklart om approval fra `github-actions[bot]` er gyldig med gjeldende CODEOWNERS eller branch protection.
- Hvis merge queue eller rulesets ikke er synlige fra repoet du jobber i.

### Aldri

- Gjett App-id, bot-login, secrets eller required checks.
- Gjør automerge-workflowen required.
- Aktiver automerge før workflow-filene ligger på default branch.
- Gjeninnfør gammel `pull_request_target`-basert automerge.

## Referanser

- Se [REFERENCE.md](REFERENCE.md) for detaljert sjekkliste, stoppkriterier og verifisering.
- Se repoets `README.md` for sikkerhetsmodell og rollout-forklaringer.
- Se `templates/hovmester-automerge/` for kanoniske workflow-maler.
