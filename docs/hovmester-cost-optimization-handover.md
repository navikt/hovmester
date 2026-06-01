# Handover: Hovmester cost optimization

Audience: GitHub Copilot `@hovmester`

This handover explains the cost/quality optimization work done in the Hovmester setup, why the choices were made, what should be reviewed, and how to turn this into an issue and later a PR.

## Short summary

The Hovmester setup has been rebalanced to reduce expensive model usage without removing the quality gates that matter.

Main changes:

- Added a new internal agent, `juniorkokk`, for narrow low-risk maintenance work.
- Moved Kokk from `gpt-5.4` to `gpt-5.3-codex`.
- Moved Konditor from Opus to `claude-sonnet-4.6`.
- Upgraded all existing Opus 4.6 usages to `claude-opus-4.8`.
- Kept Hovmester and Inspektor-GPT on `gpt-5.5`.
- Reworked Hovmester's workflow from size-based "trivial/liten/medium/stor" to risk-based `R0` to `R4`.
- Made Souschef optional for low-risk and clear medium work.
- Made review gates risk-aware:
  - R0: no inspector.
- R1: no inspector by default, but ask "Ønsker du kryssmodell-review her?" when uncertain.
  - R2: cross-model review by default, but can be skipped if the user actively opts out for clearly low-risk work.
  - R3/R4: cross-model review remains mandatory.
- Replaced Konditor's manual "check aksel.nav.no" habit with direct use of `/aksel-design`.
- Split accessibility context:
  - Short always-loaded `accessibility.instructions.md`.
  - Detailed `/accessibility-review` skill for deeper review and tests.
- Restricted `juniorkokk` from git and GitHub side effects. It may draft commit/issue/PR text, but must not commit, push, create issues, change labels, or mutate PR state.

Tests currently pass: `cd scripts && python3 -m pytest test_sync.py -v` gives `50 passed`.

No commit has been made.

## Why this work was done

GitHub Copilot model pricing changed, making the existing setup more expensive than necessary. The original Hovmester configuration sent too much routine work through expensive planning and review paths. The goal was to keep the strong multi-agent quality model for meaningful risk, while making cheap, safe work cheaper.

The important tradeoff is:

- Do not optimize by blindly weakening everything.
- Optimize by routing low-risk work away from expensive agents and by loading less context by default.
- Keep strong models where mistakes are expensive: orchestration, reviews, planning of risky work, security, auth, data, API contracts, deploy/release, and unclear medium-sized tasks.

## Model decisions

### Hovmester

Current model: `gpt-5.5`

Decision: keep.

Reason: Hovmester owns task understanding, risk classification, delegation, escalation and final consolidation. This is the wrong place to save money. If the orchestrator misclassifies work, the whole pipeline gets worse.

### Juniorkokk

Current model: `gpt-5.4-mini`

Decision: add new internal low-risk agent, but keep the mandate narrow.

Why not `auto`:

- GitHub Copilot warned that `model: "auto"` is not available for the custom agent and would fall back to the current model.
- Omitting `model` would inherit the default/current model, which defeats cost control.

Why not `gpt-5-mini`:

- It is cheap, but the agent must understand small repo-context tasks, not just fix typos.
- Documentation and text changes often require understanding what should change and why.
- We decided `gpt-5-mini` is too weak for this role.

Why `gpt-5.4-mini`:

- It is cheaper than full `gpt-5.4`, Sonnet, Opus and GPT-5.5.
- It is positioned for agentic software development and codebase exploration.
- It should be capable enough for small scoped file changes when Hovmester has already clarified intent and risk.

Important boundary:

Juniorkokk is not a cheap replacement for Kokk/Konditor. It is a low-risk maintenance agent. If the task requires product judgement, cross-domain context, runtime behavior, security, deploy logic, data model changes, or unclear intent, it must escalate.

### Kokk

Current model: `gpt-5.3-codex`

Decision: downgrade from `gpt-5.4`.

Reason: Kokk is the backend implementer. `gpt-5.3-codex` should be cheaper while still being code-oriented enough for scoped backend work. Higher-risk work remains protected by Hovmester, Souschef when needed, and cross-model inspection.

Review concern:

