# Aksel-tokens for Figma-skisser (empirisk uttrukket)

Komponentene i [`aksel-figma-katalog.md`](./aksel-figma-katalog.md) bærer sin egen styling. Denne filen dekker **layouten rundt** dem — luft, bakgrunner, kanter, hjørner og løs tekst — så hele skissen blir Aksel-korrekt, ikke bare komponentene.

> Tokens ligger i biblioteket `01 Aksel Tokens`. **Autoritativ live-kilde:** `get_variable_defs` på en node returnerer de faktiske `--ax-*`-verdiene den bruker — kjør den ved tvil. Verdiene under er en praktisk hurtigreferanse for å bygge omkringliggende layout uten å gjette.

## Spacing (`--ax-space-N`, N = piksler)

Lineær px-skala: bruk verdien direkte til `itemSpacing`, `padding*`, gaps.

`0 · 2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 28 · 32 …`

Praktiske valg: feltavstand i skjema **24**, seksjonsavstand **40–48**, tett gruppe **8–12**, padding i kort/paneler **16–24**.

## Hjørneradius (`--ax-radius-N`)

| Token | px | Bruk |
|---|---|---|
| `radius-4` | 4 | små elementer, tags |
| `radius-8` | 8 | knapper, input, kort |
| `radius-12` | 12 | paneler, modaler |
| `radius-full` | 9999 | pill/sirkel |

## Semantiske farger (navn → hex)

**Bakgrunn**
| Token | Hex | Bruk |
|---|---|---|
| `bg-default` | `#ffffff` | standard sidebakgrunn |
| `bg-raised` | `#ffffff` | kort/svevende bokser |
| `bg-sunken` | — | nedsunket seksjon (lysere grå) |
| `bg-neutral-soft` | `#f5f6f7` | subtil grå flate |
| `bg-neutral-moderate` | `#ecedef` | tydeligere grå |
| `bg-info-moderate` | `#e3eff7` | info-flate |
| `bg-success-moderate` | `#d5f6db` | suksess-flate |
| `bg-success-strong` | `#00893c` | meningsbærende grønn |
| `bg-accent-strong` | `#2176d4` | primær blå (knapp/markering) |

**Tekst**
| Token | Hex | Bruk |
|---|---|---|
| `text-neutral` | `#202733` | standard tekst |
| `text-neutral-subtle` | `#49515e` | dempet/sekundær tekst |
| `text-neutral-contrast` | `#ffffff` | tekst på mørk/sterk flate |
| `text-accent-subtle` | `#005bb6` | lenke/aksent-tekst |
| `text-success` | `#002e00` | suksess-tekst |
| `text-info` | `#002942` | info-tekst |

**Kant**
| Token | Hex | Bruk |
|---|---|---|
| `border-neutral` | `#6f7785` | standard kant |
| `border-neutral-subtleA` | `#00163030` | subtil skillelinje (alpha) |
| `border-neutral-strong` | `#5d6573` | tydelig kant |
| `border-accent` | `#2176d4` | aksent-kant |
| `border-success` | `#00893c` | suksess-kant |
| `border-info` | `#457c9d` | info-kant |

## Typografi (for LØS tekst du lager selv)

Bruk komponentene `Heading`/`Detail` der det passer. For ren tekst i layout, match Aksel-skalaen. Familie: **`Source Sans 3`** (noen eldre noder: `Source Sans Pro` — les alltid `node.fontName`).

| Stil | Font · vekt | Størrelse / linjehøyde | Bruk |
|---|---|---|---|
| Heading Large | Source Sans 3 · SemiBold | 32 / 40 | sidetittel (desktop) |
| Heading Medium | Source Sans 3 · SemiBold | 24 / 32 | seksjonstittel |
| Heading Small | Source Sans 3 · SemiBold | 20 / 28 | underseksjon |
| BodyLong Medium | Source Sans 3 · Regular | 18 / 28 | brødtekst (lange avsnitt) |
| BodyShort Medium | Source Sans 3 · Regular | 18 / 24 | korte tekster/labels |
| BodyShort Small | Source Sans 3 · Regular | 16 / 20 | hjelpetekst |
| Detail Uppercase | Source Sans 3 · Regular | 14 / 20 (ls 7.5) | metadata/caps |

## Slik bruker du tokens i `use_figma`

- **Raskt (90 %):** bruk råverdiene direkte — `frame.itemSpacing = 24`, `frame.cornerRadius = 8`, `fill = {#f5f6f7}`. Dekker nesten alle skisser.
- **Token-bundet (presist):** importer variabelen og bind den:
  ```javascript
  const v = await figma.variables.importVariableByKeyAsync(KEY); // key fra search_design_system
  frame.setBoundVariable('itemSpacing', v);      // eller fills via setBoundVariableForPaint
  ```
  Bruk dette når skissen skal være helt token-tro (f.eks. før kode-overlevering / Fase 5).
- **Ved tvil:** `get_variable_defs` på en eksisterende Aksel-komponent i samme fil viser hvilke `--ax-*` den faktisk bruker — kopier de tokenene.
