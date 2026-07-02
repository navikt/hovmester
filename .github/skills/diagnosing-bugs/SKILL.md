---
name: diagnosing-bugs
description: "Brukes når en feil skal diagnostiseres systematisk — noe kaster, feiler, henger eller er tregt, en flaky test, en ytelsesregresjon, eller et runtime-symptom på Nais (CrashLoopBackOff, 401/403, consumer lag, DB-timeout). 'Debug dette', 'hvorfor feiler X'. Kalles via /diagnosing-bugs. Design av nytt: /grill-with-docs."
---

# Systematisk feildiagnose

En disiplin for vanskelige feil. Hopp over faser kun når du eksplisitt kan begrunne det.

Les `docs/CONTEXT.md` (hvis den finnes) for en skarp mental modell av de relevante modulene, og sjekk `docs/adr/` for beslutninger i området du rører. For ikke-trivielle fikser sporer du arbeidet i `.grill/` (`STATE.md` leses først) på linje med @grillmester sin faseløkke.

Er symptomet et **runtime-/plattformproblem** (appen kjører, men feiler i drift) — start i symptom-tabellen nederst og følg det diagnostiske treet i `/nav-troubleshoot` (som eier trærne), deretter tilbake hit for fikse-disiplinen.

## Fase 1 — Bygg en feedback-loop

**Dette er selve skillen.** Alt annet er mekanikk. Har du et **stramt** pass/fail-signal for feilen — ett som går rødt på _denne_ feilen — så finner du årsaken; bisection, hypotesetesting og instrumentering konsumerer bare loopen. Har du den ikke, redder ingen mengde kodelesing deg.

Bruk uforholdsmessig mye krefter her. **Vær aggressiv. Vær kreativ. Ikke gi opp.**

Se [references/loop-katalog.md](references/loop-katalog.md) for åtte måter å konstruere loopen på, i prioritert rekkefølge — feilende test (med `./gradlew test --tests`- og Ktor `testApplication`-eksempel), curl/HTTP-script, replay av fanget hendelse, throwaway-harness, property/fuzz-loop, bisection-harness, differensiell loop og HITL-script som siste utvei.

### Stram loopen

Behandle loopen som et produkt. Når du har _en_ loop, **stram** den:

- Kan jeg gjøre den raskere? (Cache oppsett, hopp over urelatert init, `./gradlew test --tests` på én test, gjenbruk Testcontainers.)
- Kan jeg gjøre signalet skarpere? (Assert på det spesifikke symptomet, ikke "krasjet ikke".)
- Kan jeg gjøre den mer deterministisk? (Pinn tid med en `Clock`, seed RNG, isoler DB-schema, frys nettverk med WireMock/MockK.)

En 30-sekunders flaky loop er knapt bedre enn ingen loop; en 2-sekunders deterministisk er stram — en debugging-superkraft.

### Ikke-deterministiske feil

Målet er ikke en ren repro, men en **høyere reproduksjonsrate**. Loop triggeren 100×, parallelliser, legg på stress, smalne timing-vinduer, injiser sleeps. En 50 %-flaky feil er debugbar; 1 % er ikke — hev raten til den er debugbar.

### Når du genuint ikke får bygget en loop

Stopp og si det eksplisitt. List opp hva du prøvde. Be brukeren om: (a) tilgang til miljøet som reproduserer (f.eks. `dev-gcp`), (b) et fanget artefakt (HAR-fil, `kubectl logs --previous`-dump, Kafka-record, trace fra Tempo), eller (c) tillatelse til midlertidig produksjons-instrumentering. **Ikke** gå videre til hypoteser uten en loop.

### Fullføringskriterium — en stram loop som kan gå rød

Fase 1 er ferdig når loopen er **stram** og **rød-kapabel**: du kan navngi **én kommando** — en script-sti, en test-invokasjon, en curl — som du **allerede har kjørt minst én gang** (lim inn invokasjonen og dens output), og som er:

