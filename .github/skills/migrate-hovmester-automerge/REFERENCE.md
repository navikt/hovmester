# Referanse — rollout av hovmester-automerge

Denne runbooken brukes sammen med `SKILL.md` når et consumer-repo skal migreres fra gammel kombinert `pull_request_target`-workflow til delt verify/automerge-modell.

Start alltid fra referansemalene i `templates/hovmester-automerge/` i dette repoet. `README.md` forklarer sikkerhetsmodellen og rollout-rekkefølgen, men template-filene er den kanoniske YAML-kilden.

## Før du endrer noe

Bekreft dette i consumer-repoet:

- Det finnes bare én relevant hovmester-sync-flyt. Stopp hvis repoet har flere konkurrerende sync-workflows.
- Repoet bruker GitHub App for hovmester-sync, med kjent `pr_app_id`, kjent bot-login og private key-secret.
- Secret-navnet er avklart: `APP_PRIVATE_KEY` eller `HOVMESTER_APP_PRIVATE_KEY`.
- App-installasjonen har minst `contents: write` og `pull-requests: write`.
- Du ser hvordan branch protection eller rulesets er satt opp for default branch.
- Du vet om repoet bruker merge queue.
- Du vet om bot-approval er lov for hovmester-forvaltede paths gitt CODEOWNERS og review-regler.

## Workflow-målbildet

Før du tilpasser workflowene i consumer-repoet, bytt ut plassholderne for:

- GitHub App-bot-login (`__EXPECTED_PR_AUTHOR__`)
- GitHub App-ID (`__APP_ID__`)
- Secret-navn for App private key (`__APP_PRIVATE_KEY_SECRET__`)

### `hovmester-verify.yml`

Må oppfylle alle punktene under:

- Trigges på `pull_request` og `merge_group`
- Har bare read-only permissions: `contents: read`, `pull-requests: read`
- Bruker ingen secrets og ingen write-token
- Har job/check-navn `verify-hovmester-sync`
- Verifiserer bare hovmester-forvaltede filer og forbyr workflow-endringer

### `hovmester-automerge.yml`

Må oppfylle alle punktene under:

- Trigges på `workflow_run`
- Kjører fra default branch, ikke fra PR-branch
- Re-verifiserer fail closed via GitHub API før approval og merge
- Bekrefter minst workflow-konklusjon, event-type, same-repo-krav, fil-allowlist og head SHA
- Godkjenner PRen først etter vellykket re-verifisering, normalt via `GITHUB_TOKEN`, så approval-aktøren blir `github-actions[bot]`
- Kjører `gh pr merge --auto --squash --match-head-commit` med GitHub App-token

## Repo-oppsett som må verifiseres

### GitHub App og bot

- `pr_app_id` peker til riktig App
- Bot-login matcher Appen som faktisk oppretter hovmester-sync-PRer
- Forventet PR-forfatter er denne GitHub App-boten, ikke `github-actions[bot]`
- Ukjent App eller bot-login er stoppkriterium

### Required checks og merge queue

- `verify-hovmester-sync` er required check
- `hovmester-automerge.yml` er ikke required
- Andre required checks som gjelder default branch støtter også `merge_group` hvis repoet bruker merge queue
- Manglende oversikt over required checks eller merge queue er stoppkriterium

### CODEOWNERS og review-regler

- Approval fra `github-actions[bot]` må være gyldig for hovmester-forvaltede paths
- PR-forfatteren vil normalt være GitHub App-boten, mens merge eller auto-merge bruker GitHub App-token
- Hvis CODEOWNERS krever menneskelig godkjenning uten unntak for bot, stopp og avklar før rollout

## Anbefalt rollout-rekkefølge

1. Kopier workflow-filene fra `templates/hovmester-automerge/` til consumer-repoet og tilpass plassholderne.
2. Lag PR for akkurat dette repoet.
3. Merge første PR manuelt ved behov.
4. Vent til workflow-filene ligger på default branch.
5. Bekreft branch protection/rulesets etter at required check peker på `verify-hovmester-sync`.
6. Kjør eller vent på en faktisk hovmester-sync PR.
7. Bekreft at verify kjører på `pull_request` og `merge_group`.
8. Bekreft at automerge-workflowen trigges via `workflow_run`, godkjenner PRen og setter auto-merge eller merge queue.

## Verifisering etter rollout

Bruk en ekte hovmester-sync PR, ikke bare statisk filreview:

- PRen opprettes av forventet GitHub App-bot
- `verify-hovmester-sync` blir grønn
- Workflowen er required check på default branch
- Automerge-workflowen re-verifiserer og feiler lukket ved avvik
- Approval registreres normalt fra `github-actions[bot]` via `GITHUB_TOKEN`
- `gh pr merge --auto --squash --match-head-commit` med GitHub App-token lykkes, eller PRen går korrekt inn i merge queue

## Stoppkriterier

Stopp og be om avklaring hvis ett av disse punktene slår inn:

- Ukjent App-id, ukjent bot-login eller uklart secret-oppsett
- Flere sync-workflows eller blandet gammel/ny modell
- Merge queue/rulesets kan ikke inspiseres
- Required checks er uklare eller i konflikt med målbildet
- CODEOWNERS/review-regler gjør bot-approval uakseptabelt
- Workflow-filene er ikke merget til default branch, men noen vil teste automerge likevel

## Hva som bør inn i consumer-repo-PRen

- Kort hvorfor repoet migreres nå
- At gammel `pull_request_target`-flyt erstattes av verify/automerge-splitt
- At `verify-hovmester-sync` beholdes som required check-navn
- Om første PR må merges manuelt
- Hvordan rollout ble verifisert eller hva som gjenstår å teste
