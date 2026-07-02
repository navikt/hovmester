---
name: spike
description: "Brukes når et design er for usikkert for papir og skal testes med kjørbar kast-vekk-kode FØR du forplikter deg — datamodell, tilstandsmaskin, API-/feilkontrakt eller Kafka-flyt (idempotens/replay). Triggere: 'spike dette', 'la meg leke med det', 'er datamodellen riktig', 'prøv et par varianter'. Kalles via /spike."
---

# spike

En spike er **kast-vekk-kode som svarer på ett spørsmål**. Den lever i et eget spor, er tydelig merket som kast-vekk, og dør når svaret er funnet. Lærdommen — ikke koden — mates inn i `.grill/`-artefaktene.

Dette er et backend-repo (Ktor / no.nav.syfo). Spiken handler aldri om utseende, alltid om **atferd og form**: hvordan en tilstand utvikler seg, hvilke data en modell faktisk klarer å representere, hvordan et API-svar ser ut, eller hva en konsument gjør når den samme hendelsen kommer to ganger.

## Når dette er riktig verktøy

- Midt i en grilling (`/grill-with-docs`) dukker det opp et valg ingen av dere klarer å avgjøre på papir — "føles denne tilstandsmaskinen riktig når X skjer rett før Y?".
- Du vil presse en datamodell gjennom de stygge kantene før du skriver Flyway-migrasjonen.
- Du vil se den faktiske JSON-en og feilkontrakten et endepunkt skal gi, før du binder deg til den.
- Du er usikker på om en Kafka-konsument er idempotent / replay-trygg, og vil mate den en sekvens av records for hånd.

Hvis spørsmålet allerede er avklart og du bare skal bygge — feil verktøy. Bruk `/tdd` og skriv ekte kode test-først.

## Velg vinkel

Skriv ned spørsmålet i én setning øverst i spike-fila (eller i `.grill/STATE.md`) før du koder. En spike som svarer på feil spørsmål er ren sløsing.

- **"Føles modellen/tilstandsmaskinen riktig?"** → bygg en bitteliten interaktiv `main()` som lar deg drive modellen for hånd og se tilstanden endre seg etter hver handling.
- **"Hva skal API-formen / feilkontrakten være?"** → skissér request/response som `data class`, start en minimal `embeddedServer` med én route, og `curl` mot den til formen føles riktig.
- **"Holder Kafka-flyten?"** → isolér konsument-/produsentlogikken som en ren funksjon over en `record`-liste, og mat den hendelser i en valgt rekkefølge (duplikat, replay, out-of-order) og se hva som faller ut.

## Regler (gjelder alle vinkler)

1. **Kast-vekk fra dag én, og tydelig merket.** Legg spiken nær det den utforsker (samme pakke under `no.nav.syfo`), men i et eget spor som ingen forveksler med produksjon — f.eks. `src/test/kotlin/no/nav/syfo/spike/` eller en `SpikeXxx`-fil. Aldri under `main` der den kan ende i en deploy.
2. **Isolér logikken bak et rent grensesnitt.** Det som faktisk svarer på spørsmålet — reduceren `(state, event) -> state`, tilstandsmaskinen, settet av rene funksjoner, eller `data class`-ene — skal være løftbart rett inn i ekte kode senere. Ingen I/O, ingen `println` for kontrollflyt, ingen DB inni logikken. Runner-skallet rundt er søppel; kjernen er det eneste verdt å beholde.
3. **Én kommando å kjøre.** Bruk Gradle slik repoet allerede gjør — en throwaway `fun main()` kjørt via en `JavaExec`-task eller fra IDE, eller en `@Test` som driver modellen. Brukeren skal aldri måtte huske en sti.
4. **Ingen persistens som standard.** Tilstand lever i minnet. Persistens er det spiken *sjekker*, ikke noe den skal hvile på. Må du treffe en database, bruk en in-memory `H2`/Testcontainers-instans eller et lokalt skjema med navn som roper `SPIKE — slett meg`. Aldri en delt eller ekte database.
5. **Ingen auth, ingen polish.** Dropp TokenX/Azure AD-validering, `StatusPages`, retry, metrikker, logging utover det som gjør spiken *kjørbar*. Det er nettopp tingene du tester formen på, ikke noe spiken skal implementere.
6. **Vis tilstanden.** Etter hver handling (modell/maskin), eller for hver matet record (Kafka), eller i hvert svar (API): skriv ut hele den relevante tilstanden — én linje per felt eller formatert JSON — så du ser nøyaktig hva som endret seg.
7. **Slett eller absorbér når du er ferdig.** Når spørsmålet er besvart: enten slett spiken, eller løft den validerte kjernen inn i ekte kode (test-først via `/tdd`). Ikke la den råtne i repoet.

## Knytt til faseløkken (@grillmester)

Spiken er et sideverktøy *inne i* design- og planfasen, ikke et eget løp:

- **Utløses fra fase 1–2.** Når `/grill-with-docs` treffer en blind-spot ingen klarer å avgjøre (idempotens, en stygg tilstandsovergang, en tvilsom modell), pauser du grillingen, spiker svaret, og går tilbake.
- **Svaret er det eneste som lagres.** Når spiken har gjort jobben: én vanskelig-å-reversere beslutning → `docs/adr/NNNN-<tittel>.md` (via `/nav-architecture-review`). Et nytt eller skjerpet begrep → `docs/GLOSSARY.md` (via `/domain-modeling`). En bekreftet tilnærming → `docs/CONTEXT.md` og inn i `.grill/PLAN.md` som et avklart steg.
- **Notér åpne svar.** Kjører du AFK og brukeren ikke har bekreftet verdikten ennå: skriv spørsmålet + foreløpig funn i `.grill/STATE.md`, så det fylles inn før spiken slettes.

## Anti-mønstre

- **Ikke skriv tester for spiken.** Trenger spiken tester, er den ikke lenger en spike — da skal den løftes inn i ekte kode og testes der.
- **Ikke koble til ekte database, Kafka-cluster eller TokenX.** Mat hendelser og tilstand fra minnet. Spørsmålet er "holder formen?", ikke "virker infrastrukturen?".
- **Ikke generaliser.** Ingen "hva om vi senere vil støtte X". Spiken svarer på ett spørsmål.
- **Ikke bland kjernen og skallet.** Refererer reduceren/maskinen til `println`, HTTP eller en `Connection`, er den ikke lenger løftbar. Hold runneren som et tynt skall over en ren kjerne.
- **Ikke promotér spike-koden rett til produksjon.** Den er skrevet under spike-vilkår (ingen auth, ingen feilhåndtering). Skriv den ordentlig på nytt når du folder den inn.
