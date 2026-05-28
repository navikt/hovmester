# Referanse for /dulting

Denne referansen utdyper praktisk bruk av `/dulting` i Nav-flater. Den bygger på eksisterende dulting-arbeid for oppfølgingsplan og på tiltaksmodellene i dulting-studio, men er generalisert for flere domener.

## Praktisk modell

Generaliser disse arbeidsmønstrene fra oppfølgingsplan-arbeidet før du foreslår løsninger:

| Mønster | Når det passer | Typiske grep |
|---|---|---|
| **Tidsriktig signal** | Når brukeren ikke oppdager at noe bør gjøres nå | Varsel, oppgavekort, konkret frist, riktig timing |
| **Behovsvurdering** | Når brukeren må ta stilling før neste steg | Ja/nei-spørsmål, valg med trygg forklaring, anbefalt neste steg |
| **Støttende tekst og forståelse** | Når verdien eller plikten er uklar | Kort forklaring av hvorfor dette er nyttig eller nødvendig |
| **Stegvis hjelp** | Når oppgaven virker stor eller uklar | Veiviser, sjekkliste, fremdrift, små deloppgaver |
| **Evaluering og påminnelse** | Når oppfølging skjer over tid | Påminnelse, gjenoppta utkast, avtal nytt tidspunkt |

Velg ett hovedmønster først. Legg bare til flere grep hvis måling eller brukertest viser at ett ikke er nok.

## Guardrails i praksis

### Sosiale normer og tall

- Bruk bare normbudskap når dere faktisk har data, kilde og relevant segment.
- Ikke skriv «de fleste», «mange» eller prosenttall for å skape press hvis datagrunnlaget er uklart.
- Hvis dere mangler data, bruk nøytrale budskap: hva brukeren kan gjøre nå, hvorfor det hjelper, og hva som skjer videre.

### Valgfrihet

- Defaults skal være lette å endre.
- «Ikke nå», «Hopp over» eller tilsvarende valg skal være synlige når det er legitimt.
- Ikke legg mer friksjon i å takke nei enn i å følge anbefalingen.

### Sårbarhet

- Jo mer utsatt situasjonen er, desto mildere skal virkemidlene være.
- Unngå hard tapsframing og nedtelling i flater der brukeren kan være syk, redd eller presset.
- Bruk tydelig hjelpesti når konsekvenser må nevnes: hva betyr dette, og hva kan brukeren gjøre nå?

## Når du ikke skal dulte

Bruk nøytral informasjon framfor påvirkning når brukeren må forstå rettigheter, plikter eller konsekvenser uten styring. Det gjelder særlig juridisk informert samtykke, tvangsvedtak og klage, og valg der brukeren trenger et balansert grunnlag mer enn et puff i én retning.

## Domeneeksempler

### Dine sykmeldte

**Typisk problem:** Arbeidsgiver ser informasjon, men skjønner ikke hva som bør gjøres først.  
**Grep som ofte passer:** Tidsriktig signal + behovsvurdering.  
**Eksempel:** Vis en konkret oppgave når oppfølging bør vurderes, med tydelig neste steg i stedet for passiv informasjon.  
**Unngå:** Default som gjør «plan trengs ikke nå» til enkleste vei, eller språk som presser fram deling av helseopplysninger.

### Oppfølgingsplan

**Typisk problem:** Brukeren starter, men fullfører ikke.  
**Grep som ofte passer:** Stegvis hjelp + fremdrift + gjenoppta utkast.  
**Eksempel:** Del opp flyten i små steg med ett tydelig neste valg, og vis hva som gjenstår.  
**Unngå:** Lange introblokker, truende fristtekster eller for mange valg samtidig.

### Meldekort

**Typisk problem:** Brukeren glemmer tidspunktet eller blir usikker på om alt er sendt inn.  
**Grep som ofte passer:** Tidsriktig signal + trygg bekreftelse.  
**Eksempel:** Minn om at meldekortet snart kan sendes inn, vis status for det som gjenstår, og gi tydelig bekreftelse etter innsending.  
**Unngå:** Falsk hastverk, unødvendige bekreftelsesdialoger eller skjult vei tilbake til oversikten.

### Aktivitetsplan

**Typisk problem:** Oppgaven oppleves stor og uklar over tid.  
**Grep som ofte passer:** Stegvis hjelp + evaluering og påminnelse.  
**Eksempel:** Vis neste naturlige aktivitet, gjør det lett å gjenoppta arbeid som er påbegynt, og minn om oppfølging når det faktisk er relevant.  
**Unngå:** Påminnelser uten tydelig nytte, eller sosialt press uten data.

### Dagpenger

**Typisk problem:** Brukeren mister oversikt over hva som mangler for å komme videre.  
**Grep som ofte passer:** Behovsvurdering + støttende forklaring + friksjonsreduksjon.  
**Eksempel:** Pek ut én manglende handling av gangen, forklar hvorfor den trengs, og gjør veien til dokumentasjon eller oppfølging tydelig.  
**Unngå:** Å bruke retten til ytelse som hardt press i mikrocopy når veien videre er uklar.

## Slik velger du grep

| Hvis problemet er ... | Prøv først | Ikke start med |
|---|---|---|
| brukeren ser ikke oppgaven | signal og timing | mer tekst på samme sted |
| brukeren forstår ikke vurderingen | behovsvurdering | avanserte valgtrær |
| brukeren faller av halvveis | stegvis hjelp | flere forklaringer på toppen |
| brukeren må følge opp senere | påminnelse | hyppige varsler uten verdi |
| brukeren er i sårbar situasjon | enkel støtte og rolig tone | sterke tapsbudskap og tidspress |

## Måling

Mål først på nærliggende atferd, ikke bare på slutteffekt:

1. Oppdaget brukeren signalet?
2. startet brukeren handlingen?
3. fullførte brukeren neste steg?
4. kom brukeren tilbake ved behov?

Dette viderefører prinsippet fra dulting-studio: mål på klynger og observerbar atferd før du vurderer større effektmål.

## Avgrensning

- `/dulting` velger atferdsgrep og etiske rammer.
- `/klarsprak` forbedrer formuleringene når grepet er valgt.
- `/aksel-design` velger komponenter, layout og visuell utforming.

Bruk gjerne flere skills sammen, men hold ansvaret tydelig.
