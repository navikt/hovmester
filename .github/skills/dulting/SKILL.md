---
name: dulting
description: Dulting (nudging) i Nav-tjenester — utforsking, design og prototyping av atferdsteknikker som øker bruk, senker terskel og styrker ønsket handling uten mørke mønstre. Brukes via /dulting ved utforsking av dulting-muligheter, design av varsler, påminnelser, defaults, fremdrift eller motiverende tekst, og for skissering med design-agenten.
---

# Dulting — atferdsdesign for Nav-tjenester

Retningslinjer for å utforske, designe og implementere dulting (nudging) i Nav-tjenester. Bygger på EAST-rammeverket, Fogg Behavior Model, choice architecture og FORGOOD-etikk. Eksemplene er designhypoteser fra oppfølgingsplan-kontekst og tjener som mønstre — de er ikke bevist i produksjon og krever egen tilpasning og testing i hver tjeneste.

## Når du skal bruke skillen

Bruk `/dulting` når du:

- Utforsker en eksisterende løsning for dulting-muligheter
- Identifiserer nudge-punkter i en brukerreise
- Designer varsler, påminnelser, statusmeldinger eller onboarding
- Velger defaults og forhåndsutfylte verdier
- Skriver motiverende eller handlingsrettet mikrotekst
- Vil redusere friksjon eller øke motivasjon for handling
- Skisserer eller prototyper en dulte-idé (gjerne sammen med `/prototype` eller `@designer`)

## Kjernemodeller

### EAST (gjør det Enkelt, Attraktivt, Sosialt, Tidsriktig)

BIT oppdaterte EAST i desember 2024 med Digital EAST Cards for å bryte ned digitale brukerreiser og finne riktige dultepunkter.

| Prinsipp | Anvendelse (eksempler fra oppfølgingsplanen) |
|----------|--------------------------------------------------------|
| **Enkelt** | Fjern steg, bruk defaults, forhåndsutfyll, vis én ting om gangen |
| **Attraktivt** | Vis gevinst, bruk fremdrift, personaliser budskap |
| **Sosialt** | Vis at andre gjør det, bruk normative formuleringer |
| **Tidsriktig** | Dulte i beslutningsøyeblikket, bruk frister aktivt |

### Fogg: B = MAP (Behavior = Motivation + Ability + Prompt)

Handling skjer når motivasjon, evne og en trigger møtes samtidig. Hvis brukeren ikke handler — finn hvilken faktor som mangler:

- **Lav motivasjon** → Vis konsekvens, gevinst eller sosial norm
- **Lav evne** → Fjern friksjon, forenkle, bruk defaults
- **Manglende prompt** → Riktig tidspunkt, tydelig CTA, visuell salience

## Teknikker

Se [REFERENCE.md](REFERENCE.md) for fullstendig katalog med eksempler.

### Tekstlig dulting

1. **Tapsframing** — vis hva man mister ved å ikke handle (sterkere enn gevinst)
2. **Handlingsrettet språk** — konkret neste steg, ikke abstrakt informasjon
3. **Sosial norm** — «De fleste arbeidsgivere lager planen innen 2 uker»
4. **Personalisering** — bruk navn, situasjon, tidsreferanser
5. **Fristbevissthet** — gjør frister konkrete med dato, ikke «innen 4 uker»

### Visuell/funksjonell dulting

1. **Smarte defaults** — forhåndsutfyll, foreslå innhold, velg beste alternativ
2. **Fremdriftsindikator** — vis hvor langt brukeren har kommet
3. **Stegvis avsløring** — én beslutning om gangen, ikke overvelm
4. **Salience** — fremhev viktigste handling visuelt (størrelse, farge, plassering)
5. **Friksjonsfjerning** — fjern unødvendige klikk, bekreftelser og omveier

## FORGOOD — etisk vurdering av dulting

Hver dulte skal vurderes gjennom FORGOOD-rammeverket (Lades & Delaney, 2022), et sentralt etisk rammeverk for atferdsintervensjoner som også brukes i internasjonalt veiledningsarbeid hos blant annet OECD og UNICEF.

| Dimensjon | Spørsmål for Nav-tjenesten din |
|-----------|--------------------------------|
| **F**airness | Rammer dultingen noen grupper urettferdig? |
| **O**penness | Er dultingen åpen og synlig? |
| **R**espect | Respekterer dultingen brukerens autonomi og verdighet? |
| **G**oals | Er målet legitimt og i brukerens interesse? |
| **O**pinions | Ville brukerne akseptere dultingen? |
| **O**ptions | Bevares valgfriheten? |
| **D**elegation | Er det riktig instans som dulter? |

### Sjekkliste for hver dulte

- [ ] Bestått FORGOOD-vurdering (alle syv dimensjoner)
- [ ] Normative utsagn basert på faktiske data
- [ ] Ingen mørke mønstre (dark patterns / sludge)
- [ ] Sårbare grupper ivaretatt

## Målgrupper

| Målgruppe | Motivasjon | Barriere | Dulte-strategi |
|-----------|-----------|----------|----------------|
| **Arbeidsgiver** | Unngå lovbrudd, beholde ansatt | Vet ikke hvordan, travel, usikker | Forenkling + tidspress + veiledning |
| **Sykmeldt** | Komme tilbake, beholde jobb | Syk, lav energi, usikker på rettigheter | Lav friksjon + empatisk tone + små steg |
| **Egen målgruppe** | Tilpass til faktisk mål, gevinst og plikt i domenet ditt | Kartlegg faktisk brukerreise, sårbarhet og beslutningsøyeblikk | Bruk oppfølgingsplan-eksemplene som mønstre, ikke som bevis for effekt i ditt domene |

## Arbeidsflyt

1. **Identifiser** — Utforsk eksisterende brukerreise for dulting-muligheter (Digital EAST Cards, sludge audit)
2. **Design** — Velg teknikk(er), vurder FORGOOD-etikk, skisser konkret løsning
3. **Prototype** — Bruk `/prototype` eller `@designer` for å visualisere dulte-ideen
4. **Test** — A/B-test én endring om gangen i faktisk tjeneste. Mål effekt. Iterer.

## Referanser

Se [REFERENCE.md](REFERENCE.md) for detaljerte teknikker, eksempler, sludge audit og akademisk grunnlag.
