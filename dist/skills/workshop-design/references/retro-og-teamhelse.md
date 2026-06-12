# Retro og teamhelse

Tre verktøy som henger sammen: retroen er motoren for forbedring, Spotify Health Check er en dypere temperaturmåling noen ganger i året, og helsesjekk-boten gir et ukentlig anonymt signal. Funn fra de to siste blir input til den første.

## Del 1: Retro

Navs veiledning: https://aksel.nav.no/god-praksis/artikler/retro

### Rytme

- Retro **hver 3.–6. uke** — hyppigere i urolige perioder, sjeldnere når teamet er stabilt
- **Minst to ganger i året med ekstern fasilitator** — en utenfra ser mønstre teamet er blitt blinde for, og frigjør teamleder/produktleder til å delta

### Først: forrige retros tiltak

**Start ALLTID med å følge opp tiltakene fra forrige retro.** Ble de gjennomført? Hadde de effekt? En retro der tiltak aldri følges opp lærer teamet at retroen ikke betyr noe — da dør den. Ikke gå videre til ny datainnsamling før dette er gjort.

### Fasemodellen

Fem faser (Derby/Larsen, jf. Retromat): **sett scenen → samle data → generer innsikt → beslutt tiltak → avslutt.** Velg én aktivitet per fase, tilpasset situasjonen. Forslag, merket for når de passer:

**1. Sett scenen**

| Aktivitet | Passer når |
|---|---|
| Innsjekk med ett ord: «hvordan har sprinten vært?» | Jevnlig vedlikehold |
| ESVP: alle plasserer seg anonymt som utforsker, shopper, turist eller fange | Lav energi — avdekker om folk egentlig vil være der |
| Trygghetsmåling: anonym skala 1–5 på «hvor trygt er det å si det jeg mener her?» | Konflikt/friksjon — lav score betyr at formatet må gjøres tryggere (mer skriftlig, mer anonymt) |

**2. Samle data**

| Aktivitet | Passer når |
|---|---|
| Glad/trist/overrasket — lapper i tre kolonner | Jevnlig vedlikehold |
| Tidslinje: tegn periodens hendelser kronologisk, marker opp- og nedturer | Etter stor leveranse — gir felles bilde av et langt løp |
| Energikurve: hver person tegner sin energi over perioden | Lav energi eller konflikt — gjør det usagte synlig uten å peke på personer |

**3. Generer innsikt**

| Aktivitet | Passer når |
|---|---|
| Grupper lappene i temaer, heatmap med prikker på viktigste tema | Jevnlig vedlikehold |
| Fem hvorfor på det høyest stemte temaet | Jevnlig vedlikehold, etter stor leveranse — kommer bak symptomet |
| «Hva ligger under?» — skill observasjon, tolkning og behov for det vanskelige temaet | Konflikt/friksjon |

**4. Beslutt tiltak**

| Aktivitet | Passer når |
|---|---|
| Dot-voting, deretter SMART-formulering av topp 1–2 tiltak | Jevnlig vedlikehold |
| Start/stopp/fortsett — lav terskel, konkrete handlinger | Lav energi |
| «Billigste eksperiment»: hva er det minste vi kan prøve til neste retro? | Etter stor leveranse, konflikt — senker innsatsen når endring føles stor |

**Maks 1–2 tiltak**, alltid **SMART med eier og frist**. Et tiltak uten eier er et ønske, ikke et tiltak.

**5. Avslutt**

| Aktivitet | Passer når |
|---|---|
| ROTI: skala 1–5 på «var dette verdt tiden?» | Jevnlig vedlikehold — data til å forbedre selve retroen |
| Takk og anerkjennelse: hver person trekker frem noe en kollega gjorde | Konflikt/friksjon, etter stor leveranse |
| Ett ord ut | Lav energi |

## Del 2: Spotify Health Check

Selvvurderingsmodell med ~11 indikatorer. Teamet vurderer hver indikator med **trafikklys** (grønn/gul/rød) og **trendpil** (↑ → ↓) — trenden er ofte viktigere enn fargen.

| Indikator | Spørsmålet bak |
|---|---|
| Leverer verdi | Leverer vi noe brukerne faktisk får nytte av? |
| Lett å release | Er det enkelt og trygt å sette i produksjon? |
| Gøy | Er det gøy å gå på jobb? |
| Kodehelse | Er vi stolte av kodebasen? |
| Læring | Lærer vi nye ting hele tiden? |
| Oppdrag | Vet vi hvorfor vi er her, og brenner vi for det? |
| Brikker eller spillere | Styrer vi vår egen skjebne, eller blir vi flyttet på? |
| Fart | Får vi ting gjort raskt, uten å vente på hverandre? |
| Egnet prosess | Passer måten vi jobber på til oss? |
| Støtte | Får vi hjelpen vi trenger når vi ber om den? |
| Lagfølelse | Er vi et lag, eller en samling individer? |

Per indikator brukes et **«strålende vs. elendig»-kort** som samtalestøtte: en kort beskrivelse av hvordan strålende ser ut og hvordan elendig ser ut. Teamet snakker seg frem til hvor de er — kortet kalibrerer samtalen, fasiten finnes ikke.

**VIKTIG: dette er selvvurdering for samtale i teamet — ALDRI et rapporteringsverktøy oppover.** I det øyeblikket fargene blir måltall til ledelsen, begynner teamene å pynte på dem, og ærligheten dør. Hvis noen ber om å «samle inn health check-resultatene», si fra om dette eksplisitt.

### Mural-oppsett som tekst

Bygges av brukeren — ingen integrasjon finnes:

- Én rad per indikator: kortet («strålende vs. elendig»-teksten) til venstre
- Tre stemmesoner per rad: grønn / gul / rød — hver deltaker plasserer én lapp, stille, før diskusjon
- Trendfelt per rad: ↑ → ↓ etter diskusjonen
- Område «Mønstre»: hva går igjen på tvers av indikatorene?
- Område «Til retro/tiltak»: indikatorer som fortjener oppfølging, med eier
- Parkeringsplass

## Del 3: Tolkning av helsesjekk-bot-resultater

Nav-bred Slack-bot (open source, navikt/helsesjekk-bot) som måler teamhelse **ukentlig og anonymt**.

### Resultatformat

- Kategorier med indikatorer: **«Teamhelse»** (stress, stemningen i teamet) og **«Fart & flyt»** (fremdrift, prioritering og tidsbruk)
- Skala **1–5** per indikator, med **ukestrend i parentes** (f.eks. «3,8 (−0,4)») og fargemarkering grønn/gul/rød
- **Totalscore** for teamet

**Dashbordet er internt og ligger bak innlogging — forsøk ALDRI å hente det.** Be brukeren lime inn resultatet som tekst, og tolk det de limer inn.

### Tolkningsregler

| Signal | Respons |
|---|---|
| Fall **> 1,0** i én indikator fra forrige uke | Foreslå indikatoren som tema for neste retro |
| Vedvarende gult/rødt i **3+ uker** | Foreslå å ta det opp i en teamsamtale — ikke vent på retroen |
| Utslag i én enkeltuke | Observer, ikke overreager — én dårlig uke er støy, ikke trend |
| Lav prioritering/tidsbruk **og** høyt stress samtidig | Se kategoriene i sammenheng: for mye parallelt arbeid? |

Når et funn skal videre til retro: bruk fasemodellen i del 1 og velg aktiviteter merket for situasjonen funnet peker på (f.eks. høyt stress over tid → «lav energi»- eller «konflikt/friksjon»-aktiviteter). Helsesjekken sier *at* noe skurrer — retroen finner ut *hvorfor* og fester tiltak med eier.
