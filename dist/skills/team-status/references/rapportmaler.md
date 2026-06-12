# Rapportmaler

Tre maler. Felles regler:

- Issue-referanser alltid med repo-prefiks: `<repo>#<nr>` — rapportene går på tvers av repos
- Maks 1 linje per issue
- Hvilke statuser/kolonner som hører til hvilken seksjon: følg teamets tavle-guide. Mangler guiden — spør, ikke gjett
- Vurderingstekst hører hjemme i de avsluttende seksjonene, ikke i issue-listene — skill mellom hva tavla sier og egne tolkninger

## Ukesoversikt

```markdown
# Ukesoversikt — uke <NN>

## I arbeid
- <repo>#<nr> Kort tittel — <hvem>

## Klart til plukking
- <repo>#<nr> Kort tittel

## Blokkert
- <repo>#<nr> Kort tittel — blokkert av: <årsak>

## Stale
- <repo>#<nr> Kort tittel — uendret siden <dato>

## Nylig ferdig
- <repo>#<nr> Kort tittel

## Hva betyr dette
<2–4 setninger vurdering>
```

Utfyllingsregler:

- **I arbeid**: alltid med hvem. Uten assignee: skriv «(ingen tildelt)» — det er ofte et funn i seg selv
- **Blokkert**: alltid med årsak. Finnes ikke årsaken på tavla eller i issuet: skriv «årsak ukjent» og foreslå å avklare
- **Stale**: issues i aktiv status uten bevegelse på over 14 dager (siste oppdatering på item eller issue). Mangler tavle-guiden: regn «aktiv» som enhver status som verken er ferdig- eller backlog-aktig, og si eksplisitt i rapporten at denne antagelsen er gjort.
- **Nylig ferdig**: ferdigstilt siste uke, eller siden forrige oversikt hvis kjent
- Tomme seksjoner beholdes med «(ingen)» — fravær er også informasjon
- **Hva betyr dette**: kort vurdering — flaskehalser, skjev fordeling, ting som har stått lenge. Merk tydelig at dette er din tolkning

## Tertialstatus

```markdown
# Tertialstatus — <tertial>

## <Mål — verdien fra målfeltet>
Ferdig: <N> · I arbeid: <N> · Ikke startet: <N>
<1–2 setninger vurdering: ligger målet an til å nås?>

## Mål uten oppgaver
- <Mål> — ingen issues knyttet dette tertialet

## Oppgaver uten mål
- <repo>#<nr> Kort tittel

## Forslag til samtalepunkter
- <punkt>
```

Utfyllingsregler:

- Gruppér issues på teamets målfelt × status × tertial — feltnavnene kommer fra tavla og tavle-guiden, ikke fra denne malen
- Én `##`-seksjon per målfelt-verdi med antall ferdig / i arbeid / ikke startet (map statusopsjonene til disse tre via tavle-guiden) + 1–2 setninger vurdering
- **Mål uten oppgaver** og **Oppgaver uten mål** skal alltid med — de avdekker hull i planen eller i tavle-hygienen
- Vurderingen per mål er din tolkning — si det
- **Forslag til samtalepunkter**: 2–4 konkrete punkter for teamets neste målprat (f.eks. mål uten bevegelse, opphopning på ett mål)

## Prioriteringsunderlag

```markdown
# Prioriteringsunderlag — <anledning>

Beslutningskriterier (fra sparringen): <kriterier>
Kapasitet: <det som er avklart>

| Oppgave | Mål den støtter | Innsats | Avhengigheter | Anbefaling |
|---|---|---|---|---|
| <repo>#<nr> Kort tittel | <mål> | <size> | <repo>#<nr> | <ta nå / vent / avklar — kort hvorfor> |

## Antagelser
Dette baserer seg på:
- <antagelse>
```

Utfyllingsregler:

- Kandidater: fra sparringsfasen; er det ikke avklart, bruk køen av plukkbare issues pluss det brukeren peker på
- **Innsats**: size-feltet hvis satt, ellers «ukjent» — ikke estimer selv
- **Mål den støtter**: fra målfeltet; tomt felt → «ingen» og flagg det
- **Avhengigheter**: fra issue-tekst, sub-issues og dependencies; «ingen kjente» hvis ikke funnet
- **Anbefaling**: knytt eksplisitt til beslutningskriteriene fra sparringen, maks én setning per rad
- **Antagelser** er obligatorisk: skriv eksplisitt hva du har antatt om kapasitet, kriterier og tavle-semantikk
