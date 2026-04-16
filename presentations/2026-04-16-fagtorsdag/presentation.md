---
marp: true
theme: default
paginate: true
size: 16:9
style: |
  section {
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    background: #fafafa;
    color: #1a1a1a;
    padding: 60px 70px;
  }
  h1 {
    color: #00529b;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  h2 {
    color: #00529b;
    font-weight: 600;
  }
  h3 {
    color: #1a1a1a;
    font-weight: 600;
  }
  code {
    background: #eef2f7;
    color: #1a1a1a;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.85em;
  }
  pre {
    background: #1e1e2e;
    color: #cdd6f4;
    border-radius: 8px;
    padding: 20px;
    font-size: 0.75em;
    line-height: 1.4;
  }
  pre code {
    background: transparent;
    color: #cdd6f4;
  }
  a { color: #00529b; }
  strong { color: #00529b; }
  em { color: #555; }
  blockquote {
    border-left: 4px solid #00529b;
    background: #f0f4f8;
    padding: 0.6em 1.2em;
    color: #333;
    font-style: italic;
    margin: 0.8em 0;
  }
  table {
    border-collapse: collapse;
    margin: 0.6em 0;
    font-size: 0.85em;
  }
  th {
    background: #00529b;
    color: white;
    padding: 0.5em 0.9em;
    text-align: left;
  }
  td {
    border: 1px solid #d0d7de;
    padding: 0.4em 0.9em;
  }
  section.lead {
    background: #00529b;
    color: #fafafa;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  section.lead h1 { color: #fafafa; font-size: 3em; }
  section.lead h2 { color: #cdd9e8; font-weight: 400; }
  section.lead a { color: #cdd9e8; }
  section.center {
    text-align: center;
  }
  section.code-focus pre { font-size: 0.9em; }
  footer {
    color: #888;
    font-size: 0.7em;
  }
  header {
    color: #888;
    font-size: 0.7em;
  }
  .ascii-diagram {
    font-family: 'JetBrains Mono', 'Consolas', monospace;
    white-space: pre;
    font-size: 0.75em;
    line-height: 1.3;
    background: #f5f7fa;
    padding: 20px 28px;
    border-radius: 8px;
    border: 1px solid #e1e4e8;
    color: #1a1a1a;
  }
  .small {
    font-size: 0.7em;
    color: #666;
  }
footer: "hovmester · fagtorsdag 16. april 2026"
---

<!-- _class: lead -->
<!-- _paginate: false -->
<!-- _footer: "" -->

# Hovmester 🍽️

## Multi-agent Copilot-orkestrering for Nav

*Audun Sørheim · Fagtorsdag 16. april 2026*

<br>

`github.com/navikt/hovmester`

---

<!-- _class: center -->

<div class="ascii-diagram">
  Rammen  →  Arbeidsflyt  →  Kunnskap  →  Fire overflater  →  Demo
</div>

---

# Premiss

I Nav har vi **Copilot**.

Ikke Claude Code. Ikke Cursor. Ikke Windsurf.

Spørsmålet er ikke *"hvilken AI?"*.

Spørsmålet er: **hvordan får vi Copilot til å gjøre Nav-jobben best?**

---

# Hovmesters svar: to lag

<div class="ascii-diagram">
    ┌──────────────────────────────────────────────────┐
    │                                                  │
    │   ARBEIDSFLYTLAGET                               │
    │   hvordan jobbe                                  │
    │                                                  │
    │   agenter · modellvalg · subagent-kontekst ·     │
    │   kryssmodell-review · Steg 0–5                  │
    │                                                  │
    └──────────────────────────────────────────────────┘
                           ⇅
    ┌──────────────────────────────────────────────────┐
    │                                                  │
    │   KUNNSKAPSLAGET                                 │
    │   hva som er riktig i Nav                        │
    │                                                  │
    │   path-scoped instructions · skills med          │
    │   progressive disclosure · collections           │
    │                                                  │
    └──────────────────────────────────────────────────┘
</div>

<span class="small">Separation of concerns på agent-nivå. Lagene kan fornyes uavhengig.</span>

---

<!-- _class: lead center -->

# Arbeidsflytlaget

*hvordan jobbe godt med AI*

---

# 6 agenter — én maskin

<div class="ascii-diagram">
                    ┌─────────────────┐
                    │  🍽️  Hovmester  │  Opus · orkestrator
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
    📋 Souschef        👨‍🍳 Kokk           🎂 Konditor
    Opus · plan        GPT · backend      Opus · frontend
                             │                  │
                             ▼                  ▼
                   🔬 Inspektør-Claude   🔬 Inspektør-GPT
                   Opus · review GPT     GPT · review Opus
</div>

**Én regel:** én agent eier hele snittet vertikalt.
Konditor eier UI + state + API-kall. Kokk eier API + service + DB.
*Ikke* filtype-splitt.

---

# Riktig modell til riktig jobb

| Oppgave | Agent | Modell | Hvorfor |
|---|---|---|---|
| Orkestrering | Hovmester | Opus | Plan, nyanse, dialog |
| Planlegging | Souschef | Opus | Utforske, resonnere |
| Backend-kode | Kokk | **GPT** | Konsistens, mønstre, konvensjoner |
| Frontend-kode | Konditor | **Opus** | Aksel-nyanse, accessibility, design |
| Review av GPT-kode | Inspektør-Claude | Opus | Uavhengige øyne |
| Review av Opus-kode | Inspektør-GPT | GPT | Uavhengige øyne |

---

# Subagent-kontekst: hvorfor det matter

<div class="ascii-diagram">
  Uten subagent — én agent gjør alt:

  [■■■■■■■■■■■■■■■■■■■■■] 200k tokens
   prosjekt  utforskning  historikk   ← 20k igjen til arbeid


  Med subagent — fresh kontekstvindu per oppgave:

  [■■■■■■■■■■■■■■■■■■■■■] 200k  hovmester  ↓ returnerer 2k
     ├─[■■■■■·················] fresh    Souschef
     ├─[■■■■■■■■■■·············] fresh   Kokk
     └─[■■■■■■■■··············] fresh    Konditor
</div>

**50k tokens utforskning → 2k sammendrag tilbake.**
Hovmester beholder fullt kontekstvindu til koordinering.

---

# Kryssmodell-review

<div class="ascii-diagram">
    Kokk (GPT)          skriver kode
         │
         ▼
    Inspektør-Claude (Opus)    reviewer — uavhengige øyne
         │
         ▼                      BLOCKER / WARNING / SUGGESTION
    Hovmester konsoliderer
</div>

**Uavhengige øyne, ikke adversarial.**
Ulike modellfamilier fanger ulike feil.
Reviewer skriver aldri kode — kun tilbakemelding.

---

# Steg 0–5

<div class="ascii-diagram">
  0  Omfangsvurder. Utfordre premiss. Bekreft bestilling.
     ├─ Triviell → direkte til spesialist
     └─ Stor     → brainstorm → godkjent plan

  1  Souschef planlegger. HVA, ikke HVORDAN.

  2  Fase-oppsplitting. Parallellitet der mulig.

  3  Kjøkkenet jobber. Kurert kontekst inn.
     Status: DONE · DONE_WITH_CONCERNS · NEEDS_CONTEXT · BLOCKED

  4  Kryssmodell-inspeksjon. Re-inspeksjon ved BLOCKER.

  5  Servering. Diff · review-rapport · neste steg.
</div>

**Hvert steg er en beslutningsgate.**

---

<!-- _class: lead center -->

# Kunnskapslaget

*hva som er riktig i Nav*

---

# Instructions — path-scoped

```yaml
---
applyTo: "**/*.kt"
---

# Kotlin-konvensjoner i Nav

- Bruk `kotlin-spring` eller `kotlin-ktor` skills for detaljer
- Følg Nav-standarden for feilhåndtering ...
```

**Lastes *kun når du rører en .kt-fil*.**

Ingen tokens brukt på Kotlin-regler når du jobber i React.

<span class="small">`.github/instructions/*.instructions.md`</span>

---

# Skills — progressive disclosure

<div class="ascii-diagram">
  Nivå 1  name + description (ALLTID i konteksten)
          ~50 tokens per skill · alle 23 synlige samtidig

          "nais-manifest — valider og bygg Nais-deploy.yaml"

                              │  matcher oppgaven?
                              ▼

  Nivå 2  hele SKILL.md (on-demand)
          ~500 tokens · lastes når agenten velger å bruke

                              │  trenger mer?
                              ▼

  Nivå 3  references/ (on-demand)
          detaljerte eksempler · mønstre · sjekklister
</div>

**23 skills tilgjengelig. Kun det som trengs, lastes.**

---

# Collections — teamets oppsett

| Collection | Innhold | Typisk for |
|---|---|---|
| **hovmester** *(alltid)* | Orkestrator + Nav-brede instructions + 13 generiske skills | Alle |
| **backend** | Kotlin-instruksjoner + 7 skills (Ktor, Spring, Flyway, Kafka, Postgres, API-design, auth) | Backend-repo |
| **frontend** | Frontend/accessibility + 4 skills (Aksel, auth, Lumi, a11y-review) | Frontend-repo |

```yaml
with:
  collections: "frontend"   # eller "backend,frontend"
```

Én linje i teamets workflow-fil.

---

<!-- _class: code-focus -->

# Ett konkret eksempel: `figma-workflow`

```markdown
---
name: figma-workflow
description: Hent Figma-design, utled Aksel-komponenter, bygg React
  med riktig token-oppsett
---

Når bruker refererer til en Figma-lenke:

1. Hent node-data via Figma MCP
2. Map til Aksel v8-komponenter (Card, BodyShort, Heading, ...)
3. Verifiser tokens (farger, spacing, typography)
4. Generer React med riktig a11y-attributter
5. Valider mot design-spec før commit
```

**Kunnskapen om *hvordan bruke Figma riktig i Nav-stack* bor i repoet.**
Ikke i min prompt. Ikke i hodet mitt. I repoet.

---

<!-- _class: lead center -->

# Konsekvens

*én investering → fire overflater*

---

# Fem overflater, samme investering

| Overflate | Instructions | Skills | Custom agents | Multi-agent |
|---|---|---|---|---|
| **Copilot CLI** | ✅ | ✅ | ✅ | ✅ |
| **VS Code** | ✅ | ✅ | ✅ | – |
| **IntelliJ** | ✅ | (delvis) | – | – |
| **github.com** — coding agent | ✅ | ✅ | – | – |
| **github.com** — Code Review | ✅ | ✅ | – | – |

**Én PR inn i repoet → bedre Copilot på fem overflater.**

Du snakker med hovmester. Hovmester orkestrerer.
Resten — `/fleet`, subagent-spawning, prompt-strukturer — er under panseret.

---

# Distribusjon — reusable workflow

<div class="ascii-diagram">
   navikt/hovmester                   ditt-repo
        │                                 │
        │   cron (05:00 daglig)           │
        ├────────────────────────────────▶│   hovmester-sync.yml
        │                                 │        │
        │                                 │        ▼
        │                                 │   diff · manifest
        │                                 │        │
        │                                 │        ▼
        │                                 │   PR opprettes av GitHub App
        │                                 │        │
        │                                 │        ▼
        │                                 │   hovmester-verify.yml
        │                                 │   (file-scope-sjekk)
        │                                 │        │
        │                                 │        ▼
        │                                 │   auto-merge (valgfritt)
</div>

**Manifest sporer stale filer → fjernes automatisk.**
Team eier workflows selv — hovmester rører kun `.github/agents|instructions|skills`.

---

# Oppsett — én linje for teamet

```yaml
# .github/workflows/hovmester-sync.yml
jobs:
  sync:
    uses: navikt/hovmester/.github/workflows/hovmester-sync.yml@main
    with:
      collections: "frontend"
```

Merge den første PR-en → du er i gang.

Verify + auto-merge er valgfritt, krever GitHub App + `hovmester-verify.yml`.

---

<!-- _class: lead center -->

# Demo 🎬

---

<!-- _class: center -->

## Hva har hovmester gjort mens vi snakket?

<br>

*(bytt til terminal — vis framdrift)*

---

<!-- _class: center -->

## Resultatet

<br>

*(PR · diff · Inspektør-GPT-kommentarer)*

---

# Tre observasjoner

**Bake kunnskap inn i repoet, ikke i prompten din.**
Instructions og skills er dokumentasjon som også er input til AI.

**Arbeidsflyt og kunnskap kan skilles.**
Lagene fornyes uavhengig. Gir portabilitet og skalerbarhet.

**"KUN Copilot" er en ramme, ikke en begrensning.**
Det som finnes i repoet, virker over hele Copilot-flata.

---

<!-- _class: lead -->

# Inspirasjon

**obra/superpowers** · skill-frameworket bak alt
**burkeholland/anvil** · evidence-first coding agent
**github/awesome-copilot** · fellesskap + mønstre

<br>

# Repo

**navikt/hovmester**

<br>

## Spørsmål?

<!--
SPEAKER NOTES — kjør ikke gjennom i visningen, bare for forfatter

Slide 1 (tittel):
- 15 sek. Start demo live i terminal i split før du går videre.
- Si: "Jeg starter hovmester på en oppgave nå. Vi kommer tilbake til den
  om ca 17 min og ser hva den har gjort."

Slide 2 (agenda):
- 15 sek. Bare pek på stasjonene, ikke les dem.

Slide 3 (premiss):
- 30 sek. Tempoløfter. "Vi har Copilot." pause. "Spørsmålet er ikke
  hvilken AI."

Slide 4 (to lag):
- 2 min. Kjernediagrammet. Bruk tid. Be publikum feste det i minnet.
- Si: "Alt jeg skal vise i resten av talken henger i en av de to boksene.
  Når jeg viser en teknikk, er det i arbeidsflytlaget. Når jeg viser en
  Nav-spesifikk skill, er det i kunnskapslaget."

Slide 5 (6 agenter):
- 90 sek. Gå gjennom dem raskt. Ikke dvel på navnene (matlaging er et
  mnemonisk valg, ikke et poeng). Dvel på "vertikalt eierskap".

Slide 6 (modellvalg):
- 60 sek. GPT vs Opus-valget er det mest tekniske. Ikke overforklar —
  si at det er basert på erfaring, ikke benchmarks.

Slide 7 (subagent-kontekst):
- 90 sek. Ascii-diagrammet gjør jobben. Pek på "50k → 2k sammendrag".
  Dette er det som får /fleet til å funke, og det er hvorfor hovmester
  jobber med subagenter.

Slide 8 (kryssmodell):
- 90 sek. "Uavhengige øyne, ikke adversarial" — viktig nyanse.
  Flag at dette ikke er Burkes Anvil (som er adversarial).
  Hvis noen spør etter tall: "Vi har ikke benchmarket. Det er basert på
  erfaring og arkitektonisk resonnering." Ikke forsvar med akademi.

Slide 9 (Steg 0–5):
- 60 sek. Ikke gå gjennom alle stegene. Si: "Hvert steg er en
  beslutningsgate. Hvis omfanget er trivielt, droppes steg 1–2."

Slide 10 (kunnskapslaget overgang):
- 10 sek.

Slide 11 (instructions):
- 60 sek. applyTo-mønsteret er kjernen. Si: "Kotlin-regler lastes bare
  når du rører en .kt-fil. Resten av dagen koster de 0 tokens."

Slide 12 (skills progressive disclosure):
- 90 sek. Det viktigste slidet i kunnskapslaget. Tre nivåer = tre
  last-budsjett. Si: "Vi har 23 skills. Ingen agent ser alle samtidig."

Slide 13 (collections):
- 45 sek. Praktisk. Si: "Frontend-team tar frontend-collection. Mixed
  repo tar begge. Hovmester er alltid med."

Slide 14 (figma-workflow eksempel):
- 90 sek. Landingsslide for kunnskapslaget. "Kunnskapen bor i repoet,
  ikke i hodet ditt." Denne linjen er viktig — den tråder demoen.

Slide 15 (fem overflater):
- 2 min. SKIN slide. Bruk tid. Si: "Dette er grunnen til at dere bør
  bry dere om dette selv om dere bruker VS Code eller IntelliJ.
  Knowledge-laget er ditt, uansett." Hvis noen spør hva Multi-agent-kolonnen
  gjør i praksis: "Du snakker med hovmester — resten er implementasjon."

Slide 16 (distribusjon):
- 90 sek. Ikke les YAML-en. Pek på sekvens-diagrammet.

Slide 17 (oppsett):
- 45 sek. "Fem linjer. Merge første PR. Ferdig."

Slide 18 (demo overskrift):
- 5 sek. Bytt til terminal.

Slide 19 (demo status):
- 2 min i terminal. Bla gjennom hva hovmester har gjort. Pek på
  Steg 0-avklaringer, Souschef-planen, cross-model-kommentarer.

Slide 20 (demo resultat):
- 3 min i terminal/GitHub. Vis PR. Åpne diff. Klikk inn på én
  Inspektør-GPT-kommentar og les den høyt. Vis Zod-typer som matcher
  backend. Nevn: "Backend-PR-en her ble faktisk også laget med
  hovmester, i går kveld. Der var det Inspektør-Claude som reviewet."
  (Vis den PR-en kort hvis tid.)

Slide 21 (tre observasjoner):
- 90 sek. Les hver som en selvstendig tanke. Ikke konkluder. La dem
  henge i luften.

Slide 22 (inspirasjon + spørsmål):
- Resten. Vis at hovmester står på skuldrene til andre.

Totalt: ~25 min inkl. 3 min demo-deltagelse på slutten.
Demoen jobber 0–17 min i bakgrunnen.

RISIKOHÅNDTERING:
- Hvis demo ikke er ferdig ved slide 19: si "den jobber fortsatt — la oss
  gi den et øyeblikk" og vis gårsdagens backend-PR som "same machinery,
  annen retning". Det er realistisk — hovmester er ikke magisk, den tar
  tid.
- Hvis demo har hengt: si "dette er del av bildet — hovmester stiller
  spørsmål når den trenger det. Akkurat nå venter den på meg." Svar
  spørsmålet raskt, fortsett.
- Hvis demo har feilet stille: bytt til gårsdagens dry-run-PR (samme task
  kjørt onsdag kveld). Det er ikke "backup" i betydningen pre-recorded —
  det er et ekte tidligere hovmester-run av samme jobb.
-->
