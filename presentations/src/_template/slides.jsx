/**
 * slides.jsx — Template-slides for hovmester-presentasjoner.
 *
 * Demonstrerer tilgjengelige slide-layouts, design tokens og
 * utility-klasser som nye decks kan gjenbruke.
 *
 * Authoring-format: JSX kompilert med esbuild til ren JS.
 * Runtime: DeckStage.mount() fra _shared/deck-stage.js.
 */

import { h, Fragment } from './jsx-runtime.js';

// ---------------------------------------------------------------------------
// Gjenbrukbare slide-komponenter
// ---------------------------------------------------------------------------

/** Dekorativ grid-bakgrunn for visuell dybde. */
function GridOverlay() {
  return <div className="hm-grid-overlay" aria-hidden="true" />;
}

/** Dekorativ linje-aksent. */
function AccentRule({ width = '120px', align = 'left' }) {
  const style = { width };
  if (align === 'center') {
    style.marginLeft = 'auto';
    style.marginRight = 'auto';
  }
  return <div className="hm-accent-rule" style={style} aria-hidden="true" />;
}

/** Statusindikator — lysende prikk med label. */
function StatusDot({ label, variant = 'active' }) {
  return (
    <span className={`hm-status-dot hm-status-dot--${variant}`}>
      <span className="hm-status-dot__pip" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

/** Monospace-etikett for kode/teknisk kontekst. */
function MonoTag({ children }) {
  return <code className="hm-mono-tag">{children}</code>;
}

// ---------------------------------------------------------------------------
// Slide-definisjoner
// ---------------------------------------------------------------------------

const slides = [
  // --- 1. Tittelslide ---
  {
    id: 'tittel',
    render(container) {
      container.appendChild(
        <div className="slide slide--title">
          <GridOverlay />
          <div className="slide__content slide__content--centered">
            <div className="hm-badge">
              <StatusDot label="hovmester" variant="active" />
            </div>
            <h1 className="hm-heading-xl">
              Presentasjonstittel
            </h1>
            <p className="hm-subtitle">
              Undertittel som beskriver presentasjonen
            </p>
            <AccentRule width="180px" align="center" />
            <p className="hm-meta">
              <MonoTag>team · dato · kontekst</MonoTag>
            </p>
          </div>
        </div>
      );
    },
  },

  // --- 2. Seksjonsskille ---
  {
    id: 'seksjon',
    render(container) {
      container.appendChild(
        <div className="slide slide--section">
          <GridOverlay />
          <div className="slide__content slide__content--centered">
            <p className="hm-overline">Del 01</p>
            <h2 className="hm-heading-lg">Seksjonsoverskrift</h2>
            <AccentRule width="100px" align="center" />
            <p className="hm-body hm-text-muted hm-mt-sm" style={{ maxWidth: '720px', textAlign: 'center' }}>
              Kort beskrivelse av hva denne seksjonen handler om.
              Brukes til å dele opp presentasjonen i logiske deler.
            </p>
          </div>
        </div>
      );
    },
  },

  // --- 3. Innholdsslide ---
  {
    id: 'innhold',
    render(container) {
      container.appendChild(
        <div className="slide slide--content">
          <div className="slide__content slide__content--padded">
            <p className="hm-overline">Innholdsslide</p>
            <h2 className="hm-heading-md hm-mb-sm">Punktliste med visuell hierarki</h2>
            <AccentRule width="80px" />
            <ul className="hm-list hm-mt-md" role="list">
              <li>
                <strong>Høy kontrast</strong> — stor tekst lesbar på avstand,
                ingen kritisk informasjon kun via farge
              </li>
              <li>
                <strong>Tastaturnavigasjon</strong> — piltaster, Home/End og R
                for å styre presentasjonen
              </li>
              <li>
                <strong>Design tokens</strong> — farger, spacing og typografi
                via CSS custom properties
              </li>
              <li>
                <strong>Gjenbrukbare layouts</strong> — tittel, seksjon, innhold,
                todelt og kode
              </li>
            </ul>
          </div>
        </div>
      );
    },
  },

  // --- 4. Todelt slide ---
  {
    id: 'todelt',
    render(container) {
      container.appendChild(
        <div className="slide slide--split">
          <div className="slide__left">
            <div className="slide__content slide__content--padded">
              <p className="hm-overline">Venstre kolonne</p>
              <h2 className="hm-heading-md hm-mb-sm">Todelt layout</h2>
              <AccentRule width="80px" />
              <p className="hm-body hm-mt-md">
                Venstre side har tekst og kontekst.
                Høyre side viser visuelt innhold, diagram eller kode.
              </p>
              <p className="hm-body hm-mt-sm hm-text-muted">
                Forholdet er omtrent 50/50, men kan tilpasses
                med utility-klasser.
              </p>
            </div>
          </div>
          <div className="slide__right">
            <div className="hm-visual-block">
              <div className="hm-visual-block__header">
                <StatusDot label="system.status" variant="active" />
              </div>
              <pre className="hm-code-block"><code>{`{
  "runtime": "deck-stage",
  "format": "jsx → esbuild → js",
  "canvas": "1920 × 1080",
  "skalering": "auto"
}`}</code></pre>
            </div>
          </div>
        </div>
      );
    },
  },

  // --- 5. Kodeslide ---
  {
    id: 'kode',
    render(container) {
      container.appendChild(
        <div className="slide slide--code">
          <div className="slide__content slide__content--padded">
            <div className="hm-code-header">
              <MonoTag>slides.jsx</MonoTag>
              <StatusDot label="eksempel" variant="info" />
            </div>
            <pre className="hm-code-block hm-code-block--full"><code>{`// Definer slides med JSX — kompileres til DOM-elementer
const slides = [
  {
    id: 'min-slide',
    render(container) {
      container.appendChild(
        <div className="slide slide--content">
          <h2 className="hm-heading-md">Overskrift</h2>
          <p className="hm-body">Innhold her.</p>
        </div>
      );
    },
  },
];

// Monter med DeckStage-runtime
DeckStage.mount({ slides });`}</code></pre>
          </div>
        </div>
      );
    },
  },

  // --- 6. Avslutningsslide ---
  {
    id: 'avslutning',
    render(container) {
      container.appendChild(
        <div className="slide slide--title">
          <GridOverlay />
          <div className="slide__content slide__content--centered">
            <h2 className="hm-heading-lg">Takk</h2>
            <AccentRule width="120px" align="center" />
            <p className="hm-body hm-text-muted hm-mt-sm">
              Spørsmål og diskusjon
            </p>
            <p className="hm-meta hm-mt-md">
              <MonoTag>navikt/hovmester</MonoTag>
            </p>
          </div>
        </div>
      );
    },
  },
];

// ---------------------------------------------------------------------------
// Montering
// ---------------------------------------------------------------------------

DeckStage.mount({ slides });
