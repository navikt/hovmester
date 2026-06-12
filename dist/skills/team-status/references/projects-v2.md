# GitHub Projects v2 — teknisk tilgang

Oppskrifter for å lese (og forsiktig skrive til) en Projects v2-tavle. Felter, opsjoner og ID-er er prosjektspesifikke — hent dem alltid ved kjøring.

## GitHub MCP `projects`-toolset (foretrukket)

Tre verktøy:

- `projects_list` — lister prosjekter for en owner
- `projects_get` — henter ett prosjekt, inkludert felter og items
- `projects_write` — oppretter/oppdaterer items med feltverdier

To forutsetninger som ofte mangler:

1. Toolset-et må eksplisitt aktiveres i serveroppsettet (typisk `--toolsets=projects` eller tilsvarende toolset-konfig)
2. Tokenet må ha project-scope

Verktøyene **skjules automatisk** uten riktig scope. Ser du ikke `projects_*`-verktøyene, er det altså aktivering eller scope som mangler — gå til feilsøkingstabellen nederst, eller fall tilbake til `gh`.

## `gh`-fallback

```bash
gh project view <nummer> --owner <org> --format json
gh project item-list <nummer> --owner <org> --format json --limit 200
gh project field-list <nummer> --owner <org> --format json
```

`item-list` returnerer flate feltverdier per item og er som regel nok til rapportene. Default-limiten er 30 items — bruk `--limit 100` (eller paginer) ved store tavler. `field-list` gir feltdefinisjoner med opsjons-ID-er (trengs før skriving).

`gh project`-kommandoene krever også project-scope:

```bash
gh auth refresh -s project
```

## GraphQL-fallgruver

Trenger du `gh api graphql` (f.eks. for iterasjonskonfigurasjon), gjelder dette:

**Feltverdier er GraphQL-unions** (`ProjectV2ItemFieldTextValue` / `...SingleSelectValue` / `...IterationValue`) — hent dem med inline fragments og flat ut klientside etterpå:

```graphql
query($owner: String!, $number: Int!) {
  organization(login: $owner) {
    projectV2(number: $number) {
      items(first: 100) {
        nodes {
          content { ... on Issue { number title repository { nameWithOwner } } }
          fieldValues(first: 20) {
            nodes {
              ... on ProjectV2ItemFieldTextValue {
                text
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldSingleSelectValue {
                name
                field { ... on ProjectV2FieldCommon { name } }
              }
              ... on ProjectV2ItemFieldIterationValue {
                title startDate duration
                field { ... on ProjectV2FieldCommon { name } }
              }
            }
          }
        }
      }
    }
  }
}
```

- **Oppdatering av single-select/iterasjon krever opsjon-ID/iterasjons-ID**, ikke navnet på verdien. Hent feltmetadata først (`field-list` eller `projects_get`) og slå opp ID-en.
- **Tømming av felt** har egen mutation: `clearProjectV2ItemFieldValue`. Du kan ikke sette verdien til null.
- **Lukkede iterasjoner** ligger i feltets `configuration.completedIterations`, separat fra de aktive i `configuration.iterations` — sjekk begge når du leter etter en forrige iterasjon.
- **Feltdefinisjoner kan IKKE endres via API.** Det finnes ingen mutations for å legge til eller endre single-select-opsjoner. Foreslå teksten — et menneske legger den inn i prosjektinnstillingene.

## Feilsøking

| Symptom | Sannsynlig årsak | Brukeren bør sjekke |
|---|---|---|
| `projects_*`-verktøyene finnes ikke | Toolset ikke aktivert | At `projects` står i `--toolsets`/toolset-konfigen for GitHub MCP-serveren |
| Verktøyene mangler selv om toolset er aktivert | Token uten project-scope | Token-scopene; PAT/App-token med project-scope. I Actions: default `GITHUB_TOKEN` når aldri Projects-API-et |
| `gh project` gir auth-/rettighetsfeil | `gh`-token uten project-scope | `gh auth status`, deretter `gh auth refresh -s project` |
| Prosjektet finnes ikke / tom respons | Org-prosjekt utilgjengelig for tokenet | At owner/nummer stemmer, at brukeren ser tavla i nettleseren, og at tokenet er autorisert for org-en (SSO) |

Hjelper ingenting av dette: be brukeren lime inn det relevante fra tavla, og bygg rapporten fra det.
