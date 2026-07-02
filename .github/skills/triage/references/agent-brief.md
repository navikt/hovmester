# Skrive en arbeidsklar brief

En brief er en strukturert kommentar som postes på et issue eller en PR når det flyttes til `ready-for-agent` (eller `ready-for-human`). Den er den autoritative spesifikasjonen arbeidet gjøres mot. Original body og diskusjon er kontekst — briefen er kontrakten.

Briefen sier **hva som skal gjøres**: for et issue er det å bygge endringen fra ingenting; for en PR er det hva som gjenstår *på den eksisterende diffen* — fullføre, tette hull, adressere review-punkter. Samme prinsipper, PR-eksempelet under viser forskjellen.

## Prinsipper

### Durabilitet over presisjon
Saken kan ligge i `ready-for-agent` i dager eller uker, og kodebasen endrer seg imens. Skriv briefen så den holder seg nyttig selv om filer flyttes eller refaktoreres.

- **Gjør:** beskriv grensesnitt, typer, og atferdskontrakter. Navngi konkrete typer, funksjonssignaturer eller config-former agenten skal lete etter eller endre (f.eks. en `data class`, en repository-metode, et Kafka-meldingsskjema, en Flyway-DDL).
- **Ikke gjør:** referer filstier eller linjenumre — de blir utdaterte. Ikke anta at dagens implementasjonsstruktur består.

### Atferd, ikke prosedyre
Beskriv **hva** systemet skal gjøre, ikke **hvordan** det implementeres. Agenten utforsker kodebasen på nytt og tar egne implementasjonsvalg.

- **Bra:** "Endepunktet `GET /api/v1/budstikke/{id}` skal validere TokenX-token og returnere 404 via StatusPages-feilkontrakten når raden ikke finnes."
- **Dårlig:** "Åpne `BudstikkeRoute.kt` og legg til en `if` på linje 42."

### Komplette akseptansekriterier
Agenten må vite når den er ferdig. Hvert kriterium skal være selvstendig verifiserbart. For dette Ktor-repoet inkluderer det typisk:

- Ende-til-ende-oppførselen virker (kall returnerer forventet svar / melding konsumeres idempotent / rad havner i Postgres).
- `./gradlew test` er grønn, inkl. ny test som dekker endringen.
- Auth på plass der relevant (TokenX/Azure AD), ingen PII i logger.
- NAIS-config oppdatert hvis endringen trenger topic/accessPolicy/secret.

### Eksplisitte scope-grenser
Si hva som er **utenfor** scope. Det hindrer agenten i å gullplette eller anta nærliggende features.

## Mal

```markdown
> *Generert av AI under triage.*

## Brief

**Kategori:** bug / enhancement
**Oppsummering:** én linje om hva som skal skje

**Dagens oppførsel:**
Hva skjer nå. For bugs: den ødelagte oppførselen (med reprodusert kodevei
hvis verifisert). For enhancements: status quo featuren bygger på.

**Ønsket oppførsel:**
Hva som skal skje etter at arbeidet er ferdig. Vær konkret om kant-tilfeller
og feilkontrakt.

**Sentrale grensesnitt:**
- `TypeNavn` — hva må endres og hvorfor
- `metodeNavn()` returtype — hva den returnerer nå vs hva den bør
- Config/meldingsskjema — nye felter eller former som trengs

**Styrende beslutninger:**
- Følger `docs/adr/NNNN-...` der det finnes en ADR som binder valget

**Akseptansekriterier:**
- [ ] Konkret, testbart kriterium 1
- [ ] `./gradlew test` grønn, inkl. ny test som dekker endringen
- [ ] Auth/PII-krav oppfylt der relevant
- [ ] NAIS-config oppdatert hvis topic/accessPolicy/secret berøres

**Utenfor scope:**
- Det som IKKE skal endres her
- Nærliggende feature som virker relatert men er separat
```

## Eksempel — bug

```markdown
> *Generert av AI under triage.*

## Brief

**Kategori:** bug
**Oppsummering:** Kafka-konsument for sykmelding-topic dobbeltbehandler ved replay

**Dagens oppførsel:**
Når konsumenten leser samme melding på nytt (rebalansering / offset-reset),
skrives raden inn i Postgres en gang til. Reprodusert: en test som leverer
samme `ConsumerRecord` to ganger gir to rader.

**Ønsket oppførsel:**
Konsumering skal være idempotent på meldingsnøkkelen — andre gangs behandling
av samme nøkkel skal være en no-op, ingen ny rad, ingen feil.

**Sentrale grensesnitt:**
- Repository-innskrivningen som persisterer hendelsen — trenger en
  idempotent upsert / unik constraint på meldingsnøkkelen
- Konsument-løkka — bør ikke kaste på allerede-sett nøkkel

**Styrende beslutninger:**
- Følger `docs/adr/0002-kafka-idempotens-via-meldingsnokkel.md`

**Akseptansekriterier:**
- [ ] Samme melding levert to ganger gir nøyaktig én rad
- [ ] `./gradlew test` grønn, inkl. ny replay-test
- [ ] Ingen PII logges ved duplikat-deteksjon

**Utenfor scope:**
- Endre meldingsskjemaet på topicen
- Idempotens for andre konsumenter
```

## Eksempel — PR

For en PR beskriver "Dagens oppførsel" tilstanden på diffen, og briefen ber agenten fullføre/fikse heller enn å bygge fra bunnen.

```markdown
> *Generert av AI under triage.*

## Brief

**Kategori:** enhancement
**Oppsummering:** Fullfør bidragsyters `--json`-output på `budstikke list`-endepunktet

**Dagens oppførsel:**
PR-en legger til JSON-serialisering. Happy path virker, men feil sendes
fortsatt som plain text, og den nye stien har ingen testdekning.

**Ønsket oppførsel:**
Med JSON-format er all output — også feil via StatusPages — velformet JSON,
og statuskodene er uendret. Eksisterende oppførsel uten flagget er urørt.

**Akseptansekriterier:**
- [ ] Både suksess og feil gir gyldig JSON med riktig statuskode
- [ ] `./gradlew test` grønn, inkl. én suksess- og én feiltest
- [ ] Eksisterende ikke-JSON-svar er byte-for-byte uendret

**Utenfor scope:**
- Legge til JSON på andre endepunkt
- Endre den allerede definerte JSON-formen for suksess
```

## Dårlig brief (gjør ikke dette)

```markdown
## Brief
**Oppsummering:** Fiks triage-buggen
**Hva som skal gjøres:** Triage-greia er ødelagt. Se på hovedfila og fiks det.
Funksjonen rundt linje 150 har problemet.
**Filer å endre:** BudstikkeRoute.kt (linje 150)
```

Dårlig fordi: ingen kategori, vag beskrivelse, referer filstier/linjenumre som blir utdaterte, ingen akseptansekriterier, ingen scope-grenser, ingen dagens-vs-ønsket-oppførsel.
