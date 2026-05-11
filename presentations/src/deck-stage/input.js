/**
 * input.js — Tastatur- og touch/click-navigasjon for deck-stage.
 *
 * Tastatur:
 *   → / ↓ / Space / PageDown  = neste slide
 *   ← / ↑ / Backspace / PageUp = forrige slide
 *   Home = første slide
 *   End  = siste slide
 *   R    = reset til første slide
 *   F    = fullscreen av/på
 *   ?    = vis/skjul hurtigtaster
 *
 * Touch/swipe:
 *   Swipe venstre = neste slide
 *   Swipe høyre = forrige slide
 *   Museklikk navigerer ikke
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

function toggleFullscreen() {
  const fullscreenTarget = document.documentElement;

  if (!document.fullscreenElement && typeof fullscreenTarget.requestFullscreen !== 'function') {
    console.warn('deck-stage: fullscreen støttes ikke av denne nettleseren');
    return;
  }

  const action = document.fullscreenElement
    ? document.exitFullscreen()
    : fullscreenTarget.requestFullscreen();

  action.catch((error) => {
    console.warn('deck-stage: kunne ikke endre fullscreen-modus', error);
  });
}

function createShortcutHelp() {
  const overlay = document.createElement('div');
  overlay.className = 'ds-shortcuts';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'false');
  overlay.setAttribute('aria-label', 'Hurtigtaster');
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="ds-shortcuts__panel">
      <div class="ds-shortcuts__heading">Hurtigtaster</div>
      <dl class="ds-shortcuts__list">
        <div><dt>→ ↓ Space PageDown</dt><dd>Neste slide</dd></div>
        <div><dt>← ↑ Backspace PageUp</dt><dd>Forrige slide</dd></div>
        <div><dt>Home / End</dt><dd>Første / siste slide</dd></div>
        <div><dt>R</dt><dd>Reset til første slide</dd></div>
        <div><dt>F</dt><dd>Fullscreen av/på</dd></div>
        <div><dt>?</dt><dd>Vis/skjul denne hjelpen</dd></div>
        <div><dt>Esc</dt><dd>Lukk hjelpen</dd></div>
      </dl>
    </div>
  `;
  overlay.addEventListener('click', () => {
    overlay.hidden = true;
  });
  return overlay;
}

/**
 * Bind tastaturnavigasjon.
 * @param {HTMLElement} viewport
 * @param {{ next, prev, first, last, reset }} nav
 */
export function bindKeyboard(viewport, nav) {
  const shortcutHelp = createShortcutHelp();
  viewport.appendChild(shortcutHelp);

  document.addEventListener('keydown', (e) => {
    const key = e.key;
    const code = e.code;
    const plain = !e.ctrlKey && !e.metaKey && !e.altKey;

    if (!viewport.contains(e.target)) {
      viewport.focus();
    }
    if (isInteractiveTarget(e.target, viewport)) return;

    if (plain && (key === 'r' || key === 'R' || code === 'KeyR')) {
      e.preventDefault();
      nav.reset();
      return;
    }

    if (plain && (key === 'f' || key === 'F' || code === 'KeyF')) {
      e.preventDefault();
      toggleFullscreen();
      return;
    }

    if (key === '?' || (plain && e.shiftKey && code === 'Slash')) {
      e.preventDefault();
      shortcutHelp.hidden = !shortcutHelp.hidden;
      return;
    }

    switch (key) {
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

      case 'Escape':
        if (!shortcutHelp.hidden) {
          e.preventDefault();
          shortcutHelp.hidden = true;
        }
        break;
    }
  }, { capture: true });
}

/**
 * Bind touch-navigasjon til viewport.
 * Swipe venstre = neste, swipe høyre = forrige.
 * Museklikk navigerer IKKE — kun tastatur og touch/swipe.
 *
 * @param {HTMLElement} viewport
 * @param {{ next, prev }} nav
 */
export function bindTouch(viewport, nav) {
  let touchStartX = null;
  const SWIPE_THRESHOLD = 50; // piksler

  viewport.addEventListener('touchstart', (e) => {
    if (isInteractiveTarget(e.target, viewport)) return;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    if (isInteractiveTarget(e.target, viewport)) {
      touchStartX = null;
      return;
    }

    const dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;

    if (Math.abs(dx) < SWIPE_THRESHOLD) return;

    if (dx < 0) {
      nav.next();
    } else {
      nav.prev();
    }
  }, { passive: true });
}
