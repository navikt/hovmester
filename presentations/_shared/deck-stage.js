var DeckStage=(()=>{var m=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var w=Object.getOwnPropertyNames;var E=Object.prototype.hasOwnProperty;var k=(e,t)=>{for(var n in t)m(e,n,{get:t[n],enumerable:!0})},C=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of w(t))!E.call(e,r)&&r!==n&&m(e,r,{get:()=>t[r],enumerable:!(o=y(t,r))||o.enumerable});return e};var A=e=>C(m({},"__esModule",{value:!0}),e);var M={};k(M,{mount:()=>I});function h(e){let t=document.createElement("div");t.className="ds-viewport",t.setAttribute("aria-roledescription","presentasjon"),t.setAttribute("aria-label","Presentasjon \u2014 bruk piltaster for \xE5 navigere"),t.setAttribute("tabindex","0");let n=document.createElement("div");n.className="ds-canvas";let o=document.createElement("div");o.className="ds-slide",o.setAttribute("role","group"),o.setAttribute("aria-roledescription","slide");let r=document.createElement("div");r.className="ds-counter",r.setAttribute("aria-live","polite"),r.setAttribute("aria-atomic","true"),n.appendChild(o),n.appendChild(r),t.appendChild(n),e.appendChild(t),T();let i=()=>$(t,n);return i(),window.addEventListener("resize",i),requestAnimationFrame(()=>t.focus()),{viewport:t,canvas:n,slideContainer:o,counter:r}}function $(e,t){let n=e.clientWidth,o=e.clientHeight;if(n===0||o===0)return;let r=n/1920,i=o/1080,c=Math.min(r,i);t.style.transform=`scale(${c})`,t.style.transformOrigin="center center"}function T(){if(document.getElementById("ds-base-styles"))return;let e=document.createElement("style");e.id="ds-base-styles",e.textContent=`
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

    .ds-viewport:focus-visible {
      outline: 3px solid #99c9ff;
      outline-offset: -6px;
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
  `,document.head.appendChild(e)}function b(e,t,n){let o=-1;function r(s){if(s<0||s>=e.length||s===o)return;o=s;let l=e[s];history.replaceState(null,"",`#${l.id}`),n.textContent=`${s+1} / ${e.length}`,t.setAttribute("aria-label",`Slide ${s+1} av ${e.length}: ${l.id}`),t.innerHTML="";try{l.render(t)}catch(p){F(t,l.id,p)}}function i(){o<e.length-1&&r(o+1)}function c(){o>0&&r(o-1)}function a(){r(0)}function d(){r(e.length-1)}function u(){o=-1,r(0)}function f(){return o}return window.addEventListener("hashchange",()=>{let s=location.hash.slice(1),l=e.findIndex(p=>p.id===s);l>=0&&l!==o&&r(l)}),{next:i,prev:c,goTo:r,first:a,last:d,reset:u,current:f}}function F(e,t,n){e.innerHTML="";let o=document.createElement("div");o.className="ds-error";let r=document.createElement("h2");r.textContent=`Feil i slide \xAB${t}\xBB`;let i=document.createElement("pre"),c=n.message||String(n),a=n.stack||"";i.textContent=a?`${c}

${a}`:c,o.appendChild(r),o.appendChild(i),e.appendChild(o),console.error(`[deck-stage] Feil i slide \xAB${t}\xBB:`,n)}var R=["a","button","input","textarea","select","summary","details","label","iframe","video[controls]","audio[controls]",'[contenteditable]:not([contenteditable="false"])','[tabindex]:not([tabindex="-1"])','[role="button"]','[role="link"]','[role="menuitem"]','[role="checkbox"]','[role="radio"]','[role="switch"]','[role="tab"]',"[data-deck-interactive]"].join(",");function g(e,t){if(!(e instanceof Element))return!1;let n=e.closest(R);return!!(n&&n!==t)}function v(e,t){e.addEventListener("keydown",n=>{if(!g(n.target,e))switch(n.key){case"ArrowRight":case"ArrowDown":case" ":case"PageDown":n.preventDefault(),t.next();break;case"ArrowLeft":case"ArrowUp":case"Backspace":case"PageUp":n.preventDefault(),t.prev();break;case"Home":n.preventDefault(),t.first();break;case"End":n.preventDefault(),t.last();break;case"r":case"R":!n.ctrlKey&&!n.metaKey&&(n.preventDefault(),t.reset());break}})}function x(e,t){e.addEventListener("click",n=>{if(g(n.target,e))return;let o=e.getBoundingClientRect();n.clientX-o.left<o.width/2?t.prev():t.next()})}function I({slides:e,root:t}){if(!e||!Array.isArray(e)||e.length===0)throw new Error("deck-stage: slides m\xE5 v\xE6re et ikke-tomt array med { id, render }.");let n=t||document.body,{viewport:o,canvas:r,slideContainer:i,counter:c}=h(n),a=b(e,i,c);v(o,a),x(o,a);let d=location.hash?location.hash.slice(1):null;if(d){let u=e.findIndex(f=>f.id===d);u>=0?a.goTo(u):a.goTo(0)}else a.goTo(0)}return A(M);})();
