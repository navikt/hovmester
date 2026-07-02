---
name: grill-with-docs
description: "Brukes når et design, en ny tjeneste eller en ikke-triviell endring skal stresstestes før koding, med ADR + glossar som faller ut underveis. @grillmester fase 1–2; 'design dette', 'er dette gjennomtenkt', 'grill dette designet'. Kalles via /grill-with-docs. Rask stresstest uten dokumentasjon: /grill-me."
---

# grill-with-docs

Et nådeløst design-intervju som skjerper planen OG produserer dokumentasjon (ADR + glossar) underveis. Dette er inngangen til Grillmester sin faseløkke — målet er delt forståelse FØR kode skrives.

**Rolle:** dette _avhører_ planen og fester docs løpende. Beslektede skills med egne roller: `/improve-codebase-architecture` finner kandidater, `/codebase-design` designer grensesnittet, `/nav-architecture-review` formaliserer tunge valg som ADR.

## Kontrakt for økta
Grunnkontrakten for selve grillingen eies av `/grill-me` — ett spørsmål av gangen, hvert med din anbefalte svar, gå ned hvert gren av beslutningstreet, og utforsk kodebasen i stedet for å spørre når svaret finnes der. Det som er **i tillegg** her:

- Skriv artefakter **løpende** (ikke til slutt): hver avklart beslutning → ADR-linje; hvert avklart begrep → glossar-linje. Bruk `/domain-modeling` for å holde språket skarpt.

## Nav-seeding (still disse før de generiske)
Velg arketype først, og still domene-spørsmålene som hører til. Den korte versjonen:
- **Arketype:** Backend-API / Hendelseskonsument (Kafka) / Naisjob / Fullstack. (Sjekk repoets arketype i `copilot-instructions.md`; vekt seedingen deretter.)
- **Dataklassifisering:** Hvilke data berøres? (åpne / personopplysninger / særlige kategorier / fnr) — styrer auth, logging, lagring og om DPIA trengs.
- **Blind-spots å grave i:** auth (TokenX / Azure AD / ID-porten / Maskinporten), `accessPolicy` mot andre team, idempotens/replay (Kafka), oppførsel når avhengigheter er nede, PII i logger, sletting/oppbevaring, observability fra dag én, feilkontrakt (StatusPages/ApiError).
- **Arkitekturbeslutning?** → utløs ADR via `/nav-architecture-review`.

For **ny tjeneste, ny arketype eller modernisering** — kjør den fulle kravavdekkingen (dybden ligger i references, lastes ved behov):
- [references/nav-arketyper.md](references/nav-arketyper.md) — arketype-valg, domene-spørsmål per personvern/plattform/observerbarhet/team, brownfield endringskonsekvens, modernisering, og hva som oppsummeres i `docs/CONTEXT.md`.
- [references/blind-spots.md](references/blind-spots.md) — full sjekkliste (auth, DB, Kafka, observerbarhet, sikkerhet) med konsekvens + spørsmål å stille.
- [references/data-classification.md](references/data-classification.md) — Navs klassifiseringsnivåer, PII-kategorier og arkitekturkonsekvenser.

## ADR-kontrakt
For hver beslutning som er vanskelig å reversere, overraskende uten kontekst, og resultatet av en reell avveining, skriv `docs/adr/NNNN-<kort-tittel>.md` med det kanoniske ADR-formatet — se `/domain-modeling` (formatet ligger i `../domain-modeling/references/adr-format.md`). Én beslutning per ADR.

## Glossar-kontrakt
Hvert domenebegrep som dukker opp avklares i `docs/GLOSSARY.md` (én linje: `term → presis definisjon i Nav-kontekst`). Konsistent språk er en del av designet, ikke pynt.

## Utfall
Når treet er gjennomgått og bruker har bekreftet: oppsummer beslutningene, pek på ADR-ene og glossaret, og skriv den valgte tilnærmingen til `docs/CONTEXT.md`. Det er input til plan- og implementeringsfasen.
