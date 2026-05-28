# Dulting — referansekatalog for Nav-tjenester

Denne referansen samler teknikker, etiske vurderinger og måleprinsipper for `/dulting`. Den bygger på designarbeid fra oppfølgingsplan-kontekst i sykefraværsoppfølging.

## Status og bruk

- Eksemplene under er designhypoteser fra oppfølgingsplan-kontekst — de er ikke testet i produksjon.
- De viser mønstre som kan overføres til andre Nav-flater, men krever egen tilpasning, etikkvurdering og testing i faktisk kontekst.
- DellaVigna & Linos (2022) viser at effekter fra nudge-RCT-er ikke alltid replikerer i stor skala. Test derfor i reell tjeneste.
- Bruk eksemplene som inspirasjon og utgangspunkt for design, ikke som bevis for effekt.

## Akademisk grunnlag

| Kilde | Nøkkelkonsept | Relevans |
|-------|---------------|----------|
| Thaler & Sunstein (2008) — *Nudge* | Choice architecture, libertarian paternalism | Rammeverk for defaults og valgdesign |
| BIT (2014, oppdatert 2024) — *EAST Framework* og *Digital EAST Cards* | Easy, Attractive, Social, Timely | Praktisk sjekkliste for alle nudges og et verktøy for å bryte ned digitale brukerreiser |
| BJ Fogg — *Behavior Model* | B=MAP (Motivation, Ability, Prompt) | Diagnostisering av hvorfor handling uteblir |
| Kahneman (2011) — *Thinking, Fast and Slow* | System 1 (automatisk) vs System 2 (reflektert) | Forstå når brukere tar snarveier |
| Hertwig & Grüne-Yanoff (2017) | Boosts vs nudges | Styrke kompetanse, ikke bare styre valg |
| Lades & Delaney (2022) — *Nudge FORGOOD* | Fairness, Openness, Respect, Goals, Opinions, Options, Delegation | Etisk vurdering av atferdsintervensjoner |
| DellaVigna & Linos (2022) — *RCTs to Scale* | Effekt i skala vs effekt i kontrollerte studier | Viktig påminnelse om å teste i faktisk kontekst |
| Mills et al. (2024) — *Dark patterns and sludge audits* | Integrert analyse av mørke mønstre og sludge | Systematisk identifisering av unødvendig friksjon som supplement til dulting |

## Teknikkatalog med eksempler

### 1. Defaults (forhåndsvalg)

**Prinsipp**: Folk holder seg til det som er forhåndsvalgt. Velg det beste alternativet som standard.

**Eksempler (oppfølgingsplan-kontekst):**
- Forhåndsutfyll arbeidsoppgaver fra siste kjente stilling
- Foreslå tilretteleggingstiltak basert på type sykmelding
- Sett «Del med lege» som standard ved ferdigstilling
- Forhåndsfyll dato for neste oppfølging basert på fristene

### 2. Fremdrift og commitment

**Prinsipp**: Folk fullfører det de har begynt (endowment effect). Synlig fremdrift motiverer.

**Eksempler (oppfølgingsplan-kontekst):**
- Vis fremdriftslinje: «Planen er 60 % ferdig»
- «Du har allerede fylt ut arbeidsoppgaver — neste steg er tilrettelegging»
- Bryt opp i 3-4 tydelige steg, ikke én lang side
- Vis hva som gjenstår, ikke bare hva som er gjort

### 3. Tidspress og frister

**Prinsipp**: Konkrete frister skaper handling (EAST: Timely). Abstrakte tidsrom gjør det ikke.

**Eksempler (oppfølgingsplan-kontekst):**
- ❌ «Planen skal lages innen 4 uker»
- ✅ «Fristen for oppfølgingsplanen er 15. februar»
- Vis nedtelling: «5 dager til fristen for å dele planen med legen»
- Send påminnelse i beslutningsøyeblikket (f.eks. etter innlogging)

### 4. Tapsframing (loss aversion)

**Prinsipp**: Tap oppleves sterkere enn gevinst. Vis hva brukeren risikerer.

**Eksempler (oppfølgingsplan-kontekst):**
- ❌ «Det er lurt å lage en oppfølgingsplan»
- ✅ «Uten oppfølgingsplan kan Nav be om en forklaring ved 8 ukers sykefravær»
- Arbeidsgiver: «Du kan miste rett til tilskudd hvis planen mangler»
- Sykmeldt: «Uten medvirkning kan sykepengene stoppes»

**Viktig**: Bruk tapsframing sparsomt og kun når det er sant. Ikke skap unødvendig frykt.

### 5. Sosial norm

**Prinsipp**: Folk gjør det andre gjør. Normative utsagn motiverer handling.

