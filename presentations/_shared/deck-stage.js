var DeckStage=(()=>{var m=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var E=Object.prototype.hasOwnProperty;var k=(t,e)=>{for(var r in e)m(t,r,{get:e[r],enumerable:!0})},A=(t,e,r,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of x(e))!E.call(t,o)&&o!==r&&m(t,o,{get:()=>e[o],enumerable:!(n=y(e,o))||n.enumerable});return t};var C=t=>A(m({},"__esModule",{value:!0}),t);var R={};k(R,{mount:()=>w});function h(t){let e=document.createElement("div");e.className="ds-viewport",e.setAttribute("role","application"),e.setAttribute("aria-roledescription","presentasjon"),e.setAttribute("aria-label","Presentasjon \u2014 bruk piltaster for \xE5 navigere");let r=document.createElement("div");r.className="ds-canvas";let n=document.createElement("div");n.className="ds-slide",n.setAttribute("role","group"),n.setAttribute("aria-roledescription","slide");let o=document.createElement("div");o.className="ds-counter",o.setAttribute("aria-live","polite"),o.setAttribute("aria-atomic","true"),r.appendChild(n),r.appendChild(o),e.appendChild(r),t.appendChild(e),N();let a=()=>T(e,r);return a(),window.addEventListener("resize",a),{viewport:e,canvas:r,slideContainer:n,counter:o}}function T(t,e){let r=t.clientWidth,n=t.clientHeight;if(r===0||n===0)return;let o=r/1920,a=n/1080,c=Math.min(o,a);e.style.transform=`scale(${c})`,e.style.transformOrigin="center center"}function N(){if(document.getElementById("ds-base-styles"))return;let t=document.createElement("style");t.id="ds-base-styles",t.textContent=`
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
  `,document.head.appendChild(t)}function g(t,e,r){let n=-1;function o(s){if(s<0||s>=t.length||s===n)return;n=s;let d=t[s];history.replaceState(null,"",`#${d.id}`),r.textContent=`${s+1} / ${t.length}`,e.setAttribute("aria-label",`Slide ${s+1} av ${t.length}: ${d.id}`),e.innerHTML="";try{d.render(e)}catch(u){$(e,d.id,u)}}function a(){n<t.length-1&&o(n+1)}function c(){n>0&&o(n-1)}function i(){o(0)}function l(){o(t.length-1)}function p(){n=-1,o(0)}function f(){return n}return window.addEventListener("hashchange",()=>{let s=location.hash.slice(1),d=t.findIndex(u=>u.id===s);d>=0&&d!==n&&o(d)}),{next:a,prev:c,goTo:o,first:i,last:l,reset:p,current:f}}function $(t,e,r){t.innerHTML="";let n=document.createElement("div");n.className="ds-error";let o=document.createElement("h2");o.textContent=`Feil i slide \xAB${e}\xBB`;let a=document.createElement("pre"),c=r.message||String(r),i=r.stack||"";a.textContent=i?`${c}

${i}`:c,n.appendChild(o),n.appendChild(a),t.appendChild(n),console.error(`[deck-stage] Feil i slide \xAB${e}\xBB:`,r)}function b(t){document.addEventListener("keydown",e=>{if(!(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA"||e.target.isContentEditable))switch(e.key){case"ArrowRight":case"ArrowDown":case" ":case"PageDown":e.preventDefault(),t.next();break;case"ArrowLeft":case"ArrowUp":case"Backspace":case"PageUp":e.preventDefault(),t.prev();break;case"Home":e.preventDefault(),t.first();break;case"End":e.preventDefault(),t.last();break;case"r":case"R":!e.ctrlKey&&!e.metaKey&&(e.preventDefault(),t.reset());break}})}function v(t,e){t.addEventListener("click",r=>{let n=r.target.tagName;if(n==="A"||n==="BUTTON"||n==="INPUT"||n==="TEXTAREA")return;let o=t.getBoundingClientRect();r.clientX-o.left<o.width/2?e.prev():e.next()})}function w({slides:t,root:e}){if(!t||!Array.isArray(t)||t.length===0)throw new Error("deck-stage: slides m\xE5 v\xE6re et ikke-tomt array med { id, render }.");let r=e||document.body,{viewport:n,canvas:o,slideContainer:a,counter:c}=h(r),i=g(t,a,c);b(i),v(n,i);let l=location.hash?location.hash.slice(1):null;if(l){let p=t.findIndex(f=>f.id===l);p>=0?i.goTo(p):i.goTo(0)}else i.goTo(0)}typeof window<"u"&&(window.DeckStage={mount:w});return C(R);})();