Check that `gpt-5.3-codex` is accepted by both GitHub Copilot CLI and VS Code custom agents. If the runtime warns, this model string may need adjustment.

### Konditor

Current model: `claude-sonnet-4.6`

Decision: move from Opus to Sonnet.

Reason: frontend work needs strong UI/context reasoning, but Opus for all Konditor work is expensive. Sonnet is a more balanced default. Hovmester still escalates high-risk or unclear tasks through planning and review.

### Souschef

Current model: `claude-opus-4.8`

Decision: upgrade from Opus 4.6 to Opus 4.8, but use less often.

Reason: Planning should remain strong when used. Savings should come from skipping Souschef on R0/R1 and clear R2, not from making planning weaker.

### Inspektor-Claude

Current model: `claude-opus-4.8`

Decision: upgrade from Opus 4.6 to Opus 4.8.

Reason: Review of GPT-generated code should remain high-quality. Do not move inspectors to cheaper models for now.

### Inspektor-GPT

Current model: `gpt-5.5`

Decision: keep.

Reason: Review of Claude-generated work and Souschef plans should remain strong.

### Designer

Current model: `claude-opus-4.8`

Decision: upgrade from Opus 4.6 to Opus 4.8, and remove `disable-model-invocation` from frontmatter.

Reason: Designer is directly used by designers, not part of Hovmester's normal delegation loop. The extra frontmatter flag was unnecessary and created avoidable runtime uncertainty.

## Workflow changes

### Risk model

Hovmester now classifies requests into:

- `R0 Triviell lavrisiko`
- `R1 Liten lavrisiko`
- `R2 Medium lavrisiko`
- `R3 Høy risiko eller uklar medium`
- `R4 Kritisk`
- `Kun gjennomgang`

This replaces the old purely size-oriented table.

Reason:

Cost should follow risk. A three-line docs change and a three-line auth/config change should not have the same workflow.

### Souschef usage

Souschef is no longer automatic for medium work.

New behavior:

- R0/R1 skip Souschef.
- R2 skips Souschef when Hovmester can describe safe execution in 3-5 concrete points.
- R3/R4 use Souschef.
- R3/R4 also require mandatory planreview in Step 1b before the detailed plan is presented to the user.
- R2 uses Souschef if Hovmester is uncertain about implementation order, scope, or hidden risk.

Reason:

Codex-style models are not the preferred planning agents here; GPT-5.5 and Opus are better at planning. For simple tasks, Hovmester should understand the task and route directly. For complex tasks, Souschef remains strong.

### Review gates

Review is now risk-aware:

- R0: no inspector.
- R1: no inspector by default. Ask the user "Ønsker du kryssmodell-review her?" when uncertain.
- R2: cross-model review is default, but can be skipped only if the task is clearly low-risk and the user actively opts out.
- R3: one cross-model inspector mandatory.
- R4: both inspectors.

The important gate wording is:

> Ønsker du kryssmodell-review her?

Reason:

This keeps low-risk work cheap while giving the human a simple quality/cost decision when the system is uncertain.

## Juniorkokk scope

Juniorkokk is for:

- README, documentation, typos and Norwegian text.
- Issue/PR/commit text as drafts.
- Templates and checklists.
- Mechanical markdown/comment cleanup.
- Small YAML/config edits that do not affect deploy, auth, CI, access, runtime or dependencies.

Juniorkokk must return `BLOCKED` for:

- Runtime behavior changes.
- Auth, TokenX, Azure AD, ID-porten, secrets or PII.
- Database, Flyway, Kafka, API contracts or data models.
- NAIS accessPolicy, ingress, secrets, resources or probes.
- GitHub Actions security, dependency upgrades or release/deploy flow.
- Git side effects: commit, branch, tag, push, merge or rebase.
- GitHub side effects: create/close/update issues or PRs, labels, milestones or assignees.
- Many-file changes, renames or refactoring.

Reason:

Committing, opening issues and changing PR state creates coordination and state-management risk. Even if Juniorkokk can write the text, Hovmester or a full implementation agent should own side effects.

## Aksel and frontend context optimization

Konditor previously had an instruction to check `aksel.nav.no`. That is expensive and less deterministic.

New behavior:

- Use `/aksel-design` as the primary Aksel source.
- That skill points to the LLM-friendly Aksel markdown documentation.
- Manual web search should be secondary and only used when needed.

Reason:

The skill gives more focused context and avoids loading/reading generic website pages manually.

## Accessibility context optimization

The always-loaded accessibility instruction was reduced significantly.

New split:

- `accessibility.instructions.md`: short WCAG/Aksel minimum rules, auto-applied to `.tsx`/`.jsx`.
- `/accessibility-review`: detailed review process, code patterns and test recipes.

Reason:

Frontend agents need core accessibility rules during coding, but detailed examples and test recipes should be loaded only when the task requires deeper review.

This reduces default context without removing quality guidance.

## Files changed

Source and mirror files are both updated. The repo tests enforce `.github` and `dist` parity.

Agents:

- `.github/agents/hovmester.agent.md`
- `dist/agents/hovmester.agent.md`
- `.github/agents/juniorkokk.agent.md` new
- `dist/agents/juniorkokk.agent.md` new
- `.github/agents/kokk.agent.md`
- `dist/agents/kokk.agent.md`
- `.github/agents/konditor.agent.md`
- `dist/agents/konditor.agent.md`
- `.github/agents/souschef.agent.md`
- `dist/agents/souschef.agent.md`
- `.github/agents/inspektor-claude.agent.md`
- `dist/agents/inspektor-claude.agent.md`
- `.github/agents/inspektor-gpt.agent.md`
- `dist/agents/inspektor-gpt.agent.md`
- `.github/agents/designer.agent.md`
- `dist/agents/designer.agent.md`

Instructions and skills:

- `.github/instructions/accessibility.instructions.md`
- `dist/instructions/accessibility.instructions.md`
- `.github/skills/accessibility-review/SKILL.md`
- `dist/skills/accessibility-review/SKILL.md`

Metadata/docs:

- `collections.yml`
- `README.md`

## Current validation

Command run:

```bash
cd scripts && python3 -m pytest test_sync.py -v
```

Result:

```text
50 passed
```

Also checked with `rg` that:

- `gpt-5-mini` is no longer used.
- `gpt-5.4-mini` is used for Juniorkokk in both `.github` and `dist`.
- README reflects GPT-5.4 mini.
- Hovmester keeps R2 review as default with explicit active opt-out gate for clearly low-risk work.

## Suggested issue

Title:

```text
Optimize Hovmester model routing and context usage
```

Body:

```markdown
## Bakgrunn

GitHub Copilot-modellkostnader har endret seg, og dagens Hovmester-oppsett bruker dyre modeller og full review-/planleggingsflyt oftere enn nødvendig. Vi ønsker å redusere kostnad uten å svekke kvalitet der risikoen er høy.

## Mål

- Beholde sterk orkestrering og review for risikable oppgaver.
- Gjøre lavrisiko docs/tekst/template/config-arbeid billigere.
- Redusere default context for frontend/UU.
- Unngå manuelle Aksel-søk når `/aksel-design` gir mer fokusert dokumentasjon.

## Foreslått løsning

- Legg til `juniorkokk` som intern lavrisiko-agent på `gpt-5.4-mini`.
- Flytt Kokk til `gpt-5.3-codex`.
- Flytt Konditor til `claude-sonnet-4.6`.
- Oppgrader Opus 4.6-bruk til `claude-opus-4.8`.
- Behold Hovmester og Inspektor-GPT på `gpt-5.5`.
- Bruk risikonivå `R0`-`R4` i Hovmester i stedet for ren størrelse.
- Hopp over Souschef på R0/R1 og klare R2.
- Bruk review som gate:
  - R0: ingen review.
  - R1: ingen review som standard, men spør ved tvil.
  - R2: review default, men bruker kan velge bort ved tydelig lav risiko.
  - R3/R4: review obligatorisk.
- Gjør `/aksel-design` til primærkilde for Aksel.
- Flytt detaljerte UU-regler fra always-loaded instruction til `/accessibility-review`.

## Akseptansekriterier

- [ ] Ny `juniorkokk` finnes i både `.github/agents` og `dist/agents`.
- [ ] `collections.yml` inkluderer `juniorkokk`.
- [ ] README dokumenterer ny agent og oppdaterte modeller.
- [ ] Hovmester har tydelig R0-R4-risikotabell.
- [ ] Hovmester spør om kryssmodell-review ved tvil i R1.
- [ ] R2 har review som default, men kan gates av bruker ved tydelig lav risiko.
- [ ] Juniorkokk kan ikke utføre git-/GitHub-sideeffekter.
- [ ] Konditor bruker `/aksel-design` som primær Aksel-kilde.
- [ ] Accessibility instruction er kort, og `/accessibility-review` har detaljene.
- [ ] `.github` og `dist` er synkronisert.
- [ ] `cd scripts && python3 -m pytest test_sync.py -v` passerer.
```

