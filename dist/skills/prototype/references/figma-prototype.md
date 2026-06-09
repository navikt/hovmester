# Figma-prototype — Nav-spesifikk referanse

## Oppstart: Hent planKey

```
whoami → plans[0].key (typisk "organization::810213623608415105" for Nav)
```

Hvis flere plans: spør designeren hvilken organisasjon.

## Opprett fil

```
create_new_file(fileName: "<beskrivende navn>", planKey: "<key>", editorType: "design")
```

Spør designeren: "Vil du lagre i Drafts (standard) eller et spesifikt prosjekt?"
- Drafts: utelat projectId
- Prosjekt: be om URL eller prosjekt-ID, bruk `projectId`-parameteret

## Aksel-biblioteker i Nav-org

Automatisk tilgjengelige (auto-subscribed):
- **01 Aksel Tokens** — farger, spacing, typografi
- **02 Aksel Components** — alle UI-komponenter
- **03 Aksel Icons** — ikonbiblioteket

Bekreft med `get_libraries(fileKey)` etter filopprettelse.

## Søk og bruk komponenter

Se komponent-gate og demo-tekst-regler i `SKILL.md` — de gjelder alltid før søk.

```
search_design_system(query: "Button", fileKey: "<key>")
→ Returnerer component key, variants, props
```

Nyttige søk:
- `Button`, `TextField`, `Select`, `Checkbox`, `Radio`
- `Modal`, `Tabs`, `Accordion`, `Table`
- `LocalAlert`, `GlobalAlert`, `InlineMessage`, `InfoCard` (`Alert` er deprecated i kode — bruk Aksel-erstatningene selv om Alert finnes i Figma-biblioteket)
- `Heading`, `BodyLong`, `BodyShort`, `Label`

### Slik er Aksel-biblioteket faktisk strukturert (verifisert)

Søk gir ofte flere treff enn forventet. Disse fakta er bekreftet mot biblioteket og sparer deg for feil-runder:

- **Button er IKKE ett sett.** Det er separate sett per farge: `Button Accent`, `Button Neutral`, `Button Danger`. Hver har 72 varianter med fire akser: `Size`, `Variant` (`Primary`/`Secondary`/`Tertiary` — IKKE "Filled"), `State`, `Icon only`. Primær knapp = `Button Accent`, variant `Primary`.
- **Hopp over treff merket `🚨 OLD`, `[🚨Old]` eller `___Old_`.** Bruk alltid den nye komponenten med samme navn.
- **Det finnes ingen enkelt `Table`-komponent** (se egen Tabell-seksjon under).
- Tekst-primitives (`Heading`, `BodyLong`, `BodyShort`, `Label`) finnes som komponenter, men for skisser er det ofte enklere og mer stabilt å lage rene `figma.createText()`-noder med riktig font (se under).

### Varianter: default er nesten alltid feil for status/tilstand

`defaultVariant` er sjelden den du vil ha når skissen viser en bestemt **farge, status eller tilstand**. Verifiserte feller:

| Komponent | defaultVariant | Konsekvens hvis du bruker default |
|---|---|---|
| GlobalAlert / LocalAlert | `Variant=Error` (rød) | Et «vedlikehold»-varsel blir rødt feilvarsel |
| Tag | `Color=Neutral, Variant=Outline` | Statusfarge mangler (grå outline) |
| Checkbox | `Checked=False` | Avhuket checkbox vises tom |

**Velg variant eksplisitt** ut fra skissens semantikk. Bygg variantstrengen ved å starte fra `defaultVariant.name` og bytte ÉN akse — ikke skriv lange strenger for hånd (akser kan inneholde Unicode som `↳ Selected`):

```javascript
// ✅ Bytt én akse trygt, behold resten
const base = cs.defaultVariant.name;
const wanted = base.replace(/Variant=\w+/, "Variant=Warning");
const v = cs.children.find(c => c.name === wanted) || cs.defaultVariant;
const inst = v.createInstance();
```

Nav status → Tag-farge (Tag har 81 varianter — `Size × Color × Variant`):

| Status i skissen | `Color` | `Variant` |
|---|---|---|
| Under behandling / venter | `Warning` | `Moderate` |
| Innvilget / fullført | `Success` | `Moderate` |
| Avslått / feil | `Danger` | `Moderate` |
| Utkast / nøytral | `Neutral` | `Moderate` |

Gyldige `Color`-verdier: `Info, Neutral, Warning, Success, Danger, Meta 1, Meta 2, Brand Magenta, Brand Beige`.

