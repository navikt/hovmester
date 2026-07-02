# Format for GLOSSARY.md

Glossaret bor i `docs/GLOSSARY.md`. Det er en ordliste over begreper som er spesifikke for dette domenet — ingenting annet.

## Struktur

```md
# Glossar — <context/modulnavn>

<Én til to setninger om hva denne contexten er og hvorfor den finnes.>

## Språk

**Sykmeldt**:
Personen oppfølgingen gjelder. Identifiseres med `Ident`.
_Unngå_: bruker, pasient, arbeidstaker

**Veileder**:
Nav-ansatt som følger opp sykefraværet. Logger inn via Azure AD (NAVident).
_Unngå_: saksbehandler, bruker

**Ident**:
Personens folkeregistrerte fødselsnummer eller D-nummer (11 siffer). Brukes som nøkkel mot eksterne tjenester.
_Unngå_: fnr, personnummer, aktørId (aktørId er en egen, ikke-utbyttbar identifikator)
```

## Regler

- **Vær bestemt.** Finnes flere ord for samme begrep, velg det beste og list de andre under `_Unngå_`. Glossaret tar et standpunkt.
- **Hold definisjonene stramme.** Maks én til to setninger. Definer hva noe ER, ikke hva det gjør.
- **Bare begreper spesifikke for denne contexten.** Generelle programmeringsbegreper (timeout, feiltyper, paginering, retry) hører ikke hjemme — selv om koden bruker dem mye. Spør før du legger til: er dette unikt for sykefravær-/Nav-domenet, eller et generelt teknisk begrep? Bare det første hører hjemme.
- **Ingen implementasjonsdetaljer.** Tabellnavn, Kafka-topic-navn, klassenavn og endepunkt hører til kode/ADR, ikke glossaret.
- **Grupper under underoverskrifter** når naturlige klynger oppstår (f.eks. «Aktører», «Hendelser», «Tilstander»). Henger alt sammen i ett tema, holder en flat liste.

## Flere contexts

Er domenet delt i flere bounded contexts (egne moduler under `no.nav.syfo`), legg en kort kart-seksjon øverst som peker på hvor hver context bor og hvordan de henger sammen:

```md
## Contexts

- **Sykmelding** (`no.nav.syfo.sykmelding`) — mottar og tolker sykmeldinger
- **Oppfølging** (`no.nav.syfo.oppfolging`) — veileders oppfølgingsløp

## Relasjoner

- **Sykmelding → Oppfølging**: Sykmelding publiserer `SykmeldingMottatt` på Kafka; Oppfølging konsumerer for å starte løpet.
- Delt nøkkel: `Ident` eies konseptuelt av Sykmelding; andre contexts refererer kun via verdien.
```

Er det uklart hvilken context et begrep hører til — spør før du skriver.
