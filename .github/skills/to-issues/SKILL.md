---
name: to-issues
description: "Brukes når en plan, et design, en PRD eller .grill/PLAN.md skal brytes ned i selvstendig plukkbare GitHub-issues. Typisk etter @grillmester sin plan-fase, eller 'lag issues', 'splitt opp i tickets', 'bryt ned arbeidet', 'lag epic + sub-issues'. Kalles via /to-issues."
---

# to-issues

Bryt en plan ned i selvstendig plukkbare issues via **tracer-bullet** vertikale snitt. Hvert issue er et tynt snitt som går helt gjennom alle lag i tjenesten, ikke et horisontalt snitt av ett lag.

Dette er broa mellom plan-fasen og implementeringen i @grillmester sin faseløkke: input er som regel `.grill/PLAN.md` (+ `docs/CONTEXT.md` og `docs/adr/`), output er issues på dette repoet som er klare for plukking.

## Arbeidsflyt

### 1. Hent kontekst

Jobb fra det som allerede er i samtalen. Prioritert kilderekkefølge:

- `.grill/PLAN.md` — den vedtatte planen fra plan-fasen
- `docs/CONTEXT.md` — valgt tilnærming og rammer fra design-fasen
- `docs/adr/` — beslutninger som binder issue-innholdet (respekter dem; ikke reåpne avgjorte valg)
- `docs/GLOSSARY.md` — domenespråk som issue-titler og -beskrivelser skal bruke

Hvis brukeren oppgir en issue-referanse (nummer, URL) som argument, hent issuet fra GitHub og les body + kommentarer. Det blir parent-issue for snittene.

### 2. Utforsk kodebasen (ved behov)

Har du ikke allerede kartlagt koden, gjør det nå for å forstå utgangspunktet. Issue-titler og -beskrivelser skal bruke domenespråket fra `docs/GLOSSARY.md` og respektere ADR-ene i området du rører.

Se etter **prefaktorering** som gjør implementeringen enklere: "gjør endringen lett, så gjør den lette endringen." Prefaktorering blir egne issues som plukkes først.

### 3. Tegn vertikale snitt

Bryt planen i **tracer-bullet**-issues. Et snitt i denne Ktor-backenden kutter typisk gjennom:

```
Flyway-migrasjon  →  repository/spørring  →  domene/service
                  →  Ktor-route ELLER Kafka-konsument  →  auth (TokenX/Azure AD)
                  →  test (`./gradlew test`)  →  NAIS-config (topic/accessPolicy ved behov)
```

<vertikalt-snitt-regler>

- Hvert snitt leverer en smal, men KOMPLETT vei gjennom alle berørte lag
- Et fullført snitt er demonstrerbart eller verifiserbart for seg selv (et kall som returnerer riktig svar, en melding som konsumeres idempotent, en rad som havner i Postgres)
- Prefaktorering gjøres først, som egne snitt
- Bind hvert snitt til relevant ADR der det finnes en beslutning som styrer det

</vertikalt-snitt-regler>

Eksempel — én feature, tre snitt:

1. **Persistér mottatt budstikke-hendelse** — Flyway-migrasjon + repository + idempotent insert + test. Ingen route ennå.
2. **Eksponer hendelse via autentisert endepunkt** — Ktor-route med TokenX-validering + service som leser fra repository + StatusPages-feilkontrakt + test. Blokkert av 1.
3. **Konsumer Kafka-hendelse inn i samme lager** — konsument + idempotens/replay-håndtering + NAIS topic/accessPolicy + test. Blokkert av 1.

### 4. Kvalitetssjekk snittene mot brukeren

Presenter nedbrytningen som en nummerert liste. For hvert snitt, vis:

- **Tittel** — kort, beskrivende, på domenespråket
- **Blokkert av** — hvilke andre snitt (om noen) må fullføres først
- **Dekker** — hvilke deler av planen / brukerhistorier dette løser

Spør brukeren:

- Føles granulariteten riktig? (for grov / for fin)
- Stemmer avhengighetene?
- Skal noen snitt slås sammen eller splittes videre?

Iterer til brukeren godkjenner nedbrytningen.

### 5. Publiser issues til GitHub

For hvert godkjent snitt, opprett et issue på dette repoet med malen under. Publiser i avhengighetsrekkefølge (blokkerere først) så du kan referere reelle issue-nummer i "Blokkert av".

- Sett **issue-type** (`Feature`/`Task`/`Bug`/`Story`), og for store kilder: opprett epic først, koble snittene som **sub-issues** og koble **avhengigheter** native. Selve issue-mekanikken (typer, sub-issues, avhengigheter, ferdigmelding, PR-kobling) eies av `/issue-management` — kall den.
- Legg issuet inn i prosjektboardet hvis konfigurert — se `references/prosjektboard.md`
- Disse issuene regnes som klare for plukking; publiser med riktig triage-label med mindre noe annet er sagt

<issue-mal>
## Parent

Referanse til parent-issue (utelat hvis kilden ikke var et eksisterende issue).
For sub-issues: `Del av epic: #EPIC_NR`.

## Hva som skal bygges

Kort beskrivelse av dette vertikale snittet. Beskriv ende-til-ende-oppførsel, ikke lag-for-lag-implementering.

Unngå konkrete filstier og kodesnutter — de blir utdaterte fort. Unntak: hvis et design/prototype har produsert en snutt som koder en beslutning mer presist enn prosa (datakontrakt, Kafka-meldingsskjema, Flyway-DDL, feilkontrakt), inline kun de beslutningsbærende bitene og noter hvor de kommer fra.

Pek på styrende ADR der det finnes: `Følger docs/adr/NNNN-...`.

## Akseptansekriterier

- [ ] Ende-til-ende-oppførselen virker (f.eks. kall returnerer forventet svar / melding konsumeres idempotent)
- [ ] `./gradlew test` grønn, inkl. ny test som dekker snittet
- [ ] Auth på plass der relevant (TokenX/Azure AD), ingen PII i logger
- [ ] NAIS-config oppdatert hvis snittet trenger topic/accessPolicy/secret

## Blokkert av

- Referanse til blokkerende issue (`#NNN`), ellers "Ingen – kan startes umiddelbart"
</issue-mal>

Ikke lukk eller endre parent-issuet.

## Etter publisering

Issuene er nå input til implementeringsfasen. Når et snitt plukkes, kjører @grillmester normal faseløkke på det (implementer → verifiser → server), og lukker issuet via `Closes #NNN` i PR-en. Bruk `/grill-with-docs` hvis et snitt viser seg å trenge mer design før det kan implementeres.
