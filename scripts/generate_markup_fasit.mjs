/**
 * Aksel markup-fasit generator.
 *
 * Renders every active Aksel component via @navikt/ds-react + react-dom/server
 * to EXACT static HTML, then writes a reference the Visual Companion agent uses
 * to author authentic Aksel markup (instead of .mock-* approximations).
 *
 * The generated HTML is ds-react's own output, so it is guaranteed correct and
 * renders authentically with @navikt/ds-css loaded. Regenerate on Aksel upgrades:
 *   node scripts/generate_markup_fasit.mjs
 *
 * Output: dist/skills/prototype/references/aksel-markup-fasit.md
 * (the .github mirror is produced by the normal sync step).
 */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { format } from "node:util";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as ds from "@navikt/ds-react";

const h = React.createElement;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(
  __dirname,
  "..",
  "dist/skills/prototype/references/aksel-markup-fasit.md",
);

// Pretty-print the rendered HTML with light indentation for readability.
function pretty(html) {
  let depth = 0;
  const voidEls = new Set([
    "input",
    "br",
    "hr",
    "img",
    "source",
    "path",
    "use",
    "meta",
    "link",
  ]);
  return html
    .replace(/>\s*</g, ">\n<")
    .split("\n")
    .map((line) => {
      const isClose = /^<\//.test(line);
      const tagMatch = line.match(/^<\/?([a-zA-Z0-9-]+)/);
      const tag = tagMatch ? tagMatch[1] : "";
      const selfClose = /\/>$/.test(line) || voidEls.has(tag);
      const opensAndCloses = /^<[^>]+>.*<\/[^>]+>$/.test(line);
      if (isClose) depth = Math.max(0, depth - 1);
      const indent = "  ".repeat(depth);
      const out = indent + line;
      if (!isClose && !selfClose && !opensAndCloses && /^<[a-zA-Z]/.test(line))
        depth += 1;
      return out;
    })
    .join("\n");
}

const errors = [];
function render(name, el) {
  try {
    return pretty(renderToStaticMarkup(el));
  } catch (err) {
    errors.push(`${name}: ${err.message}`);
    return `<!-- KUNNE IKKE RENDRES: ${err.message} -->`;
  }
}

const {
  Accordion,
  BodyLong,
  BodyShort,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Chips,
  ConfirmationPanel,
  CopyButton,
  Detail,
  ErrorSummary,
  ExpansionCard,
  Fieldset,
  FileUpload,
  FormProgress,
  FormSummary,
  GlobalAlert,
  GuidePanel,
  Heading,
  HelpText,
  InfoCard,
  Ingress,
  InlineMessage,
  InternalHeader,
  Label,
  Link,
  LinkCard,
  List,
  Loader,
  LocalAlert,
  Modal,
  Pagination,
  ProgressBar,
  Radio,
  RadioGroup,
  ReadMore,
  Search,
  Select,
  Skeleton,
  Stepper,
  Switch,
  Table,
  Tabs,
  Tag,
  TextField,
  Textarea,
  Timeline,
  ToggleGroup,
  Tooltip,
  UNSAFE_Combobox: Combobox,
} = ds;

