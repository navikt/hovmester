# Aksel Figma-katalog (empirisk uttrukket)

Komplett oppslag over aktive Aksel-komponenter i Figma-biblioteket `02 Aksel Components`, uttrukket via preflight (import + instans-inspeksjon). Bruk denne i stedet for å gjette variant-navn, defaults, tekstnode-navn eller fonter.

> Denne fila er vår egen «manifest» inntil Aksel publiserer en maskinlesbar én. Verdiene er hentet direkte fra biblioteket, ikke fra dokumentasjon.

## Slik leser du katalogen

- **key** importeres med `importComponentSetByKeyAsync(key)` (component set) med mindre raden er merket `(component)` → bruk `importComponentByKeyAsync`.
- **Variant-akser**: alle gyldige verdier listes; **fet** = default-verdi. Bygg variantstrengen ved å starte fra `defaultVariant.name` og bytte ÉN akse (se `figma-prototype.md`).
- **Antall-akser** (`Options`, `Amount`, `Items`, `Number of`) styrer **antall barn** — du kan ikke appende. Velg variant med riktig antall, fyll deretter de likt-navngitte tekstnodene per indeks.
- **Tekstnoder**: eksakte `name`-verdier for `findOne`/`findAllWithCriteria`. Gjentatte navn = fyll per indeks.
- **Font**: les alltid `node.fontName` dynamisk. Standard er `Source Sans 3` (Regular/SemiBold/Bold); noen noder bruker fortsatt `Source Sans Pro`.
- **Default-varianter er ofte «feil»** for status/tilstand (se `figma-prototype.md`). Katalogen markerer kjente feller.

## Skjema og input

| Komponent | Figma-navn · key | Variant-akser (**default** uthevet) | Tekstnoder | Merknad |
|---|---|---|---|---|
| Button | `Button Accent` `c2e28c6490cec0346ffbbf5636fbdee88bbb7f41` · `Button Neutral` `f2ad7c75cb7dd9eb2215f6ffa580d9ea73107d94` · `Button Danger` `669a43e5a3ece8dd2ad458c4a83384b28a968bae` | Size(**Medium**/Small/XSmall) · Variant(**Primary**/Secondary/Tertiary) · State(**Default**/Hover/Active/Disabled) · Icon only(**False**/True) | `label` | 3 separate sett per farge, ikke én fargeakse. Accent=blå primær |
| TextField | `TextField` `c580ac23684bc1b8b6f1f750eaa1ae7b548d742a` | Size(**Medium**/Small) · State(**Default**/Hover/Focus/Error/Read-only/Disabled) | `Label`, `Description`, `intput text` | Input-noden heter `intput text` (skrivefeil i Aksel). Skjul `Description` hvis ubrukt |
| Textarea | `TextArea` `37bed4a523afa158b6015d401143e153ab85f4d3` | Fixed height(True/**False**) · Size(**Medium**/Small) · State(**Default**/Hover/Focus/Error/Read-only/Disabled) | `Label`, `Description`, `Text`, `Value`, `Value-text` | |
| Select | `Select` `39877bb4a89c7c6777766ab90efa94f88457b838` | Size(**Medium**/Small) · State(**Default**/Hover/Focus/Error/Read-only/Disabled) | `Label`, `Description`, `intput text` | Input bruker `Source Sans Pro` |
| Checkbox | `CheckboxGroup` `d310e8c9b71cae9d89645c7e3014351240483d56` | Size(**Medium**/Small) · **Options(2–7, default 2)** · State(**Default**/Read-only/Error/Disabled) | `Label`+`Description` per element (gjentatt) | Antall-akse. Sub-checkbox-key: `a9ba5731c00a4df08daa5100ff9651bb4392c9b1` |
| Radio | `Radio Group` `7b02ae73ea50ec44aa75d9b5d37ff73786121a65` · `Radio Group Horizontal` `efb5ed6274d0a61c3729a7426be7e343161eb978` | Size(**Medium**/Small) · **Options(2–7, default 2)** · State(**Default**/Error/Read-only/Disabled) | `Label`+`Description` per element (gjentatt) | Antall-akse. Ingen gruppe-akse for forhåndsvalgt |
| Switch | `Switch` `ecb55bd1d9dc008d46a64d73e39f33df835cf5e5` | Size(**Medium**/Small) · Position(Right/**Left**) · State(**Default**/Hover/Read-only/Disabled) · Checked(**False**/True) · Loading(**False**/True) · Label(**True**/False) | `Label`, `Description` | `Checked=True` for på-tilstand |
| Combobox | `Combobox__Dropdown` `d7ddf3c2103c96a7a0756576e54e9345edfcf367` | Size(**Medium**/Small) · Variant(NewValue/**Default**/MaxSelected) | `text`, `value`, `label`×N | Til >7 alternativer / flervalg |
| Chips | `ToggleChip` `1e56b247b6f97626a16babe4e9c772b6ca649d47` | Variant(**Neutral**/Accent) · Size(**Medium**/Small) · State(**Default**/Hover) · Selected(**False**/True) · hasCheck(**True**/False) | `Label` | Filtrering. `Selected=True` for aktivt filter |
| ToggleGroup | `ToggleGroup` `412465b2b3caaa705d133ecc7bfe7ec14d0c2095` | **Amount(2–5, default 2)** · Size(Small/**Medium**/XSmall) · Variant(**Neutral**/Accent) | `Label`×N | Antall-akse `Amount` |
| CopyButton | `CopyButton` `efe9bd1c76e9060e51d7cb409a5bc0ad9be4075d` | Size(**Medium**/Small/XSmall) · Variant(**Neutral text**/Neutral link/Accent text/Accent link) · Icon(**Icon left**/Icon right/Icon only) · State(**Default**/Hover) · Interaction · Tooltip | `label` | |
| FormProgress | `FormProgress` `09c3f76750b876883d302d70429a8df41c2efde7` | State(**Default**/Hover) · Open(**False**/True) | `Steg`, `333`, `av`, `999`, `label` | Søknadssteg — **bruk denne, ikke Stepper**. `333`=gjeldende steg, `999`=totalt. Steg er tekstnoder, ikke akse |
| FileUpload | `FileUpload-ItemList` `da7dfbe17329c3262d786c69f1e5a7a8f4721822` `(component)` | _ingen akser_ | `Label`, `Text`+`Details` per fil (gjentatt) | Liste over opplastede filer. Ett `Text`/`Details`-par per fil |

