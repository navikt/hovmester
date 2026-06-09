# Survey-design

## Velg riktig type

| Type | Bruk når | Standardmønster |
|---|---|---|
| `rating` | Du vil måle opplevelse eller tilfredshet | Emoji-rating + fritekst ved lav score |
| `discovery` | Du vil forstå hva brukeren prøver å gjøre | Fritekst om mål + om de fikk gjort det |
| `topTasks` | Du vil måle oppgavesuksess for kjente oppgaver | Oppgavevalg + fullføringsstatus + blokkering |
| `taskPriority` | Du vil prioritere oppgaver/roadmap | Multi-choice med mange oppgaver og `randomize` |
| `custom` | Du trenger spesifikk flyt | Bruk bare når de andre ikke passer |

Hvis utvikleren er usikker, anbefal `rating` med emoji og ett oppfølgingsspørsmål ved lav score.

## Spørsmålsregler

- Skriv konkret: "Hvordan var det å søke om sykepenger?" er bedre enn "Hvor fornøyd er du?".
- Bruk `visibleIf` for oppfølgingsspørsmål. Ikke vis alt på én gang.
- Hold `context.tags` lav-kardinalitet: rolle, flate, variant, feature. Ikke bruk bruker-ID, sak-ID eller fritekst.
- Bruk `context.debug` bare til teknisk feilsøking og aldri med PII.
- `id` og option `value` må være stabile. Endrer du dem, er det en strukturendring og krever ny `surveyId`.

## Eksempel: rating

```tsx
import type { LumiSurveyConfig } from "@navikt/lumi-survey";

export const survey = {
  type: "rating",
  questions: [
    {
      id: "opplevelse",
      type: "rating",
      variant: "emoji",
      prompt: "Hvordan var det å bruke tjenesten?",
      required: true,
    },
    {
      id: "lav_score_arsak",
      type: "text",
      prompt: "Hva gjorde opplevelsen dårlig?",
      maxLength: 1000,
      visibleIf: { field: "ANSWER", questionId: "opplevelse", operator: "LT", value: 3 },
    },
  ],
} satisfies LumiSurveyConfig;
```

## Eksempel: top tasks

```tsx
import type { LumiSurveyConfig } from "@navikt/lumi-survey";

export const survey = {
  type: "topTasks",
  questions: [
    {
      id: "task",
      type: "singleChoice",
      prompt: "Hva kom du hit for å gjøre?",
      randomize: true,
      required: true,
      options: [
        { value: "soke", label: "Søke" },
        { value: "sjekke_status", label: "Sjekke status" },
        { value: "sende_dokumentasjon", label: "Sende dokumentasjon" },
      ],
    },
    {
      id: "taskSuccess",
      type: "singleChoice",
      prompt: "Fikk du gjort det?",
      required: true,
      options: [
        { value: "yes", label: "Ja" },
        { value: "partial", label: "Delvis" },
        { value: "no", label: "Nei" },
      ],
    },
  ],
} satisfies LumiSurveyConfig;
```

Ikke legg `Annet` inn i en randomisert top tasks-liste med mindre det er greit at valget også flyttes rundt. Bruk heller fritekst-oppfølging ved behov.

## SurveyId-strategi

- Første produksjonsversjon: `appnavn-feedback-v1`.
- Ny `surveyId` ved alle strukturendringer: nye/fjernede/omdøpte spørsmål, endret type, endrede option values eller rating-variant.
- Ikke bytt `surveyId` for rene tekstendringer i labels/prompt hvis felt-id-er, typer og options er uendret.
- Ikke lag `surveyId` per deploy, bruker eller miljø.
