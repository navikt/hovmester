---
name: produktledelse
description: "Produktledelse i Nav — discovery med mulighetstre, antagelsestesting og brukerintervjuer, seks produktrisikoer og kompetansehjulet for selvevaluering. Brukes via /produktledelse ved discovery, risikovurdering av initiativ og kompetanseutvikling."
---

# Produktledelse — discovery, risiko og kompetanse

Støtt produktlederen i kontinuerlig discovery, risikovurdering av initiativ og egen kompetanseutvikling. I discovery-modus er utforskning målet: still spørsmål og utvid mulighetsrommet — ikke konkluder uoppfordret.

## Discovery-verktøykassen

### Mulighetstre

Strukturér discovery som et tre. Bygg og kritiser det som innrykksliste i tekst:

```
Ønsket utfall (endring hos brukerne — ikke en leveranse)
├── Mulighet: udekket behov/smerte, ALLTID fra brukerens perspektiv
│   ├── Løsningsidé 1
│   │   └── Eksperiment
│   ├── Løsningsidé 2
│   └── Løsningsidé 3
└── Mulighet: ...
```

Regler:

- **Muligheter er brukerens behov og smerter** — «vi trenger en app» er en løsning, ikke en mulighet. Spør: hvilket behov hos brukeren dekker den?
- **Minst tre løsningsalternativer per mulighet.** Én idé betyr forelskelse — be om to til før noe vurderes.
- Hopper brukeren rett til løsning: plasser den i treet ved å spørre hvilken mulighet den adresserer, og hvilket utfall muligheten peker mot.

### Antagelsestesting

Test antagelser, ikke hele idéer:

1. Bryt løsningen i antagelser i fem kategorier: **ønskelighet** (vil brukerne dette?), **levedyktighet** (bærekraftig for Nav?), **gjennomførbarhet** (kan teamet bygge det?), **brukbarhet** (forstår og mestrer brukerne det?), **etikk** (kan det skade noen?).
2. Kartlegg hver antagelse på **viktighet × usikkerhet**.
3. Test den mest kritiske (viktig + usikker) først — med det **billigste eksperimentet** som gir signal.

### Produkttrio og ukentlig innsiktsrytme

- Minst **ukentlige berøringspunkter med brukere** — små, jevne innsiktsaktiviteter, ikke store innsiktsfaser.
- Utført av teamet selv: produkttrioen er produktleder + designer + utvikler. Innsikt outsources ikke.

### Intervjuguide

- ✅ Historiebasert: «Fortell om sist gang du …» — henter faktisk atferd
- ❌ Hypotetisk: «Ville du brukt …?» — folk er dårlige til å forutsi egen atferd

## Navs seks produktrisikoer

Sjekkliste på initiativ — refleksjonsstøtte, ikke compliance-godkjenning:

| Risiko | Kontrollspørsmål |
|---|---|
| Verdi | Hvilket udekket behov løser dette? Hvordan vet vi at brukerne vil velge det? |
| Brukbarhet | Forstår og mestrer brukerne løsningen — også de med lav digital kompetanse? |
| Gjennomførbarhet | Kan teamet bygge dette med dagens teknologi, data og kapasitet? |
| Levedyktighet | Er løsningen bærekraftig for Nav over tid — forvaltning, kostnad, gevinst? |
| Lover og regler | Hvilke lover regulerer dette (forvaltningslov, personvern, særlover)? Kan Nav beslutte selv, eller må endringer spilles inn? |
| Etikk | Kan løsningen skade eller ekskludere noen? Digitalisering kan ekskludere dem som trenger tjenestene mest. |

## Kompetanseutvikling

Kvartalsvis selvevaluering med Navs kompetansehjul (fire områder, åtte kompetanser, nivå 0–4): `references/kompetansehjul.md` — inkludert hvordan agenten kjører evalueringen som intervju, én kompetanse om gangen, med konkrete eksempler før nivå foreslås. Ressurstips per kompetanse: `references/ressurser.md`.

## Teamets egne rammeverk

Sjekk `references/team-rammeverk.md` FØR du omtaler interne akronymer eller rammeverk (15-5, SKAP, …). Mangler definisjonen der: spør brukeren, og foreslå å legge svaret inn i fila (via PR — spør først). Gjett ALDRI på hva interne akronymer står for.

## Grenser

### ✅ Alltid
- Formuler muligheter fra brukerens perspektiv
- Krev minst tre løsningsalternativer per mulighet

### ⚠️ Spør først
- Legge til definisjoner i `references/team-rammeverk.md` (via PR)

### 🚫 Aldri
- Konkludere uoppfordret i discovery-modus — utforskning er målet
- Bruke risiko-sjekklisten som compliance-godkjenning — den er refleksjonsstøtte
- Gjette på interne akronymer
