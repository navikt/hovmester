/**
 * slides.jsx — Bærekraftig KI i produktteam
 *
 * Workshopformat: korte innledninger, tydelige diskusjonsspørsmål og
 * oppsamling i Mural. Deler av evidensen bygger på Utviklerundersøkelsen
 * 2026 i Nav og er derfor holdt som draft-deck.
 */

import { h } from '../_template/jsx-runtime.js';

function GridOverlay() {
  return <div className="hm-grid-overlay" aria-hidden="true" />;
}

function AccentRule({ width = '120px', align = 'left' }) {
  const style = { width };
  if (align === 'center') {
    style.marginLeft = 'auto';
    style.marginRight = 'auto';
  }
  return <div className="hm-accent-rule" style={style} aria-hidden="true" />;
}

function FormatTag({ children }) {
  return <span className="ws-format-tag">{children}</span>;
}

function BolkNum({ num }) {
  return <div className="ws-bolk-num" aria-hidden="true">{num}</div>;
}

function SectionIntro({ num, title, subtitle, theme }) {
  return (
    <div className={`slide slide--section slide--theme-${theme}`}>
      <GridOverlay />
      <div className="slide__content slide__content--centered">
        <BolkNum num={num} />
        <h2 className="hm-heading-lg">{title}</h2>
        <AccentRule width="120px" align="center" />
        {subtitle && <p className="ws-tension hm-mt-sm">{subtitle}</p>}
      </div>
    </div>
  );
}

function DiscussCard({ question, kicker = 'Diskusjon', time = '15–25 min diskusjon' }) {
  return (
    <div className="ws-discuss-card">
      <div className="ws-discuss-card__kicker">{kicker}</div>
      <div className="ws-discuss-card__question">{question}</div>
      <div className="ws-discuss-card__timer">{time}</div>
    </div>
  );
}

function Source({ children }) {
  return <p className="ws-source">{children}</p>;
}

function FlowArrow() {
  return <div className="ws-flow__arrow" aria-hidden="true">→</div>;
}