### Endre farge/variant på en nestet komponent

I motsetning til tekst (se under) fungerer `setProperties` **bra** for variant-akser. Slik fargelegger du en nestet Tag (f.eks. inni en LinkCard, eller en frittstående Tag):

```javascript
const tag = card.findAllWithCriteria({ types: ["INSTANCE"] }).find(n => /tag/i.test(n.name));
tag.setProperties({ "Color": "Warning", "Variant": "Moderate" }); // ✅ variant-akser er stabile nøkler
```

## Preflight (ALLTID før bygging)

Kjør alltid en preflight-sjekk med EN instans av hver komponenttype du planlegger å bruke. Dette avdekker varianter, text-node-navn og font-krav. **Hopp aldri over dette** — det er den eneste pålitelige kilden til faktiske node-navn (som `"intput text"`) og default-varianter.

```javascript
// Preflight-mønster — kjør som FØRSTE use_figma-kall
const componentSet = await figma.importComponentSetByKeyAsync("COMPONENT_KEY");

// 1. Logg varianter OG default (default er ofte feil farge/tilstand)
const variantNames = componentSet.children.map(c => c.name);
const defaultName = componentSet.defaultVariant.name;

// 2. Opprett test-instans og logg tekstnoder + fonter
const testInstance = componentSet.defaultVariant.createInstance();
const textNodes = testInstance.findAllWithCriteria({ types: ["TEXT"] });
const nodeInfo = textNodes.map(n => ({ name: n.name, chars: n.characters, font: n.fontName }));

// 3. Returner data — bruk dette til å bygge skissen i neste kall
testInstance.remove();
return JSON.stringify({ variants: variantNames, default: defaultName, textNodes: nodeInfo });
```

Dette forhindrer feil-runder der du gjetter variant-navn, default-varianter, fonter eller tekst-node-navn.

## Plugin API-mønster for instansiering

```javascript
// Importer komponent-set og opprett instans
const componentSet = await figma.importComponentSetByKeyAsync("COMPONENT_KEY");

// Velg variant med eksakt navnematch (fra preflight-data)
const variant = componentSet.children.find(c => c.name === "Size=Medium, Variant=Primary");
const instance = (variant || componentSet.defaultVariant).createInstance();
frame.appendChild(instance);
```

### Korrekt tekst-overstyring i komponent-instanser

Aksel-komponentenes `componentProperties` har nøkler med instansspesifikke ID-suffiks (f.eks. `"Label Text#21497:30"`) som varierer mellom instanser. `setProperties()` fungerer derfor **ikke pålitelig** for tekstendringer.

**Anbefalt tilnærming:** Bruk `findOne` med **eksakt** `name`-match på direkte instansen. **Du MÅ kjenne det faktiske nodenavnet fra preflight** — gjettede navn gir ingen feilmelding, de bare lar placeholder-teksten stå igjen.

```javascript
// ✅ RIKTIG: Finn tekstnode med eksakt navn innenfor den spesifikke instansen
const labelNode = instance.findOne(n => n.type === "TEXT" && n.name === "Label");
if (labelNode) {
  await figma.loadFontAsync(labelNode.fontName);
  labelNode.characters = "Fastlegen til den ansatte";
}

// ✅ For TextField — input-noden heter "intput text" (ja, skrivefeil i Aksel!):
// Noder: "Label", "Description", "intput text"
const tfInput = textfieldInstance.findOne(n => n.type === "TEXT" && n.name === "intput text");

// ✅ For TextArea:
// Typiske nodenavn: "Label", "Description", "Text", "Value"
const taLabel = textareaInstance.findOne(n => n.type === "TEXT" && n.name === "Label");
const taDesc = textareaInstance.findOne(n => n.type === "TEXT" && n.name === "Description");

// ✅ For Button:
// Nodenavn er "label" (lowercase!)
const btnLabel = buttonInstance.findOne(n => n.type === "TEXT" && n.name === "label");

// ✅ For Checkbox:
// Nodenavn er "Label" (uppercase)
const cbLabel = checkboxInstance.findOne(n => n.type === "TEXT" && n.name === "Label");

// ✅ For GuidePanel — noder "heading" og "text" (lowercase), default har Star Wars-tekst
const gpHeading = guidePanelInstance.findOne(n => n.type === "TEXT" && n.name === "heading");
```