// Each entry: [group, name, note, element]. Order mirrors the Figma catalog.
const entries = [
  // --- Skjema og input ---
  [
    "Skjema og input",
    "Button",
    "variant: primary | secondary | tertiary | danger. size: medium | small | xsmall. Primær er blå (accent) via rot-konteksten.",
    h(
      "div",
      { style: { display: "flex", gap: "12px" } },
      h(Button, { variant: "primary" }, "Lagre"),
      h(Button, { variant: "secondary" }, "Avbryt"),
      h(Button, { variant: "tertiary" }, "Tilbake"),
      h(Button, { variant: "danger" }, "Slett"),
    ),
  ],
  [
    "Skjema og input",
    "TextField",
    "Bytt label/description. error-prop gir rød ramme + feilmelding.",
    h(TextField, {
      label: "Fornavn",
      description: "Slik det står i passet ditt",
    }),
  ],
  [
    "Skjema og input",
    "Textarea",
    "Flerlinjet fritekst. maxLength gir teller.",
    h(Textarea, { label: "Begrunnelse", description: "Maks 200 tegn" }),
  ],
  [
    "Skjema og input",
    "Select",
    "Nedtrekksvalg for korte lister.",
    h(
      Select,
      { label: "Land" },
      h("option", { value: "no" }, "Norge"),
      h("option", { value: "se" }, "Sverige"),
    ),
  ],
  [
    "Skjema og input",
    "Search",
    "Fritekstsøk (ikke verdivalg → bruk Combobox).",
    h(Search, { label: "Søk", variant: "primary" }),
  ],
  [
    "Skjema og input",
    "Checkbox / CheckboxGroup",
    "Grupper alltid i CheckboxGroup med legend.",
    h(
      CheckboxGroup,
      { legend: "Hvilke ytelser søker du om?" },
      h(Checkbox, { value: "dp" }, "Dagpenger"),
      h(Checkbox, { value: "aap" }, "Arbeidsavklaringspenger"),
    ),
  ],
  [
    "Skjema og input",
    "Radio / RadioGroup",
    "Ett valg av flere gjensidig utelukkende.",
    h(
      RadioGroup,
      { legend: "Er du norsk statsborger?" },
      h(Radio, { value: "ja" }, "Ja"),
      h(Radio, { value: "nei" }, "Nei"),
    ),
  ],
  [
    "Skjema og input",
    "Switch",
    "På/av-bryter for innstillinger.",
    h(Switch, null, "Få varsler på SMS"),
  ],
  [
    "Skjema og input",
    "Combobox",
    "Søkbar liste / flervalg for >7 alternativer.",
    h(Combobox, {
      label: "Velg kommune",
      options: ["Oslo", "Bergen", "Trondheim"],
    }),
  ],
  [
    "Skjema og input",
    "Chips (Toggle)",
    "Filtrering. selected markerer aktivt valg.",
    h(
      Chips,
      null,
      h(Chips.Toggle, { selected: true }, "Åpne"),
      h(Chips.Toggle, null, "Under behandling"),
      h(Chips.Toggle, null, "Avsluttet"),
    ),
  ],
  [
    "Skjema og input",
    "ToggleGroup",
    "Segmentert valg, fast antall.",
    h(
      ToggleGroup,
      { defaultValue: "uke", label: "Vis per" },
      h(ToggleGroup.Item, { value: "uke" }, "Uke"),
      h(ToggleGroup.Item, { value: "maned" }, "Måned"),
    ),
  ],
  [
    "Skjema og input",
    "CopyButton",
    "Kopierer tekst til utklippstavle.",
    h(CopyButton, { copyText: "12345678901", text: "Kopier fødselsnummer" }),
  ],
  [
    "Skjema og input",
    "ConfirmationPanel",
    "Bekreftelse/samtykke før innsending.",
    h(
      ConfirmationPanel,
      { label: "Jeg bekrefter at opplysningene er riktige" },
      "Du er ansvarlig for at svarene stemmer.",
    ),
  ],
  [
    "Skjema og input",
    "Fieldset",
    "Grupperer relaterte felt med felles legend.",
    h(
      Fieldset,
      { legend: "Kontaktinformasjon" },
      h(TextField, { label: "E-post" }),
      h(TextField, { label: "Telefon" }),
    ),
  ],
  [
    "Skjema og input",
    "FormProgress",
    "Søknadssteg — bruk denne, IKKE Stepper for søknadsflyt.",
    h(
      FormProgress,
      { activeStep: 2, totalSteps: 4 },
      h(FormProgress.Step, { href: "#1" }, "Om deg"),
      h(FormProgress.Step, { href: "#2" }, "Inntekt"),
      h(FormProgress.Step, { href: "#3" }, "Vedlegg"),
      h(FormProgress.Step, { href: "#4" }, "Oppsummering"),
    ),
  ],
  [
    "Skjema og input",
    "FileUpload",
    "Opplasting + liste over filer.",
    h(FileUpload.Item, { file: { name: "vedlegg.pdf", size: 24000 } }),
  ],
  [
    "Skjema og input",
    "ErrorSummary",
    "Samlet valideringsoversikt med lenker til felt.",
    h(
      ErrorSummary,
      { heading: "Du må rette opp følgende:" },
      h(ErrorSummary.Item, { href: "#fnr" }, "Fødselsnummer mangler"),
      h(ErrorSummary.Item, { href: "#epost" }, "E-post er ugyldig"),
    ),
  ],
  [
    "Skjema og input",
    "FormSummary",
    "Oppsummering av svar før innsending. (Dette er komponenten som startet fidelity-arbeidet.)",
    h(
      FormSummary,
      null,
      h(
        FormSummary.Header,
        null,
        h(FormSummary.Heading, { level: "2" }, "Dine svar"),
      ),
      h(
        FormSummary.Answers,
        null,
        h(
          FormSummary.Answer,
          null,
          h(FormSummary.Label, null, "Navn"),
          h(FormSummary.Value, null, "Kari Nordmann"),
        ),
        h(
          FormSummary.Answer,
          null,
          h(FormSummary.Label, null, "Fødselsnummer"),
          h(FormSummary.Value, null, "01010012345"),
        ),
      ),
    ),
  ],
  [
    "Skjema og input",
    "HelpText",
    "Hjelpetekst i popover (trigger vises; innhold er interaktivt).",
    h(HelpText, { title: "Hva betyr dette?" }, "Vi bruker dette til å beregne ytelsen."),
  ],

  // --- Tilbakemelding og status ---
  // MERK: `Alert` (@navikt/ds-react) er deprecated. Bruk LocalAlert (lokalt
  // varsel) eller GlobalAlert (hele løsningen). Begge bruker `status`
  // (announcement | success | warning | error) — det finnes INGEN "info";
  // `announcement` er det nøytrale/informative varselet.
  [
    "Tilbakemelding og status",
    "LocalAlert",
    "Lokalt varsel nær en hendelse. status: announcement | success | warning | error (ingen 'info' — announcement = nøytral/info). Erstatter deprecated Alert. Komponer med .Header/.Title/.Content.",
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "12px" } },
      ...[
        ["announcement", "Vi har mottatt søknaden din", "Du hører fra oss innen tre uker."],
        ["success", "Søknaden er sendt", "Du kan logge inn for å se status."],
        ["warning", "Fristen nærmer seg", "Du har tre dager igjen på å svare."],
        ["error", "Noe gikk galt", "Vi kunne ikke lagre svaret. Prøv igjen."],
      ].map(([status, title, body]) =>
        h(
          LocalAlert,
          { status, key: status },
          h(LocalAlert.Header, null, h(LocalAlert.Title, null, title)),
          h(LocalAlert.Content, null, body),
        ),
      ),
    ),
  ],
  [
    "Tilbakemelding og status",
    "GlobalAlert",
    "Varsel for hele løsningen — full bredde, øverst. status: announcement | success | warning | error. Komponer med .Header/.Title/.Content.",
    h(
      GlobalAlert,
      { status: "announcement" },
      h(GlobalAlert.Header, null, h(GlobalAlert.Title, { as: "h2" }, "Planlagt vedlikehold")),
      h(GlobalAlert.Content, null, "Tjenesten er nede lørdag kl. 02–04. Søknader lagres som kladd."),
    ),
  ],
  [
    "Tilbakemelding og status",
    "InlineMessage",
    "Kort statusmelding i kontekst. Har Info-variant.",
    h(InlineMessage, { variant: "info" }, "Lagret automatisk"),
  ],
  [
    "Tilbakemelding og status",
    "Tag",
    "Status-merkelapp. variant: neutral | info | success | warning | error + variant outline/moderate/strong.",
    h(
      "div",
      { style: { display: "flex", gap: "8px" } },
      h(Tag, { variant: "success" }, "Innvilget"),
      h(Tag, { variant: "warning" }, "Under behandling"),
      h(Tag, { variant: "error" }, "Avslått"),
    ),
  ],
  [
    "Tilbakemelding og status",
    "InfoCard",
    "Fremhever innhold (ikke varsel).",
    h(InfoCard, null, h(InfoCard.Content, null, "Du kan endre svarene fram til fristen.")),
  ],
  [
    "Tilbakemelding og status",
    "ProgressBar",
    "Kjent varighet/progresjon. Søknad → FormProgress.",
    h(ProgressBar, { value: 60, "aria-label": "60% fullført" }),
  ],
  [
    "Tilbakemelding og status",
    "Loader",
    "Ubestemt lasting >1s.",
    h(Loader, { size: "large", title: "Laster" }),
  ],
  [
    "Tilbakemelding og status",
    "Skeleton",
    "Plassholder mens innhold lastes.",
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "8px" } },
      h(Skeleton, { variant: "text", width: "60%" }),
      h(Skeleton, { variant: "rectangle", height: 80 }),
    ),
  ],
  [
    "Tilbakemelding og status",
    "Tooltip",
    "Hint ved hover/fokus (trigger vises; tooltip er interaktiv).",
    h(Tooltip, { content: "Logg ut" }, h(Button, { variant: "tertiary" }, "Meny")),
  ],
  [
    "Tilbakemelding og status",
    "Pagination",
    "Sidenavigasjon for lange lister.",
    h(Pagination, { page: 2, count: 8, "aria-label": "Sidenavigasjon" }),
  ],

  // --- Layout og innholdsgruppering ---
  [
    "Layout og innholdsgruppering",
    "Accordion",
    "Sammenleggbare seksjoner. defaultOpen på første.",
    h(
      Accordion,
      null,
      h(
        Accordion.Item,
        { defaultOpen: true },
        h(Accordion.Header, null, "Hva er dagpenger?"),
        h(Accordion.Content, null, "Dagpenger er en ytelse hvis du er arbeidsledig."),
      ),
      h(
        Accordion.Item,
        null,
        h(Accordion.Header, null, "Hvem kan få?"),
        h(Accordion.Content, null, "Du må være registrert som arbeidssøker."),
      ),
    ),
  ],
  [
    "Layout og innholdsgruppering",
    "ExpansionCard",
    "Utvidbart kort med tittel + beskrivelse.",
    h(
      ExpansionCard,
      { "aria-label": "Om søknaden" },
      h(
        ExpansionCard.Header,
        null,
        h(ExpansionCard.Title, null, "Om søknaden"),
        h(ExpansionCard.Description, null, "Les mer om hva du må fylle ut."),
      ),
      h(ExpansionCard.Content, null, "Detaljert innhold her."),
    ),
  ],
  [
    "Layout og innholdsgruppering",
    "ReadMore",
    "Forklare begreper inline.",
    h(ReadMore, { header: "Hva betyr inntektsgrunnlag?" }, "Inntektsgrunnlaget er ..."),
  ],
  [
    "Layout og innholdsgruppering",
    "GuidePanel",
    "Vennlig intro/veiledning øverst på side.",
    h(GuidePanel, null, "Her søker du om dagpenger. Det tar ca. 10 minutter."),
  ],
  [
    "Layout og innholdsgruppering",
    "LinkCard",
    "Fremhevet lenke med kontekst.",
    h(
      LinkCard,
      null,
      h(LinkCard.Title, null, h(LinkCard.Anchor, { href: "#" }, "Søk om dagpenger")),
      h(LinkCard.Description, null, "Start en ny søknad."),
    ),
  ],
  [
    "Layout og innholdsgruppering",
    "Box",
    "Layout-primitiv med bakgrunn/ramme/padding via tokens.",
    h(
      Box,
      { background: "surface-subtle", padding: "6", borderRadius: "large" },
      h(BodyShort, null, "Innhold i en Box."),
    ),
  ],

  // --- Overlegg ---
  [
    "Overlegg (modaler, popovere)",
    "Modal",
    "Dialog over innholdet. open vises her; i VC vis åpen tilstand inline.",
    h(
      Modal,
      { open: true, header: { heading: "Bekreft innsending" }, "aria-label": "Bekreft" },
      h(Modal.Body, null, h(BodyLong, null, "Vil du sende søknaden nå?")),
      h(
        Modal.Footer,
        null,
        h(Button, { variant: "primary" }, "Send"),
        h(Button, { variant: "secondary" }, "Avbryt"),
      ),
    ),
  ],

  // --- Navigasjon ---
  [
    "Navigasjon",
    "Tabs",
    "Faner. Fast antall.",
    h(
      Tabs,
      { defaultValue: "soknader" },
      h(
        Tabs.List,
        null,
        h(Tabs.Tab, { value: "soknader", label: "Søknader" }),
        h(Tabs.Tab, { value: "vedtak", label: "Vedtak" }),
      ),
      h(Tabs.Panel, { value: "soknader" }, "Dine søknader"),
    ),
  ],
  [
    "Navigasjon",
    "Link",
    "Navigasjon (ikke handling → Button).",
    h(Link, { href: "#" }, "Les mer om dagpenger"),
  ],
  [
    "Navigasjon",
    "Stepper",
    "Generell stegindikator. Søknad → bruk FormProgress.",
    h(
      Stepper,
      { activeStep: 2 },
      h(Stepper.Step, null, "Om deg"),
      h(Stepper.Step, null, "Inntekt"),
      h(Stepper.Step, null, "Oppsummering"),
    ),
  ],
  [
    "Navigasjon",
    "Timeline",
    "Tidslinje — kun interne flater, ikke mobil.",
    h(
      Timeline,
      null,
      h(
        Timeline.Row,
        { label: "Saksbehandling" },
        h(Timeline.Period, {
          start: new Date("2024-01-01"),
          end: new Date("2024-02-01"),
          status: "success",
        }),
      ),
    ),
  ],

  // --- Typografi ---
  [
    "Typografi",
    "Heading",
    "size: xlarge | large | medium | small | xsmall. level styrer h1–h6.",
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "8px" } },
      h(Heading, { size: "large", level: "1" }, "Sidetittel"),
      h(Heading, { size: "medium", level: "2" }, "Seksjonstittel"),
    ),
  ],
  [
    "Typografi",
    "BodyLong / BodyShort",
    "Brødtekst. BodyLong for avsnitt, BodyShort for korte linjer.",
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "8px" } },
      h(BodyLong, null, "Et lengre avsnitt med brødtekst som forklarer noe."),
      h(BodyShort, null, "Kort tekstlinje."),
    ),
  ],
  [
    "Typografi",
    "Ingress",
    "Ledetekst/ingress under tittel.",
    h(Ingress, null, "Her søker du om dagpenger hvis du er arbeidsledig."),
  ],
  [
    "Typografi",
    "Label",
    "Frittstående label/etikett.",
    h(Label, null, "Beløp"),
  ],
  [
    "Typografi",
    "Detail",
    "Liten metadata-tekst.",
    h(Detail, null, "Sist oppdatert 1. mars 2024"),
  ],
  [
    "Typografi",
    "List",
    "Punktliste eller nummerert liste.",
    h(
      List,
      { as: "ul", title: "Du trenger:" },
      h(List.Item, null, "Fødselsnummer"),
      h(List.Item, null, "Kontonummer"),
    ),
  ],

  // --- Data og tabeller ---
  [
    "Data og tabeller",
    "Table",
    "Tabell med header + rader. Bruk Zebra for lange tabeller.",
    h(
      Table,
      null,
      h(
        Table.Header,
        null,
        h(
          Table.Row,
          null,
          h(Table.HeaderCell, null, "Periode"),
          h(Table.HeaderCell, null, "Beløp"),
        ),
      ),
      h(
        Table.Body,
        null,
        h(
          Table.Row,
          null,
          h(Table.DataCell, null, "Januar 2024"),
          h(Table.DataCell, null, "12 340 kr"),
        ),
      ),
    ),
  ],

  // --- Dekoratør / interne flater ---
  [
    "Dekoratør og interne flater",
    "InternalHeader",
    "Header for interne Nav-flater.",
    h(
      InternalHeader,
      null,
      h(InternalHeader.Title, { href: "#" }, "Saksbehandling"),
      h(InternalHeader.User, { name: "Ola Saksbehandler" }),
    ),
  ],
];