const slides = [
  {
    id: 'tittel',
    render(container) {
      container.appendChild(
        <div className="slide slide--title">
          <GridOverlay />
          <div className="slide__content slide__content--centered">
            <FormatTag>Workshop · bærekraftig KI</FormatTag>
            <h1 className="hm-heading-xl hm-mt-md">
              Bærekraftig KI<br />i produktteam
            </h1>
            <AccentRule width="220px" align="center" />
            <div className="ws-title-meta hm-mt-md">
              <div>
                <span>Hva</span>
                <strong>Workshop om KI-praksis i produktteam</strong>
              </div>
              <div>
                <span>Hvem</span>
                <strong>Seksjon Arbeid og Helse</strong>
              </div>
              <div>
                <span>Når</span>
                <strong>Onsdag 13. mai 2026</strong>
              </div>
              <div>
                <span>Hvor</span>
                <strong>Hotell Soria Moria</strong>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: 'premiss',
    render(container) {
      container.appendChild(
        <div className="slide slide--content">
          <div className="slide__content slide__content--centered">
            <p className="hm-overline">Premiss</p>
            <h2 className="hm-heading-md hm-mb-sm">God med KI alene ≠ god KI-praksis i produktteam</h2>
            <AccentRule width="120px" align="center" />
            <div className="ws-premise-compare hm-mt-md">
              <div className="ws-premise-compare__not-equal" aria-hidden="true">≠</div>
              <div className="ws-premise-compare__header ws-premise-compare__header--solo">
                <span>Alene</span>
                <strong>Jeg får mer gjort</strong>
              </div>
              <div className="ws-premise-compare__header ws-premise-compare__header--team">
                <span>Produktteam</span>
                <strong>Vi jobber bedre sammen</strong>
              </div>

              <div className="ws-premise-compare__row">
                <div>
                  <strong>Jeg bestemmer alt selv</strong>
                </div>
                <span>Eierskap</span>
                <div>
                  <strong>Vi eier beslutningen</strong>
                </div>
              </div>
              <div className="ws-premise-compare__row">
                <div>
                  <strong>Jeg bestemmer selv hva som er godt nok</strong>
                </div>
                <span>Kvalitet</span>
                <div>
                  <strong>Vi kan forklare og etterprøve</strong>
                </div>
              </div>
              <div className="ws-premise-compare__row">
                <div>
                  <strong>Jeg lærer min måte å bruke KI på</strong>
                </div>
                <span>Kompetanse</span>
                <div>
                  <strong>Vi bygger felles dømmekraft</strong>
                </div>
              </div>
              <div className="ws-premise-compare__row">
                <div>
                  <strong>Jeg bruker KI i min rolle</strong>
                </div>
                <span>Samarbeid</span>
                <div>
                  <strong>KI støtter rollene våre. Teamet eier produktet sammen.</strong>
                </div>
              </div>
              <div className="ws-premise-compare__row">
                <div>
                  <strong>Jeg setter egne grenser</strong>
                </div>
                <span>Kjøreregler</span>
                <div>
                  <strong>Vi gjør grensene synlige og felles</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: 'nav-kontekst',
    render(container) {
      container.appendChild(
        <div className="slide slide--content">
          <div className="slide__content slide__content--padded">
            <p className="hm-overline">Hvorfor det betyr ekstra mye i Nav</p>
            <h2 className="hm-heading-md hm-mb-sm">Produktene våre påvirker mennesker</h2>
            <AccentRule width="90px" />
            <div className="ws-impact-grid hm-mt-md">
              <div className="ws-impact-card">
                <div className="ws-impact-card__icon" aria-hidden="true">§</div>
                <h3>Rettigheter</h3>
                <p>Regler, vedtak og begrunnelser må kunne forklares.</p>
              </div>
              <div className="ws-impact-card">
                <div className="ws-impact-card__icon" aria-hidden="true">kr</div>
                <h3>Økonomi</h3>
                <p>Små feil kan få store konsekvenser for folk.</p>
              </div>
              <div className="ws-impact-card">
                <div className="ws-impact-card__icon" aria-hidden="true">↔</div>
                <h3>Oppfølging</h3>
                <p>Tjenestene må tåle innsyn, klage og etterprøving.</p>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: 'format',
    render(container) {
      container.appendChild(
        <div className="slide slide--content">
          <div className="slide__content slide__content--padded">
            <p className="hm-overline">Format</p>
            <h2 className="hm-heading-md hm-mb-sm">Fem temaer, samme rytme</h2>
            <AccentRule width="90px" />
            <div className="ws-format-rhythm hm-mt-md">
              <div className="ws-format-topics">
                <span className="ws-format-topics__label">Vi går gjennom 5 temaer</span>
                <strong>Eierskap</strong>
                <strong>Kvalitet</strong>
                <strong>Kompetanse</strong>
                <strong>Samarbeid</strong>
                <strong>Kjøreregler</strong>
              </div>
              <div className="ws-format-loop" aria-label="Rytme per tema">
                <div className="ws-format-step">
                  <strong>1</strong>
                  <span>Kort intro</span>
                </div>
                <div className="ws-format-step">
                  <strong>2</strong>
                  <span>Felles diskusjon</span>
                </div>
                <div className="ws-format-step">
                  <strong>3</strong>
                  <span>Lapper i Mural underveis</span>
                </div>
              </div>
              <div className="ws-format-outro">
                <span className="ws-format-outro__label">Til slutt</span>
                <div className="ws-format-outro__card">
                  <div className="ws-format-outro__num">4</div>
                  <strong>Velg 3–5 lapper å løfte frem</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: 'survey-start',
    render(container) {
      container.appendChild(
        <div className="slide slide--content">
          <div className="slide__content slide__content--centered">
            <p className="hm-overline">Utviklerundersøkelsen 2026</p>
            <h2 className="hm-heading-md hm-mb-sm">KI er allerede hverdagen</h2>
            <AccentRule width="120px" align="center" />
            <div className="ws-stat-row hm-mt-md">
              <div className="ws-stat-card ws-stat-card--hero">
                <div className="ws-stat-card__number">93 %</div>
                <div className="ws-stat-card__label">bruker AI-kodeverktøy aktivt</div>
              </div>
              <div className="ws-stat-card">
                <div className="ws-stat-card__number">73 %</div>
                <div className="ws-stat-card__label">er fornøyde</div>
              </div>
              <div className="ws-stat-card ws-stat-card--concern">
                <div className="ws-stat-card__number">59 %</div>
                <div className="ws-stat-card__label">er bekymret for kompetansetap</div>
              </div>
            </div>
            <Source>Utviklerundersøkelsen 2026, Nav intern · 163 svar</Source>
          </div>
        </div>
      );
    },
  },

  {
    id: 'bolk1',
    render(container) {
      container.appendChild(
        <SectionIntro
          num="1"
          theme="1"
          title="Eierskap til produktet"
        />
      );
    },
  },

  {
    id: 'eierskap-sitat',
    render(container) {
      container.appendChild(
        <div className="slide slide--content slide--theme-1">
          <div className="slide__content slide__content--centered">
            <div className="ws-quote-card">
              <div className="ws-quote-card__mark" aria-hidden="true">“</div>
              <blockquote>
                AI er veldig god med å skrive kode som ser riktig ut, men det betyr ikke at koden er riktig. Til slutt føler jeg ikke at koden er min kode og da mister jeg eierskap.
              </blockquote>
              <cite>Nav-utvikler · Utviklerundersøkelsen 2026</cite>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: 'eierskap-hva',
    render(container) {
      container.appendChild(
        <div className="slide slide--content slide--theme-1">
          <div className="slide__content slide__content--padded">
            <p className="hm-overline">Eierskap</p>
            <h2 className="hm-heading-md hm-mb-sm">Hva bør mennesker ha ansvar for, og hva kan vi overlate til KI?</h2>
            <AccentRule width="90px" />
            <div className="ws-chip-grid hm-mt-md">
              <div>Hva skal løses?</div>
              <div>Produktretning</div>
              <div>Arkitekturvalg</div>
              <div>Design og brukerreise</div>
              <div>Avgrensninger: hva velger vi ikke å gjøre?</div>
              <div>Hva er godt nok før release?</div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: 'eierskap-diskusjon',
    render(container) {
      container.appendChild(
        <div className="slide slide--section slide--theme-1">
          <GridOverlay />
          <div className="slide__content slide__content--centered">
            <DiscussCard question="Hvordan beholder vi eierskap til produktet når KI gjør mer av arbeidet?" />
          </div>
        </div>
      );
    },
  },

  {
    id: 'bolk2',
    render(container) {
      container.appendChild(
        <SectionIntro
          num="2"
          theme="2"
          title="Kvalitet som tåler etterprøving"
        />
      );
    },
  },

  {
    id: 'kvalitet-evidens',
    render(container) {
      container.appendChild(
        <div className="slide slide--content slide--theme-2">
          <div className="slide__content slide__content--centered">
            <p className="hm-overline">Utviklerundersøkelsen 2026</p>
            <h2 className="hm-heading-md hm-mb-sm">Man kan ikke stole blindt på KI</h2>
            <div className="ws-stat-row ws-stat-row--tight hm-mt-md">
              <div className="ws-stat-card ws-stat-card--concern">
                <div className="ws-stat-card__number">34 %</div>
                <div className="ws-stat-card__label">mener AI-generert kode holder god nok kvalitet til at den ikke skaper ekstra arbeid i code review</div>
              </div>
              <div className="ws-stat-card">
                <div className="ws-stat-card__number">43 %</div>
                <div className="ws-stat-card__label">er nøytrale</div>
              </div>
            </div>
            <Source>Utviklerundersøkelsen 2026, Nav intern · 163 svar</Source>
          </div>
        </div>
      );
    },
  },

  {
    id: 'kvalitet-skala',
    render(container) {
      container.appendChild(
        <div className="slide slide--content slide--theme-2">
          <div className="slide__content slide__content--padded">
            <p className="hm-overline">Etterprøving</p>
            <h2 className="hm-heading-md hm-mb-sm">Fra vibe coding til agentic engineering</h2>
            <AccentRule width="90px" />
            <div className="ws-practice-compare hm-mt-md">
              <div className="ws-practice-compare__heading ws-practice-compare__heading--risk">Vibe coding</div>
              <div className="ws-practice-compare__heading ws-practice-compare__heading--safe">Agentic engineering</div>

              <div className="ws-practice-compare__cell ws-practice-compare__cell--risk">
                Kjører agenten på autopilot
              </div>
              <div className="ws-practice-compare__cell ws-practice-compare__cell--safe">
                Parplanlegger før agenten slippes løs
              </div>

              <div className="ws-practice-compare__cell ws-practice-compare__cell--risk">
                Merger PR-er uten å lese dem
              </div>
              <div className="ws-practice-compare__cell ws-practice-compare__cell--safe">
                Leser, forklarer og går god for endringen
              </div>

              <div className="ws-practice-compare__cell ws-practice-compare__cell--risk">
                Stoler på at tester fanger alt
              </div>
              <div className="ws-practice-compare__cell ws-practice-compare__cell--safe">
                Bruker tester, typer og review som sikkerhetsnett
              </div>

              <div className="ws-practice-compare__cell ws-practice-compare__cell--risk">
                Sender ut det som kompilerer
              </div>
              <div className="ws-practice-compare__cell ws-practice-compare__cell--safe">
                Står inne for arkitektur, lesbarhet og domene
              </div>

              <div className="ws-practice-compare__cell ws-practice-compare__cell--risk">
                Gunner på, på egenhånd
              </div>
              <div className="ws-practice-compare__cell ws-practice-compare__cell--safe">
                Bruker KI som verktøy og partner for å bidra inn i teamet
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: 'kvalitet-diskusjon',
    render(container) {
      container.appendChild(
        <div className="slide slide--section slide--theme-2">
          <GridOverlay />
          <div className="slide__content slide__content--centered">
            <DiscussCard question="Hva må vi gjøre ekstra for å sikre kvalitet når KI bidrar i produkter som påvirker folks rettigheter, økonomi eller oppfølging?" />
          </div>
        </div>
      );
    },
  },

  {
    id: 'bolk3',
    render(container) {
      container.appendChild(
        <SectionIntro
          num="3"
          theme="3"
          title="Kompetanse som ikke forsvinner"
          subtitle="Raskere er ikke alltid læring"
        />
      );
    },
  },

  {
    id: 'kompetanse-nav',
    render(container) {
      container.appendChild(
        <div className="slide slide--content slide--theme-3">
          <div className="slide__content slide__content--centered">
            <p className="hm-overline">Utviklerundersøkelsen 2026</p>
            <h2 className="hm-heading-md hm-mb-sm">Fornøyd og bekymret samtidig</h2>
            <div className="ws-stat-row ws-stat-row--duo hm-mt-md">
              <div className="ws-stat-card ws-stat-card--concern">
                <div className="ws-stat-card__number">59 %</div>
                <div className="ws-stat-card__label">er bekymret for kompetansetap</div>
              </div>
              <div className="ws-stat-card ws-stat-card--overlap">
                <div className="ws-stat-card__number">41 %</div>
                <div className="ws-stat-card__label">er både fornøyde og bekymret</div>
              </div>
            </div>
            <Source>Utviklerundersøkelsen 2026, Nav intern · 163 svar</Source>
          </div>
        </div>
      );
    },
  },

  {
    id: 'kompetanse-ekstern',
    render(container) {
      container.appendChild(
        <div className="slide slide--content slide--theme-3">
          <div className="slide__content slide__content--padded">
            <p className="hm-overline">Ekstern evidens</p>
            <h2 className="hm-heading-md hm-mb-sm">Å få hjelp er ikke det samme som å lære</h2>
            <AccentRule width="90px" />
            <div className="ws-learning-card hm-mt-md">
              <div className="ws-learning-card__number">17 %</div>
              <div>
                <h3>lavere forståelsesscore</h3>
                <p>i en studie der deltakere brukte KI-assistanse til programmeringsoppgaver.</p>
              </div>
            </div>
            <p className="hm-body hm-text-muted hm-mt-sm" style={{ maxWidth: '900px' }}>
              Beste mønster: bruk KI til forklaring, konsepter og alternativer. Ikke bare delegering.
            </p>
            <Source>Anthropic Economic Index · AI Assistance and Coding Skills</Source>
          </div>
        </div>
      );
    },
  },

  {
    id: 'kompetanse-diskusjon',
    render(container) {
      container.appendChild(
        <div className="slide slide--section slide--theme-3">
          <GridOverlay />
          <div className="slide__content slide__content--centered">
            <DiscussCard question="Hvordan bruker vi KI så juniorer bygger kompetanse, og seniorer beholder faglig dømmekraft?" />
          </div>
        </div>
      );
    },
  },

  {
    id: 'pause',
    render(container) {
      container.appendChild(
        <div className="slide slide--pause">
          <GridOverlay />
          <div className="slide__content slide__content--centered">
            <h2 className="hm-heading-xl">Pause</h2>
            <div className="ws-pause-timer">
              <span className="ws-pause-timer__number">15</span>
              <span className="ws-pause-timer__unit">min</span>
            </div>
            <AccentRule width="100px" align="center" />
          </div>
        </div>
      );
    },
  },

  {
    id: 'bolk4',
    render(container) {
      container.appendChild(
        <SectionIntro
          num="4"
          theme="4"
          title="Samarbeid med KI i bildet"
          subtitle="Rollene bruker KI ulikt"
        />
      );
    },
  },

  {
    id: 'samarbeid-roller',
    render(container) {
      container.appendChild(
        <div className="slide slide--content slide--theme-4">
          <div className="slide__content slide__content--centered">
            <p className="hm-overline">Produktteam</p>
            <h2 className="hm-heading-md hm-mb-sm">Hvor kan KI støtte ulike roller?</h2>
            <div className="ws-orbit hm-mt-md">
              <div className="ws-orbit__center">Produktet</div>
              <div className="ws-orbit__item ws-orbit__item--dev">Utvikler<br /><span>problemutforsking, kode, review, test</span></div>
              <div className="ws-orbit__item ws-orbit__item--design">Designer/UX<br /><span>skisser, prototyper, tekst</span></div>
              <div className="ws-orbit__item ws-orbit__item--po ws-orbit__item--unknown">Produktleder?<br /><span>hypoteser, innsikt, prioritering</span></div>
              <div className="ws-orbit__item ws-orbit__item--fag ws-orbit__item--unknown">Jurist/fag?<br /><span>regelverk, presisjon, kvalitetssikring</span></div>
              <div className="ws-orbit__item ws-orbit__item--team">Teamet<br /><span>beslutninger og ansvar</span></div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: 'samarbeid-esyfo',
    render(container) {
      container.appendChild(
        <div className="slide slide--content slide--theme-4">
          <div className="slide__content slide__content--padded">
            <p className="hm-overline">Teamcase</p>
            <h2 className="hm-heading-md hm-mb-sm">Designer-agent som bro mellom designere og utviklere</h2>
            <AccentRule width="90px" />
            <div className="ws-flow ws-flow--case ws-flow--designer hm-mt-md">
              <div className="ws-flow__step"><strong>Designere</strong><span>problem, innsikt og brukerreise</span></div>
              <FlowArrow />
              <div className="ws-flow__step ws-flow__step--highlight"><strong>Designer-agent</strong><span>skisser og prototyping</span></div>
              <FlowArrow />
              <div className="ws-flow__step"><strong>Prototype</strong><span>Figma-skisse som kan diskuteres</span></div>
              <FlowArrow />
              <div className="ws-flow__step"><strong>Issue</strong><span>oversetter design til bestilling</span></div>
              <FlowArrow />
              <div className="ws-flow__step"><strong>Utviklere</strong><span>parplanlegging og kode</span></div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: 'samarbeid-diskusjon',
    render(container) {
      container.appendChild(
        <div className="slide slide--section slide--theme-4">
          <GridOverlay />
          <div className="slide__content slide__content--centered">
            <DiscussCard question="Hvordan samarbeider vi godt når rollene i produktteamet bruker KI ulikt?" />
          </div>
        </div>
      );
    },
  },

  {
    id: 'bolk5',
    render(container) {
      container.appendChild(
        <SectionIntro
          num="5"
          theme="5"
          title="Felles kjøreregler"
        />
      );
    },
  },

  {
    id: 'kjoreregler-dora',
    render(container) {
      container.appendChild(
        <div className="slide slide--content slide--theme-5">
          <div className="slide__content slide__content--centered">
            <p className="hm-overline">DORA 2025</p>
            <h2 className="hm-heading-md hm-mb-sm">KI forsterker praksisen vi allerede har</h2>
            <AccentRule width="120px" align="center" />
            <div className="ws-amplifier hm-mt-md">
              <div>Utydelige arbeidsflyter</div>
              <div className="ws-amplifier__center">KI</div>
              <div>Tydelige feedback loops og safety nets</div>
            </div>
            <p className="hm-body hm-text-muted hm-mt-md" style={{ maxWidth: '900px', textAlign: 'center' }}>
              Overordnede rammer hjelper. Teamet må oversette dem til praksis.
            </p>
            <Source>DORA 2025 · AI forsterker eksisterende praksis</Source>
          </div>
        </div>
      );
    },
  },

  {
    id: 'kjoreregler-ovelse',
    render(container) {
      container.appendChild(
        <div className="slide slide--content slide--theme-5">
          <div className="slide__content slide__content--padded">
            <p className="hm-overline">Øvelse · diskusjon</p>
            <h2 className="hm-heading-md hm-mb-sm">Hva bør være kjørereglene for KI-bruk i produktteam?</h2>
            <AccentRule width="90px" />
            <div className="ws-traffic-grid hm-mt-md">
              <div className="ws-traffic-card ws-traffic-card--green">
                <h3>Grønt</h3>
                <p>Hva kan vi bruke KI til helt fritt, uten begrensninger? For eksempel prototyping.</p>
              </div>
              <div className="ws-traffic-card ws-traffic-card--yellow">
                <h3>Gult</h3>
                <p>Hva kan vi bruke KI til, men bare med ekstra kontroll eller felles vurdering?</p>
              </div>
              <div className="ws-traffic-card ws-traffic-card--red">
                <h3>Rødt</h3>
                <p>Hvordan bør vi ikke bruke KI?</p>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: 'oppsamling',
    render(container) {
      container.appendChild(
        <div className="slide slide--finale">
          <GridOverlay />
          <div className="slide__content slide__content--centered">
            <p className="hm-overline">Oppsamling i Mural</p>
            <h2 className="hm-heading-xl hm-mt-sm">Takk for diskusjoner og innspill</h2>
            <AccentRule width="220px" align="center" />
            <a className="ws-final-mural-link hm-mt-md" href="https://app.mural.co/t/navdesign3580/m/navdesign3580/1778494029280/3b43e79d8ab544d95ce5d20f099ddbfc388ddccb" target="_blank" rel="noreferrer">
              Åpne Mural
            </a>
            <p className="ws-final-note hm-mt-md">
              Vi velger 3–5 lapper i Mural vi mener er ekstra viktige å fremheve.
            </p>
          </div>
        </div>
      );
    },
  },
];

DeckStage.mount({ slides });
