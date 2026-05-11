var DeckStage=(()=>{var h=Object.defineProperty;var E=Object.getOwnPropertyDescriptor;var k=Object.getOwnPropertyNames;var _=Object.prototype.hasOwnProperty;var w=(e,t)=>{for(var n in t)h(e,n,{get:t[n],enumerable:!0})},F=(e,t,n,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of k(t))!_.call(e,o)&&o!==n&&h(e,o,{get:()=>t[o],enumerable:!(s=E(t,o))||s.enumerable});return e};var A=e=>F(h({},"__esModule",{value:!0}),e);var I={};w(I,{mount:()=>j});function g(e){let t=document.createElement("div");t.className="ds-viewport",t.setAttribute("aria-roledescription","presentasjon"),t.setAttribute("aria-label","Presentasjon \u2014 bruk piltaster for \xE5 navigere"),t.setAttribute("tabindex","0");let n=document.createElement("div");n.className="ds-canvas";let s=document.createElement("div");s.className="ds-slide",s.setAttribute("role","group"),s.setAttribute("aria-roledescription","slide");let o=document.createElement("div");o.className="ds-counter",o.setAttribute("aria-live","polite"),o.setAttribute("aria-atomic","true"),n.appendChild(s),n.appendChild(o),t.appendChild(n),e.appendChild(t),S();let i=()=>C(t,n);return i(),window.addEventListener("resize",i),requestAnimationFrame(()=>t.focus()),{viewport:t,canvas:n,slideContainer:s,counter:o}}function C(e,t){let n=e.clientWidth,s=e.clientHeight;if(n===0||s===0)return;let o=n/1920,i=s/1080,c=Math.min(o,i);t.style.transform=`scale(${c})`,t.style.transformOrigin="center center"}function S(){if(document.getElementById("ds-base-styles"))return;let e=document.createElement("style");e.id="ds-base-styles",e.textContent=`
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
      width: 1920px;
      height: 1080px;
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
  `,document.head.appendChild(e)}function b(e,t,n){let s=-1;function o(l){if(l<0||l>=e.length||l===s)return;s=l;let f=e[l];history.replaceState(null,"",`#${f.id}`),n.textContent=`${l+1} / ${e.length}`,t.setAttribute("aria-label",`Slide ${l+1} av ${e.length}: ${f.id}`),t.innerHTML="";try{f.render(t)}catch(p){T(t,f.id,p)}}function i(){s<e.length-1&&o(s+1)}function c(){s>0&&o(s-1)}function r(){o(0)}function a(){o(e.length-1)}function d(){s=-1,o(0)}function u(){return s}return window.addEventListener("hashchange",()=>{let l=location.hash.slice(1),f=e.findIndex(p=>p.id===l);f>=0&&f!==s&&o(f)}),{next:i,prev:c,goTo:o,first:r,last:a,reset:d,current:u}}function T(e,t,n){e.innerHTML="";let s=document.createElement("div");s.className="ds-error";let o=document.createElement("h2");o.textContent=`Feil i slide \xAB${t}\xBB`;let i=document.createElement("pre"),c=n.message||String(n),r=n.stack||"";i.textContent=r?`${c}

${r}`:c,s.appendChild(o),s.appendChild(i),e.appendChild(s),console.error(`[deck-stage] Feil i slide \xAB${t}\xBB:`,n)}var L=["a","button","input","textarea","select","summary","details","label","iframe","video[controls]","audio[controls]",'[contenteditable]:not([contenteditable="false"])','[tabindex]:not([tabindex="-1"])','[role="button"]','[role="link"]','[role="menuitem"]','[role="checkbox"]','[role="radio"]','[role="switch"]','[role="tab"]',"[data-deck-interactive]"].join(","),H=["a[href]","button:not([disabled])","input:not([disabled])","textarea:not([disabled])","select:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(",");function m(e,t){if(!(e instanceof Element))return!1;let n=e.closest(L);return!!(n&&n!==t)}function v(e,t,n){return n&&(e==="?"||e==="/"&&t==="Slash")}function D(){let e=document.documentElement,t;if(document.fullscreenElement){if(typeof document.exitFullscreen!="function"){console.warn("deck-stage: fullscreen st\xF8ttes ikke av denne nettleseren");return}t=document.exitFullscreen()}else{if(typeof e.requestFullscreen!="function"){console.warn("deck-stage: fullscreen st\xF8ttes ikke av denne nettleseren");return}t=e.requestFullscreen()}t&&typeof t.then=="function"&&Promise.resolve(t).catch(n=>{console.warn("deck-stage: kunne ikke endre fullscreen-modus",n)})}function M(){let e=document.createElement("div");return e.className="ds-shortcuts",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby","ds-shortcuts-heading"),e.setAttribute("tabindex","-1"),e.hidden=!0,e.innerHTML=`
    <div class="ds-shortcuts__panel">
      <div class="ds-shortcuts__top">
        <h2 class="ds-shortcuts__heading" id="ds-shortcuts-heading">Hurtigtaster</h2>
        <button class="ds-shortcuts__close" type="button">Lukk</button>
      </div>
      <dl class="ds-shortcuts__list">
        <div><dt>\u2192 \u2193 Space PageDown</dt><dd>Neste slide</dd></div>
        <div><dt>\u2190 \u2191 Backspace PageUp</dt><dd>Forrige slide</dd></div>
        <div><dt>Home / End</dt><dd>F\xF8rste / siste slide</dd></div>
        <div><dt>R</dt><dd>Reset til f\xF8rste slide</dd></div>
        <div><dt>F</dt><dd>Fullscreen av/p\xE5</dd></div>
        <div><dt>?</dt><dd>Vis/skjul denne hjelpen</dd></div>
        <div><dt>Esc</dt><dd>Lukk hjelpen</dd></div>
      </dl>
    </div>
  `,e}function R(e){return Array.from(e.querySelectorAll(H)).filter(t=>t instanceof HTMLElement&&!t.hidden)}function $(e,t){let n=R(e);if(n.length===0){t.preventDefault(),e.focus();return}let s=n[0],o=n[n.length-1];if(t.shiftKey&&document.activeElement===s){t.preventDefault(),o.focus();return}!t.shiftKey&&document.activeElement===o&&(t.preventDefault(),s.focus())}function x(e,t){let n=M(),s=n.querySelector(".ds-shortcuts__close"),o=null;e.appendChild(n);function i(){o=document.activeElement instanceof HTMLElement?document.activeElement:e,n.hidden=!1,(s||n).focus()}function c(){n.hidden=!0;let r=o&&document.contains(o)?o:e;o=null,r.focus()}n.addEventListener("click",r=>{r.target===n&&c()}),s&&s.addEventListener("click",c),document.addEventListener("keydown",r=>{let a=r.key,d=r.code,u=!r.ctrlKey&&!r.metaKey&&!r.altKey;if(!n.hidden){if(a==="Escape"||v(a,d,u)){r.preventDefault(),c();return}if(a==="Tab"){$(n,r);return}r.preventDefault();return}if(e.contains(r.target)||e.focus(),!m(r.target,e)){if(u&&(a==="r"||a==="R"||d==="KeyR")){r.preventDefault(),t.reset();return}if(u&&(a==="f"||a==="F"||d==="KeyF")){r.preventDefault(),D();return}if(v(a,d,u)){r.preventDefault(),i();return}switch(a){case"ArrowRight":case"ArrowDown":case" ":case"PageDown":r.preventDefault(),t.next();break;case"ArrowLeft":case"ArrowUp":case"Backspace":case"PageUp":r.preventDefault(),t.prev();break;case"Home":r.preventDefault(),t.first();break;case"End":r.preventDefault(),t.last();break;case"Escape":break}}},{capture:!0})}function y(e,t){let n=null,s=50;e.addEventListener("touchstart",o=>{m(o.target,e)||(n=o.touches[0].clientX)},{passive:!0}),e.addEventListener("touchend",o=>{if(n===null)return;if(m(o.target,e)){n=null;return}let i=o.changedTouches[0].clientX-n;n=null,!(Math.abs(i)<s)&&(i<0?t.next():t.prev())},{passive:!0})}function j({slides:e,root:t}){if(!e||!Array.isArray(e)||e.length===0)throw new Error("deck-stage: slides m\xE5 v\xE6re et ikke-tomt array med { id, render }.");let n=t||document.body,{viewport:s,canvas:o,slideContainer:i,counter:c}=g(n),r=b(e,i,c);x(s,r),y(s,r);let a=location.hash?location.hash.slice(1):null;if(a){let d=e.findIndex(u=>u.id===a);d>=0?r.goTo(d):r.goTo(0)}else r.goTo(0)}return A(I);})();