// Build the markdown.
const groups = [];
for (const [group, name, note, el] of entries) {
  let g = groups.find((x) => x.group === group);
  if (!g) {
    g = { group, items: [] };
    groups.push(g);
  }
  g.items.push({ name, note, html: render(name, el) });
}

const themeWrapper = render(
  "ThemeRoot",
  h(ds.Theme, { theme: "light" }, h("span", null, "{{INNHOLD}}")),
).replace(/<span>[\s\S]*<\/span>/, "  {{INNHOLD}}");

let md = `# Aksel markup-fasit (ekte ds-react-output)

> **Generert** av \`scripts/generate_markup_fasit.mjs\` via \`@navikt/ds-react@8.12.0\` +
> \`react-dom/server\`. Hver kodeblokk er ds-reacts **egen** statiske HTML — garantert
> korrekt DOM som rendrer autentisk Aksel med \`@navikt/ds-css\` lastet. Ikke rediger
> for hånd; kjør generatoren på nytt ved Aksel-oppgradering.

Dette er Visual Companion-sidens **fasit**: bruk denne ekte \`.aksel-*\`-markupen i
VC-skissene i stedet for \`.mock-*\`-tilnærminger. Da rendrer skissen ekte Aksel —
riktige farger, fasonger, ikoner og struktur — uten React, build eller CDN.

## Slik bruker du fasiten

1. VC-siden MÅ ha rot-konteksten under (setter standard fargekontekst = \`accent\`, så
   primærknapper blir blå). \`@navikt/ds-css\` lastes via \`/aksel.css\` (allerede i
   frame-malen).
2. Lim inn komponentens markup fra tabellen under, bytt teksten til ditt innhold.
3. Komponenter som setter egen \`data-color\` (LocalAlert, GlobalAlert, Tag …)
   overstyrer rot-konteksten — det er meningen (nøstede fargekontekster).
4. Ikon-SVG-er er inkludert for eksakthet; bytt fritt til andre Aksel-ikoner.

### Rot-kontekst (wrap alt innhold i denne)

\`\`\`html
${themeWrapper}
\`\`\`

`;

