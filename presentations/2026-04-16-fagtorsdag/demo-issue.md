# Pre-specced GitHub issue — live-demo

Opprett denne som issue i `navikt/syfo-oppfolgingsplan-frontend` onsdag kveld. Assign til `@hovmester` når du starter demoen.

**Tittel:** Vis stillingstittel og stillingsprosent på plan-detaljsiden

---

## Body

```markdown
## Oppgave

Utvid plan-detaljvisningen med stillingsinformasjon som nettopp ble eksponert i backend.

**Figma:** https://www.figma.com/design/Pb0fjag25Qc5W9PRD5qO6K/eSYFO-oppfølgingsplan?node-id=4590-30257

**Backend-kontrakt landet:** navikt/syfo-oppfolgingsplan-backend#<NR>
(responsen inkluderer nå `stillingstittel: string | null` og `stillingsprosent: number | null`)

## Acceptance criteria

- [ ] Stillingstittel og stillingsprosent rendres på plan-detaljsiden i henhold til Figma-skissen
- [ ] Bruk Aksel v8-komponenter: `Card`, `BodyShort`, `Heading` — følg eksisterende mønster i `src/components/plan-detail/`
- [ ] Tomstate: hvis begge felter er `null` (sykmeldte uten registrert ansettelse), skjul hele seksjonen (ikke vis "ikke oppgitt" eller lignende)
- [ ] Delvis tomstate: hvis kun ett felt er `null`, vis det andre alene
- [ ] Zod-typer oppdatert i `src/api/schemas/oppfolgingsplan.ts` i samsvar med backend-kontrakt
- [ ] Data-henting via eksisterende `useOppfolgingsplan`-hook — ingen ny hook eller ny endpoint-kall
- [ ] Accessibility: feltene er lesbare for skjermleser (bruk `dl`/`dt`/`dd` eller `Label` + `BodyShort` etter eksisterende mønster)
- [ ] Minst én test i `src/components/plan-detail/__tests__/` som dekker visning + tomstate

## Mønster å følge

- Komponentfil: `src/components/plan-detail/StillingsInfo.tsx` (ny)
- Testfil: `src/components/plan-detail/__tests__/StillingsInfo.test.tsx`
- Komposisjon: importer i `PlanDetail.tsx` under eksisterende "Om arbeidstaker"-seksjon
- Typer: utvid `Oppfolgingsplan`-schema med to optional-felt

## Ikke-scope

- Ingen nye routes eller endepunkter
- Ingen endringer i autentisering/autorisering
- Ikke rør `PlanDetail.tsx`-layout utover å montere den nye komponenten
- Ingen ny state-manager eller context
- Ingen i18n-endringer (alt er norsk)

## Risiko

- Figma-node-ID peker til spesifikk komponent; hvis Figma MCP ikke får tilgang, fall tilbake til manuell lesning av node-struktur
- Accessibility-regler i Nav er strenge — følg eksisterende a11y-mønstre i nabokomponenter
```

---

## Notater til taleren

**Hvorfor denne issuen er skrevet slik:**

- *Acceptance criteria* lister alle de vanlige Steg 0-spørsmålene som sjekkbokser. Hovmester trenger ikke spørre "hvilken komponent?", "hva med tomstate?", "test?", fordi alt står her.
- *Mønster å følge* gir Konditor konkrete filstier. Ingen leting etter konvensjoner.
- *Ikke-scope* lukker "skal jeg også …?"-avsporinger.
- *Backend-kontrakt* er en lenke til en faktisk landet PR (fra din dry-run tirsdag). Det er troverdighetens ankerpunkt — dette er *ekte* integrasjon, ikke mockdata.
- *Risiko*-seksjonen er ikke for hovmester, men for deg: hvis Figma MCP feiler under demoen, har du et forhåndstenkt fallback.

**Når du kjører demoen:**

1. Åpne issue i browser (kort visning for publikum — 10 sek)
2. I terminal: `copilot --agent hovmester --prompt "Løs issue #<NR> i dette repoet"` eller tilsvarende invocation
3. La hovmester kjøre. Hvis Steg 0 produserer spørsmål, svar kort — det er en *feature* å vise, ikke en feil.

**Om issuen leveres til @hovmester i VS Code eller CLI:**

CLI gir penest output for publikum (strukturert logg). VS Code er bra hvis du vil vise split-panel med kode. **Anbefaling: CLI i stor terminal på venstre halvdel av skjermen**, nettleser med issue/PR på høyre halvdel.
