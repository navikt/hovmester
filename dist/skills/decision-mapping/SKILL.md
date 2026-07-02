---
name: decision-mapping
description: "Brukes når en idé rommer flere sammenkoblede, åpne beslutninger som ikke kan avgjøres i én økt, og avhengighetene må gjøres synlige før du velger. @grillmester fase 1–2; 'vi må avgjøre X først', 'tegn opp beslutningstreet', eller når en /grill-with-docs-økt drukner i valg som peker på hverandre. Kalles via /decision-mapping."
---

# decision-mapping

Gjør beslutningstreet eksplisitt: kartlegg de åpne valgene, hvilke som blokkerer hvilke, og hvilken avveining hvert valg står på — **før** du bestemmer deg. Dette er teknikken for når design-rommet er for stort for ett intervju: du sekvenserer beslutninger i stedet for å ta dem i tilfeldig rekkefølge og angre senere.

**Komplementerer `/grill-with-docs`, dupliserer den ikke.** Selve intervju-mekanikken (ett spørsmål av gangen, anbefalt svar + begrunnelse) bor i `/grill-with-docs`. Denne skillen eier **kart-strukturen**: nodene, avhengighetsgrafen og rekkefølgen. Når en node skal løses ved drøfting, kjør `/grill-with-docs` for selve økta — og før resultatet tilbake i kartet.

Plass i faseløkka: fase 1–2 (Utforske/Design), som stillaset rundt grillingen. Avklarte beslutninger graduerer ut av kartet og inn i `docs/adr/` og `docs/CONTEXT.md`, som så mater PLAN-fasen.

## Beslutningskartet

Ett kompakt Markdown-dokument per planleggings-innsats: `.grill/DECISIONS.md` — transient arbeidsminne (gitignorert; avgjorte beslutninger graduerer til `docs/adr/`). Det er den kanoniske *arbeids*-artefakten, og **hele kartet lastes inn som kontekst i hver økt** — derfor må det holdes stramt.

- Hold det kompakt. Tunge artefakter (utrednings-notater, spike-resultater, prototyper) lenkes fra noden, **aldri** limes inn i kartet.
- Når en beslutning er tatt og er vanskelig å reversere → skriv den som `docs/adr/NNNN-*.md` (se `/grill-with-docs`) og lenk fra noden. Kartet eier det åpne; ADR-ene eier det avgjorte.
- Nytt domenebegrep dukker opp → `docs/GLOSSARY.md` (se `/domain-modeling`). Bruk de samme begrepene i nodene.

## Node-struktur

Nummererte noder, hver sin seksjon nøklet på nummeret. `Avveining`-linja er ikke pynt — den er hele poenget med å kartlegge: den gjør synlig hvilken akse valget koster på.

```markdown
## #3: TokenX eller Azure AD for innkommende auth?

Blokkert av: #1, #2
Type: Drøfting
Avveining: borgerkontekst on-behalf-of (TokenX) vs. ren server-til-server uten bruker (Azure AD M2M) — styrer hele accessPolicy-modellen i NAIS

### Spørsmål
Skal endepunktene kalles på vegne av en innlogget borger/saksbehandler, eller maskin-til-maskin fra et annet team?

### Beslutning
<fylles ut når noden løses — pek til ADR hvis den ble vanskelig-å-reversere>
```

Hver node skal være dimensjonert til **én fokusert økt**. Blir den for stor, splitt den i flere noder med riktige `Blokkert av`-kanter.

## Avhengigheter: hvordan finne `Blokkert av`-kantene

En beslutning er **blokkert av** en annen når dens fornuftige alternativer *endrer seg* avhengig av det andre valget. Test hver node: «Hvis jeg avgjør X annerledes, blir listen over alternativer her en annen?» Ja → tegn kanten.

Typiske avhengighets-mønstre i et Nav Ktor-backend:

- **Dataklassifisering før alt annet.** Hvilke data berøres (åpne / personopplysninger / særlige kategorier / fnr) avgjør auth-modell, logging, lagring, sletting og om DPIA trengs. Nesten alt annet er blokkert av denne.
- **Arketype før kontrakt.** Backend-API vs. Kafka-konsument vs. naisjob avgjør hvilke kontrakt-valg som i det hele tatt finnes.
- **Integrasjonsvalg før schema.** Om du kobler deg på en eksisterende rapid eller bygger eget topic avgjør om Avro/JSON-schema-valget er ditt eller arvet.
- **Auth-modell før accessPolicy.** TokenX/Azure AD-valget avgjør hvilke `accessPolicy`-kanter mot andre team som gir mening.