## Suggested review request to Hovmester

Use this when asking `@hovmester` to review the changes:

```text
Gjør en review av endringene for Hovmester cost optimization.

Fokus:
1. Er risikomodellen R0-R4 tydelig nok til at Hovmester kan rute oppgaver billigere uten å miste kvalitet?
2. Er Juniorkokk sitt mandat smalt nok, særlig rundt tekstoppgaver, små config-endringer og ingen git-/GitHub-sideeffekter?
3. Er review-gaten god: R1 spør ved tvil, R2 default review med mulig aktivt bortvalg ved tydelig lav risiko?
4. Er modellvalgene fornuftige gitt kost/kvalitet:
   - Hovmester: gpt-5.5
   - Juniorkokk: gpt-5.4-mini
   - Kokk: gpt-5.3-codex
   - Konditor: claude-sonnet-4.6
   - Souschef/Designer/Inspektor-Claude: claude-opus-4.8
   - Inspektor-GPT: gpt-5.5
5. Finnes det frontmatter-felt eller model strings som GitHub Copilot CLI/VS Code custom agents kan advare på?
6. Er Aksel- og accessibility-endringene riktig balansert mellom kontekstkostnad og kvalitet?
7. Er `.github` og `dist` fortsatt konsistente?

Ikke implementer nye endringer før reviewen er levert. Prioriter bugs, uklarheter og risikoer over stilforslag.
```

## Suggested PR body

```markdown
## Summary

- Adds `juniorkokk`, a low-risk maintenance agent on `gpt-5.4-mini`.
- Rebalances model usage to reduce cost while preserving strong orchestration and review.
- Reworks Hovmester routing from size-based flow to `R0`-`R4` risk-based flow.
- Makes Souschef optional for low-risk and clear medium work.
- Makes review gates explicit: R2 defaults to cross-model review, with skip only by explicit user opt-out in clearly low-risk cases.
- Moves Aksel guidance to `/aksel-design` as primary source.
- Splits accessibility guidance into short always-loaded instructions and detailed `/accessibility-review` skill.
- Updates README and collection metadata.

## Why

Copilot model costs increased, and the old setup used expensive planning/review paths for too many low-risk tasks. This keeps high-quality gates for risky work while making routine docs/text/template/config changes cheaper.

## Risk

Medium. The changes are instruction/model-routing changes, not application runtime code, but they affect how future Copilot agents behave. Main risks are routing mistakes and too-aggressive skipping of review/planning.

## Review focus

- Validate model strings and review/plan routing behavior.
- Validate that Juniorkokk is narrow enough and cannot create git/GitHub side effects.
- Validate that R1/R2 review gates are clear and safe.
- Validate `.github`/`dist` sync.
- Validate that accessibility context reduction does not remove required default rules.

## Verification

- [x] `cd scripts && python3 -m pytest test_sync.py -v` - 50 passed
```

## Suggested commit message

```text
Optimize Hovmester agent routing and model usage
```

## Open questions for reviewer

- Does GitHub Copilot accept all model identifiers exactly as written?
- Is `gpt-5.3-codex` good enough for Kokk in practice, or should Kokk be lifted for some task classes?
- Should R2 always ask the user about review, or is "review default unless actively opted out" better?

## Recommended next steps

1. Ask Hovmester for a review using the review prompt above.
2. Fix any concrete issues from the review.
3. Smoke-test the custom agents in GitHub Copilot CLI and VS Code extension if possible, looking especially for model/frontmatter warnings.
4. Create an issue using the suggested issue body.
5. Open a PR with the suggested PR body.
