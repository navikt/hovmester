# Deepening

Hvordan deepe en klynge grunne moduler trygt, gitt avhengighetene. Forutsetter vokabularet i [SKILL.md](SKILL.md) — **modul**, **grensesnitt**, **søm**, **adapter**. Henger sammen med `/improve-codebase-architecture`; vanskelige beslutninger skrives som ADR i `docs/adr/`.

## Avhengighetskategorier

Når du vurderer en kandidat for deepening, klassifiser avhengighetene. Kategorien avgjør hvordan den deepede modulen testes over sømmen.

### 1. In-process

Ren beregning, in-memory tilstand, ingen I/O (f.eks. arbeidsgiverperiode-beregning, validering, mapping). Alltid deepbar — slå sammen modulene og test direkte gjennom det nye grensesnittet. Ingen adapter trengs.

### 2. Lokalt-substituerbar

Avhengigheter med lokale test-stand-ins: Postgres via Testcontainers + Flyway, embedded/Testcontainers Kafka, in-memory `DataSource`. Deepbar hvis stand-in finnes. Den deepede modulen testes med stand-in kjørende i testsuiten. Sømmen er intern; ingen port på modulens eksterne grensesnitt.

### 3. Eid over nett (Ports & Adapters)

Andre Nav-tjenester over en nettverksgrense (andre team, intern API styrt av NAIS `accessPolicy`). Definer en **port** (grensesnitt) ved sømmen. Den dype modulen eier logikken; transporten injiseres som en **adapter**. Tester bruker en in-memory adapter. Produksjon bruker en Ktor `HttpClient`-adapter (med TokenX/Azure AD on-behalf-of-token).

Anbefalingsform: *«Definer en port ved sømmen, implementer en HTTP-adapter (Ktor `HttpClient`) for produksjon og en in-memory adapter for test, slik at logikken ligger i én dyp modul selv om den er deployet over nett.»*

```kotlin
// Port ved sømmen — logikken kjenner bare denne
interface PdlClient { suspend fun hentNavn(fnr: String): Navn }

// Produksjons-adapter (TokenX-token + Ktor HttpClient)
class PdlHttpClient(private val http: HttpClient, private val tokenClient: TokenXClient) : PdlClient

// Test-adapter (deterministisk, ingen nett)
class PdlInMemory(private val data: Map<String, Navn>) : PdlClient
```

### 4. Ekte ekstern (Mock)

Tredjeparter / felleskomponenter du ikke kontrollerer (ID-porten, Maskinporten-endepunkter, eksterne leverandører). Den deepede modulen tar den eksterne avhengigheten som en injisert port; tester gir en mock-adapter. Vurder kontrakt-/avtaletester mot leverandøren der det finnes.

## Søm-disiplin

- **Én adapter betyr en hypotetisk søm. To adaptere betyr en reell.** Ikke innfør en port før minst to adaptere er rettferdiggjort (typisk produksjon + test). En søm med bare én adapter er ren indireksjon.
- **Interne sømmer vs eksterne sømmer.** En dyp modul kan ha interne sømmer (private for implementasjonen, brukt av dens egne tester) i tillegg til den eksterne sømmen ved grensesnittet. Ikke eksponer interne sømmer gjennom grensesnittet bare fordi testene bruker dem.

## Teststrategi: bytt, ikke lagdel

- Gamle enhetstester på grunne moduler blir avfall når tester ved den deepede modulens grensesnitt finnes — slett dem.
- Skriv nye tester ved den deepede modulens grensesnitt. **Grensesnittet er testflaten.**
- Tester asserterer på observerbare utfall gjennom grensesnittet, ikke på intern tilstand.
- Tester skal overleve interne refaktoreringer — de beskriver oppførsel, ikke implementasjon. Må en test endres når implementasjonen endres, tester den forbi grensesnittet.
