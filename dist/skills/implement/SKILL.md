---
name: implement
description: "Brukes når en vedtatt plan skal omsettes til kode — @grillmester fase 4 med .grill/PLAN.md på plass, «implementer planen», «begynn på oppgave N», eller når et plukket issue/snitt er klart for koding og skal drives frem steg for steg med bevis og atomiske commits. Kalles via /implement."
---

# Implementer

Implementeringsdisiplinen for `@grillmester` **fase 4**. Du omsetter `.grill/PLAN.md` til kjørende kode — ett steg av gangen, test-først, med positivt bevis per steg og atomiske commits.

## Grunnregler (ufravikelige)

1. **Skriveren er inline.** Du skriver koden selv, i hovedtråden, på sterk modell. Du delegerer ALDRI selve skrivingen til en subagent — koding har for få reelt uavhengige deler, og implisitte beslutninger kolliderer. Subagent er kun et kontekst-verktøy for read-only utforsking som ellers fyller tråden med støy.
2. **Ett steg av gangen.** Jobb gjennom `.grill/PLAN.md` i rekkefølge, ett nummerert steg per syklus. Ikke hopp fremover, ikke bunt flere steg.
3. **Positivt bevis per steg.** Påstå aldri at et steg er ferdig uten ferskt bevis i SAMME melding: kommandoen du kjørte + output + exit-kode. Mangler beviset: skriv `UVERIFISERT: <hva som gjenstår>`.
4. **Atomiske commits.** Én logisk endring per commit, grønn ved hver commit. Ikke samle hele planen i én diff.
5. **Disk er minne.** Status og fremdrift hører hjemme i `.grill/`, ikke i hodet på samtalen.
6. **Respekter vedtatte valg.** ADR-ene i `docs/adr/` og rammene i `docs/CONTEXT.md` er bindende. Avdekker implementeringen at et valg er feil, STOPP og flagg det — ikke reåpne avgjorte valg på egen hånd.

## Før du starter

- [ ] Les `.grill/STATE.md` FØRST for å orientere deg: hvor er vi, hva er gjort, hva er neste steg.
- [ ] Les `.grill/PLAN.md` — de nummererte oppgavene med filstier, ferdig-når-kriterium, risiko-tag og påkrevde skills.
- [ ] Les `docs/CONTEXT.md` og `docs/GLOSSARY.md` så navngiving og grensesnitt matcher domenespråket.
- [ ] Sjekk `docs/adr/` for beslutninger som binder området du rører.

Mangler `.grill/PLAN.md`, er du ikke klar for fase 4. Gå tilbake til plan-fasen (`/to-issues` / planlegging) eller `/grill-with-docs` hvis snittet trenger mer design.

## Steg-løkka

For hvert nummererte steg i `.grill/PLAN.md`:

### 1. Les steget

Hva er ferdig-når-kriteriet? Hvilke filstier? Hvilken risiko-tag? Hvilke skills krever steget?

### 2. Rut til riktig domeneskill

Kall den eksplisitt med slash-form når steget berører domenet — så body-en faktisk lastes, ikke bare beskrivelsen:

| Signal i steget | Skill |
|---|---|
| Routes, plugins, DI, JWT/NAVident, StatusPages, paginering | `/kotlin-ktor` |
| Nytt/endret API, endepunkt, konsumenttilgang, breaking change | `/api-design` |
| Azure AD, TokenX, ID-porten, Maskinporten | `/auth-overview` |
| Flyway schema-endring | `/flyway-migration` |
| PostgreSQL query, indeks, pool, N+1, EXPLAIN | `/postgresql-review` |
| Kafka topic, consumer, producer | `/kafka-topic` |
| NAIS-manifest, accessPolicy, ingress, resources | `/nais-manifest` |
| Metrikker, logging, tracing, alerts | `/observability-setup` |
| PII, secrets, auditlogg, sikkerhetsreview | `/security-review` |
| Domenebegrep / ubiquitous language | `/domain-modeling` |
| Vanskelig bug underveis | `/diagnosing-bugs` |

### 3. Test-først via /tdd

Der steget har en testbar atferd (det vil si nesten alltid), kall `/tdd` og kjør red-green-refactor på den ene atferden:

```
RED:   Skriv én test for stegets atferd → feiler
GREEN: Minimal kode for å bestå → bestått
```

Ikke skriv all kode for steget i bulk. Vertikale skiver: én test → én implementasjon → gjenta. Refaktorer kun når grønn.

For et nytt endepunkt er den første testen typisk en `testApplication`-test som treffer ruten og forventer riktig status — den beviser at hele veien henger sammen.

### 4. Bevis at steget er grønt

Kjør den smaleste relevante kommandoen og lim inn kommando + output + exit-kode:

```bash
./gradlew test --tests "no.nav.syfo.<KlasseNavn>"
echo "exit: $?"
```

Uten dette beviset er steget `UVERIFISERT`.

### 5. Commit atomisk

Når steget er grønt, commit det alene via `/conventional-commit`. Pre-commit-gaten `scripts/scan-grill-pii.sh` (core.hooksPath `.githooks`) skanner staged changes for secrets/PII (fnr, tokens, hemmeligheter) og blokkerer commit ved mistanke — men len deg ikke blindt på den: ikke stage PII i utgangspunktet.

### 6. Oppdater fremdrift

Kryss av steget i `.grill/PLAN.md`. Når en fase drar ut eller du står ved en fase-grense: skriv checkpoint til `.grill/STATE.md` (hvor du er, hva som gjenstår, neste deloppgave — hold den kuratert) og re-hydrer en fersk tråd fra `.grill/STATE.md` + relevante filer. Ikke gjett på en vindu-prosent; bruk fase / «drar dette ut?» som trigger.

## Sjekkliste per steg

```
[ ] Steget lest; ferdig-når-kriterium og filstier klare
[ ] Riktig domeneskill kalt eksplisitt der relevant
[ ] Atferd drevet test-først via /tdd (én test → én impl)
[ ] Ferskt bevis: kommando + output + exit-kode i samme melding
[ ] Ingen secrets/PII i diff
[ ] Atomisk commit via /conventional-commit
[ ] PLAN.md krysset av; STATE.md oppdatert ved vindu-trykk
```

## Når alle steg er grønne

1. Kjør de deterministiske gatene i sin helhet — dette er fase 5:

   ```bash
   ./gradlew build
   echo "exit: $?"
   ```

   `build` kjører kompilering, ktlint og hele testsuiten. Hardt pass/fail.
2. Skriv hva som faktisk ble verifisert (kommando + resultat) til `.grill/VERIFICATION.md` slik at fase-løkka kan lukkes.
3. For høyrisiko-steg (auth/TokenX, PII/fnr, secrets, DB/Flyway, datamodell, Kafka, API-kontrakt, NAIS `accessPolicy`/ingress, deploy): kall `/security-review`, og vurder kryssmodell-review via `grill-inspektor`.
4. Lever via fase 6: `/pull-request`. Lukk issuet med `Closes #NNN` i PR-en og oppdater `.grill/STATE.md`.

## Anti-mønstre

- **Bulk-implementering.** Skrive hele planen før du kjører noe. Bryter steg-for-steg og positivt bevis.
- **Påstand uten bevis.** «Testene passerer» uten kommando/output/exit-kode i samme melding.
- **Mega-commit.** Hele planen i én commit. Mister atomisitet og gjør review/revert vanskelig.
- **Delegert skriving.** Sende kodingen til en subagent. Skriveren er inline.
- **Reåpne ADR-er.** Endre vedtatte valg uten å flagge — STOPP og varsle i stedet.
