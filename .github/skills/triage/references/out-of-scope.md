# Out-of-scope-kunnskapsbasen

Mappen `.out-of-scope/` i repoet lagrer varige spor av *avviste* feature-ønsker. Den tjener to formål:

1. **Institusjonell hukommelse** — hvorfor en feature ble avvist, så begrunnelsen ikke går tapt når saken lukkes.
2. **Deduplisering** — kommer et nytt ønske som matcher en tidligere avvisning, surfacer triage den gamle beslutningen i stedet for å ta debatten på nytt.

## Mappestruktur

```
.out-of-scope/
├── grafql-api.md
├── multi-tenant-lagring.md
└── eget-brukervendt-ui.md
```

Én fil per **konsept**, ikke per issue. Flere issues som ber om det samme grupperes under én fil. Bruk korte, beskrivende kebab-case-navn så noen som blar i mappen skjønner hva som ble avvist uten å åpne fila.

## Filformat

Skriv avslappet og lesbart — mer som et kort designnotat enn en databaserad. Bruk avsnitt og kodeeksempler så begrunnelsen er nyttig for noen som møter den første gang.

```markdown
# GraphQL-API

Denne tjenesten eksponerer ikke et GraphQL-API.

## Hvorfor dette er utenfor scope

Budstikka er en hendelsesdrevet Ktor-backend: kontrakten utad er noen få
autentiserte REST-endepunkt og Kafka-topics. Et GraphQL-lag ville kreve et
schema-/resolver-rammeverk, ny auth-mapping per felt, og en query-kostnadsgrense
mot Postgres — betydelig overflate uten et reelt konsumentbehov.

Konsumenter som trenger fleksible spørringer kan lese fra topicene og bygge sin
egen lesemodell. Følger `docs/adr/0003-rest-fremfor-graphql.md`.

## Tidligere ønsker

- #42 — "Legg til GraphQL-endepunkt"
- #87 — "Fleksibel spørring over budstikke-hendelser"
```

### Skrive begrunnelsen

Begrunnelsen skal være substansiell — ikke "vi vil ikke ha dette", men hvorfor. Gode begrunnelser refererer:

- Tjenestens scope/filosofi ("Budstikka er hendelsesdrevet; X er en konsumentbekymring").
- Tekniske rammer ("Dette ville kreve Y, som bryter med Z-arkitekturen i `docs/adr/`").
- Strategiske valg ("Vi valgte A fremfor B fordi …").

Begrunnelsen skal være durabel. Unngå midlertidige omstendigheter ("vi har ikke tid nå") — det er ikke avvisninger, det er utsettelser.

## Når sjekke `.out-of-scope/`

Under triage (steg 1, Hent kontekst): les alle filer i `.out-of-scope/`. Vurder om et nytt ønske matcher et eksisterende konsept — match på **konseptlikhet, ikke nøkkelord** ("fleksibel spørring" matcher `grafql-api.md`). Ved match, surface for brukeren: "Dette ligner `.out-of-scope/grafql-api.md` — vi avviste dette før fordi [grunn]. Føler du fortsatt det samme?"

Brukeren kan:
- **Bekrefte** — det nye issuet legges til fila sin "Tidligere ønsker"-liste, så lukkes som `wontfix`.
- **Revurdere** — fila slettes/oppdateres, og issuet går gjennom normal triage.
- **Være uenig** — sakene er relatert men distinkte; fortsett normal triage.

## Når skrive til `.out-of-scope/`

Kun når en **enhancement** (ikke en bug) *avvises* som `wontfix`. Dette gjelder enhancement-PR-er nøyaktig som issues — en avvist PR spores her så samme ønske ikke kommer tilbake som fersk kode.

Skriv **ikke** her når noe lukkes `wontfix` fordi det er **allerede implementert**. Det er en bygd feature, ikke et avvist ønske; å spore den ville forgifte dedup-sjekken med falske avvisninger. Pek heller i lukke-kommentaren på hvor featuren allerede lever.

Flyten:

1. Brukeren avgjør at et feature-ønske er utenfor scope.
2. Sjekk om en matchende `.out-of-scope/`-fil finnes.
3. Hvis ja: legg det nye issuet til "Tidligere ønsker".
4. Hvis nei: opprett ny fil med konseptnavn, beslutning, begrunnelse og første tidligere ønske.
5. Post en kommentar (med AI-disclaimer) på issuet som forklarer beslutningen og nevner fila.
6. Lukk issuet med `wontfix`-label.

## Oppdatere eller fjerne filer

Ombestemmer brukeren seg om et tidligere avvist konsept: slett `.out-of-scope/`-fila. Triage trenger ikke gjenåpne gamle issues — de er historiske spor. Det nye issuet som utløste revurderingen går gjennom normal triage.
