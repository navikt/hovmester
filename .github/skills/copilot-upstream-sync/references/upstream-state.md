# Upstream-sync state

Siste sjekket commit i `navikt/copilot` og hva som ble gjort.

## Siste sync

| Felt | Verdi |
|------|-------|
| SHA | `2ad032b8aa8676d78a52506d2582c785541fc426` |
| Dato | 2026-04-27 |
| Sjekket til og med | Alle commits t.o.m. 2026-04-26 |

## Adoptert

### 2026-04-27 (PR-A: quick wins)

- **`ada2e27d` Minimal-editing-prinsipp** — `kotlin.instructions.md`, `frontend.instructions.md`, kokk- og konditor-agentene fikk "Bevar eksisterende struktur"-bolk. Begge inspektør-agenter fikk diff-disproporsjon-sjekk.
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
