/**
 * jsx-runtime.js — Minimal JSX-til-DOM factory for deck-stage slides.
 *
 * Brukes med esbuild: --jsx-factory=h --jsx-fragment=Fragment
 * Produserer ekte DOM-elementer, ikke virtuelle noder.
 */

/**
 * Opprett et DOM-element fra JSX.
 *
 * @param {string|Function} tag — HTML-tagnavn eller komponentfunksjon
 * @param {Object|null} props — attributter/egenskaper
 * @param  {...any} children — barn-elementer
 * @returns {HTMLElement|DocumentFragment}
 */
export function h(tag, props, ...children) {
  if (typeof tag === 'function') {
    return tag({ ...props, children: children.length === 1 ? children[0] : children });
  }

  const el = document.createElement(tag);

  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value == null || value === false) continue;
      if (key === 'className') {
        el.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === 'htmlFor') {
        el.setAttribute('for', value);
      } else if (value === true) {
        el.setAttribute(key, '');
      } else {
        el.setAttribute(key, String(value));
      }
    }
  }

  appendChildren(el, children);
  return el;
}

/**
 * Fragment — samler barn uten wrapper-element.
 */
export function Fragment({ children }) {
  const frag = document.createDocumentFragment();
  appendChildren(frag, Array.isArray(children) ? children : [children]);
  return frag;
}

function appendChildren(parent, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false || child === true) continue;
    if (typeof child === 'string' || typeof child === 'number') {
      parent.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof Node) {
      parent.appendChild(child);
    }
  }
}
