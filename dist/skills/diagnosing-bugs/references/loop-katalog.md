# Katalog — måter å konstruere en feedback-loop på

Prøv dem omtrent i denne rekkefølgen.

1. **Feilende test** ved den sømmen som når feilen — enhetstest, integrasjonstest, eller Ktor `testApplication { }`:
   ```bash
   ./gradlew test --tests "no.nav.syfo.<klasse>.<metode>"
   ```
   ```kotlin
   testApplication {
       application { module() }
       val res = client.get("/api/sykmelding/123")
       assertEquals(HttpStatusCode.OK, res.status) // går rødt på akkurat denne feilen
   }
   ```
2. **curl / HTTP-script** mot en kjørende lokal Ktor-server (`./gradlew run`), som differ status/body mot kjent-god.
3. **Replay av en fanget hendelse.** Lagre en ekte Kafka-record / HTTP-payload / event-logg til disk, og spill den gjennom kodestien isolert (kall consumer-handleren / route-handleren direkte med payloaden).
4. **Throwaway-harness.** Spinn opp et minimalt subsett (én route, mockede avhengigheter via MockK/WireMock, in-memory Postgres via Testcontainers) som treffer feil-kodestien med ett funksjonskall.
5. **Property / fuzz-loop.** Er feilen "noen ganger feil output", kjør 1000 tilfeldige inputs og let etter feilmodusen.
6. **Bisection-harness.** Oppstod feilen mellom to kjente tilstander (commit, datasett, versjon), automatiser "boot ved X, sjekk, gjenta" så du kan `git bisect run` den.
7. **Differensiell loop.** Kjør samme input gjennom gammel vs. ny versjon (eller to konfigurasjoner) og diff output.
8. **HITL bash-script.** Siste utvei. Må et menneske klikke/handle, driv _dem_ med `scripts/hitl-loop.template.sh` så loopen forblir strukturert. Fanget output mates tilbake til deg.

Bygg riktig feedback-loop, og feilen er 90 % fikset.
