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

const INTERACTIVE_SELECTOR = [
  'a', 'button', 'input', 'textarea', 'select',
  'summary', 'details', 'label', 'iframe',
  'video[controls]', 'audio[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]', '[role="link"]',
  '[role="menuitem"]', '[role="checkbox"]',
  '[role="radio"]', '[role="switch"]', '[role="tab"]',
  '[data-deck-interactive]',
].join(',');

function isInteractiveTarget(target, boundary) {
  if (!(target instanceof Element)) return false;
  const interactive = target.closest(INTERACTIVE_SELECTOR);
  return Boolean(interactive && interactive !== boundary);
}

/**
 * Bind tastaturnavigasjon til viewport-elementet.
 * @param {HTMLElement} viewport
 * @param {{ next, prev, first, last, reset }} nav
 */
export function bindKeyboard(viewport, nav) {
  viewport.addEventListener('keydown', (e) => {
    if (isInteractiveTarget(e.target, viewport)) return;

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
    // Ikke fang klikk på interaktive elementer.
    if (isInteractiveTarget(e.target, viewport)) return;

    const rect = viewport.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < rect.width / 2) {
      nav.prev();
    } else {
      nav.next();
    }
  });
}
