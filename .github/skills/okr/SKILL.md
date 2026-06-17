---
name: okr
description: "Målarbeid for offentlig sektor — formulering og kvalitetssikring av OKR-er med lint av utkast (utfall, ikke aktiviteter), tertialrytme og vedlikehold av teamets måldokument. Brukes via /okr ved målformulering, tertialplanlegging og målgjennomgang."
---

# OKR — målarbeid for offentlig sektor

Hjelp teamet å formulere, kvalitetssikre og vedlikeholde tertialvise OKR-er. Still spørsmålene som flytter utkast fra aktiviteter til utfall, og lint alle utkast — også dine egne forslag. Flere eksempler: `references/eksempler.md`.

## Formuleringsguide

- **Mål utfall, ikke output.** Et nøkkelresultat beskriver en endring hos brukerne eller i samfunnet — ikke at noe er levert.
- **Bruker- og samfunnsverdi, ikke omsetning.** Verdispråket i offentlig sektor er effekt for brukere og samfunn (gevinstrealisering) — aldri salg eller inntekt.
- **1–3 Objectives à 2–3 Key Results.** Færre mål gir mer fokus — foreslå gjerne ett enkelt Objective for team som er nye på målarbeid.
- **O er kvalitativt og motiverende; KR er målbart utfall** — alltid med baseline → mål («fra X til Y»).
- **Ordinær drift holdes utenfor** OKR-settet, eller skilles eksplisitt ut. Men målbare forbedringer i tjenestekvalitet (svartid, oppetid, feilrate, etterlevelse) fra en baseline kan være reelle utfall og høre hjemme som KR. Skillet går på forbedringsambisjon: drift uten forbedringsmål holdes utenfor; en målbar løft fra X til Y kan være OKR.
- **Norske termer er helt ok** og senker terskelen: ambisjon (O) og nøkkelresultat (KR).

Eksempelpar:

- ✅ KR: «Andel brukere som fullfører søknaden digitalt uten å kontakte oss øker fra 62 % til 75 %»
- ❌ KR: «Lansere ny søknadsdialog» — aktivitet; sier ingenting om endringen hos brukeren

## Lint av utkast

Kjør disse sjekkene på ALLE utkast. Presenter funn per regel med et konkret forslag til omskriving — ikke bare påpek feilen.

| Sjekk | Spørsmål å stille |
|---|---|
| Aktivitetsliste i forkledning? | «Lansere X» er output — hva er endringen hos brukeren når X finnes? |
| Baseline mangler? | Måltall uten startpunkt kan ikke graderes — hva er dagens nivå? |
| Måleplan mangler? | Hvordan måles dette i praksis, uten å bygge ny måleinfrastruktur? |
| For mange mål? | Mer enn 3 Objectives, eller mer enn 3 KR per O → foreslå hva som kuttes |
| Drift inkludert? | Foreslå å skille driftsoppgavene ut av OKR-settet |
| Mangler verdi-kobling? | Hvilken bruker- eller samfunnsverdi peker målet mot? |
| Måler vi en proxy? | Beskriver tallet faktisk verdien — eller bare noe som er lett å telle? Et høyere tall er ikke alltid bedre |

## Tertialrytme

| Når | Hva |
|---|---|
| Tertialstart | Målworkshop — bruk `/workshop-design` for opplegget; lint resultatet her |
| Ukentlig | Kort sjekk mot målene via ukesoversikten i `/team-status` |
| Midtveis | Graderingssjekk: ligger KR-ene an til å nås? Juster innsats, ikke målene |
| Tertialslutt | Scoring per KR + kort retro: hva lærte vi om måten vi setter mål på? |

## Måldokument og tavle

- Teamets måldokument bor i fellesrepoet `navikt/team-esyfo` — les det før formulering, og foreslå oppdateringer som PR eller issue dit (spør først).
- Har du ikke fått oppgitt noe måldokument: spør hvor målene bor, og tilby å etablere et måldokument.

Nye tertialmål skal ofte inn som opsjoner i målfeltet på teamets GitHub Projects-tavle. Feltdefinisjoner kan ikke endres via API — foreslå de nye opsjonene som tekst, og pek på at et menneske må legge dem inn manuelt. Detaljer om tavle-tilgang: projects-v2-referansen i `/team-status`-skillen.

## Grenser

### ✅ Alltid
- Lint alle OKR-utkast — også dine egne forslag
- Skill tydelig mellom utkast og vedtatte mål

### ⚠️ Spør først
- Skrive til måldokumentet (PR eller issue til fellesrepoet)

### 🚫 Aldri
- Love å endre tavlefelter selv — foreslå teksten; et menneske legger den inn
- Gi karakter på måloppnåelse uten data
