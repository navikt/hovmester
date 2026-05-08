/**
 * deck-stage — repo-eid presentasjonsruntime for hovmester.
 *
 * Kontrakt:
 *
 *   Slides:
 *     Hver deck registrerer slides via DeckStage.mount({ slides, root }).
 *     `slides` er en Array<{ id: string, render: (container: HTMLElement) => void }>.
 *     Hvert slide-objekt har en unik `id` og en `render`-funksjon som fyller innholdet.
 *     Rekkefølgen i arrayet bestemmer presentasjonsrekkefølgen.
 *
 *   Navigasjon:
 *     - Piltaster: → / ↓ / Space / PageDown = neste, ← / ↑ / Backspace / PageUp = forrige
 *     - Home = første slide, End = siste slide
 *     - R = reset til første slide
 *     - Touch/click: høyre halvdel = neste, venstre halvdel = forrige
 *     - Slide-posisjon lagres i URL-hash (#slide-id) for direktelenking og refresh.
 *
 *   Skalering:
 *     Fixed 16:9 canvas (1920×1080 referansestørrelse) skalert med CSS transform
 *     for å fylle viewport uten å endre innholdslayout.
 *
 *   GitHub Pages subpath:
 *     Alle asset-referanser er relative til deck-katalogen.
 *     Runtime laster fra _shared/deck-stage.js relativt til presentations/-roten.
 *     Fungerer under vilkårlig Pages-subpath uten konfigurasjon.
 *
 *   Relative assets:
 *     Decks legger assets/ i egen katalog og refererer med relative stier.
 *     Runtime pålegger ingen basepath; alt er relativt.
 *
 *   Feilvisning:
 *     Ved runtime-feil i slide-render vises en tydelig feilmelding direkte i
 *     presentasjonscanvas, med slide-id og feildetaljer. Presentasjonen krasjer ikke.
 */

import { createCanvas } from './canvas.js';
import { createNavigator } from './navigator.js';
import { bindKeyboard, bindTouch } from './input.js';

/**
 * Monter en deck-stage-presentasjon.
 *
 * @param {Object} options
 * @param {Array<{id: string, render: (el: HTMLElement) => void}>} options.slides
 * @param {HTMLElement} [options.root] — container-element, default document.body
 */
function mount({ slides, root }) {
  if (!slides || !Array.isArray(slides) || slides.length === 0) {
    throw new Error('deck-stage: slides må være et ikke-tomt array med { id, render }.');
  }

  const container = root || document.body;
  const { viewport, canvas, slideContainer, counter } = createCanvas(container);
  const nav = createNavigator(slides, slideContainer, counter);

  bindKeyboard(nav);
  bindTouch(viewport, nav);

  // Les startposisjon fra URL-hash
  const initialId = location.hash ? location.hash.slice(1) : null;
  if (initialId) {
    const idx = slides.findIndex((s) => s.id === initialId);
    if (idx >= 0) {
      nav.goTo(idx);
    } else {
      nav.goTo(0);
    }
  } else {
    nav.goTo(0);
  }
}

// Eksporter som global for script-tag-bruk
if (typeof window !== 'undefined') {
  window.DeckStage = { mount };
}

export { mount };
