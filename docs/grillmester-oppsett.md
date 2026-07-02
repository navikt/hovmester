# Grillmester — faseløkke-agent (eksperimentell collection)

`grillmester`-collectionen distribuerer en ny-generasjons agentflyt utviklet og
testet i [navikt/syfo-budstikka](https://github.com/navikt/syfo-budstikka)
(referanseimplementasjonen). Denne siden er menneske-vendt: hva collectionen
er, hvorfor den er bygd slik, og hva som gjenstår før den er allment anbefalt.

## Hva du får

- **`@grillmester`** (Opus 4.8) — orkestrator + inline implementør med en fast
  faseløkke: **grill → design → plan → implementer → verifiser → server →
  verifiser i miljø**. Grilling betyr at krav og design stresstestes med
  spørsmål FØR kode skrives; svar krystalliseres til levende dokumentasjon.
- **`grill-inspektor`** (GPT-5.5, read-only) — opt-in kryssmodell-review av
  sikkerhetssensitive eller tunge valg. En annen modellfamilie leser kritisk;
  den skriver aldri kode.
- **14 flyt-skills** som bærer løkka: `grill-with-docs`, `domain-modeling`,
  `codebase-design`, `decision-mapping`, `spike`, `to-prd`, `to-issues`,
  `implement`, `review`, `diagnosing-bugs`, `improve-codebase-architecture`,
  `resolving-merge-conflicts`, `triage`, `handoff` — pluss gjenbruk av
  eksisterende hovmester-skills (`grill-me`, `tdd`, `kafka-topic`, ...).
- **`bevisst-ai-bruk`-instruksjonen** — rød/grønn sone for AI-assistert
  arbeid, med explain-back-krav på rød sone.

## Designprinsipper

1. **Skriveren er inline** på sterk modell — koding parallelliseres ikke
   (implisitte beslutninger kolliderer).
2. **Subagenter er kontekst-verktøy**: read-only utforsking og
   kryssmodell-verify. Aldri parallell skriving av kode.
3. **Kvalitetsgater er deterministiske og utenfor modellen** — `./gradlew
   test`, lint, build. Positivt bevis, ikke «ser riktig ut».
4. **Disk er minne**: transient arbeidsminne i `.grill/` (gitignorert),
   durabel verdi graduerer til `docs/` (`docs/adr/`, `docs/GLOSSARY.md`,
   `docs/CONTEXT.md`).
5. **Kontrakter, ikke forbud** i alle instruksjoner.
6. **Seremonien skalerer med beslutningsinnhold, ikke diff-størrelse** —
   hurtigspor for R0–R1 uten nye domenebegreper; gatene hoppes aldri over.

## Hva som IKKE distribueres (ennå)

- **Gate-skriptene.** Referanseimplementasjonen har `scripts/scan-grill-pii.sh`
  (pre-commit-gate mot PII/hemmeligheter i `.grill/` og staged innhold) og
  `scripts/validate-agent-models.sh` (modell-pin-allowlist i CI). Agent- og
  skill-tekstene refererer disse; i et synket repo må de kopieres inn manuelt
  inntil vi har en distribusjonsmekanisme for skript (jf. `repo-sync`-skillen
  som bærer egne skript i skill-mappa).
- **Repo-meta-skillene** `writing-great-skills` (skill-forfatting med lokal
  lint) og `upstream-watch` (proveniens-sporing) — de hører hjemme i
  kilde-repoet, ikke i konsument-repoene.
- **`copilot-instructions.md`** — hvert repo eier sin egen stack-profil;
  grillmester leser den i stedet for å gjenta den.

## Status og validering

Eksperimentell. Brukt lokalt via **Copilot CLI** — ikke cloud agent på
github.com (cloud agent ignorerer `model:`-pins og agent-delegering). Det som
gjenstår før collectionen anbefales bredt:

- Røyktest av `model:`-pinning og lokal subagent-delegering i Copilot CLI
  (starter: `scripts/agent-smoke.sh` i referanseimplementasjonen).
- Erfaring fra minst ett team-repo utover syfo-budstikka.
- Beslutning om forholdet til `@hovmester`-orkestratoren: konvergens eller
  side-om-side. Inntil da er collectionen additiv og opt-in.

## Proveniens

Adaptert fra tre kilder: [mattpocock/skills](https://github.com/mattpocock/skills)
(MIT; flyt-skillene, oversatt og Nav/Ktor-tilpasset), navikt/hovmester
(backend-skills og lint-regler) og navikt/copilot (policy og
klarspråk-regler). Full proveniens-tabell med pinnede SHA-er vedlikeholdes i
referanseimplementasjonens `.github/GRILLMESTER.md`.
