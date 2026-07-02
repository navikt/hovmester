---
name: domain-modeling
description: "Brukes når domenespråket skal skjerpes eller skrives ned — et begrep er uklart eller overlastet, to ord brukes om samme ting, koden og praten er uenige, eller en vanskelig-å-reversere beslutning bør festes som ADR. Den aktive disiplinen i @grillmester fase 1; 'hva mener vi egentlig med X', 'skriv ned den beslutningen'. Kalles via /domain-modeling."
---

# domain-modeling

Den **aktive** disiplinen: bygg og skjerp domenemodellen mens du designer — utfordre begreper, finn opp kant-scenarier, og skriv glossar og beslutninger ned i det øyeblikket de krystalliserer seg.

Å bare *lese* `docs/GLOSSARY.md` for å bruke riktig ord er ikke denne skillen — det er en énlinjes vane enhver skill har. Denne skillen er for når du **endrer** modellen, ikke bare konsumerer den. Den lever inne i grillingen (`/grill-with-docs`, fase 1): et avklart begrep blir en glossar-linje, en avklart beslutning blir en ADR-linje, løpende.

## Hvor ting ligger

Domenemodellen er **durable dokumentasjon** og bor i `docs/` (committes — `.grill/` er gitignorert transient arbeidsminne, ikke her):

```
docs/
├── GLOSSARY.md           ← ett begrep per linje: term → presis definisjon
├── CONTEXT.md            ← valgt tilnærming / designkontekst (ikke glossar)
└── adr/
    ├── 0001-tokenx-mot-ekstern-api.md
    └── 0002-kafka-idempotens-via-meldingsnokkel.md
```

Lag filer **lazy** — kun når du har noe å skrive. Ingen `GLOSSARY.md` enda? Opprett den når første begrep avklares. Ingen `adr/`? Opprett den når første ADR trengs.

Er repoet stort nok til flere bounded contexts (f.eks. egne moduler under `src/main/kotlin/no/nav/syfo/<context>/`), seed et begrep til riktig context og noter relasjonen mellom dem i toppen av `GLOSSARY.md` (hvem eier `Ident`, hvem konsumerer hvilke Kafka-hendelser). Når det er uklart hvilken context et begrep hører til — spør.

## Under økta

### Utfordre mot glossaret
Når et begrep kolliderer med eksisterende språk i `GLOSSARY.md`, si fra med en gang. «Glossaret definerer `sykmeldt` som personen oppfølgingen gjelder, men du bruker det nå om innloggede `veileder` — hvilket er det?»

### Skjerp uklart språk
Når et ord er vagt eller overlastet, foreslå ett kanonisk begrep og legg de andre under `_Unngå_`. «Du sier `bruker` — mener du `sykmeldt` (personen saken gjelder) eller `veileder` (saksbehandleren)? Det er to forskjellige ting.» Tilsvarende for `ident` / `fnr` / `aktørId` — de er ikke synonymer i Nav-kontekst.

### Stresstest med konkrete scenarier
Når en domenerelasjon diskuteres, finn opp spesifikke scenarier som presser kantene. «En sykmelding avvises av Arena etter at vi har lagret den lokalt og publisert `SykmeldingMottatt` på Kafka — hva er da sannheten, og hvem retter den opp?» Tving frem presise grenser mellom begrepene.

### Kryssjekk mot koden
Når bruker forteller hvordan noe virker, sjekk om koden er enig. Finner du en motsigelse, løft den frem: «`SykmeldingService` sletter hele saken, men du sa nettopp at en enkelt periode kan annulleres alene — hva er riktig?» Bruk `grep`/lesing av `no.nav.syfo`-pakken som kilde, ikke antakelser.

### Oppdater glossaret inline
Når et begrep er avklart, skriv det til `GLOSSARY.md` der og da — ikke samle opp til slutt. Bruk formatet i [references/glossary-format.md](references/glossary-format.md).

`GLOSSARY.md` skal være **helt fri for implementasjonsdetaljer**. Det er en ordliste, ikke en spec, ikke en kladdeblokk, ikke et lager for tekniske beslutninger. Tekniske valg hører hjemme i ADR; valgt tilnærming i `CONTEXT.md`.

### Tilby ADR sparsomt
Tilby kun ADR når **alle tre** er sanne:

1. **Vanskelig å reversere** — det koster reelt å ombestemme seg senere (DB-schema/Flyway, Kafka-kontrakt, auth-mekanisme, NAIS `accessPolicy`).
2. **Overraskende uten kontekst** — en fremtidig leser vil lure på «hvorfor i all verden gjorde de det sånn?»
3. **Resultat av en reell avveining** — det fantes genuine alternativer og dere valgte ett av spesifikke grunner.

Mangler én av de tre — dropp ADR-en. Bruk formatet i [references/adr-format.md](references/adr-format.md).

## Kobling til faseløkka
Dette er domenemotoren i `/grill-with-docs` (fase 1). Artefaktene den produserer (`GLOSSARY.md`, `adr/`) leses videre i design (fase 2), plan (`PLAN.md`, fase 3) og verifisering (`VERIFICATION.md`, fase 5) — så et skarpt begrep her sparer en runde context-rot senere. Berører en avklaring arkitektur eller tilgang mot andre team, send den videre til `/nav-architecture-review`.