**Eksempler (oppfølgingsplan-kontekst):**
- «De fleste arbeidsgivere lager oppfølgingsplanen i løpet av de 2 første ukene»
- «9 av 10 som lager plan, opplever bedre dialog med den ansatte»
- Vis antall planer som er delt digitalt siste måned (hvis data finnes)

**Krav**: Normative utsagn **må** baseres på faktiske data. Aldri fiktive tall.

### 6. Forenkling og friksjonsfjerning

**Prinsipp**: Hver ekstra handling reduserer gjennomføring dramatisk. Fjern alt som kan fjernes.

**Eksempler (oppfølgingsplan-kontekst):**
- Én primærhandling per side/steg
- Fjern bekreftelsesdialog når handlingen er enkel å angre
- Forhåndsutfyll alt som kan utledes fra kontekst
- Bruk progressive disclosure — vis detaljer kun ved behov

### 7. Prompt-design (triggere)

**Prinsipp**: Riktig prompt til riktig tid utløser handling (Fogg). For tidlig = ignorert. For sent = for sent.

**Eksempler på triggerpunkter (oppfølgingsplan-kontekst):**

| Hendelse | Prompt | Kanal |
|----------|--------|-------|
| Ny sykmelding mottatt | «Du har en ny sykmeldt ansatt — start oppfølgingsplan» | Notifikasjon/dashbord |
| 2 uker uten aktivitet | «Fristen nærmer seg — ta neste steg i planen» | E-post/varsel |
| Dialogmøte nærmer seg | «Oppfølgingsplanen bør være klar til dialogmøte 1» | Påminnelse |
| Plan ferdigstilt | «Del planen med legen for å gi bedre oppfølging» | I flyten |
| Sykmeldt logger inn | «Arbeidsgiveren din har startet en oppfølgingsplan» | Dashbord |

### 8. Personalisering

**Prinsipp**: Personlige budskap er mer effektive enn generelle (Mills, 2022).

**Eksempler (oppfølgingsplan-kontekst):**
- Bruk den ansattes fornavn i påminnelser
- Referer til konkret arbeidssted/stilling
- Tilpass budskap til fase i sykefraværet
- Vis relevant info basert på type sykmelding (hel/delvis)

### 9. Handlingsrettet språk

**Prinsipp**: Fortell brukeren hva de skal *gjøre*, ikke bare hva som *er*.

| ❌ Passivt | ✅ Handlingsrettet |
|-----------|-------------------|
| «Oppfølgingsplanen er et verktøy» | «Start oppfølgingsplanen nå» |
| «Det er viktig med tilrettelegging» | «Beskriv hva du kan tilby av tilpasninger» |
| «Planen skal sendes til Nav» | «Del planen med Nav — trykk her» |
| «Fristen er 4 uker» | «Fullfør innen 15. februar» |

### 10. Stegvis avsløring (progressive disclosure)

**Prinsipp**: For mye informasjon på én gang overvelder (choice overload). Vis litt om gangen.

**Eksempler (oppfølgingsplan-kontekst):**
- Vis kun neste steg tydelig — resten som en enkel liste
- Ekspander detaljer ved behov, ikke vis alt alltid
- Bruk veiviser-mønster for første gangs utfylling
- Gi hjelp kontekstuelt, ikke som en lang instruksjon på toppen

## Digital EAST Cards i praksis

BITs Digital EAST Cards er nyttige når et team skal oversette EAST fra teori til en konkret digital brukerreise:

1. Kartlegg én handling brukeren skal gjennomføre
2. Marker beslutningspunkter, venting, frister og avbrudd
3. Vurder hvert punkt med EAST: hva kan gjøres enklere, mer attraktivt, mer sosialt eller mer tidsriktig?
4. Koble funnene til Fogg: mangler motivasjon, evne eller prompt?
5. Test én endring om gangen i faktisk tjeneste

## Dulting vs. mørke mønstre

| Dulting (OK) | Mørkt mønster / sludge (ALDRI) |
|---|---|
| Foreslå beste alternativ som default | Skjule alternativet brukeren egentlig vil |
| Vise sosial norm basert på ekte tall | Fabrikkere statistikk for å presse |
| Gjøre handling enklere | Gjøre det vanskelig å *ikke* handle |
| Påminne om frister | Skape falsk tidspress |
| Vise konsekvens av å ikke handle | Overdrive konsekvenser for å skremme |

Thaler (2018) definerte «sludge» som det motsatte av dulting: å bevisst legge til friksjon for å hindre folk i å ta valg som gagner dem. I offentlig sektor er sludge spesielt problematisk fordi borgerne ikke har alternativer.

## Sludge audit

Mills et al. (2024) beskriver sludge audit som en integrert tilnærming: design gode dulter, men kartlegg samtidig unødvendig friksjon og mørke mønstre i samme brukerreise.