- [ ] **Rød-kapabel** — den driver den faktiske feil-kodestien og asserter brukerens **eksakte symptom**, så den kan gå rød på denne feilen og grønn når fikset. Ikke "kjører uten å feile" — den må kunne _fange akkurat denne feilen_.
- [ ] **Deterministisk** — samme dom hver kjøring (flaky feil: en pinnet, høy reproduksjonsrate, jf. over).
- [ ] **Rask** — sekunder, ikke minutter.
- [ ] **Agent-kjørbar** — du kan kjøre den uten tilsyn; menneske i loopen kun via `scripts/hitl-loop.template.sh`.

Tar du deg selv i å lese kode for å bygge en teori før denne kommandoen finnes, **stopp — å hoppe rett til en hypotese er nøyaktig feilen denne skillen forhindrer.** Ingen rød-kapabel kommando, ingen fase 2.

## Fase 2 — Reproduser + minimer

Kjør loopen. Se den gå rød — feilen dukker opp.

Bekreft:

- [ ] Loopen produserer feilmodusen **brukeren** beskrev — ikke en annen feil som tilfeldigvis ligger i nærheten. Feil bug = feil fiks.
- [ ] Feilen er reproduserbar over flere kjøringer (eller, for ikke-deterministiske feil, reproduserbar med høy nok rate til å debugge mot).
- [ ] Du har fanget det eksakte symptomet (feilmelding, feil output, treg timing) så senere faser kan verifisere at fiksen faktisk treffer det.

### Minimer

Når den er rød, krymp reproen til det **minste scenarioet som fortsatt går rødt**. Kutt inputs, kallere, config, data og steg **ett om gangen**, og kjør loopen på nytt etter hvert kutt — behold kun det som er bærende for feilen.

Hvorfor bry seg: en minimal repro krymper hypoteserommet i fase 3 (færre bevegelige deler igjen å mistenke) og blir den rene regresjonstesten i fase 5.

Ferdig når **hvert gjenværende element er bærende** — fjerner du ett av dem, går loopen grønn.

Ikke gå videre før du har reprodusert **og** minimert.

## Fase 3 — Hypotetiser

Generer **3–5 rangerte hypoteser** før du tester noen av dem. Enkelt-hypotese-generering ankrer på den første plausible idéen.

Hver hypotese må være **falsifiserbar**: oppgi prediksjonen den gjør.

> Format: "Hvis <X> er årsaken, vil <endring av Y> få feilen til å forsvinne / <endring av Z> gjøre den verre."

Kan du ikke oppgi prediksjonen, er hypotesen en magefølelse — forkast eller skjerp den.

**Vis den rangerte listen til brukeren før du tester.** De har ofte domenekunnskap som re-rangerer øyeblikkelig ("vi deployet nettopp en endring til #3"), eller kjenner hypoteser de allerede har utelukket. Billig sjekkpunkt, stor tidsbesparelse. Ikke blokker på det — kjør videre med din rangering hvis brukeren er borte.

## Fase 4 — Instrumenter

Hver probe må mappe til en spesifikk prediksjon fra fase 3. **Endre én variabel om gangen.**

Verktøypreferanse:

1. **Debugger / REPL-inspeksjon** hvis miljøet støtter det. Ett breakpoint slår ti logger.
2. **Målrettede logger** ved grensene som skiller hypotesene. I Ktor: SLF4J/Logback via `LoggerFactory.getLogger(...)`.
3. Aldri "logg alt og grep".

**Tagg hver debug-logg** med et unikt prefiks, f.eks. `log.info("[DEBUG-a4f2] ...")`. Opprydding til slutt blir én grep. Utaggede logger overlever; taggede logger dør.

**PII-grense (Nav):** aldri logg fnr, tokens, navn eller særlige kategorier — heller ikke i midlertidige debug-logger. Logg ID-er/correlation (`Nav-Call-Id`, `callId`), ikke personopplysninger.

**Perf-gren.** For ytelsesregresjoner er logger som regel feil verktøy. I stedet: etabler en baseline-måling (Micrometer-timer, `measureTimedValue {}`, profiler, `EXPLAIN ANALYZE` på query-en), og bisect deretter. Mål først, fiks etterpå. Se `/nav-troubleshoot` (observability-diagnose) for Mimir/Loki/Tempo.

