---
name: dulting
description: Atferdsdesign for Nav-flater — valg av dultinggrep for varsler, påminnelser, defaults, fremdrift og friksjonsreduksjon uten mørke mønstre. Brukes via /dulting når en brukerflate skal hjelpe folk å velge, forstå eller fullføre en handling i riktig øyeblikk.
---

# Dulting

Dulting handler om å gjøre ønsket handling lettere å oppdage, forstå og gjennomføre i Nav-flater. Skillen generaliserer praktiske mønstre fra oppfølgingsplan-arbeidet til flere domener, og eier valg av dultinggrep — ikke språkvask eller komponentvalg.

## Når du skal bruke skillen

Bruk `/dulting` når du:

- vurderer varsler, påminnelser, defaults eller fremdriftsvisning
- vil redusere friksjon i en flyt uten å fjerne reelle valg
- trenger å velge mellom grep som tidsriktig signal, behovsvurdering eller stegvis hjelp
- vil teste om en flate bør dulte før, under eller etter en oppgave

Bruk `/klarsprak` for språkvask og `/aksel-design` for komponentvalg, layout og visuell prioritering.

## Arbeidsflyt

1. **Definer atferden**  
   Beskriv én konkret handling brukeren skal klare nå, ikke et diffust effektmål.
2. **Finn hindringen**  
   Er problemet timing, lav oversikt, for høy friksjon, svak motivasjon eller uklart neste steg?
3. **Velg ett hovedgrep**  
   Start med ett tydelig grep fremfor mange små samtidig.
4. **Stress-test etikken**  
   Gå gjennom guardrails før du foreslår tekst, UI eller timing.
5. **Mål nært på handlingen**  
   Mål først om brukeren oppdaget, startet og fullførte handlingen.

## Vanlige dultinggrep

| Situasjon | Start med |
|---|---|
| Brukeren oppdager ikke at noe bør gjøres | Tidsriktig signal |
| Brukeren skjønner ikke hva som gjelder | Behovsvurdering eller støttende forklaring |
| Brukeren stopper halvveis | Stegvis hjelp eller fremdrift |
| Brukeren må velge blant mange like alternativer | Trygge defaults eller anbefalt neste steg |
| Oppfølging glemmes over tid | Påminnelse eller evaluering |

Se [REFERENCE.md](REFERENCE.md) for praktiske eksempler på tvers av Nav-domener.

## Guardrails for Nav

- **Sosiale normer og tall må være sanne.** Bruk aldri fiktive tall, rundede påstander eller «de fleste»-budskap uten faktisk datagrunnlag.
- **Valgfrihet og reversibilitet skal bevares.** En anbefalt vei er lov, men brukeren skal enkelt kunne velge annerledes og angre.
- **Brukerens mål veier tyngst.** Ikke dult mot handlinger som primært hjelper systemet hvis de skaper unødig belastning for brukeren.
- **Sårbare situasjoner krever mildere virkemidler.** Demp tapsframing, skyld, knapp tid og press når brukeren kan være syk, stresset eller økonomisk utsatt.
- **Ingen mørke mønstre.** Ikke skjul alternativer, skap falsk hastverk, gjør «nei» vanskelig eller bruk friksjon for å presse fram valg.
- **Ikke press fram deling av sensitive opplysninger.** Dulting skal aldri gjøre det lettere å dele mer helse- eller personinformasjon enn oppgaven krever.

## Beslutningsregel

Hvis dulten ikke tåler å bli forklart åpent til brukeren, bør den justeres eller forkastes.

## Referanser

- Praktiske mønstre og domeneeksempler: [REFERENCE.md](REFERENCE.md)