### Sludge audit i praksis

1. Kartlegg hele brukerreisen, også vei ut, hjelp, analog kanal og angre-muligheter
2. List alle klikk, ventepunkter, bekreftelser, dokumentkrav og informasjonsforespørsler
3. Marker hva som er juridisk eller faglig nødvendig, og hva som bare er historisk eller intern friksjon
4. Se særlig etter sludge i opt-out, sletting, kontakt, papirvalg eller hjelp til sårbare brukere
5. Fjern sludge før dere legger på sterkere dulting

## FORGOOD — detaljert etisk vurdering

FORGOOD (Lades & Delaney, 2022) er et ledende etisk rammeverk for vurdering av dulting og atferdsintervensjoner. Det er utviklet ved University College Dublin og London School of Economics, publisert i *Behavioural Public Policy*, og brukes i internasjonalt veiledningsarbeid hos blant annet UNICEF og OECD.

Rammeverket syntetiserer den filosofiske debatten om dulting-etikk i syv dimensjoner. Det er ikke ment som en avkryssingsliste, men som en struktur for evaluering og beslutninger — fordi etiske spørsmål ofte er kontekstavhengige og innebærer avveininger.

### F — Fairness (rettferdighet)

**Kjernespørsmål**: Rammer dultingen noen grupper urettferdig?

Dulter kan ha ulik effekt på ulike grupper. Eksempel fra oppfølgingsplan-kontekst:

- **Store vs. små arbeidsgivere**: En liten bedrift med én sykmeldt har helt andre forutsetninger enn en stor organisasjon med HR-avdeling. Defaults og forhåndsutfylling bør ikke forutsette ressurser som kun store bedrifter har.
- **Alvorlig vs. lett sykdom**: Fremdriftsindikatorer og tidspress kan oppleves belastende for alvorlig syke. Tonen bør tilpasses.
- **Digital kompetanse**: Digitale dulter når ikke de med lav digital kompetanse. Papiralternativet må ikke bli unødvendig vanskelig (sludge).
- **Maktforhold**: Arbeidsgiveren har mer makt enn den sykmeldte. Dulter rettet mot den sykmeldte bør være ekstra varsomme med press.

**Eksempel — OK**: Forenkle skjemaet likt for alle arbeidsgivere.
**Eksempel — problematisk**: Vise «90 % av arbeidsgivere fullfører på 3 dager» når dette kun gjelder store bedrifter.

### O — Openness (åpenhet)

**Kjernespørsmål**: Er dultingen åpen og synlig for brukeren?

Forskning viser at transparente dulter ofte er like effektive som skjulte (Paunov et al., 2019). Åpenhet styrker tillit — spesielt i offentlig sektor.

- Defaults bør forklares: «Vi har forhåndsvalgt å dele med legen — du kan endre dette»
- Sosiale normer bør oppgi kilde: «Basert på data fra 2025»
- Påminnelser bør si hvorfor de sendes: «Vi sender denne fordi fristen nærmer seg»

**Nav-kontekst**: Som offentlig myndighet har Nav høyere krav til åpenhet enn private aktører. Brukeren skal ikke føle seg lurt.

### R — Respect (respekt)

**Kjernespørsmål**: Respekterer dultingen brukerens autonomi, verdighet og beslutningsevne?

- Den sykmeldte er i en sårbar situasjon. Språk og tone skal anerkjenne dette.
- Tapsframing skal brukes varsomt — ikke skape skyldfølelse.
- Brukeren skal aldri presses til å oppgi helseinformasjon de ikke ønsker å dele.
- Valg skal alltid være reelle — «Hopp over» skal alltid være tilgjengelig.

**Eksempel — OK**: «Du kan beskrive arbeidsoppgavene dine i egne ord — det hjelper legen å gi bedre råd.»
**Eksempel — problematisk**: «Hvis du ikke fyller ut planen, kan sykepengene stoppes.» (selv om det er sant, kan det oppleves som trusler i en sårbar situasjon)

### G — Goals (mål)

**Kjernespørsmål**: Er målet legitimt og i brukerens interesse?

Dultingen skal tjene brukerens mål, ikke bare systemets mål. Eksempel fra oppfølgingsplan-kontekst:

- **Brukerens mål**: Komme tilbake i jobb, få god oppfølging, beholde rettigheter
- **Systemets mål**: Redusere sykefravær, overholde lovkrav, effektivisere
- **Overlapp**: Ofte sammenfallende — men ikke alltid

Når målene spriker, skal brukerens mål prioriteres. En dulte som primært tjener Nav men belaster brukeren, bør revurderes.

### O — Opinions (meninger)

**Kjernespørsmål**: Ville brukerne akseptere dultingen hvis de visste om den?

