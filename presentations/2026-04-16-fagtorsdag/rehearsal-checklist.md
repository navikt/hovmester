# Rehearsal-sjekkliste — fagtorsdag 16. april

Talen er 25 min med live-demo uten pre-recorded backup. Sjekklisten er designet for å redusere risiko slik at du slipper screencast.

---

## Tirsdag (14. april) — dress rehearsal 1: backend

**Mål:** få backend-siden landet, og samtidig teste hovmester på en ekte Nav-oppgave for å lære hvordan den oppfører seg.

- [ ] Kjør hovmester i `syfo-oppfolgingsplan-backend`: *"utvid `/api/v1/oppfolgingsplan/:id`-responsen med `stillingstittel: string | null` og `stillingsprosent: number | null`. Hent fra aareg-integrasjonen som allerede er satt opp."*
- [ ] Noter: hvor lang tid tok hele Steg 0–5? Hvor mange spørsmål stilte hovmester?
- [ ] Sjekk at Inspektør-Claude faktisk reviewet GPT-koden — har du én review-kommentar du kan vise på torsdag?
- [ ] Merge PR-en. Noter PR-nummeret — du skal lenke til det i frontend-issuet.

**Hvis hovmester bruker >30 min eller stiller flere enn 2 spørsmål:**
- Forbedre prompten for onsdag (mer eksplisitt acceptance criteria)
- Eller: vurdér om Kafka/aareg-integrasjonen krever flere eksplisitte hints

---

## Onsdag (15. april) — dress rehearsal 2: frontend

**Mål:** kjøre den *eksakte* live-demoen med timing, slik at du vet nøyaktig hva som skjer.

- [ ] Opprett issue i `syfo-oppfolgingsplan-frontend` med body fra `demo-issue.md`. Link til backend-PR fra tirsdag.
- [ ] Start en stopwatch. Kjør hovmester: `copilot --agent hovmester --prompt "Løs issue #<NR>"`
- [ ] **Tidsmål:** under 15 min total, ingen blokker, maks 1 spørsmål underveis
- [ ] Hvis demoen tar >18 min eller henger:
  - Stram issue-body (legg til mer HVA-spesifisering)
  - Eller: reduser scope (f.eks. kun stillingstittel, ikke også stillingsprosent)
  - Gjenta til timing ligger stabilt på 10–15 min
- [ ] Når du har en ren kjøring: **ikke merge PR-en**. La den stå som "gårsdagens run" for torsdag
- [ ] Noter eventuelle interessante Inspektør-GPT-kommentarer — du kan peke på dem live

**Dette er din safety net uten å være backup:** en merget backend-PR + en ikke-merget frontend-PR fra onsdag betyr at hvis torsdagens live-run henger, kan du si *"hovmester henger litt akkurat nå — la meg vise dere gårsdagens ferske run i stedet"* og bytte til onsdags-PR-en. Det er ikke pre-recorded, det er et ekte forrige run.

---

## Onsdag kveld — teknisk oppsett

- [ ] Start Reveal-decken: `presentations/2026-04-16-fagtorsdag/html/present.sh`
- [ ] Sjekk at alle slides rendrer, spesielt SVG-diagrammene, terminalblokkene og siste repo-/kilde-slide
- [ ] Eksporter PDF fra browserens print-dialog hvis du vil ha offline backup
- [ ] Last ned PDF-en på laptopen *og* legg den i OneDrive/Dropbox
- [ ] Test PDF-en åpnes i fullskjermsmodus og kan navigeres med piltaster
- [ ] Hvis mulig: test på en stor skjerm/projector — sjekk at mørk terminalstil er lesbar bakerst i rommet
- [ ] Sjekk internettforbindelse. Har du hotspot som backup hvis venue-wifi er dårlig?

---

## Torsdag morgen (før 09:00)

- [ ] Logg inn på: GitHub, Copilot CLI (`copilot auth status`), nettleser
- [ ] Kjør hovmester én gang for å varme opp: `copilot --agent hovmester "sjekk status"` eller lignende lett query
- [ ] Lukk: Slack, Teams, Discord, mail-klient, alt som kan popup'e
- [ ] Skru av notifikasjoner i OS (Focus-modus / Do Not Disturb)
- [ ] Skru av Copilot-autocomplete i alle åpne editorer (så det ikke forstyrrer)
- [ ] Sett terminal-font til **minst 18pt**, gjerne 20pt. Terminal-bakgrunn mørk matcher presentasjonen.
- [ ] Test mikrofonen. Test HDMI-adapter. Test wifi.
- [ ] Åpne disse tabs i nettleser: backend-PR fra tirsdag, frontend-issue, Figma-skissen (i spontan behov), `github.com/navikt/hovmester`
- [ ] Kjør issue-invocation *én gang med `--dry-run` eller tilsvarende* for å sjekke at auth er OK (ikke start en ny hovmester-run)

---

## 5 min før start

- [ ] Åpne: Reveal-deck i browser på venstre halvdel, terminal på høyre halvdel
- [ ] Ha frontend-issue-tab klar i browser
- [ ] Pust
- [ ] Start stopwatch når du tar ordet

---

## Under talen — sjekkpunkter

- **Minutt 0–0:30:** Tittel. Start hovmester i terminal mens du sier tittelen. Publikum ser terminalen i split.
- **Minutt 0:30–6:** Hva en agent trenger: context window, path-scoped instructions, skills.
- **Minutt 6–13:** Når du trenger orkestrator: context overflow, rolleisolasjon, kryssmodell-review.
- **Minutt 13–16:** Hvor investeringen virker: instructions/skills på flere overflater, full orkestrering primært i CLI.
- **Minutt 16–22:** Bytt til terminal/GitHub. Vis status, PR, diff og én Inspektør-GPT-kommentar.
- **Minutt 22–24:** Tre observasjoner.
- **Minutt 24–25:** Repo-lenke, kilder og spørsmål.

---

## Hvis noe går galt

| Problem | Det du sier | Det du gjør |
|---|---|---|
| Demo henger på spørsmål | "Hovmester stiller spørsmål når den trenger det. Akkurat nå venter den på meg." | Svar spørsmålet kort, fortsett talken |
| Demo er ikke ferdig ved min 17:30 | "Den jobber fortsatt. La oss gi den et øyeblikk." | Fortsett med distribusjons-slide, eller vis backend-PR fra tirsdag som "same machinery, annen retning" |
| Demo har crashet eller feilet stille | "Hovmester kjørte samme jobb onsdag kveld. Det er det resultatet jeg skal vise dere." | Bytt til onsdags-PR som "gårsdagens run" |
| Internett dør | "Wifi-en tok en pause. Godt jeg har slides lokalt." | Bytt til PDF-versjonen av presentasjonen, fortsett uten demo-resultat (vis onsdags-PR hvis du har lokal kopi) |
| Browser/deck crasher | "Jeg bytter til PDF." | Åpne PDF i fullskjerm, fortsett |
| Du glemmer hvor du er | "Tilbake til rammen." | Gå tilbake til kontekst-premisset (slide 2) — det er ankerpunktet |

---

## Post-talk

- [ ] Merge onsdags-frontend-PR (hvis ikke allerede merget live)
- [ ] Send lenker til talen til interesserte team
- [ ] Noter publikumsspørsmål som kom opp — mulig input til hovmester roadmap
- [ ] Slett `presentations/2026-04-16-fagtorsdag/`-mappen hvis du ikke vil ha den i repoet
