/**
 * canvas.js — Oppretter og skalerer 16:9-presentasjonscanvas.
 *
 * Referansestørrelse: 1920×1080.
 * Canvas skaleres med CSS transform for å fylle viewport uten å endre innholdslayout.
 */

const REF_W = 1920;
const REF_H = 1080;

/**
 * Sett inn viewport-wrapper og canvas i container.
 * Returnerer referanser til nøkkelelementer.
 */
export function createCanvas(container) {
  // Viewport — fyller hele skjermen, sentrerer canvas
  const viewport = document.createElement('div');
  viewport.className = 'ds-viewport';
  // role="application" gir fullstendig tastaturkontroll til applikasjonen.
  // Nødvendig her fordi piltaster brukes til slide-navigasjon og ikke bør
  // fanges av skjermleserens virtuelle modus. Uten denne rollen vil mange
  // skjermlesere (NVDA/JAWS) konsumere piltastene til eget bruk.
  viewport.setAttribute('role', 'application');
  viewport.setAttribute('aria-roledescription', 'presentasjon');
  viewport.setAttribute('aria-label', 'Presentasjon — bruk piltaster for å navigere');

  // Canvas — fast 1920×1080, skaleres via transform
  const canvas = document.createElement('div');
  canvas.className = 'ds-canvas';

  // Slide-container — her rendres innholdet
  const slideContainer = document.createElement('div');
  slideContainer.className = 'ds-slide';
  slideContainer.setAttribute('role', 'group');
  slideContainer.setAttribute('aria-roledescription', 'slide');
  // aria-live fjernet herfra — counter alene annonserer slidebytte
  // for å unngå doble skjermleserannonseringer.

  // Slideteller (visuell + skjermleser)
  const counter = document.createElement('div');
  counter.className = 'ds-counter';
  counter.setAttribute('aria-live', 'polite');
  counter.setAttribute('aria-atomic', 'true');

  canvas.appendChild(slideContainer);
  canvas.appendChild(counter);
  viewport.appendChild(canvas);
  container.appendChild(viewport);

  // Injiser baseline-stiler
  injectStyles();

  // Skalér ved lasting og resize
  const scale = () => scaleCanvas(viewport, canvas);
  scale();
  window.addEventListener('resize', scale);

  return { viewport, canvas, slideContainer, counter };
}

function scaleCanvas(viewport, canvas) {
  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;
  if (vw === 0 || vh === 0) return;

  const scaleX = vw / REF_W;
  const scaleY = vh / REF_H;
  const s = Math.min(scaleX, scaleY);

  canvas.style.transform = `scale(${s})`;
  canvas.style.transformOrigin = 'center center';
}

function injectStyles() {
  if (document.getElementById('ds-base-styles')) return;

  const style = document.createElement('style');
  style.id = 'ds-base-styles';
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      width: 100%; height: 100%;
      overflow: hidden;
      background: #0a0a0a;
      color: #f0f0f0;
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    }

    .ds-viewport {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background: #000;
      cursor: default;
    }

    .ds-canvas {
      width: ${REF_W}px;
      height: ${REF_H}px;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
    }

    .ds-slide {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .ds-counter {
      position: absolute;
      bottom: 24px;
      right: 36px;
      font-size: 18px;
      font-variant-numeric: tabular-nums;
      opacity: 0.35;
      pointer-events: none;
      font-family: "IBM Plex Mono", "SF Mono", Consolas, monospace;
      letter-spacing: 0.04em;
    }

    .ds-error {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px;
      background: #1a0000;
      color: #ff6b6b;
      text-align: center;
    }

    .ds-error h2 {
      font-size: 36px;
      margin-bottom: 24px;
      font-weight: 600;
    }

    .ds-error pre {
      font-size: 20px;
      font-family: "IBM Plex Mono", "SF Mono", Consolas, monospace;
      white-space: pre-wrap;
      word-break: break-word;
      max-width: 1400px;
      line-height: 1.5;
      opacity: 0.85;
    }

    @media print {
      .ds-viewport { position: static; }
      .ds-canvas { transform: none !important; page-break-after: always; }
      .ds-counter { display: none; }
    }
  `;
  document.head.appendChild(style);
}
