# Format for ADR

ADR-er bor i `docs/adr/` med fortløpende nummerering: `0001-<slug>.md`, `0002-<slug>.md`. Opprett mappa lazy — først når første ADR trengs.

## Mal

Dette er det kanoniske ADR-formatet for oppsettet — `/grill-with-docs` og `/nav-architecture-review` peker hit, så artefaktene er enhetlige gjennom hele faseløkka:

```md
# NNNN: <kort tittel på beslutningen>

- Status: foreslått | besluttet | utdatert | erstattet av ADR-NNNN
- Kontekst: <hva tvang frem valget>
- Beslutning: <hva vi valgte>
- Konsekvenser: <hva det betyr, inkl. ulemper>
- Alternativer vurdert: <kort — hva ble vraket og hvorfor>
```

En ADR kan være korte avsnitt. Verdien ligger i å feste *at* en beslutning ble tatt og *hvorfor* — ikke i å fylle ut felter for syns skyld. Dropp `Alternativer vurdert` hvis det ikke var noe reelt alternativ; men da bør beslutningen sannsynligvis ikke vært en ADR i det hele tatt.

## Nummerering

Skann `docs/adr/` for høyeste eksisterende nummer og øk med én.

## Når tilby en ADR

Alle tre må være sanne:

1. **Vanskelig å reversere** — det koster reelt å ombestemme seg senere.
2. **Overraskende uten kontekst** — en fremtidig leser ser på koden og lurer på «hvorfor i all verden gjorde de det sånn?»
3. **Resultat av en reell avveining** — det fantes genuine alternativer og ett ble valgt av spesifikke grunner.

Er beslutningen lett å reversere, dropp den — du reverserer den bare. Er den ikke overraskende, lurer ingen på hvorfor. Fantes det ikke noe reelt alternativ, er det ingenting å feste utover «vi gjorde det åpenbare».

## Hva kvalifiserer (Nav / Ktor-backend)

- **Arkitektonisk form.** «Skrivemodellen er hendelsesdrevet, lesemodellen projiseres til Postgres.» «Vi bruker Rapids & Rivers i stedet for direkte Kafka-consumere.»
- **Integrasjonsmønster mellom contexts.** «Sykmelding og Oppfølging snakker via domenehendelser på Kafka, ikke synkron HTTP.»
- **Teknologivalg med innlåsing.** Database, meldingsbuss, auth-leverandør (TokenX vs Azure AD vs Maskinporten), deploy-mål. Ikke ethvert bibliotek — bare de som ville tatt et kvartal å bytte ut.
- **Grense- og scope-beslutninger.** «`Ident` eies av Sykmelding-contexten; andre contexts refererer kun via verdien.» De eksplisitte nei-ene er like verdifulle som ja-ene.
- **Bevisste avvik fra den åpenbare veien.** «Vi bruker manuell SQL framfor ORM fordi X.» Alt der en fornuftig leser ville antatt det motsatte — det stopper neste utvikler fra å «fikse» noe som var med vilje.
- **Begrensninger som ikke er synlige i koden.** «Svartid må under 200 ms pga. partner-API-kontrakt.» «NAIS `accessPolicy` mot team X er avtalt og må ikke utvides uten ny avtale.» Compliance-/personvernkrav (DPIA, oppbevaring, sletting av personopplysninger).
- **Vrakede alternativer der vrakingen ikke er åpenbar.** Vurderte dere GraphQL og valgte REST av subtile grunner, fest det — ellers foreslår noen GraphQL igjen om et halvår.
