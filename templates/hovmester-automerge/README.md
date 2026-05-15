# Referansemaler for hovmester verify/automerge

Disse malene er manuell rollout-støtte for consumer-repoer som vil auto-merg'e hovmester-sync-PRer.

- `hovmester-verify.yml` er den read-only required checken på `pull_request` og `merge_group`
- `hovmester-automerge.yml` kjører på `workflow_run`, re-verifiserer fail closed og setter auto-merge med GitHub App-token

## Slik bruker du dem

1. Kopier filene til consumer-repoet som:
   - `.github/workflows/hovmester-verify.yml`
   - `.github/workflows/hovmester-automerge.yml`
2. Bytt ut disse plassholderne:
   - `__EXPECTED_PR_AUTHOR__` → GitHub App-botens login
   - `__APP_ID__` → GitHub App-ID
   - `__APP_PRIVATE_KEY_SECRET__` → secret-navnet med App private key
3. Sett `verify-hovmester-sync` som required check.
4. La `hovmester-automerge.yml` være en vanlig workflow, ikke required check.
5. Merge normalt første rollout-PR manuelt før du forventer at automerge kan testes fra default branch.

## Viktig

- Malene ligger utenfor `dist/` og blir ikke synket til consumer-repoer automatisk.
- Workflowene forbyr endringer i `.github/workflows/*` og godtar bare hovmester-forvaltede stier.
- `hovmester-automerge.yml` bruker `GITHUB_TOKEN` til approval og et GitHub App-token med minst mulige rettigheter til merge.

## Eksempelverdier

Disse verdiene gjelder bare hvis de faktisk matcher repoet ditt:

- `__EXPECTED_PR_AUTHOR__` → `teamesyfo-automerge[bot]`
- `__APP_ID__` → `2906300`
- `__APP_PRIVATE_KEY_SECRET__` → `AUTOMERGE_APP_PRIVATE_KEY`
