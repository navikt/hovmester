---
name: codebase-design
description: "Brukes når et modul-grensesnitt skal designes eller forbedres — nytt service/repository/klient-lag, finne deepening-muligheter, plassere en søm (seam), gjøre kode mer testbar eller AI-navigerbar — eller når en annen skill trenger dyp-modul-vokabularet. @grillmester fase 2 (Design). Kalles via /codebase-design."
---

# codebase-design

Design **dype moduler**: mye oppførsel bak et lite grensesnitt, plassert ved en ren søm, testet gjennom det samme grensesnittet. Bruk dette språket og disse prinsippene overalt der kode designes eller restruktureres i dette repoet. Målet er gjennomslag for kallere, lokalitet for de som vedlikeholder, og testbarhet for alle.

**Rolle:** dette _designer_ grensesnittet og eier dyp-modul-vokabularet (under) — andre skills låner det herfra. Beslektet: `/improve-codebase-architecture` finner hva som bør fordypes, `/grill-with-docs` avhører valget, `/nav-architecture-review` formaliserer det som ADR.

Designbeslutninger som er vanskelige å reversere skrives som ADR i `docs/adr/NNNN-*.md`, og den valgte modulformen havner i `docs/CONTEXT.md` (se `/grill-with-docs`). Skarpe domenebegrep i `docs/GLOSSARY.md` (se `/domain-modeling`).

## Vokabular

Bruk disse begrepene presist — ikke bytt dem ut med «komponent», «tjeneste», «API» eller «boundary». Konsistent språk er hele poenget.

**Modul** — alt som har et grensesnitt og en implementasjon. Bevisst skala-agnostisk: en funksjon, klasse, pakke (`no.nav.syfo.sykmelding`) eller en tvertikal skive som spenner over flere lag. _Unngå_: unit, komponent, tjeneste.

**Grensesnitt** — alt en kaller må vite for å bruke modulen riktig: typesignaturen, men også invarianter, rekkefølge-krav, feilmodi (hvilke exceptions/`Result`/`ApiError`), påkrevd konfig og ytelsesegenskaper. _Unngå_: API, signatur (for snevert — de viser bare til type-flaten).

**Implementasjon** — det som er inni modulen, koden i kroppen. Forskjellig fra **Adapter**: en ting kan være en liten adapter med stor implementasjon (et Postgres-repository) eller en stor adapter med liten implementasjon (et in-memory fake). Bruk «adapter» når sømmen er temaet; «implementasjon» ellers.

**Dybde** — gjennomslag ved grensesnittet: hvor mye oppførsel en kaller (eller test) får utløst per enhet grensesnitt de må lære. En modul er **dyp** når mye oppførsel ligger bak et lite grensesnitt, **grunn** når grensesnittet er nesten like komplekst som implementasjonen.

**Seam / søm** _(Michael Feathers)_ — et sted der du kan endre oppførsel uten å redigere akkurat der; *plasseringen* der modulens grensesnitt ligger. Hvor sømmen skal gå er en egen designbeslutning, atskilt fra hva som ligger bak den. _Unngå_: «boundary» (overlastet med DDDs bounded context).

**Adapter** — en konkret ting som oppfyller et grensesnitt ved en søm. Beskriver *rolle* (hvilken plass den fyller), ikke substans (hva som er inni).

**Leverage / gjennomslag** — det kallere får av dybde: mer kapabilitet per enhet grensesnitt de lærer. Én implementasjon betaler tilbake over N kallesteder og M tester.

**Lokalitet** — det vedlikeholderne får av dybde: endring, feil, kunnskap og verifisering samler seg ett sted i stedet for å spre seg ut til kallerne. Fiks én gang, fikset overalt.

## Dyp vs grunn

**Dyp modul** = lite grensesnitt + mye implementasjon:

```
┌─────────────────────┐
│   Lite grensesnitt  │  ← Få metoder, enkle parametre
├─────────────────────┤
│                     │
│   Dyp implementasjon│  ← Kompleks logikk skjult
│                     │
└─────────────────────┘
```

**Grunn modul** = stort grensesnitt + lite implementasjon (unngå):

