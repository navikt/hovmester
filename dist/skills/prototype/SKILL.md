---
name: prototype
description: "Utforsk designkonsepter visuelt med Aksel-tema i nettleser, og lever som Figma-skisse. Brukes via /prototype når et konsept skal visualiseres."
---

# Prototype — fra konsept til synlig skisse

Utforsk designkonsepter interaktivt i nettleseren, iterer med designeren,
og lever som Figma-skisse med ekte Aksel-komponenter.

## Når brukes denne?

- Designer vil se et konsept visuelt (ikke bare beskrevet)
- Variant-sammenlikning for å velge retning
- Rask validering av layout, hierarki eller flyt
- Situasjonsdesign — vis alle situasjoner brukeren kan møte

## Fase 1: Visuell utforsking (Visual Companion)

Interaktivt nettleserverktøy for å utforske designkonsepter med Aksel-styling.

### Oppstart

1. Sørg for at avhengigheter er installert (kreves for Aksel CSS):
   ```bash
   [ -d node_modules/@navikt/ds-css ] || pnpm install
   ```
2. Start serveren:
   ```bash
   node .github/skills/prototype/scripts/server.js --project-dir .
   ```
3. Les startup-JSON fra stdout — den inneholder `url`, `screen_dir`, `state_dir`
4. Gi designeren URL umiddelbart

### Tilby visual companion

Spør designeren én gang, som egen melding:

> «Noe av det vi skal jobbe med er enklere å vise enn å beskrive. Jeg kan
> sette opp en nettleservisning der du ser mockups og klikker for å velge.
> Vil du prøve det?»

Vent på svar. Hvis nei — jobb kun med tekst og Figma.

### Bestemme per spørsmål: nettleser eller chat?

**Nettleser** — innholdet ER visuelt:
- Wireframes, mockups, layout-sammenlikninger
- Side-by-side designvarianter
- Komponenteksempler

**Chat** — innholdet er tekst:
- Kravspørsmål, scope-avklaringer
- Konseptuelle valg beskrevet i ord
- Avveininger

### Skrive innhold

Skriv HTML-fragmenter til `screen_dir`. Serveren wrapper automatisk i
Aksel-temat og laster ekte `@navikt/ds-css` fra prosjektets node_modules.

**VIKTIG — Aksel-korrekthet:**

Før du skriver en HTML-mockup, sjekk alltid `/aksel-design` skill for:
- Riktige komponentnavn og struktur
- Korrekt spacing (token = pixelverdi, f.eks. `--ax-space-16` = 16px)
- Korrekt fargebruk (`--ax-bg-*`, `--ax-text-*`, `--ax-border-*`)

Serveren laster ekte Aksel CSS. Du kan bruke:
1. **Ekte Aksel-klasser** (`.aksel-button`, `.aksel-text-field`, etc.) for high-fidelity
2. **`.mock-*` snarvei-klasser** for raske wireframes (se visual-companion.md)

Tokens i v8: `--ax-space-{px}` (f.eks. `--ax-space-16` = 16px, `--ax-space-24` = 24px).
Radius: `--ax-radius-4`, `--ax-radius-8`, `--ax-radius-12`.

Se `references/visual-companion.md` for alle CSS-klasser og eksempler.

**Regler:**
- Semantiske filnavn: `konsept-a.html`, `layout-v2.html`
- Aldri gjenbruk filnavn
- 2–4 alternativer per skjerm
- Forklar spørsmålet på siden: «Hvilken tilnærming passer best?»
- Skaler fidelitet etter spørsmålet — wireframe for layout, detaljer for detaljer

### Les brukervalg

Etter at designeren har sett skjermen:
1. Les `$STATE_DIR/events` for klikk-data
2. Kombiner med designerens tekstrespons
3. Iterer eller gå videre

### Variant-utforskning

1. Lag 2–3 varianter som valgalternativer på skjermen
2. Spør: «Hvilken variant foretrekker du?» med beskrivende navn
3. Iterer på valgt variant
4. Når konseptet er valgt — gå til Fase 2

### Situasjoner brukeren møter

Vis ulike situasjoner som separate mockups eller som sekvens:
- Normaltilstand (bruker kan handle)
- Venter (lasting/spinner)
- Feil (hva kan bruker gjøre?)
- Tom tilstand (ingenting å vise ennå)
- Ferdig / bekreftelse

## Fase 2: Figma-leveranse

Når konseptet er valgt, bygg en Figma-skisse av den valgte varianten.

### Krav

Figma MCP-verktøy tilgjengelig.

### Flyt

1. `whoami` → finn planKey
2. `create_new_file` → opprett fil, **del URL med designeren**
3. `search_design_system` → finn relevante Aksel-komponenter
4. `use_figma` → bygg skissen med ekte komponenter
5. Del oppdatert lenke ved milepæler

Se `references/figma-prototype.md` for Nav-spesifikke detaljer.

**Hva som bygges i Figma:**
- Kun den nye komponenten/endringen — ikke hele siden
- Ekte Aksel-komponenter fra designsystemet (redigerbare)
- Riktige tokens og spacing
- Varianter og situasjoner som egne frames

### Komponent-gate

Før du bygger i Figma, søk Aksel-biblioteket:

```
search_design_system(query: "<komponentnavn>", fileKey: "<key>")
```

Finnes komponenten? → Bruk den.
Finnes den ikke? → Bygg custom, men med Aksel-tokens.

## Valgfritt: Kodeprototype

Når designeren vil se konseptet bygget med ekte komponenter i den kjørende
appen.

> «Vil du se dette bygget med ekte Aksel-komponenter i appen?»
> → Deleger til konditor for å bygge på en prototype-branch

Designer-agenten skriver **aldri** kode selv. Konditor gjør det.

## Iterasjon

1. Vis resultat (nettleser-URL eller Figma-lenke)
2. Designer gir feedback
3. Juster og vis på nytt
4. Gjenta til fornøyd

## UU etter designleveranse

Forhåndssjekk i designet:
- Kontrast (4.5:1 brødtekst, 3:1 stor tekst)
- Klarspråk i labels og feilmeldinger
- Riktig semantisk Aksel-komponent

Full WCAG-validering (fokus, tastatur, axe) er utvikleroppgave via
`/accessibility-review` før release. Merk dette ved overlevering.

## Graceful degradation

| Verktøy | Tilgjengelig | Fallback |
|---|---|---|
| Visual Companion (Node.js) | Alltid | — |
| Figma MCP | Valgfritt | Beskriv konseptet, lever som Issue |
| Playwright MCP | Valgfritt | Manuelt skjermbilde fra designer |

## Opprydding

Når designarbeidet er levert (Figma-fil eller Issue opprettet), rydd opp:

```bash
node .github/skills/prototype/scripts/server.js --project-dir . --cleanup
```

Dette fjerner hele `.visual-companion/`-mappen. Kjør dette automatisk i
Fase 4 (leveranse) etter at designeren har bekreftet at arbeidet er ferdig.

## Boundaries

### ✅ Alltid
- Bruk Aksel-komponenter og -tokens
- Returner URL / Figma-lenke for resultater
- Bruk handlingsspråk — aldri verktøynavn
- Spør designer før større endringer
- Del lenker umiddelbart etter opprettelse

### 🚫 Aldri
- Skriv kode i prosjektets kildekode (deleger til konditor)
- Lever prototype som ferdig kode
- Eksponer verktøynavn til designeren
- Feilsøk build-problemer (fall tilbake til neste metode)
- Hopp over UU-sjekk ved leveranse
