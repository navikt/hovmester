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

const FOCUSABLE_SELECTOR = [
  'a[href]', 'button:not([disabled])',
  'input:not([disabled])', 'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function isInteractiveTarget(target, boundary) {
  if (!(target instanceof Element)) return false;
  const interactive = target.closest(INTERACTIVE_SELECTOR);
  return Boolean(interactive && interactive !== boundary);
}

function isShortcutToggle(key, code, plain) {
  return plain && (key === '?' || (key === '/' && code === 'Slash'));
}

function toggleFullscreen() {
  const fullscreenTarget = document.documentElement;

  let action;

  if (document.fullscreenElement) {
    if (typeof document.exitFullscreen !== 'function') {
      console.warn('deck-stage: fullscreen støttes ikke av denne nettleseren');
      return;
    }
    action = document.exitFullscreen();
  } else {
    if (typeof fullscreenTarget.requestFullscreen !== 'function') {
      console.warn('deck-stage: fullscreen støttes ikke av denne nettleseren');
      return;
    }
    action = fullscreenTarget.requestFullscreen();
  }

  if (action && typeof action.then === 'function') {
    Promise.resolve(action).catch((error) => {
      console.warn('deck-stage: kunne ikke endre fullscreen-modus', error);
    });
  }
}

function createShortcutHelp() {
  const overlay = document.createElement('div');
  overlay.className = 'ds-shortcuts';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'ds-shortcuts-heading');
  overlay.setAttribute('tabindex', '-1');
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="ds-shortcuts__panel">
      <div class="ds-shortcuts__top">
        <h2 class="ds-shortcuts__heading" id="ds-shortcuts-heading">Hurtigtaster</h2>
        <button class="ds-shortcuts__close" type="button">Lukk</button>
      </div>
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
  return overlay;
}

function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
    .filter((element) => element instanceof HTMLElement && !element.hidden);
}

function trapFocus(container, event) {
  const focusable = getFocusableElements(container);
  if (focusable.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
    return;
  }

  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/**
 * Bind tastaturnavigasjon.
 * @param {HTMLElement} viewport
 * @param {{ next, prev, first, last, reset }} nav
 */
export function bindKeyboard(viewport, nav) {
  const shortcutHelp = createShortcutHelp();
  const closeButton = shortcutHelp.querySelector('.ds-shortcuts__close');
  let returnFocus = null;
  viewport.appendChild(shortcutHelp);

  function openShortcutHelp() {
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : viewport;
    shortcutHelp.hidden = false;
    (closeButton || shortcutHelp).focus();
  }

  function closeShortcutHelp() {
    shortcutHelp.hidden = true;
    const focusTarget = returnFocus && document.contains(returnFocus) ? returnFocus : viewport;
    returnFocus = null;
    focusTarget.focus();
  }

  shortcutHelp.addEventListener('click', (event) => {
    if (event.target === shortcutHelp) {
      closeShortcutHelp();
    }
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeShortcutHelp);
  }

  document.addEventListener('keydown', (e) => {
    const key = e.key;
    const code = e.code;
    const plain = !e.ctrlKey && !e.metaKey && !e.altKey;

    if (!shortcutHelp.hidden) {
      if (key === 'Escape' || isShortcutToggle(key, code, plain)) {
        e.preventDefault();
        closeShortcutHelp();
        return;
      }

      if (key === 'Tab') {
        trapFocus(shortcutHelp, e);
        return;
      }

      e.preventDefault();
      return;
    }

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

    if (isShortcutToggle(key, code, plain)) {
      e.preventDefault();
      openShortcutHelp();
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
