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
  viewport.setAttribute('aria-roledescription', 'presentasjon');
  viewport.setAttribute('aria-label', 'Presentasjon — bruk piltaster for å navigere');
  // Beholder viewport fokusérbar for presentasjonssemantikk.
  // Tastaturhendelser håndteres globalt i input-modulen.
  viewport.setAttribute('tabindex', '0');

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

  // Fokuser viewport ved mount så tastaturnavigasjon fungerer umiddelbart
  requestAnimationFrame(() => viewport.focus());

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

    .ds-viewport:focus:not(:focus-visible) {
      outline: none;
    }

    .ds-viewport:focus-visible .ds-canvas {
      box-shadow: 0 0 0 4px rgba(232, 164, 74, 0.75),
                  0 0 0 10px rgba(232, 164, 74, 0.16);
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

    .ds-shortcuts[hidden] {
      display: none;
    }

    .ds-shortcuts {
      position: absolute;
      inset: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
      background: rgba(0, 0, 0, 0.58);
      backdrop-filter: blur(8px);
    }

    .ds-shortcuts__panel {
      width: min(760px, 100%);
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 24px;
      padding: 32px;
      background: rgba(12, 12, 16, 0.96);
      box-shadow: 0 32px 120px rgba(0, 0, 0, 0.55);
      color: #f0f0f0;
    }

    .ds-shortcuts__top {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 20px;
    }

    .ds-shortcuts__heading {
      font-size: 30px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .ds-shortcuts__close {
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 999px;
      padding: 8px 14px;
      background: rgba(255, 255, 255, 0.08);
      color: #f0f0f0;
      font: inherit;
      font-size: 16px;
      cursor: pointer;
    }

    .ds-shortcuts__close:hover {
      background: rgba(255, 255, 255, 0.14);
    }

    .ds-shortcuts__close:focus-visible {
      outline: 3px solid rgba(232, 164, 74, 0.9);
      outline-offset: 3px;
    }

    .ds-shortcuts__list {
      display: grid;
      gap: 10px;
      margin: 0;
    }

    .ds-shortcuts__list > div {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 20px;
      align-items: baseline;
      padding: 10px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.09);
    }

    .ds-shortcuts__list dt {
      font-family: "IBM Plex Mono", "SF Mono", Consolas, monospace;
      font-size: 18px;
      color: #82f0ff;
    }

    .ds-shortcuts__list dd {
      margin: 0;
      font-size: 18px;
      color: rgba(240, 240, 240, 0.78);
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
