# Upstream-sync state

Siste sjekket commit i `navikt/copilot` og hva som ble gjort.

## Siste sync

| Felt | Verdi |
|------|-------|
| SHA | `2114270f24436a0ca3d32b78ea7de3008ba17ff3` |
| Dato | 2026-06-05 |
| Sjekket til og med | HEAD i `/tmp/navikt-copilot-upstream` etter fetch (`2114270f24436a0ca3d32b78ea7de3008ba17ff3`), inkludert commits t.o.m. 2026-06-05 |

## Adoptert

### 2026-06-05 (selektiv upstream-sync)

- **`4579ee0` terse-mode + `de73ce6` deliberate-ai-use** — ikke adoptert som egen skill/instruction. Prinsippene ble tilpasset inn i ny `dist/agents/barista.agent.md`: kort, presis stil, solo-flyt for små oppgaver og tydelig rød/grønn-sone med manuell eskalering til `@hovmester`.
- **`ffe0c25` observability-debugging** — ikke ny skill. Nav-spesifikk diagnoseflyt ble flettet inn i `dist/skills/nav-troubleshoot/SKILL.md` og ny `dist/skills/nav-troubleshoot/references/observability-diagnose.md`.
- **`7acbe01` code-review.instructions** — ikke ny parallell instruction. Relevante røde sikkerhetssignaler ble tilpasset inn i eksisterende `dist/instructions/copilot-review.instructions.md`.
- **`c050179` bokmål med nynorsk/svensk-detektering + `9c73343` AI-mønstre** — tilpasset i `dist/skills/klarsprak/references/ai-markorer.md`, ikke i auto-load instruction.
- **`security-owasp` (`4579ee0257add4245626499404962f4ed86a7c23`) + `threat-model` (`ac1bfdfbe949f3257395b446a896b12be216a97e`, oppdatert i `961f8a49d2dc966334b6007a7a637486399758ef`)** — ikke nye skills. Korte, Nav-relevante deler ble flettet inn i `dist/skills/security-review/references/api-security.md` og `dist/skills/security-review/references/nav-threat-model.md`.

### 2026-04-27 (PR-A: quick wins)

- **`ada2e27d` Minimal-editing-prinsipp** — `kotlin.instructions.md`, `frontend.instructions.md`, kokk- og konditor-agentene fikk "Bevar eksisterende struktur"-bolk. Begge inspektor-agenter fikk diff-disproporsjon-sjekk.
- **`8b2cb9f9` NAIS pod-lifecycle** — `nais-manifest`-skillen dokumenterer preStop sleep 5, terminationGracePeriodSeconds-anti-mønster og readiness=false som anti-mønster (detaljer i `references/pod-lifecycle.md` pga line-cap). `kotlin-ktor` fikk Graceful shutdown-seksjon. `kotlin-spring` peker til `nais-manifest` for plattformkonteksten.
- **`f6c88077` readme-review-innsikter** — `readme-update` beriket med scope-deteksjon (library + Naisjob), 7-punkts anti-mønsterliste på norsk, "topp 3 fikser"-reviewmodus og kognitiv-trakt-prinsipp. Section-spec-matrix (18×4) droppet som for tung.
- **`46f2cc13` copilot-review-instructions** — adoptert som path-specific instruction (`.github/instructions/copilot-review.instructions.md` med `applyTo: "**"`). Upstream brukte path `.github/copilot-review-instructions.md` som ikke leses av GitHub Copilot Code Review — vi korrigerte til en støttet path under adopsjon.
- **`5552d025` Norwegian text quality (hybrid)** — ny `norwegian-text.instructions.md` (`applyTo: "**/*.md"`) auto-loader kjerneregler; eksisterende `klarsprak`-skill trimmet for å unngå dobbeltlagring og beholder dypdykk for UI-tekst, mikrotekst og feilmeldinger.

### 2026-04-17

- **Aksel llm.md-referanse** — aksel-design og figma-workflow peker nå til `aksel.nav.no/llm.md` for live docs
- **Aksel v8-regler** — Alert deprecated, Button danger→data-color, borderRadius numerisk, CSS-prefix `.aksel-`
- **accessibility.instructions.md** — Alert→LocalAlert i ARIA-eksempel

## Vurdert og droppet

| Commit | Hva | Grunn |
|--------|-----|-------|
| `f5da16a7` | Ktor/Spring-rebalansering (transaction patterns, DI-reframing) | Relevant, men eget arbeid — oppfølgingsissue opprettet |
| `ba5bb16f` | HikariCP 40→5 | Allerede dekket — hovmester sier 3-5 i postgresql-review, kotlin-spring og nais-manifest |
| `b7e67ec3` | my-copilot hero-kodeeksempler | Intern portal — ikke relevant |
| `43414879` | forfatter guardrails | Forfatter-agent — ikke relevant |
| `7a5150a4` | april 2026 nyheter | Docs/news — ikke relevant |
| `961f8a49` | agentskills.io / gh skill install | nav-pilot tooling — ikke relevant |
| `d23d36fc`–`828261d6` | nav-pilot, my-copilot, news | Intern tooling og portal — ikke relevant |
| 2026-04-18→04-26 | nav-pilot tooling, my-copilot portal, news-poster, forfatter-agent-justeringer, intern Fleet-artikkel | Intern tooling/docs — ikke relevant |
| `4579ee0` | `terse-mode` som egen skill | Prinsipp adoptert i `barista`; egen skill ville duplisert agentatferd |
| `de73ce6` | `deliberate-ai-use` instruction | Kort rød/grønn-sone lagt i `barista`; ingen global instruction |
| `ffe0c25` | `observability-debugging` skill som egen skill | Flettet inn i `nav-troubleshoot`; vi vil ha Nav-diagnostikk, ikke ekstra generisk skill |
| `4579ee0257add4245626499404962f4ed86a7c23` | `security-owasp` | Kort mapping flyttet til eksisterende sikkerhetsflater |
| `ac1bfdfbe949f3257395b446a896b12be216a97e`, `961f8a49d2dc966334b6007a7a637486399758ef` | `threat-model` | DFD/trusseltabell flettet inn i `nav-threat-model.md` |
| `7acbe01` | Ny `code-review.instructions.md` | Eksisterende `copilot-review.instructions.md` ble oppdatert i stedet |
| `c050179` | Mer detaljer i auto-load `norwegian-text.instructions.md` | Holdt auto-instruction lean; detaljer lagt i `/klarsprak` |
| `c0706a213bff53b4b1a820f800c3909ee452b919^..2114270f24436a0ca3d32b78ea7de3008ba17ff3` | playwright-testing, aksel-spacing, web-design-reviewer, scaffold-skills, Rust/Go/Java-to-Kotlin, workstation-security, ai-news-research, portal/nav-pilot docs/news | Batch-droppet etter lean-filter og brukerbeslutning |
