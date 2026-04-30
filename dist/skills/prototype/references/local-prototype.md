# Lokal HTML-prototype — Nav-spesifikk referanse

## Aksel CDN-oppsett

Bruk Aksel sin CDN-distribusjon for standalone prototyper:

```html
<link rel="stylesheet" href="https://cdn.nav.no/designsystem/@navikt/ds-css/7/index.min.css" />
```

Fonter (Inter) lastes automatisk av ds-css.

## HTML-skjelett

```html
<!DOCTYPE html>
<html lang="nb">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Prototype — [navn]</title>
  <link rel="stylesheet" href="https://cdn.nav.no/designsystem/@navikt/ds-css/7/index.min.css" />
</head>
<body>
  <main class="aksel-page-block aksel-page-block--md" style="padding-block: var(--ax-space-24);">
    <!-- Innhold her -->
  </main>
</body>
</html>
```

## Aksel CSS-klasser (uten React)

Aksel-komponenter har CSS-klasseekvivalenter med `aksel-`-prefiks:

| Komponent | CSS-klasse |
|---|---|
| Button primary | `aksel-button aksel-button--medium` |
| Button secondary | `aksel-button aksel-button--medium aksel-button--secondary` |
| TextField | `aksel-text-field` med `aksel-label` + `aksel-input` |
| Heading | `aksel-heading aksel-heading--medium` |
| BodyShort | `aksel-body-short` |
| Box med padding | `aksel-box` + inline `--ax-space-*` variabler |

## Spacing via CSS custom properties

Aksel eksponerer spacing-tokens som CSS custom properties:

```css
var(--ax-space-4)   /* 0.25rem */
var(--ax-space-8)   /* 0.5rem */
var(--ax-space-12)  /* 0.75rem */
var(--ax-space-16)  /* 1rem */
var(--ax-space-24)  /* 1.5rem */
var(--ax-space-32)  /* 2rem */
```

Bruk disse i `style`-attributter — aldri hardkod pikselverdier.

## Dev-server

Start med `npx serve` (ingen prosjektavhengighet):

```bash
npx serve /tmp/prototype --port 3333
```

Prototypefilen legges i en temp-mappe, aldri i prosjektets kildekode.

## Visning via Playwright

Etter at serveren kjører:
1. `browser_navigate` → `http://localhost:3333`
2. `browser_take_screenshot` → vis til designer
3. Designer gir feedback → rediger HTML → ta nytt screenshot

## Overføring til Figma

Når prototypen er godkjent og Figma MCP er tilgjengelig:
```
generate_figma_design → capture localhost:3333 → ny Figma-fil
```

## Opprydding

Stopp `npx serve`-prosessen etter endt prototyping.
Slett temp-filer.
