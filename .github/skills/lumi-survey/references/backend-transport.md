# Backend/BFF-transport

Widgeten sender til appens egen BFF. BFF-en utveksler token og videresender rå JSON til Lumi API.

## Prinsipper

- Videresend hele `submission.transportPayload` uendret uten å bygge egen payload.
- Behold blant annet `schemaVersion`, `surveyId`, `surveyType`, `submittedAt`, `definition`, `deduplicationKey`, `answers` og `context`.
- Ikke logg rå payload eller tokens.
- Returner feilstatus fra Lumi API slik at widgeten kan retrye.
- `deduplicationKey` er idempotency for retry etter transportfeil. Den ligger ikke i localStorage.

## Node.js BFF

```tsx
import { getToken, requestOboToken } from "@navikt/oasis";

export async function POST(request: Request) {
  const token = getToken(request);
  if (!token) return new Response("Unauthorized", { status: 401 });

  const obo = await requestOboToken(token, process.env.LUMI_AUDIENCE!);
  if (!obo.ok) return new Response("Token exchange failed", { status: 502 });

  const body = await request.text();
  const response = await fetch(`${process.env.LUMI_API_HOST}${process.env.LUMI_FEEDBACK_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${obo.token}`,
    },
    body,
  });

  if (!response.ok) return new Response("Lumi API error", { status: response.status });
  return new Response(null, { status: 204 });
}
```

## Kotlin BFF

```kotlin
post("/api/lumi/feedback") {
    val userToken = call.request.authorization()?.removePrefix("Bearer ")
        ?: return@post call.respond(HttpStatusCode.Unauthorized)

    val payload = call.receiveText()
    val oboToken = exchangeTokenWithTexas(
        identityProvider = System.getenv("LUMI_IDENTITY_PROVIDER"),
        target = System.getenv("LUMI_AUDIENCE"),
        userToken = userToken,
    )

    val lumiResponse = httpClient.post("${System.getenv("LUMI_API_HOST")}${System.getenv("LUMI_FEEDBACK_PATH")}") {
        contentType(ContentType.Application.Json)
        bearerAuth(oboToken)
        setBody(payload)
    }

    call.respond(lumiResponse.status)
}
```

## Endepunkt per auth-type

| Auth-type | `LUMI_FEEDBACK_PATH` |
|---|---|
| TokenX | `/api/tokenx/v1/feedback` |
| AzureAD | `/api/azure/v1/feedback` |

## Testflyt

- Happy case: submit og se svar i Lumi-dashboard.
- Retry: la BFF returnere 500 første gang og 204 andre gang. Samme widget-instans skal sende samme `deduplicationKey`, og backend skal ikke lage duplikat.
- Ny submission: etter success/reset/ny sidevisning skal ny innsending få ny `deduplicationKey` og lagres som ny tilbakemelding.