Tegn aldri en kant du ikke kan begrunne. En falsk avhengighet tvinger frem unødig sekvensering og bremser frontlinja.

## Node-typer

Hver node løses av riktig verktøy. Velg type etter hva slags spørsmål det er:

- **Drøfting** (standard) — svaret ligger i hodet til teamet/brukeren eller i kodebasen. Kjør `/grill-with-docs` (+ `/domain-modeling` for språket). Kan spørsmålet besvares ved å lese repoet → utforsk i stedet for å spørre.
- **Utredning** — svaret ligger i dokumentasjon utenfor repoet (bibliotek, tredjeparts-API, Nav-plattform: nais.io, TokenX, Maskinporten). Slå opp i offisiell dokumentasjon for plattformen eller biblioteket. For et reelt arkitekturvalg: `/nav-architecture-review`. Resultat: et kort markdown-notat, lenket fra noden.
- **Spike** — spørsmålet er «virker dette / hvordan oppfører det seg». Kjør `/spike` for selve spiken (eier kast-vekk-kode, plassering og regler) — f.eks. idempotens ved Kafka-replay, en tilstandsmaskin, eller en datamodell mot Testcontainers-Postgres. Skal kjernen modnes til ekte kode → `/tdd`. Resultat: kort notat lenket fra noden; aldri lim spike-kode inn i kartet.

## Tåkefronten

Kartet er **bevisst ufullstendig** forbi frontlinja. Du kjenner ikke nodene som ligger bak en uløst beslutning — fordi hvilke de er avhenger av hva du velger. Jobben er å løse noder ved frontlinja, én om gangen, og dytte tåka bakover.

Når en node løses, dukker det ofte opp nye noder. Legg dem til med riktige `Blokkert av`-kanter. Hvis beslutningen invaliderer noder lenger ute (de var bygd på en antakelse du nå har forkastet), oppdater eller slett dem.

Til slutt er tåka dyttet langt nok bak til at veien til mål er klar. Da trengs ingen flere noder, og kartet er **ferdig**.

## To måter å starte på

### Bygg kartet (bootstrap)
Bruker kommer med en løs idé.

1. Kjør en `/grill-with-docs`-økt for å avdekke de åpne beslutningene (Nav-seedingen der — arketype, dataklassifisering, blind-spots — er nettopp det som avslører nodene).
2. Skriv `.grill/DECISIONS.md`: mest tåke, frontlinja identifisert, trivielt-avgjørbare valg løst inline med en gang. Tegn `Blokkert av`-kantene.
3. **Stopp.** Å bygge kartet er én økts arbeid — ikke løs nodene i samme slengen.

### Løs en node (resume)
Bruker peker på et eksisterende kart + et nodenummer.

1. Last **hele kartet** som kontekst.
2. Kjør én økt for å løse noden, med riktig verktøy for typen (se over).
3. Skriv det økta avgjorde inn i nodens `### Beslutning`. Vanskelig-å-reversere → ADR + lenk.
4. Legg til nylig oppdagede noder med korrekte `Blokkert av`-kanter. Oppdater/slett noder beslutningen invaliderte.
5. **Stopp.**

## Parallellisme

Brukeren kan løse flere uavhengige noder samtidig (noder uten felles `Blokkert av`-sti). Forvent derfor at andre økter endrer kartet mens du jobber — les hele kartet på nytt før du skriver, og rør bare din egen node + dens nye barn.

## Når kartet er overflødig

Ofte avslører den første grillingen ingen tåke: ingen sammenkoblede åpne beslutninger, bare ting å implementere. Da trengs ikke et beslutningskart — det er kun verdt det når beslutninger må tas over flere økter og avhenger av hverandre.

Tilby da brukeren å hoppe over kartet, og anbefal i stedet å implementere direkte, eller `/to-prd` for å støpe det til en sak.

## Utfall

Når kartet er ferdig: de avgjorte beslutningene lever i `docs/adr/` og den valgte tilnærmingen i `docs/CONTEXT.md`. Det er inngangen til plan-fasen — `/to-prd` for kravspec, deretter `/to-issues` for å bryte ned i uavhengig-gripbare saker.

Et utfylt eksempel: se [references/eksempel-beslutningskart.md](references/eksempel-beslutningskart.md).
