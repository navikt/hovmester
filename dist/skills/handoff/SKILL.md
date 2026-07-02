---
name: handoff
description: "Brukes når en økt nærmer seg slutten eller kontekstvinduet blir trangt, arbeidet ikke er ferdig, og en fersk tråd skal overta uten å miste tråden — 'lag en handoff', 'oppsummer tilstanden', 'vi fortsetter i morgen', 'jeg mister konteksten'. Kalles via /handoff. Design av nytt: /grill-with-docs."
---

# handoff

Komprimer tilstanden i den pågående økta til `.grill/STATE.md` slik at en fersk tråd kan plukke opp arbeidet uten å lese hele samtalen på nytt. Dette er **disk-som-minne**: konteksten lever på disk i `.grill/`, ikke i et chat-vindu som forsvinner.

## Når du skriver (vindu-trykk-checkpoint)

Lag eller oppdater handoff når **minst én** holder:

- En fase drar ut eller du nærmer deg en fase-grense, og arbeidet er ikke ferdig — **skriv før du blir tvunget**, ikke når det allerede er for sent å oppsummere godt. Du kan ikke måle vindu-prosenten din, så ikke vent på et tall; fase-grensen og «drar dette ut?» er triggeren.
- Brukeren signaliserer pause / trådbytte / ny chat.
- En @grillmester-fase er fullført og neste fase skal kjøres i en fersk tråd (design → plan → implementer → verifiser).

Venter du til vinduet er fullt, har modellen allerede mistet detaljene du trenger for en god handoff. Sjekkpunktet er hele poenget.

## Kontrakt

1. **Skriv til `.grill/STATE.md`** — én fil, fast plass. Ikke til OS-temp, ikke et tilfeldig navn. Neste tråd leser `STATE.md` først (samme konvensjon som `/diagnosing-bugs`).
2. **Ikke dupliser det som allerede ligger i artefakter.** `docs/CONTEXT.md` (mental modell), `docs/adr/` (beslutninger), `.grill/PLAN.md` (planen), `.grill/VERIFICATION.md` (ferskt grønt bevis), GitHub-issues, commits og diff bærer sin egen tilstand. **Referér dem med sti/URL** — ikke kopier innholdet inn.
3. **STATE.md er flyktig og overskrivbar.** Den fanger _hvor vi er akkurat nå_. Varige beslutninger hører hjemme i ADR, ikke her — oppstår en ny vanskelig-reversibel beslutning, løft den til `docs/adr/` via `/nav-architecture-review` og referér den.
4. **Redaksjon (Nav) — håndhevet av gate, ikke bare oppfordring.** Aldri fnr, tokens, passord, navn eller særlige kategorier i `STATE.md`. Logg ID-er/correlation (`callId`, `Nav-Call-Id`), branch-navn, issue-nummer, filstier — ikke personopplysninger eller hemmeligheter. `.grill/` er gitignorert (`.gitignore`), men behandles som om den var offentlig (defense-in-depth). Dette håndheves av pre-commit-gaten `scripts/scan-grill-pii.sh` (aktiveres med `git config core.hooksPath .githooks`), som skanner `.grill/` og alt som stages, og blokkerer commit ved mistanke om PII/hemmelighet.
5. **Handlingsrettet, ikke referat.** Neste tråd skal kunne ta neste steg fra første avsnitt. Kutt prosa om hva som ble diskutert; behold hva som ble besluttet og hva som gjenstår.
6. **Hold den liten og kuratert — readback er hele gevinsten.** `STATE.md` leses tilbake inn i en fersk tråd, så den skal være et lite, rent delsett — ikke en voksende logg. Tommelfingerregel: får den ikke plass på ~ett skjermbilde, komprimer. **Marker superseding ved å slette:** når en ny beslutning erstatter en tidligere, fjern den gamle linja — ikke la begge stå. En foreldet oppføring ved siden av sin revisjon er en «confident-wrong» distraktor som skader den ferske tråden mer enn fravær gjør. Mål det du faktisk leser tilbake, ikke bare at fila ble skrevet.

## STATE.md-mal

```markdown
# STATE — <kort tittel> (<dato>)

## Hvor vi er
<1–3 setninger: hvilken @grillmester-fase, hvilken branch, hva som er gjort så langt.>
Branch: <navn>  ·  Issue/PR: <#nr / URL>

## Beslutninger tatt i denne økta
- <beslutning> → ADR `docs/adr/NNNN-...md` (hvis vanskelig å reversere)
- <lettere valg som ikke fortjener ADR, men neste tråd må vite>

## Hva gjenstår
- [ ] <konkret oppgave>
- [ ] <konkret oppgave>

## Neste steg (start her)
1. <første konkrete handling den ferske tråden bør gjøre>
2. <...>

## Kontekst som ikke ligger andre steder
- <fallgruver, blindveier vi allerede har utelukket, halvferdige greier i arbeidstreet>
- Uncommitted endringer: <ja/nei — hva> (`git status`)

## Referanser (ikke duplisert her)
- Mental modell: `docs/CONTEXT.md`
- Plan: `.grill/PLAN.md`
- Beslutninger: `docs/adr/`
- Verifikasjon: `.grill/VERIFICATION.md`
- Issue/PR: <URL>

## Foreslåtte skills for neste tråd
- `/<skill>` — <hvorfor akkurat nå>
```

## Foreslåtte skills (alltid med)

Avslutt alltid `STATE.md` med en seksjon som peker neste tråd til riktig skill for neste steg. Velg ut fra hvor i faseløkka arbeidet står:

- `/grill-with-docs` — designet er ikke ferdig stresstestet (fase 1–2).
- `/codebase-design` eller `/api-design` — modul-/endepunktsform skal avklares.
- `/tdd` — implementasjon gjenstår, test-først.
- `/diagnosing-bugs` — en feil er åpen og må jaktes systematisk.
- `/nav-architecture-review` — en arkitekturbeslutning venter på ADR.
- `/security-review`, `/postgresql-review`, `/kafka-topic`, `/nais-manifest`, `/flyway-migration` — når neste steg treffer det respektive området.

## Etter skriving

Bekreft kort til brukeren: sti til `STATE.md`, og at en fersk tråd kan starte med "les `.grill/STATE.md`". Ikke gjenta innholdet i chatten — det er nå på disk.