**Skjul/erstatt placeholder-tekst.** Mange Aksel-instanser leveres med synlig demo-tekst: TextField/TextArea har en `"Description"`-node, GuidePanel har Star Wars-tekst. Hvis skissen ikke har en beskrivelse, må du sette `.visible = false` på noden — ellers blir placeholder stående.

**Bruk `findAllWithCriteria` for robust traversering.** `findOne`/`findAll` med predikat kan kaste «Node not found» på ferske, komplekse instanser (se Gotchas). `findAllWithCriteria` er mer stabilt:

```javascript
// ✅ Mer stabilt enn findAll(n => n.type === "TEXT")
const texts = instance.findAllWithCriteria({ types: ["TEXT"] });
const label = texts.find(n => n.name === "Label");
```

**VIKTIG — bruk direkte children, IKKE findAll på parent:**

```javascript
// ❌ FEIL: findAll på frame går inn i nestede instanser
const instances = frame.findAll(n => n.type === "INSTANCE"); // Inkluderer sub-instanser!

// ✅ RIKTIG: Bruk direkte children
const instances = frame.children.filter(c => c.type === "INSTANCE");
```

**Feilsøkings-mønster** (bruk når tekst ikke endres):

```javascript
// Logg alle tekstnoder i en instans for å finne riktig navn
const textNodes = instance.findAll(n => n.type === "TEXT");
console.log(textNodes.map(n => ({ name: n.name, chars: n.characters, font: n.fontName })));
```

### Auto Layout-regler

```javascript
// counterAxisSizingMode godtar kun "FIXED" eller "AUTO" — ALDRI "FILL"
frame.counterAxisSizingMode = "FIXED"; // eller "AUTO"

// For å fylle bredden til parent, bruk layoutSizingHorizontal på child:
childFrame.layoutSizingHorizontal = "FILL";

// Unngå spacing-akkumulering — bruk ÉN flat auto-layout med itemSpacing
// Ikke nøst frames med padding + spacer-frames
mainFrame.itemSpacing = 24; // Mellom alle felt
// IKKE: itemSpacing + paddingTop på child + spacer-frame
```

## Gotchas

### Font (viktig — feil i tidligere versjon)
- **Aksel bruker `Source Sans 3`, ikke Inter.** Stilnavn er `"Regular"`, `"SemiBold"`, `"Bold"` (UTEN mellomrom). Noen eldre noder bruker `"Source Sans Pro"`.
- **Aldri hardkod fontnavn.** Les fonten fra noden og last den dynamisk — da treffer du alltid riktig familie/stil:
  ```javascript
  await figma.loadFontAsync(node.fontName); // ✅ bruk nodens egen font
  node.characters = "…";
  ```
- For nye `createText()`-noder: last `{ family: "Source Sans 3", style: "Regular" }` (eller `"SemiBold"`/`"Bold"`).

### Atferd i `use_figma` (kritisk for stabilitet)
- **Atomisk rollback:** ÉN kastet exception ruller tilbake HELE scriptet — ingen delvis lagring. En liten feil sent i et stort script sletter alt arbeidet. Pakk risikable kall i `try/catch` og returner en logg i stedet for å kaste.
- **Bygg inkrementelt:** kjør ett `use_figma`-kall per seksjon (header, så kort-rad, så tabell) i stedet for ett stort. Da overlever fullførte deler en senere feil.
- **Intermitterende traverserings-crash:** `findAll(predikat)` på en fersk, kompleks instans (f.eks. LinkCard) kan kaste «in get_name: Node not found», men funke ved nytt forsøk. Bruk `findAllWithCriteria({types:[...]})` og bygg inkrementelt.
- **Villedende timeout:** et kall kan returnere «Plugin execution failed due to internal timeout» selv om operasjonen faktisk committet. Ikke retry blindt — verifiser med `get_metadata`/`get_screenshot` først (operasjonene er ofte idempotente, blind retry kan duplisere).

### Øvrige
- Tekstendring krever font-loading: kall `loadFontAsync()` for alle fonter i noden *før* du endrer `.characters`
- Bruk `await figma.setCurrentPageAsync(page)` — IKKE `figma.currentPage = page`
- `setRelaunchData`, `getPluginData`/`setPluginData` er IKKE støttet her — bruk `getSharedPluginData`/`setSharedPluginData` ved behov
- `generate_figma_design` lager ny fil — bruk `use_figma` for å redigere eksisterende
- Aksel-biblioteker trenger ikke manuell subscription i Nav-org
- `counterAxisSizingMode` aksepterer bare `"FIXED"` eller `"AUTO"` — aldri `"FILL"`
- Logg alltid `componentSet.children.map(c => c.name)` FØR du velger variant
- `setProperties()` fungerer IKKE pålitelig for tekst (bruk `findOne`/`findAllWithCriteria`), men fungerer BRA for variant-akser (`Color`, `Variant`, `Size`)
- `layoutSizingHorizontal = "FILL"` kan kun settes ETTER at noden er appended til auto-layout parent
- `frame.children.filter(...)` for direkte barn — ALDRI `frame.findAll(...)` for instansvalg (inkluderer sub-instanser)
- Button text node heter `"label"` (lowercase), Checkbox heter `"Label"` (uppercase)

