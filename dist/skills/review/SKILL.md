---
name: review
description: "Brukes når egen diff skal granskes før kryssmodell-review (grill-inspektor) eller PR — en uforpliktet endring, en branch mot main, eller diffen siden et fast punkt, sjekket for korrekthet, regresjon, kanttilfeller og scope. 'Selvreview', 'gå gjennom egen diff', 'review før PR', 'review siden X'. Kalles via /review."
---

# Selvreview — gå gjennom egen diff før andre øyne

Disiplinen for å granske **din egen** endring før du bruker en dyrere ressurs på den. Dette er ikke en agent — det er det du gjør inline, på din egen diff, i **verifiser**-fasen til @grillmester, FØR du eventuelt kaller `grill-inspektor` (kryssmodell-review) eller åpner PR.

Poenget: kryssmodell-review (GPT-5.5, annen familie) er opt-in og kostbar. Ikke bruk den på funn du selv kunne tatt. Selvreview er det billige passet som rydder bort det åpenbare, så de friske øynene bruker budsjettet sitt på blindsonene dine — ikke på slurv.

## Kjerneproblemet: du er partisk på egen kode

Du skrev koden. Du «vet» hva den gjør, så du leser intensjonen din, ikke teksten på skjermen. Selvreview virker bare hvis du bryter den partiskheten bevisst:

- **Les diffen som en motstander**, ikke som forfatter. Anta at hver linje skjuler en feil til den motbeviser seg selv.
- **Les teksten, ikke minnet.** Hvert kall til ekstern tjeneste, hver null-håndtering, hver tilstandsendring leses som om en fremmed skrev den.
- **Et grønt testpass beviser ikke korrekthet** — bare at testene du tenkte på, passerer. Selvreview leter etter det testene ikke dekker.

## 1. Fest punktet og hent diffen

Fast punkt er det brukeren oppga — commit-SHA, branch, tag, `main`, `HEAD~5`. Mangler det, spør. Verifiser at det resolver, og at diffen ikke er tom, FØR du går videre:

```bash
git rev-parse <fast-punkt>                 # resolver referansen?
git diff <fast-punkt>...HEAD --stat        # tre-prikk = mot merge-base
git log <fast-punkt>..HEAD --oneline       # commits i scopet
```

Bruk **tre-prikk** (`...HEAD`) så du sammenligner mot felles forfar, ikke mot en branch som har drevet videre. Hold deg til ett diff-scope gjennom hele reviewen.

## 2. Seks akser — hold dem adskilt

Gå gjennom diffen langs seks akser. **Ikke slå dem sammen.** En endring kan passere én akse og stryke på en annen (korrekt kode som implementerer feil krav; rett krav implementert i strid med repoets konvensjoner). Slår du dem sammen, maskerer den ene den andre.

### A. Korrekthet
Gjør hver endret linje det den ser ut til å gjøre? Les kontrollflyten, ikke kommentarene. Av-for-én, invertert betingelse, feil variabel, glemt `return`, suspenderende kall uten `await`/coroutine-scope, `runBlocking` i en hot path, ressurs som ikke lukkes (`use {}`).

### B. Regresjon
Hva ELLERS treffer den endrede koden? Følg kallere oppover: endret du en delt funksjon, en route-handler, en serialiseringsmodell, et DTO som også brukes av en annen konsument? Endret signatur eller default-verdi som stille endrer atferd for eksisterende kallere? Sjekk om en eksisterende test burde ha fanget endringen — gjorde den ikke det, mangler dekning.

### C. Kanttilfeller
Tom liste, `null`, manglende felt, samtidighet, retry, timeout. Nav/Ktor-spesifikt — se sjekklisten under.

### D. Scope (diff-disproporsjon)
Er det noe i diffen som oppgaven IKKE ba om? Refaktorering snikinnført i en feilretting, urelatert formattering, en «mens jeg var her»-endring. Hver hunk skal kunne spores til et krav i `PLAN.md`/`CONTEXT.md`. Det motsatte også: ba oppgaven om noe som ikke er i diffen?

### E. Krav-dekning (mot spec)
Sammenlign diffen mot `docs/CONTEXT.md` (krav) og `.grill/PLAN.md` (ferdig-når-kriterier). For hvert krav: innfridd / delvis / mangler. For hver ADR i `docs/adr/` som rører området: følger koden beslutningen, eller avviker den stille? Et stille ADR-avvik er en blocker, ikke en detalj.