for (const g of groups) {
  md += `## ${g.group}\n\n`;
  for (const it of g.items) {
    md += `### ${it.name}\n\n${it.note}\n\n\`\`\`html\n${it.html}\n\`\`\`\n\n`;
  }
}

md += `## Dekning og vedlikehold

Generert fra ${entries.length} representative komponent-eksempler som speiler
\`aksel-figma-katalog.md\`. Interaktive overlegg (Modal/Tooltip/HelpText/Combobox)
vises i åpen/statisk tilstand — i VC viser du dem inline. Komponenter som krever
hooks (DatePicker/MonthPicker) rendrer som et felt med kalenderknapp; selve
kalenderen er interaktiv og hører hjemme i Figma-katalogen eller en ds-react-prototype.

Regenerer ved Aksel-oppgradering: \`node scripts/generate_markup_fasit.mjs\`.
`;

fs.writeFileSync(outPath, md, "utf-8");
process.stdout.write(
  format(
    "Skrev %s (%d komponenter, %d grupper).\n",
    path.relative(path.join(__dirname, ".."), outPath),
    entries.length,
    groups.length,
  ),
);
if (errors.length) {
  process.stdout.write(`\nFEIL (${errors.length}):\n - ${errors.join("\n - ")}\n`);
  process.exitCode = 1;
}
