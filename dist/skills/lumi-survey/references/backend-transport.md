# Backend/BFF-transport

Widgeten sender til appens egen BFF. BFF-en utveksler token og videresender rå JSON til Lumi API.

## Prinsipper

- Videresend hele `submission.transportPayload` uendret uten å bygge egen payload.
- Sjekk faktisk payload-type i installert `@navikt/lumi-survey`. For v2: behold blant annet `schemaVersion`, `surveyId`, `surveyType`, `submittedAt`, `definition`, `deduplicationKey`, `answers` og `context`. For legacy v1: behold faktiske v1-felt og ikke legg til v2-felt selv.
- Ikke logg rå payload eller tokens.
- Returner feilstatus fra Lumi API slik at widgeten kan retrye.
- I v2 er `deduplicationKey` idempotency for retry etter transportfeil. Den ligger ikke i localStorage.
- Hvis brukeren refresher siden etter transportfeil før nytt forsøk, får ny widget-instans ny `deduplicationKey`; det blir en ny innsending. Dette gjelder bare når payloaden faktisk har `deduplicationKey`.

## Node.js BFF

Eksempelet bruker Fetch API-formen som passer Next.js App Router/TanStack Start. Tilpass request/response-håndtering til Express eller andre Node-rammeverk.

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
@Serializable
data class TexasTokenRequest(
    val identity_provider: String,
    val target: String,
    val user_token: String,
)

@Serializable
data class TexasTokenResponse(
    val access_token: String,
)

post("/api/lumi/feedback") {
    val userToken = call.request.authorization()?.removePrefix("Bearer ")
        ?: return@post call.respond(HttpStatusCode.Unauthorized)

    val payload = call.receiveText()
    val identityProvider = requireNotNull(System.getenv("LUMI_IDENTITY_PROVIDER"))
    val audience = requireNotNull(System.getenv("LUMI_AUDIENCE"))
    val lumiApiHost = requireNotNull(System.getenv("LUMI_API_HOST"))
    val feedbackPath = requireNotNull(System.getenv("LUMI_FEEDBACK_PATH"))

    val texasResponse = httpClient.post("http://localhost:3000/api/v1/token/exchange") {
        contentType(ContentType.Application.Json)
        setBody(
            TexasTokenRequest(
                identity_provider = identityProvider,
                target = audience,
                user_token = userToken,
            )
        )
    }

    val lumiResponse = httpClient.post("$lumiApiHost$feedbackPath") {
        contentType(ContentType.Application.Json)
        bearerAuth(texasResponse.body<TexasTokenResponse>().access_token)
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
- Retry: la BFF returnere 500 første gang og 204 andre gang. Med v2 skal samme widget-instans sende samme `deduplicationKey`, og backend skal ikke lage duplikat.
- Ny submission: etter success/reset/ny sidevisning skal ny v2-innsending få ny `deduplicationKey` og lagres som ny tilbakemelding.
- Dashboard: dev `https://lumi-dashboard.ansatt.dev.nav.no`, prod `https://lumi-dashboard.ansatt.nav.no/`.
