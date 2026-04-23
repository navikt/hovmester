# GitHub Projects V2

## Når trengs dette?

Web UI kan auto-knytte issue til prosjekt via `projects:` i issue-malen. Programmatisk opprettelse (MCP, REST, `gh api`) gjør ikke det automatisk. Kjør derfor prosjekt-steget etter at issuet er opprettet.

## Runtime-discovery av prosjekt

1. Les den relevante issue-malen i målrepoet: `.github/ISSUE_TEMPLATE/<type>.yml`
2. Finn `projects:`-linjen i format `["owner/number"]` (f.eks. `["navikt/157"]` → `owner=navikt`, `number=157`)
3. Parse `owner` og prosjektnummer fra denne linjen
4. Hvis linjen mangler: issue-malen i repoet har ikke en `projects:`-linje → hopp over hele prosjektflyten uten å feile

Bruk malen i consumer-repoet, ikke hovmester-kilden. Sync kan ha strippet `projects:` helt bort.

## Minimumssekvens for prosjekttilknytning

1. **Finn prosjekt-ID**  
   Bruk `gh project list --owner OWNER --format json` og finn prosjektet der `number` matcher prosjektnummeret fra malen. Lagre både project number og project ID.
2. **Legg issuet inn i prosjektet**  
   Bruk `gh project item-add NUMBER --owner OWNER --url ISSUE_URL --format json` og lagre returnert item-ID.
3. **Oppdag felter dynamisk**  
   Bruk `gh project field-list NUMBER --owner OWNER --format json`. Finn felter som `Status` og eventuelt `Type` etter navn, og les opsjoner fra responsen. Felt og option-ID-er er prosjektspesifikke — hardkod aldri verdier.
4. **Sett initielle feltverdier**  
   Bruk `gh project item-edit` med item-ID, project-ID, oppdaget field-ID og option-ID for single-select-felter.
   - **Status**: foretrekk `Todo`, ellers `Backlog`, ellers hopp over
   - **Type**: sett bare hvis prosjektet faktisk har et slikt felt og en opsjon som matcher issue-typen

Hvis et felt ikke finnes i boardet, skal kun det feltet hoppes over — ikke hele opprettelsen.

## Statusovergang når arbeid starter

Når brukeren velger et issue og ber om å starte arbeid:

1. Kjør samme runtime-discovery av `projects:`-linjen
2. Finn eksisterende item via `gh project item-list NUMBER --owner OWNER --format json` og match på issue-URL. Merk at `item-list` returnerer maks 30 items som standard; bruk `--limit` for store prosjekter, eller gjenta søket med paginering.
3. Hvis issuet ikke allerede ligger i prosjektet, kjør `item-add` først
4. Hent feltmetadata på nytt via `field-list`
5. Oppdater `Status` til første opsjon som matcher kjent synonym case-insensitivt: `In Progress`, `Doing`, `Påbegynt`, `I arbeid`

Ikke anta at alle board bruker samme statusnavn. Match mot tilgjengelige opsjoner i det konkrete prosjektet.

## Feilhåndtering

- Manglende `projects:`-linje → skip hele prosjektsteget stille
- Prosjekt ikke funnet via `gh project list` → rapporter kort og fortsett; issuet er allerede opprettet
- Auth-/rettighetsfeil i `gh project` → rapporter kort og fortsett; ikke rollback issuet
- Felt eller opsjon ikke funnet → skip bare det feltet
- `gh issue close` eller PR med `Closes #...` vil i de fleste Projects V2-oppsett flytte issuet til `Done` automatisk; ikke bygg egen Done-logikk med mindre boardet krever det
