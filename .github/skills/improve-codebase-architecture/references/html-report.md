# HTML-rapportformat

Arkitektur-reviewen rendres som én selvstendig HTML-fil i OS-temp. Tailwind og Mermaid hentes begge fra CDN. Mermaid håndterer graf-formede diagrammer pålitelig; håndbygde `<div>`-er og inline-SVG håndterer de mer redaksjonelle visualene (masse-diagrammer, tverrsnitt). Bland de to — ikke len deg på Mermaid for alt, da begynner det å se generisk ut.

## Stillas

```html
<!doctype html>
<html lang="no">
  <head>
    <meta charset="utf-8" />
    <title>Arkitektur-review — {{repo-navn}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      /* lite eget lag for ting Tailwind ikke dekker rent:
         stiplede søm-linjer, håndtegnede pilhoder osv. */
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="kandidater" class="space-y-10">...</section>
      <section id="topp-anbefaling">...</section>
    </main>
  </body>
</html>
```

## Header

Repo-navn, dato og en kompakt forklaring: heltrukken boks = modul, stiplet linje = søm, rød pil = lekkasje, tykk mørk boks = dyp modul. Ingen innledende avsnitt — rett inn i kandidatene.

## Kandidatkort

Diagrammene bærer tyngden. Prosa er knapp, enkel, og bruker vokabularet (modul, grensesnitt, dybde, søm, adapter, lokalitet, leverage) uten seremoni.

Hver kandidat er én `<article>`:

- **Tittel** — kort, navngir fordypningen (f.eks. "Slå sammen Sykmelding-inntak-kjeden").
- **Badge-rad** — anbefalingsstyrke (`Sterk` = emerald, `Verdt å utforske` = amber, `Spekulativ` = slate), pluss en tag for avhengighetskategori (`in-process`, `lokalt-substituerbar`, ` porter & adaptere`, `mock`).
- **Filer** — monospaced liste, `font-mono text-sm` (f.eks. `src/main/kotlin/no/nav/syfo/...`).
- **Før/etter-diagram** — midtpunktet. To kolonner side om side. Se mønstre under.
- **Problem** — én setning. Hva som svir.
- **Løsning** — én setning. Hva som endres.
- **Gevinster** — punkter, ≤6 ord hver. F.eks. "Tester treffer ett grensesnitt", "TokenX-token slutter å lekke", "Slett 4 grunne wrappere".
- **ADR-callout** (hvis relevant) — én linje i en gul-tonet boks.

Ingen avsnitt med forklaring. Trenger diagrammet et avsnitt for å forstås, tegn diagrammet på nytt.

## Diagram-mønstre

Velg mønsteret som passer kandidaten. Bland dem. Ikke la alle diagrammer se like ut — variasjon er en del av poenget.

### Mermaid-graf (arbeidshesten for avhengigheter / kallflyt)

Bruk `flowchart` eller `graph` når poenget er "X kaller Y kaller Z, se på rotet". Pakk den i et Tailwind-stylet kort. Stil med `classDef` for å farge lekkasje-kanter røde og den dype modulen mørk. Sekvensdiagram funker godt for "før: 6 rundturer; etter: 1".

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[SykmeldingRoute] --> B[SykmeldingService]
      B --> C[SykmeldingRepository]
      C -.lekk.-> D[PdlClient]
      classDef leak stroke:#dc2626,stroke-width:2px;
      class C,D leak
  </pre>
</div>
```

### Håndbygde bokser-og-piler (når Mermaids layout slåss mot deg)

Moduler som `<div>`-er med rammer og etiketter. Piler som inline-SVG `<line>`/`<path>` posisjonert absolutt over en relativ container. Bruk dette når "etter"-diagrammet skal føles som én tykk-rammet dyp modul med nedtonede interne deler.

### Tverrsnitt (bra for lagdelt grunnhet)

Stable horisontale bånd (`h-12 border-l-4`) for å vise lagene et kall passerer. Før: 6 tynne lag som hver gjør ingenting (Route → Service → Mapper → Repository → Klient → DTO). Etter: 1 tykt bånd med den konsoliderte ansvaret.

### Masse-diagram (bra for "grensesnitt like bredt som implementasjon")

To rektangler per modul — ett for grensesnitt-flate, ett for implementasjon. Før: grensesnitt-rektangelet er nesten like høyt som implementasjonen (grunn). Etter: grensesnittet er lavt, implementasjonen høy (dyp).

### Kallgraf-kollaps

Før: et tre av funksjonskall som nøstede bokser. Etter: samme tre kollapset til én boks, med de nå-interne kallene nedtonet inni.

## Stilguide

- Redaksjonelt, ikke corporate-dashboard. Raus luft. Serif valgfritt for overskrifter (`font-serif` med stone/slate).
- Farge sparsomt: én aksent (emerald eller indigo) pluss rød for lekkasje og gul for advarsler.
- Hold diagrammer ~320px høye så før/etter sitter komfortabelt side om side uten scrolling.
- Bruk `text-xs uppercase tracking-wider` for modul-etiketter inni diagrammer — de skal leses som skjematiske, ikke som UI.
- Eneste skript er Tailwind-CDN og Mermaid-ESM-import. Rapporten er ellers statisk — ingen app-kode, ingen interaktivitet utover Mermaids egen rendering.

## Topp-anbefaling-seksjon

Ett større kort. Kandidatnavn, én setning på hvorfor, anker-lenke til kortet. Ferdig.

## Tone

Enkelt norsk, konsist — men de arkitektoniske substantivene og verbene kommer rett fra vokabularet. Konsisjon er ingen unnskyldning for å drifte.

**Bruk eksakt:** modul, grensesnitt, implementasjon, dybde, dyp, grunn, søm, adapter, leverage, lokalitet.

**Aldri erstatt med:** komponent, service, enhet (for modul) · API, signatur (for grensesnitt) · boundary (for søm) · lag, wrapper (for modul, når du mener modul).

**Fraseringer som passer stilen:**

- "Sykmelding-inntak-modulen er grunn — grensesnittet er nesten like bredt som implementasjonen."
- "PDL-oppslaget lekker over sømmen."
- "Fordyp: ett grensesnitt, ett sted å teste."
- "To adaptere forsvarer sømmen: HTTP i prod, in-memory i test."

**Gevinst-punkter** navngir gevinsten i vokabularet: *"lokalitet: feil konsentreres i én modul"*, *"leverage: ett grensesnitt, N kallsteder"*, *"grensesnittet krymper; implementasjonen absorberer wrapperne"*. Ikke skriv *"lettere å vedlikeholde"* eller *"renere kode"* — de termene er ikke i vokabularet og fortjener ikke plassen.

Ingen hedging, ingen kremting, ingen "det er verdt å merke seg at…". Kan en setning være et punkt, gjør den til et punkt. Kan et punkt kuttes, kutt det.
