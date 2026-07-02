# Prosjektboard (GitHub Projects V2)

Programmatisk opprettelse (MCP, REST, `gh api`) knytter ikke issuet til et prosjektboard automatisk slik web-UI gjør. Kjør derfor dette steget etter at issuet er opprettet — men kun hvis boardet er konfigurert.

## Runtime-discovery

1. Les den relevante issue-malen i repoet: `.github/ISSUE_TEMPLATE/<type>.yml`
2. Finn `projects:`-linjen på formatet `["owner/number"]` (f.eks. `["navikt/157"]` → `owner=navikt`, `number=157`)
3. Mangler linjen → hopp over hele prosjektflyten uten å feile

Hardkod aldri felt-id-er, option-id-er eller statusnavn — oppdag dem per board.

## Minimumssekvens

0. **Auth-preflight:** kjør `gh auth status` og sjekk at `project`-scope finnes før første `gh project`-kall. Mangler scope, presenter ordrett:

   > For å oppdatere prosjektboardet trenger jeg `project`-scope på din `gh`-token. Kjør:
   > ```
   > gh auth refresh -s project
   > ```
   > Deretter kan jeg fortsette. Vil du heller hoppe over prosjekttilknytning for nå?

   Velger brukeren å hoppe over: skip prosjektsteget stille og fortsett resten av flyten.
1. **Finn prosjekt-id:** `gh project list --owner OWNER --format json`, match på `number`.
2. **Legg issuet inn:** `gh project item-add NUMBER --owner OWNER --url ISSUE_URL --format json`, lagre item-id.
3. **Oppdag felter:** `gh project field-list NUMBER --owner OWNER --format json`. Finn `Status` (og ev. `Type`) etter navn, les opsjoner fra responsen.
4. **Sett initielle verdier:** `gh project item-edit` med item-id, project-id, field-id og option-id.
   - **Status:** foretrekk `Todo`, ellers `Backlog`, ellers hopp over
   - **Type:** sett bare hvis boardet har feltet og en opsjon som matcher issue-typen

Finnes ikke et felt → hopp over kun det feltet, ikke hele opprettelsen.

## Statusovergang når arbeid starter

Når et issue plukkes og arbeid starter: samme auth-preflight og discovery, finn eksisterende item via `gh project item-list NUMBER --owner OWNER --format json --limit 100` (default returnerer maks 30), `item-add` hvis det mangler, og sett `Status` ved å matche mot synonymer: `In Progress`, `Doing`, `Påbegynt`, `I arbeid`, `Under arbeid`. Ingen treff → nærmeste aktive ikke-`Done`-opsjon.

## Feilhåndtering

- Manglende `projects:`-linje → skip stille
- Prosjekt ikke funnet / auth-feil i `gh project` → rapporter kort og fortsett; ikke rull tilbake issuet
- Felt/opsjon ikke funnet → skip kun det feltet
- `gh issue close` eller `Closes #...` flytter som regel issuet til `Done` automatisk via boardets innebygde `Item closed`-workflow (default på i nye prosjekter) — ikke bygg egen Done-logikk med mindre boardet krever det