## Fase 5 — Fiks + regresjonstest

Skriv regresjonstesten **før fiksen** — men kun hvis det finnes en **korrekt søm** for den.

En korrekt søm er en der testen treffer det **ekte feilmønsteret** slik det oppstår på kallstedet. Er eneste tilgjengelige søm for grunn (enkelt-kaller-test når feilen krever flere kallere, enhetstest som ikke kan replikere kjeden som trigget feilen), gir en regresjonstest der falsk trygghet.

**Finnes ingen korrekt søm, er det i seg selv funnet.** Noter det. Arkitekturen hindrer feilen i å låses ned. Flagg det for neste fase.

Finnes en korrekt søm:

1. Gjør den minimerte reproen til en feilende test ved den sømmen.
2. Se den feile.
3. Påfør fiksen.
4. Se den passere.
5. Kjør fase 1-loopen mot det opprinnelige (u-minimerte) scenarioet.

Pass/fail avgjøres deterministisk og utenfor modellen: `./gradlew test` (og lint/build der relevant). Ingen "ser riktig ut"-påstand uten ferskt bevis — kommando + output + exit-kode i samme melding.

## Fase 6 — Opprydding + post-mortem

Kreves før du erklærer ferdig:

- [ ] Opprinnelig repro reproduserer ikke lenger (kjør fase 1-loopen på nytt)
- [ ] Regresjonstesten passerer (eller fravær av søm er dokumentert)
- [ ] All `[DEBUG-...]`-instrumentering fjernet (`grep -rn "DEBUG-" src/`)
- [ ] Throwaway-harness slettet (eller flyttet til en tydelig merket debug-lokasjon)
- [ ] Hypotesen som viste seg riktig er skrevet i commit/PR-melding — så neste debugger lærer
- [ ] Ferskt grønt bevis for kvalitetsgatene noteres i `.grill/VERIFICATION.md` (kobler til @grillmester sin verifiser-fase)

**Spør så: hva ville forhindret denne feilen?** Involverer svaret arkitekturendring (ingen god testsøm, sammenfiltrede kallere, skjult kobling), løft funnet til en ADR i `docs/adr/` og ta det videre via `/grill-with-docs` eller `/nav-architecture-review`. Gi anbefalingen **etter** at fiksen er inne, ikke før — du vet mer nå enn da du startet.

## Symptom-oversikt — runtime/plattform

Feiler appen i **drift** (ikke i test), start i riktig diagnostisk tre. Trærne eies av `/nav-troubleshoot` (ikke duplisert her) — følg treet der, og kom tilbake hit for fikse-disiplinen (fase 5–6).

| Symptom | Tre i `/nav-troubleshoot` |
|---------|-----------|
| Pod starter ikke / krasjer / OOMKilled / ImagePullBackOff | `../nav-troubleshoot/references/pod-diagnose.md` |
| 401 Unauthorized / 403 Forbidden (TokenX / Azure AD / Texas) | `../nav-troubleshoot/references/auth-diagnose.md` |
| Kafka consumer lag / meldinger prosesseres ikke | `../nav-troubleshoot/references/kafka-diagnose.md` |
| DB-tilkoblingsfeil / HikariCP pool exhaustion / Flyway-feil | `../nav-troubleshoot/references/database-diagnose.md` |
| Feilrate/latency/restarts der signalene spriker | `../nav-troubleshoot/references/observability-diagnose.md` |

Diagnose-trærne er Nav-/Ktor-spesifikke. Generisk Kubernetes-/Kafka-/SQL-kunnskap er ikke replikert — bruk den fra eget repertoar. Foreslå alltid **minst invasive fiks først**; eskaler kun ved behov. Endring av produksjons-config, pod-restart eller pool-størrelse i prod: **spør først**.

## Relaterte skills

- `/grill-with-docs` — stresstest design + ADR/glossar (når feilen avdekker et designhull)
- `/auth-overview` — Azure AD / TokenX / ID-porten / Maskinporten / Texas (mekanismene bak auth-diagnose)
- `/nav-architecture-review` — utløs ADR for arkitekturendringer som ville forhindret feilen