### F. Standard-dekning (mot repoets konvensjoner)
Følger koden måten dette repoet skriver kode på — Ktor-route-struktur, feilkontrakt via StatusPages, DI-mønster, navngiving, pakkestruktur under `no.nav.syfo`? Hopp over alt verktøy håndhever (formattering, import-orden) — det fanges av gatene, ikke av øynene dine.

## Nav/Ktor-kanttilfeller (akse C, sjekkliste)

- **Auth:** Manglende eller feil claim-sjekk? `azp` validert mot `AZURE_APP_PRE_AUTHORIZED_APPS`? NAVident/`pid` hentet trygt (ikke `!!` på en claim som kan mangle)? Route bak riktig `authenticate("…")`-gren?
- **PII i logger:** Sniker fnr, navn, diagnose eller sykmeldingsstatus seg inn i en standard-logglinje via string-interpolasjon? Visning av persondata til ansatt → CEF-auditlog, ikke standardlogg. (Detaljer: `/security-review`.)
- **Kafka:** Tom/`null` record-value? Idempotens ved redelivery? Manuell vs. auto-commit-semantikk? Poison-message — havner den i DLQ eller looper den? Offset committet før eller etter sideeffekt?
- **Postgres/Flyway:** Ny migrering — kjørbar fremover OG bakoverkompatibel med kjørende pods (rolling deploy)? `NOT NULL`-kolonne uten default på en ikke-tom tabell? N+1 introdusert? Connection lukket / returnert til pool? Transaksjonsgrense rundt fler-stegs skriving?
- **Ktor HTTP:** Feil mappet til riktig status via StatusPages (ikke lekket stacktrace til klient)? `Nav-Call-Id` propagert til utgående kall? Timeout og retry på eksterne kall? Paginering bevart?
- **NAIS:** Endret `accessPolicy.inbound` speilet i auth-koden, og omvendt? `outbound` mot riktig cluster/namespace? Ny env-variabel faktisk satt i manifestet?
- **Coroutines:** Blokkerende kall i en suspend-funksjon? Manglende `CoroutineScope`/structured concurrency? Exception svelget i en launch?

## 3. Fiks, deretter lever til ferske øyne

Selvreview produserer en handling, ikke en rapport til arkivet:

1. **Funn du kan fikse nå → fiks dem inline.** Det er hele poenget med å ta dem selv.
2. **Kjør de deterministiske gatene på nytt** etter fiks — `./gradlew test` (og `build`/lint der det finnes). Hardt pass/fail, med ferskt bevis i samme melding. Ingen «ser bra ut» uten kommando + output + exit-kode.
3. **Funn du bevisst lar stå** (utenfor scope, egen oppgave) → noter dem kort i `.grill/STATE.md` så de ikke forsvinner.
4. **Bindende beslutninger** som dukker opp under reviewen (valgt mekanisme, ny datakategori) → fang som ADR i `docs/adr/`, ikke i en kommentar.

Først NÅ er diffen klar for det dyre passet: kall `grill-inspektor` for kryssmodell-review (anbefalt-på ved R3/R4 — auth, PII, schema, API-kontrakt, Kafka, deploy; opt-in ellers). Den er read-only (`tools: [read, search]` — kan ikke skrive filer), verifiserer uavhengig mot KRAV og BESLUTNINGER og **returnerer** verdiktet; `@grillmester` skriver det til `.grill/REVIEW.md` (de deterministiske gatene eier `.grill/VERIFICATION.md`). Selvreview erstatter den aldri — den gjør den verdt pengene.

## Flytkobling

- **Fase i faseløkka:** verifiser (fase 5), steg før den opt-in kryssmodell-reviewen.
- **Leser:** `docs/CONTEXT.md`, `.grill/PLAN.md`, `docs/adr/`, `.grill/STATE.md`.
- **Komplementerer:** `grill-inspektor` (agenten gjør kryssmodell-passet; denne skillen er din egen disiplin før det).
- **Relaterte skills:** `/security-review` (PII/auth/accessPolicy-dybde ved R3/R4), `/kotlin-ktor` (route-/auth-/feilkontrakt-konvensjoner du måler akse F mot), `/flyway-migration` (bakoverkompatibel migrering), `/postgresql-review` (N+1, pool, indeks), `/kafka-topic` (idempotens, commit-semantikk), `/diagnosing-bugs` (når et funn er en faktisk bug som må root-cause-es).
