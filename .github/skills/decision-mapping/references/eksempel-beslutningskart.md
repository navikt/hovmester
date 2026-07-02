# Eksempel: `.grill/DECISIONS.md`

Et utfylt beslutningskart, midt i en innsats. Idé: «Ny tjeneste som lytter på sykmeldinger fra et annet team og eksponerer status til saksbehandler-frontend.» Viser tåkefront, løste noder, frontlinje og avhengighetskanter.

```markdown
# Beslutningskart: sykmelding-status-tjeneste

Frontlinje: #4, #5. Tåke bak: lagring/sletting, observability, feilkontrakt.

## #1: Hvilke data berøres, og hvordan klassifiseres de?

Blokkert av: —
Type: Drøfting
Avveining: ingen reell — dette er en fakta-node som låser opp resten

### Spørsmål
Inneholder hendelsene fnr og diagnosekoder (særlige kategorier), eller bare statuskoder?

### Beslutning
Fnr + statuskode, ingen diagnose. Personopplysninger, ikke særlige kategorier.
Konsekvens: TokenX-auth, fnr aldri i logg, sletterutine kreves. → docs/adr/0001-dataklassifisering.md

## #2: Arketype — API, Kafka-konsument eller begge?

Blokkert av: —
Type: Drøfting
Avveining: én deploy som gjør begge (enklere drift) vs. to apper (renere skalering/ansvar)

### Beslutning
Én Ktor-app: Kafka-konsument som materialiserer status til Postgres + REST-API som leser.
Konsumenten og API-et deler datamodell, derfor samme app. → docs/adr/0002-arketype.md

## #3: Egen topic eller eksisterende rapid?

Blokkert av: #2
Type: Utredning
Avveining: arve schema + on-prem-konvensjoner fra rapid (mindre eget ansvar) vs. eget topic (full kontroll på kontrakt)

### Beslutning
Konsumer eksisterende `teamsykmelding.sykmelding`-topic. Schema og nøkkel arves.
Notat: references-lenke til utredning av topic-kontrakten (nøkkel = sykmelding-id, Avro). → spike/notat lenket

## #4: Idempotens ved replay?

Blokkert av: #2, #3
Type: Spike
Avveining: upsert på sykmelding-id (enkelt, taper hendelsesrekkefølge ved out-of-order) vs. event-logg + projeksjon (rekkefølge-trygt, mer kode)

### Spørsmål
Tåler vi at samme hendelse leveres på nytt, og kan hendelser komme out-of-order?

### Beslutning
<åpen — spike på gang: replay 10k hendelser mot Testcontainers-Postgres, mål om upsert holder>

## #5: TokenX eller Azure AD for status-API-et?

Blokkert av: #1
Type: Drøfting
Avveining: borgerkontekst on-behalf-of (TokenX) vs. server-til-server fra saksbehandler-backend (Azure AD M2M)

### Spørsmål
Kalles API-et fra en frontend på vegne av innlogget saksbehandler, eller server-til-server?

### Beslutning
<åpen>
```

Legg merke til:

- **#1 og #2 har ingen `Blokkert av`** — de er rota. #1 er en ren fakta-node (dataklassifisering) som låser opp auth, logging og lagring; derfor `Avveining: ingen reell`.
- **#5 er blokkert av #1, ikke av #4.** Auth-modellen avhenger av dataklassifiseringen, ikke av idempotens-valget. #4 og #5 kan derfor løses parallelt.
- **Tåka bak frontlinja** (lagring/sletting, observability, feilkontrakt) er bevisst ikke modellert som noder ennå — hvilke beslutninger som trengs der avhenger av utfallet av #4 og #5.
- **Avgjorte noder peker til ADR**, ikke til prosa i kartet. Tunge utredninger/spiker lenkes, limes ikke inn.
