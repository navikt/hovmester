/**
 * input.js — Tastatur- og touch/click-navigasjon for deck-stage.
 *
 * Tastatur:
 *   → / ↓ / Space / PageDown  = neste slide
 *   ← / ↑ / Backspace / PageUp = forrige slide
 *   Home = første slide
 *   End  = siste slide
 *   R    = reset til første slide
 *
 * Touch/click:
 *   Høyre halvdel av viewport = neste
 *   Venstre halvdel = forrige
 */

/**
 * Bind tastaturnavigasjon til navigator.
 * @param {{ next, prev, first, last, reset }} nav
 */
export function bindKeyboard(nav) {
  document.addEventListener('keydown', (e) => {
    // Ikke fang tastetrykk i input-felt
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        nav.next();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
      case 'Backspace':
      case 'PageUp':
        e.preventDefault();
        nav.prev();
        break;

      case 'Home':
        e.preventDefault();
        nav.first();
        break;

      case 'End':
        e.preventDefault();
        nav.last();
        break;

      case 'r':
      case 'R':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          nav.reset();
        }
        break;
    }
  });
}

/**
 * Bind touch/click-navigasjon til viewport.
 * Klikk/tap i venstre halvdel = forrige, høyre halvdel = neste.
 *
 * @param {HTMLElement} viewport
 * @param {{ next, prev }} nav
 */
export function bindTouch(viewport, nav) {
  viewport.addEventListener('click', (e) => {
    // Ikke fang klikk på interaktive elementer
    const tag = e.target.tagName;
    if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA') {
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < rect.width / 2) {
      nav.prev();
    } else {
      nav.next();
    }
  });
}