> **Antall-akser oppsummert (skjema):** Checkbox/Radio `Options` 2–7, ToggleGroup `Amount` 2–5. Default alltid laveste (2).

## Tilbakemelding og status

| Komponent | Figma-navn · key | Variant-akser (**default**) | Tekstnoder | Merknad |
|---|---|---|---|---|
| LocalAlert | `LocalAlert` `371252a7c82249b947473c344b5ad4342b6a6aae` | Variant(**Error**/Announcement/Warning/Success) · Size(**Medium**/Small) | `Heading`, `paragraph` | **Default=Error** — sett Variant bevisst. `Announcement`=nøytral info (ingen `Info`-variant) |
| Tag | `Tag` `247551580c347876a47506679823a7eaf5c74174` | Size(**Medium**/Small/Xsmall) · Color(**Neutral**/Info/Success/Danger/Warning/Meta 1/Meta 2/Brand Magenta/Brand Beige) · Variant(**Outline**/Moderate/Strong) | `tag label` | Status-merkelapp. `Xsmall` (liten x) |
| InfoCard | `InfoCard` `eae0533f8be3249959cdf7c986194f7ed28035cc` | Type(**Info**/Tips/Do this/Avoid this/Attention/Summary/Success/Links/Message) · Size(**Medium**/Small) | `Heading`, `paragraph` | Fremhever innhold (ikke varsel — bruk LocalAlert) |
| Pagination | `Pagination` `3e06ca84fd219676ad6eb373e0d75ab40e4a1501` | Size(**Medium**/Small/XSmall) · Button text(Off/**On**) | `label`×N | |

## Layout og innholdsgruppering

| Komponent | Figma-navn · key | Variant-akser (**default**) | Tekstnoder | Merknad |
|---|---|---|---|---|
| Accordion | `Accordion` `58f77555191eab99934a953ab57b12ecf75d465c` | **Items(02–14, default 02)** | `Title`+`Slot`+`Erstatt med eget innhold…` per element | Antall-akse. **Slot + placeholder er synlige** — skjul/erstatt dem (`.visible=false`) og legg eget innhold. Title bruker `Source Sans Pro Bold` |

## Overlegg (modaler, menyer)

| Komponent | Figma-navn · key | Variant-akser (**default**) | Tekstnoder | Merknad |
|---|---|---|---|---|
| Modal | `Modal` `3c1cfe10c8bdf94b10d9e8f8da05da8353a0451c` | Size(**Medium**/Small) · Fixed height(True/**False**) | `Eyebrow heading`, `Title`, `Text`, `Slot`, `Erstatt med eget innhold…`, `label`×3 | **Slot + placeholder synlige** — skjul/erstatt. `Eyebrow heading` ofte skjult. `label`×3 = knappetekster i footer |

## Navigasjon

| Komponent | Figma-navn · key | Variant-akser (**default**) | Tekstnoder | Merknad |
|---|---|---|---|---|
| Tabs | `Tabs` `4b0cda7109804b82b81799a5e193951e90c75c09` | **Number of(2–5, default 2)** · Size(**Medium**/Small) | `label`×N | Antall-akse `Number of` |

## Data og tabeller

| Komponent | Figma-navn · key | Variant-akser (**default**) | Tekstnoder | Merknad |
|---|---|---|---|---|
| Table | `Table row` `be74483645b989a166d7d6783c09d5f13c111e01` · `Table cell` `77d47ecf3bd48d90aeabd0cc7342a0a3b34ae770` | **row:** Variant(**Body**/Header) · Zebra · State · Selectable · Expandable. **cell:** Variant(**Body**/Header) · Size(Small/Medium/**Large**) · Interactive · State | `Content` (per celle) | **Ingen samlet Table-komponent** — komponer fra `Table row` (default 7 celler, `Content`) + `Table cell`. Sett `Variant=Header` for overskriftsrad |

## Dekning

Tier «skjema», «status/feedback» (delvis), «layout» (Accordion), «overlay» (Modal), «nav» (Tabs), «data» (Table) er uttrukket. Gjenstår bl.a.: DatePicker/MonthPicker, Search, ErrorSummary, HelpText, FormSummary, GlobalAlert, Loader, Tooltip, ProgressBar, Skeleton, ExpansionCard, GuidePanel, ReadMore, List, InternalHeader, Link, Stepper, Timeline, Dropdown/ActionMenu/Popover. Oppdateres etter hvert som tiers preflightes.
