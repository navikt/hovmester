/**
 * navigator.js — Slide-navigasjon og rendering med feilhåndtering.
 *
 * Håndterer current-slide-state, URL-hash-synkronisering og
 * tydelig feilvisning ved runtime-feil i slide-render.
 */

/**
 * Opprett en navigator for gitt slide-liste.
 *
 * @param {Array<{id: string, render: (el: HTMLElement) => void}>} slides
 * @param {HTMLElement} slideContainer
 * @param {HTMLElement} counter
 * @returns {{ next, prev, goTo, first, last, reset, current }}
 */
export function createNavigator(slides, slideContainer, counter) {
  let currentIndex = -1;

  function goTo(index) {
    if (index < 0 || index >= slides.length) return;
    if (index === currentIndex) return;

    currentIndex = index;
    const slide = slides[index];

    // Oppdater URL-hash uten å trigge scroll
    history.replaceState(null, '', `#${slide.id}`);

    // Oppdater teller
    counter.textContent = `${index + 1} / ${slides.length}`;

    // Oppdater aria-label
    slideContainer.setAttribute('aria-label', `Slide ${index + 1} av ${slides.length}: ${slide.id}`);

    // Rens og rendre
    slideContainer.innerHTML = '';

    try {
      slide.render(slideContainer);
    } catch (err) {
      renderError(slideContainer, slide.id, err);
    }
  }

  function next() {
    if (currentIndex < slides.length - 1) goTo(currentIndex + 1);
  }

  function prev() {
    if (currentIndex > 0) goTo(currentIndex - 1);
  }

  function first() {
    goTo(0);
  }

  function last() {
    goTo(slides.length - 1);
  }

  function reset() {
    currentIndex = -1; // Tvinger re-render selv om index er 0
    goTo(0);
  }

  function current() {
    return currentIndex;
  }

  // Lytt til hash-endringer (f.eks. direktelenke eller tilbakeknapp)
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    const idx = slides.findIndex((s) => s.id === id);
    if (idx >= 0 && idx !== currentIndex) {
      goTo(idx);
    }
  });

  return { next, prev, goTo, first, last, reset, current };
}

/**
 * Vis tydelig feilmelding i slide-container ved runtime-feil.
 * Bygger DOM direkte med textContent — ingen innerHTML.
 */
function renderError(container, slideId, error) {
  container.innerHTML = '';

  const errorEl = document.createElement('div');
  errorEl.className = 'ds-error';

  const heading = document.createElement('h2');
  heading.textContent = `Feil i slide «${slideId}»`;

  const pre = document.createElement('pre');
  const msg = error.message || String(error);
  const stack = error.stack || '';
  pre.textContent = stack ? `${msg}\n\n${stack}` : msg;

  errorEl.appendChild(heading);
  errorEl.appendChild(pre);
  container.appendChild(errorEl);

  // Logg også til konsoll for debugging
  console.error(`[deck-stage] Feil i slide «${slideId}»:`, error);
}
