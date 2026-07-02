# Vanlige blinde flekker i Nav backend-prosjekter

Basert på reelle Nav-repoer og feil som oppdages sent. Bruk som sjekkliste under grillingen.

## Kritiske blinde flekker (sjekk alltid)

- [ ] Er auth-mekanismen verifisert mot caller-typen (TokenX for borger, Azure AD for ansatt/M2M)?
- [ ] Er `accessPolicy.inbound` definert i NAIS-manifestet?
- [ ] Er PII-logging unngått (callId/aktørreferanse, aldri fnr i klartekst)?
- [ ] Er HikariCP pool-størrelse tilpasset container (3–5, ikke default 10)?
- [ ] Er structured (JSON) logging til stdout satt opp?
- [ ] Finnes en strategi for dependency failure (retry / circuit breaker / DLQ)?

## Ekstra blinde flekker for modernisering

- [ ] Bakoverkompatibilitet vurdert? (Kan gammel kode lese nytt skjema?)
- [ ] Rollback-plan definert og testet?
- [ ] Exit criteria for migreringen definert?
- [ ] Berørte konsumenter identifisert og informert?
- [ ] Dekommisjoneringsplan for gammel løsning laget?
- [ ] Feature toggle for gradvis utrulling?
- [ ] Rekonsiliering planlagt (sammenligning gammel vs. ny)?

## Autentisering og autorisasjon

| Blind flekk | Konsekvens | Spørsmål å stille |
|--------------|-----------|-------------------|
| Feil auth-mekanisme for caller-type | Token-validering feiler i prod | «Hvem kaller — bruker via nettleser eller tjeneste-til-tjeneste?» |
| Azure `client_credentials` med brukerkontekst | Mister bruker-audit trail | «Trenger du brukerens identitet nedover i kjeden?» |
| Manglende `accessPolicy.inbound` | Ingen kan kalle tjenesten, feiler stille | «Hvilke tjenester skal få kalle deg?» |
| Manglende outbound-regler | Kan ikke kalle avhengigheter | «Hvilke tjenester kaller du, i hvilket cluster?» |

## Database

| Blind flekk | Konsekvens | Spørsmål å stille |
|--------------|-----------|-------------------|
| HikariCP default pool (10) | Pool exhaustion i containere med flere replicas | «Hvor mange samtidige DB-tilkoblinger trengs?» |
| Manglende indeks på foreign keys | Sakte JOIN, lås-eskalering | «Hvilke kolonner filtreres/joines på?» |
| Ingen retensjonsstrategi | Data vokser ubegrenset, GDPR-brudd | «Hvor lenge lagres data? Slettekrav?» |
| VARCHAR som PK uten plan | Vanskelig å endre senere | «Naturlig identifikator — UUID eller domenespesifikk?» |

## Kafka og hendelser

| Blind flekk | Konsekvens | Spørsmål å stille |
|--------------|-----------|-------------------|
| Ingen dead-letter-strategi | Poison pills stopper konsument | «Hva skjer med meldinger som ikke kan prosesseres?» |
| Manglende idempotens | Duplikate hendelser → duplikate vedtak | «Kan tjenesten håndtere samme melding to ganger?» |
| Feil partisjonering | Rekkefølge-garanti brytes | «Er rekkefølgen på hendelser viktig?» |
| Manglende schema-evolusjon | Konsumenter brekker ved endring | «Hvordan håndteres endringer i hendelsesformat?» |

## Observerbarhet

| Blind flekk | Konsekvens | Spørsmål å stille |
|--------------|-----------|-------------------|
| Kun tekniske metrikker | Vet ikke om forretningslogikken fungerer | «Hvilke forretningsmetrikker viser at tjenesten gjør jobben?» |
| Manglende correlation ID | Kan ikke spore på tvers av tjenester | «Propagerer dere callId/correlationId?» |
| Logging av PII | GDPR-brudd | «Hva logges? Er fnr/navn filtrert ut?» |
| Ingen alerting | Oppdager feil når brukere klager | «Hvem varsles, ved hvilke terskler?» |

## Sikkerhet

| Blind flekk | Konsekvens | Spørsmål å stille |
|--------------|-----------|-------------------|
| SQL string-konkatenering | SQL injection | «Er alle queries parameteriserte?» |
| Manglende input-validering | Injection, crash | «Valideres all ekstern input?» |
| Secret i kode/config | Eksponert hemmelighet | «Hvor lagres secrets? NAIS secrets/Vault?» |
