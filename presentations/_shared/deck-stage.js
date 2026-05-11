var DeckStage=(()=>{var m=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var k=Object.getOwnPropertyNames;var E=Object.prototype.hasOwnProperty;var w=(e,n)=>{for(var r in n)m(e,r,{get:n[r],enumerable:!0})},_=(e,n,r,t)=>{if(n&&typeof n=="object"||typeof n=="function")for(let o of k(n))!E.call(e,o)&&o!==r&&m(e,o,{get:()=>n[o],enumerable:!(t=y(n,o))||t.enumerable});return e};var F=e=>_(m({},"__esModule",{value:!0}),e);var L={};w(L,{mount:()=>R});function g(e){let n=document.createElement("div");n.className="ds-viewport",n.setAttribute("aria-roledescription","presentasjon"),n.setAttribute("aria-label","Presentasjon \u2014 bruk piltaster for \xE5 navigere"),n.setAttribute("tabindex","0");let r=document.createElement("div");r.className="ds-canvas";let t=document.createElement("div");t.className="ds-slide",t.setAttribute("role","group"),t.setAttribute("aria-roledescription","slide");let o=document.createElement("div");o.className="ds-counter",o.setAttribute("aria-live","polite"),o.setAttribute("aria-atomic","true"),r.appendChild(t),r.appendChild(o),n.appendChild(r),e.appendChild(n),A();let i=()=>C(n,r);return i(),window.addEventListener("resize",i),requestAnimationFrame(()=>n.focus()),{viewport:n,canvas:r,slideContainer:t,counter:o}}function C(e,n){let r=e.clientWidth,t=e.clientHeight;if(r===0||t===0)return;let o=r/1920,i=t/1080,s=Math.min(o,i);n.style.transform=`scale(${s})`,n.style.transformOrigin="center center"}function A(){if(document.getElementById("ds-base-styles"))return;let e=document.createElement("style");e.id="ds-base-styles",e.textContent=`
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

    .ds-viewport:focus {
      outline: none;
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

    .ds-shortcuts__heading {
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: 800;
      letter-spacing: -0.02em;
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
  `,document.head.appendChild(e)}function b(e,n,r){let t=-1;function o(d){if(d<0||d>=e.length||d===t)return;t=d;let c=e[d];history.replaceState(null,"",`#${c.id}`),r.textContent=`${d+1} / ${e.length}`,n.setAttribute("aria-label",`Slide ${d+1} av ${e.length}: ${c.id}`),n.innerHTML="";try{c.render(n)}catch(f){T(n,c.id,f)}}function i(){t<e.length-1&&o(t+1)}function s(){t>0&&o(t-1)}function a(){o(0)}function l(){o(e.length-1)}function u(){t=-1,o(0)}function p(){return t}return window.addEventListener("hashchange",()=>{let d=location.hash.slice(1),c=e.findIndex(f=>f.id===d);c>=0&&c!==t&&o(c)}),{next:i,prev:s,goTo:o,first:a,last:l,reset:u,current:p}}function T(e,n,r){e.innerHTML="";let t=document.createElement("div");t.className="ds-error";let o=document.createElement("h2");o.textContent=`Feil i slide \xAB${n}\xBB`;let i=document.createElement("pre"),s=r.message||String(r),a=r.stack||"";i.textContent=a?`${s}

${a}`:s,t.appendChild(o),t.appendChild(i),e.appendChild(t),console.error(`[deck-stage] Feil i slide \xAB${n}\xBB:`,r)}var H=["a","button","input","textarea","select","summary","details","label","iframe","video[controls]","audio[controls]",'[contenteditable]:not([contenteditable="false"])','[tabindex]:not([tabindex="-1"])','[role="button"]','[role="link"]','[role="menuitem"]','[role="checkbox"]','[role="radio"]','[role="switch"]','[role="tab"]',"[data-deck-interactive]"].join(",");function h(e,n){if(!(e instanceof Element))return!1;let r=e.closest(H);return!!(r&&r!==n)}function S(){let e=document.documentElement;if(!document.fullscreenElement&&typeof e.requestFullscreen!="function"){console.warn("deck-stage: fullscreen st\xF8ttes ikke av denne nettleseren");return}(document.fullscreenElement?document.exitFullscreen():e.requestFullscreen()).catch(r=>{console.warn("deck-stage: kunne ikke endre fullscreen-modus",r)})}function M(){let e=document.createElement("div");return e.className="ds-shortcuts",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","false"),e.setAttribute("aria-label","Hurtigtaster"),e.hidden=!0,e.innerHTML=`
    <div class="ds-shortcuts__panel">
      <div class="ds-shortcuts__heading">Hurtigtaster</div>
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
  `,e.addEventListener("click",()=>{e.hidden=!0}),e}function v(e,n){let r=M();e.appendChild(r),document.addEventListener("keydown",t=>{let o=t.key,i=t.code,s=!t.ctrlKey&&!t.metaKey&&!t.altKey;if(e.contains(t.target)||e.focus(),!h(t.target,e)){if(s&&(o==="r"||o==="R"||i==="KeyR")){t.preventDefault(),n.reset();return}if(s&&(o==="f"||o==="F"||i==="KeyF")){t.preventDefault(),S();return}if(o==="?"||s&&t.shiftKey&&i==="Slash"){t.preventDefault(),r.hidden=!r.hidden;return}switch(o){case"ArrowRight":case"ArrowDown":case" ":case"PageDown":t.preventDefault(),n.next();break;case"ArrowLeft":case"ArrowUp":case"Backspace":case"PageUp":t.preventDefault(),n.prev();break;case"Home":t.preventDefault(),n.first();break;case"End":t.preventDefault(),n.last();break;case"Escape":r.hidden||(t.preventDefault(),r.hidden=!0);break}}},{capture:!0})}function x(e,n){let r=null,t=50;e.addEventListener("touchstart",o=>{h(o.target,e)||(r=o.touches[0].clientX)},{passive:!0}),e.addEventListener("touchend",o=>{if(r===null)return;if(h(o.target,e)){r=null;return}let i=o.changedTouches[0].clientX-r;r=null,!(Math.abs(i)<t)&&(i<0?n.next():n.prev())},{passive:!0})}function R({slides:e,root:n}){if(!e||!Array.isArray(e)||e.length===0)throw new Error("deck-stage: slides m\xE5 v\xE6re et ikke-tomt array med { id, render }.");let r=n||document.body,{viewport:t,canvas:o,slideContainer:i,counter:s}=g(r),a=b(e,i,s);v(t,a),x(t,a);let l=location.hash?location.hash.slice(1):null;if(l){let u=e.findIndex(p=>p.id===l);u>=0?a.goTo(u):a.goTo(0)}else a.goTo(0)}return F(L);})();