- Ville arbeidsgivere synes det er greit at vi forhåndsfyller og foreslår innhold?
- Ville sykmeldte akseptere at vi bruker sosiale normer for å motivere?
- Test med brukergrupper ved tvil — spesielt for kontroversielle dulter

Forskning viser at dulter generelt aksepteres bedre når de er i brukerens tydelige interesse (Sunstein, 2018).

### O — Options (valgmuligheter)

**Kjernespørsmål**: Bevares valgfriheten reelt?

Kjernen i dulting (vs. tvang): alle valg skal fortsatt være tilgjengelige.

- Defaults skal kunne endres med ett klikk
- Forhåndsutfylt innhold skal kunne redigeres fritt
- «Anbefalt» skal aldri bety «eneste reelle alternativ»
- Brukeren skal kunne velge papir, telefon eller digital løsning

**Test**: Kan brukeren velge annerledes uten ekstra friksjon?

### D — Delegation (delegering)

**Kjernespørsmål**: Er det riktig instans som dulter?

- **Nav som avsender**: Nav har legitimitet til å dulte om oppfølgingsplikt og frister — dette er lovpålagt
- **Helseinformasjon**: Nav skal ikke dulte om helsebeslutninger — det er legens rolle
- **Arbeidsgiverens rolle**: Tilrettelegging er arbeidsgiverens ansvar — Nav kan dulte mot handling, men ikke overta vurderingen
- **Den sykmeldtes helse**: Respekter at sykmeldt vet best om egen kapasitet

### FORGOOD-vurdering i praksis

For hver ny dulte som designes, gjennomfør en kort FORGOOD-runde:

1. Beskriv dultingen i én setning
2. Gå gjennom alle syv dimensjoner — noter vurdering
3. Identifiser avveininger og risiko
4. Beslutt: implementer / juster / forkast
5. Dokumenter vurderingen for etterprøvbarhet

For dulter med høy påvirkningsgrad (tapsframing, sterke defaults, sosial norm): vurder å gjøre en pre-mortem-analyse — «hva kan gå galt?» — før implementering.

## Måling og iterasjon

Dulting virker bare hvis det måles. Mål effekt på:

- **Konvertering**: Andel som starter plan / fullfører plan / deler plan
- **Tid til handling**: Dager fra sykmelding til plan er startet
- **Gjennomføringsgrad**: Andel steg som fylles ut
- **Tilbakevendende bruk**: Oppdaterer brukerne planen over tid?
- **Kvalitet**: Er planen innholdsmessig god (ikke bare utfylt)?

A/B-test nye dulter isolert. Én endring om gangen for å forstå effekt.

## Kilder

- Thaler, R. H., & Sunstein, C. R. (2008). *Nudge: Improving Decisions About Health, Wealth, and Happiness*. Yale University Press.
- Behavioural Insights Team. (2014, oppdatert 2024). *EAST: Four Simple Ways to Apply Behavioural Insights*.
- Behavioural Insights Team. (2024). *Digital EAST Cards*.
- Fogg, B. J. (2009). *A Behavior Model for Persuasive Design*. Persuasive '09.
- Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux.
- Hertwig, R., & Grüne-Yanoff, T. (2017). Nudging and boosting: Steering or empowering good decisions. *Perspectives on Psychological Science*, 12(6), 973–986.
- Lades, L. K., & Delaney, L. (2022). Nudge FORGOOD. *Behavioural Public Policy*, 6(1), 75–94. Cambridge University Press.
- Johnson, E. J. et al. (2012). Beyond Nudges: Tools of a Choice Architecture. *Marketing Letters*, 23(2), 487–504.
- Mills, S. (2022). Personalized nudging. *Behavioural Public Policy*, 6(1), 150–159.
- Sunstein, C. R. (2018). Do People Like Nudges? *Administrative Law Review*, 68(2), 177–232.
- Thaler, R. H. (2018). Nudge, not sludge. *Science*, 361(6401), 431.
- Paunov, Y. et al. (2019). Transparency in nudging. *Journal of Experimental Psychology: Applied*, 25(3), 485–502.
- DellaVigna, S., & Linos, E. (2022). RCTs to Scale: Comprehensive Evidence from Two Nudge Units. *Econometrica*, 90(1), 81–116.
- Mills, S., Whittle, R., Ahmed, U., Walsh, T., & Wessel, M. (2024). Dark patterns and sludge audits: an integrated approach. *Behavioural Public Policy*.
- OECD. (2022). *BASIC Toolkit for Behavioural Insights Practitioners*.
- UNICEF. (2021/2022). *The BASIC Toolkit* og *Ethics Toolkit for Applied Behavioural Science*.
- Nav. (2026). *Slik følger du opp sykmeldte* / *Oppfølgingsplan*. nav.no.