## Tabeller — det finnes ingen `Table`-komponent

Aksel har ingen samlet `Table`-komponent i Figma. Du komponerer fra `Table row`, `Table cell` og `Table row content`. Verifisert oppskrift:

- **`Table cell`** (sett): header-celle = variant `Variant=Header, Size=Large, Interactive=False, State=Default`; data-celle = default. Tekstnode heter `"Content"`.
- **`Table row`** har 7 tekstnoder som ALLE heter `"Content"` → `findOne(name=="Content")` treffer kun første. Default-rad er 1584px bred. Bruk heller `findAllWithCriteria({types:["TEXT"]})` og indekser, eller bygg raden selv av `Table cell`-instanser i en horisontal auto-layout.
- **Du kan ikke legge barn (Tag, Button, Link) inn i en `Table cell`-instans.** For en statuskolonne med Tag må du bygge en **custom celle-frame**. Match Aksel-cellens utseende: samme padding (16) og **kun bunnramme** (`strokeBottomWeight`), ikke full ramme — ellers får du en uønsket vertikal strek.
- Sett `layoutSizingHorizontal = "FILL"` på celler ETTER at de er lagt i radens auto-layout, så kolonnene fyller bredden.

```javascript
// Custom statuscelle som matcher Aksel-celle (kun bunnramme)
const cell = figma.createFrame();
cell.layoutMode = "HORIZONTAL";
cell.paddingTop = cell.paddingBottom = cell.paddingLeft = cell.paddingRight = 16;
cell.strokes = [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 } }];
cell.strokeBottomWeight = 1;
cell.strokeTopWeight = cell.strokeLeftWeight = cell.strokeRightWeight = 0; // ✅ unngå vertikal strek
row.appendChild(cell);
cell.appendChild(statusTag);
```

## Layout-oppbygging

Bygg alltid top-down:
1. Page → Frame (viewport-størrelse, f.eks. 1440×900 for desktop)
2. Frame → Auto Layout (vertikal/horisontal)
3. Sett spacing, padding, fills via Plugin API
4. Legg til komponenter fra Aksel-biblioteket

### Farger og tokens

**Aldri gjett RGB-verdier.** Bruk `search_design_system` eller `get_variable_defs` for å finne riktig fargeverdi:

```javascript
// Bruk variable-binding når mulig, ellers kjente verdier:
// Aksel info-soft = #E6F0FF → {r: 230/255, g: 240/255, b: 255/255}
// Aksel bg-default = #FFFFFF
// Aksel bg-subtle = #F7F7F7
```

Hvis du er usikker på en farge, slå opp tokenet i Aksel-biblioteket FØR du bygger.

### Labels og frame-navn

**Bruk kun frame-navn** — aldri lag separate tekst-labels over frames. Figma viser frame-navnene automatisk. Doble labels overlapper.

## Verifiseringssløyfe (OBLIGATORISK)

**Aldri lever uten visuell verifisering.** Etter bygging:

1. Ta screenshot: `get_screenshot(fileKey, nodeId)` av hovedframen
2. Sjekk visuelt:
   - Overlapper tekst eller elementer?
   - Er alle felter synlige (textarea, input, knapper)?
   - Er spacing proporsjonal og ikke akkumulert?
   - Matcher resultatet konseptet fra Visual Companion?
3. Fiks problemer funnet i steg 2
4. Ta nytt screenshot for å bekrefte
5. Lever til designeren

Typiske feil å fange:
- Tekstnoder som overlapper fordi auto-layout ikke er satt
- Textarea/input som kollapser til 0px høyde (mangler resize eller minHeight)
- Dobbel spacing fra nøstede frames med itemSpacing + padding
- Komponent-instanser som bruker default-tekst fordi setProperties feilet stille

## Lever

Returner alltid Figma-URL til designeren:
```
https://www.figma.com/design/<fileKey>/<fileName>
```
