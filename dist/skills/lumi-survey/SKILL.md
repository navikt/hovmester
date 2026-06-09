---
name: lumi-survey
description: Integrer og vedlikehold @navikt/lumi-survey med survey-design, v2-payload, transport, auth, NAIS accessPolicy og testflyt. Brukes når en agent skal lage, endre eller feilsøke Lumi Survey-widgeter, surveyId-strategi, feedback-endepunkt, datakontrakt eller tilhørende NAIS-oppsett i en Nav-app.
---

# Lumi Survey

Hjelp utviklere å lage en komplett Lumi-integrasjon: god survey, trygg payload, fungerende transport, riktig auth og tydelig validering.

## Agentregler

- Kartlegg før kode: rammeverk, Aksel-versjon, eksisterende survey, BFF/backend, auth i NAIS-manifest og hvor globale styles importeres.
- Bruk `@navikt/lumi-survey` v2-kontrakten: widgeten lager `schemaVersion: 2`, `definition` og `deduplicationKey`.
- Ikke be utvikleren fylle ut `definition` eller `deduplicationKey`; BFF skal videresende `submission.transportPayload`.
- Bruk ny `surveyId` når survey-strukturen endres: nye/fjernede/omdøpte spørsmål, ny type eller endrede options.
- Bruk stabile, maskinvennlige `id`/`value`-er: bokstaver/tall/`_`/`-`, maks 200 tegn. Ikke bruk punktum, slash, mellomrom eller brukerdata.
- Ikke legg PII i `surveyId`, `fieldId`, option values, `context.tags` eller `context.debug`.
- Bruk Aksel v8+ og importer `@navikt/ds-css` før `@navikt/lumi-survey/styles.css`.
- Velg TokenX eller AzureAD fra manifestet når det er entydig. Spør bare når auth er uklar.
- Hvis appen allerede bruker Lumi, endre eksisterende integrasjon i stedet for å lage parallell widget.

## Arbeidsflyt

1. **Kartlegg appen**: `package.json`, NAIS-manifest, style entry point, BFF/backend og eksisterende `lumi-survey`-bruk.
2. **Velg survey**: anbefal rating/emoji som standard, men bruk discovery/topTasks/taskPriority når formålet tilsier det.
3. **Lag konfig**: egen `survey.ts`, `satisfies LumiSurveyConfig`, konkrete norske spørsmål og stabile id-er.
4. **Koble transport**: frontend kaller appens BFF; BFF utveksler token og videresender rå payload til Lumi API.
5. **Oppdater NAIS**: env vars, TokenX/Azure, outbound accessPolicy og eventuell inbound-bestilling hos Team eSyfo.
6. **Valider**: submit happy case, feilet transport + retry, dashboard-synlighet, ingen PII, og ny `surveyId` ved strukturendring.

## Hurtigstart

```tsx
import "@navikt/ds-css";
import "@navikt/lumi-survey/styles.css";
import { LumiSurveyDock, type LumiSurveyConfig, type LumiSurveyTransport } from "@navikt/lumi-survey";

const survey = {
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
      id: "innspill",
      type: "text",
      prompt: "Hva kan vi gjøre bedre?",
      maxLength: 1000,
      visibleIf: { field: "ANSWER", questionId: "opplevelse", operator: "LT", value: 3 },
    },
  ],
} satisfies LumiSurveyConfig;

const transport: LumiSurveyTransport = {
  async submit(submission) {
    const response = await fetch("/api/lumi/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission.transportPayload),
    });
    if (!response.ok) throw new Error(`Lumi feedback feilet: ${response.status}`);
  },
};

<LumiSurveyDock surveyId="min-app-feedback-v1" survey={survey} transport={transport} />;
```

## Referanser

- Survey-design og spørsmålsmønstre: [references/survey-design.md](references/survey-design.md)
- Backend/BFF-transport: [references/backend-transport.md](references/backend-transport.md)
- NAIS-konfigurasjon og accessPolicy: [references/nais-konfigurasjon.md](references/nais-konfigurasjon.md)
- Avansert konfigurasjon: [references/avansert-konfigurasjon.md](references/avansert-konfigurasjon.md)
