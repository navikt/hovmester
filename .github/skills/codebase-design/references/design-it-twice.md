# Design det to ganger

Når du vil utforske alternative grensesnitt for en valgt deepening-kandidat. Basert på «Design It Twice» (Ousterhout) — den første idéen din er sjelden den beste. Bruker vokabularet i [SKILL.md](SKILL.md) — **modul**, **grensesnitt**, **søm**, **adapter**, **gjennomslag**.

**Inline vs. parallell:** _implementasjon_ (kode) skrives alltid inline i hovedtråden — «skriveren» splittes aldri over parallelle agenter, fordi implisitte beslutninger kolliderer. _Design-varianter_ er unntaket: de SKAL divergere, så her er parallell strukturelt **bedre** enn sekvensielt (sekvensielt risikerer ankring — variant 2 farget av variant 1).

**Opt-in parallell for variantene:** for et hardt grensesnittvalg kan du spinne N **read-only** design-agenter i parallell — én per designtvang under. De skriver **ingen** filer og returnerer **kompakte** skisser (≤1–2k tegn hver); orkestratoren syntetiserer. Default er sekvensielt inline; velg parallell når valget er hardt nok til å rettferdiggjøre kostnaden — samme opt-in-logikk som kryssmodell-review (de dyre stegene er valgfrie, ikke default).

## Prosess

### 1. Ramm inn problemrommet

Før du skisserer alternativer, skriv en kort forklaring av problemrommet for den valgte kandidaten:

- Hvilke krav et nytt grensesnitt må tilfredsstille (hentes fra `docs/CONTEXT.md` og relevante `docs/adr/`).
- Avhengighetene det vil hvile på, og hvilken kategori de faller i (se [deepening.md](deepening.md)).
- En grov illustrerende kode-skisse for å gjøre kravene konkrete — ikke et forslag, bare en måte å feste kravene.

### 2. Skisser 3+ radikalt ulike grensesnitt

Lag minst tre alternativer, hvert med en distinkt designtvang. Bruk vokabularet fra [SKILL.md](SKILL.md) og domenespråket i `docs/GLOSSARY.md` så ting navngis konsistent.

- Alternativ 1: **Minimer grensesnittet** — sikt på 1–3 inngangspunkter. Maksimer gjennomslag per inngangspunkt.
- Alternativ 2: **Maksimer fleksibilitet** — støtt mange bruksmønstre og utvidelse.
- Alternativ 3: **Optimaliser for den vanligste kalleren** — gjør standardtilfellet trivielt.
- Alternativ 4 (om relevant): **Ports & adapters** rundt avhengigheter som krysser nett (se [deepening.md](deepening.md), kategori 3–4).

For hvert alternativ, skriv:

1. Grensesnitt (typer, metoder/endepunkter, parametre — pluss invarianter, rekkefølge, feilmodi).
2. Bruks-eksempel som viser hvordan en kaller bruker det (kort Kotlin/Ktor).
3. Hva implementasjonen skjuler bak sømmen.
4. Avhengighetsstrategi og adaptere (se [deepening.md](deepening.md)).
5. Avveininger — hvor gjennomslaget er høyt, hvor det er tynt.

### 3. Sammenlign og anbefal

Presenter alternativene sekvensielt så de kan fordøyes ett for ett, og sammenlign dem i prosa. Kontraster på **dybde** (gjennomslag ved grensesnittet), **lokalitet** (hvor endring samler seg) og **søm-plassering**.

Gi til slutt din egen anbefaling: hvilket design som er sterkest og hvorfor. Passer elementer fra ulike alternativer godt sammen, foreslå en hybrid. Vær tydelig — gjesten vil ha et sterkt råd, ikke en meny. Det valgte grensesnittet og begrunnelsen skrives til `docs/CONTEXT.md`; er beslutningen vanskelig å reversere, skriv ADR i `docs/adr/`.