```
┌─────────────────────────────────┐
│       Stort grensesnitt         │  ← Mange metoder, komplekse parametre
├─────────────────────────────────┤
│  Tynn implementasjon            │  ← Bare videresending
└─────────────────────────────────┘
```

Når du designer et grensesnitt, spør:

- Kan jeg redusere antall metoder/endepunkter?
- Kan jeg forenkle parametrene (færre, eller én sammensatt `data class`)?
- Kan jeg skjule mer kompleksitet inni?

## Prinsipper

- **Dybde er en egenskap ved grensesnittet, ikke implementasjonen.** En dyp modul kan internt være satt sammen av små, mockbare, byttbare deler — de er bare ikke en del av grensesnittet. En modul kan ha **interne sømmer** (private for implementasjonen, brukt av dens egne tester) i tillegg til den **eksterne sømmen** ved grensesnittet.
- **Slette-testen.** Tenk deg at du sletter modulen. Forsvinner kompleksiteten, var den bare gjennomstrømning. Dukker kompleksiteten opp igjen spredt over N kallere, gjorde modulen nytte for seg.
- **Grensesnittet er testflaten.** Kallere og tester krysser samme søm. Vil du teste *forbi* grensesnittet, har modulen sannsynligvis feil form.
- **Én adapter betyr en hypotetisk søm. To adaptere betyr en reell.** Ikke innfør en søm (port) før noe faktisk varierer over den — typisk produksjon + test.

## Designe for testbarhet

Gode grensesnitt gjør testing naturlig. I Ktor/`no.nav.syfo` betyr det som regel: tynne route-handlere som delegerer til en dyp service, og avhengigheter injisert (ikke `object`/global).

1. **Ta imot avhengigheter, ikke lag dem.**

   ```kotlin
   // Testbar — porten injiseres
   class SykmeldingService(private val repo: SykmeldingRepository)

   // Vanskelig å teste — adapteren lages inni
   class SykmeldingService {
       private val repo = PostgresSykmeldingRepository(dataSource)
   }
   ```

2. **Returner resultat, ikke side-effekt.**

   ```kotlin
   // Testbar — ren beregning
   fun beregnArbeidsgiverperiode(soknad: Soknad): Arbeidsgiverperiode

   // Vanskelig å teste — skjult side-effekt
   fun oppdaterArbeidsgiverperiode(soknad: Soknad) { db.update(...) }
   ```

3. **Liten flate.** Færre metoder = færre tester. Færre parametre = enklere testoppsett. Hold route-laget tynt og legg logikken i en dyp service som testes direkte gjennom sitt grensesnitt.

## Relasjoner

- En **Modul** har nøyaktig ett **Grensesnitt** (flaten den viser til kallere og tester).
- **Dybde** er en egenskap ved en **Modul**, målt mot dens **Grensesnitt**.
- En **Søm** er der en **Moduls** **Grensesnitt** ligger.
- En **Adapter** sitter ved en **Søm** og oppfyller **Grensesnittet**.
- **Dybde** gir **Gjennomslag** for kallere og **Lokalitet** for vedlikeholdere.

## Forkastede rammer

- **Dybde som forhold mellom implementasjons-linjer og grensesnitt-linjer** (Ousterhout): belønner å fylle ut implementasjonen. Vi bruker dybde-som-gjennomslag i stedet.
- **«Grensesnitt» som Kotlin-nøkkelordet `interface` eller en klasses public-metoder**: for snevert — grensesnitt her inkluderer hvert faktum en kaller må kjenne (invarianter, feilmodi, rekkefølge).
- **«Boundary»**: overlastet med DDDs bounded context. Si **søm** eller **grensesnitt**.

## Gå dypere

- **Deepening av en klynge gitt avhengighetene** — se [references/deepening.md](references/deepening.md): avhengighetskategorier (in-process, lokalt-substituerbar, eid-over-nett, ekte-ekstern), søm-disiplin og bytt-ikke-lagdel-testing. Knytter til `/improve-codebase-architecture`.
- **Utforske alternative grensesnitt** — se [references/design-it-twice.md](references/design-it-twice.md): design grensesnittet flere radikalt ulike måter før du forplikter deg, og sammenlign på dybde, lokalitet og søm-plassering.
