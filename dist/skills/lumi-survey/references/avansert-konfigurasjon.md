## Avansert konfigurasjon

For avanserte brukstilfeller (forgreningslogikk, steg-for-steg-flyter, egendefinerte events, intro-skjermer, egne labels, styling):

1. Les de eksporterte TypeScript-typene: `node_modules/@navikt/lumi-survey/dist/index.d.ts`
2. Nøkkelgrensesnitt: `LumiSurveyDockProps`, `LumiSurveyConfig`, `LumiSurveyQuestion`, `LumiSurveyBehavior`, `LumiSurveyEvents`, `LumiSurveyStyle`
3. Full dokumentasjon: https://navikt.github.io/lumi/

**Events for analyseintegrasjon:**

```tsx
import {
  LumiSurveyDock,
  type LumiSurveyConfig,
  type LumiSurveyTransport,
} from "@navikt/lumi-survey";

const survey = {
  type: "rating",
  questions: [
    {
      id: "opplevelse",
      type: "rating",
      variant: "emoji",
      prompt: "Hvordan var opplevelsen?",
      required: true,
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

export function FeedbackSurvey() {
  return (
    <LumiSurveyDock
      surveyId="min-app-feedback-v1"
      survey={survey}
      transport={transport}
      events={{
        onSubmitSuccess: () => trackAnalyticsEvent("survey_completed"),
        onSubmitError: (cause) => logSurveyError("Survey submit failed", cause),
      }}
    />
  );
}

function trackAnalyticsEvent(eventName: string) {
  // Send kun lavkardinalitets eventnavn, ikke payload eller fritekst.
}

function logSurveyError(message: string, cause: unknown) {
  // Logg teknisk feil uten payload, token eller PII.
}
```
