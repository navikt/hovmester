# Referanse — Workflow-maler

## hovmester-sync.yml

```yaml
name: Sync hovmester
on:
  schedule:
    - cron: '0 5 * * *'
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  sync:
    uses: navikt/hovmester/.github/workflows/hovmester-sync.yml@main
    with:
      collections: "${COLLECTIONS}"
      github_project: "navikt/157"
      pr_app_id: "2906300"
    secrets:
      APP_PRIVATE_KEY: ${{ secrets.AUTOMERGE_APP_PRIVATE_KEY }}
```

Erstatt `${COLLECTIONS}` med detektert verdi: `"backend"`, `"frontend"`, eller `"backend,frontend"`.

## hovmester-verify.yml

```yaml
name: Verify and merge hovmester sync

on:
  pull_request_target:
    types: [opened, synchronize, reopened]
  merge_group:

jobs:
  verify-hovmester-sync:
    if: github.event_name == 'merge_group' || (github.head_ref == 'hovmester-sync' && github.event.pull_request.head.repo.full_name == github.repository)
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: write
      pull-requests: write
    steps:
      - name: Verify file scope
        env:
          GH_TOKEN: ${{ github.token }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          HEAD_REF: ${{ github.head_ref }}
          HEAD_REPO: ${{ github.event.pull_request.head.repo.full_name }}
          PR_AUTHOR: ${{ github.event.pull_request.user.login }}
          EXPECTED_PR_AUTHOR: "teamesyfo-automerge[bot]"
          REPO: ${{ github.repository }}
        run: |
          set -euo pipefail

          if [[ "$GITHUB_EVENT_NAME" == "merge_group" ]]; then
            echo "✅ Merge queue — verification already completed on pull_request_target"
            exit 0
          fi

          if [[ "$HEAD_REF" != "hovmester-sync" ]] || [[ "$HEAD_REPO" != "$REPO" ]]; then
            echo "Not a hovmester sync PR — skipping"
            exit 0
          fi

          if [[ "$PR_AUTHOR" != "$EXPECTED_PR_AUTHOR" ]]; then
            echo "::error::Unexpected PR author: $PR_AUTHOR"
            echo "Expected PR author: $EXPECTED_PR_AUTHOR"
            exit 1
          fi

          FILES=$(gh api "repos/${REPO}/pulls/${PR_NUMBER}/files" \
            --paginate --jq '.[] | .filename, (.previous_filename // empty)')

          if [ -z "$FILES" ]; then
            echo "::error::No files found from pull request files API; failing closed"
            exit 1
          fi

          echo "Changed files:"
          echo "$FILES"

          while IFS= read -r file; do
            [[ -z "$file" ]] && continue
            case "$file" in
              .github/agents/*|\
              .github/instructions/*|\
              .github/skills/*|\
              .github/ISSUE_TEMPLATE/*|\
              .github/PULL_REQUEST_TEMPLATE.md|\
              .github/.hovmester-manifest.json|\
              .github/.copilot-kitchen-manifest.json)
                ;;
              *)
                echo "::error::File outside sync scope: $file"
                echo "Only hovmester-managed paths are allowed in sync PRs"
                exit 1
                ;;
            esac
          done <<< "$FILES"

          echo "✅ All files within hovmester sync scope"

      - name: Create GitHub App token for merge
        if: github.head_ref == 'hovmester-sync' && github.event.pull_request.head.repo.full_name == github.repository && github.event.pull_request.user.login == 'teamesyfo-automerge[bot]'
        id: app-token
        uses: actions/create-github-app-token@1b10c78c7865c340bc4f6099eb2f838309f1e8c3 # v3.1.1
        with:
          app-id: "2906300"
          private-key: ${{ secrets.AUTOMERGE_APP_PRIVATE_KEY }}

      - name: Approve sync PR
        if: github.head_ref == 'hovmester-sync' && github.event.pull_request.head.repo.full_name == github.repository && github.event.pull_request.user.login == 'teamesyfo-automerge[bot]'
        env:
          GH_TOKEN: ${{ github.token }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          REPO: ${{ github.repository }}
        run: |
          gh pr review "$PR_NUMBER" --repo "$REPO" --approve --body "Auto-approved: file scope verified ✅"

      - name: Enable auto-merge
        if: github.head_ref == 'hovmester-sync' && github.event.pull_request.head.repo.full_name == github.repository && github.event.pull_request.user.login == 'teamesyfo-automerge[bot]'
        env:
          GH_TOKEN: ${{ steps.app-token.outputs.token }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          REPO: ${{ github.repository }}
        run: |
          gh pr merge "$PR_NUMBER" --repo "$REPO" --auto --squash
```

Denne filen er identisk for alle teamets repos — ingen tilpasning nødvendig.
