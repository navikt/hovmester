---
name: create-skill
description: Hjelper brukere å opprette nye Copilot skills med riktig lean-filter, plassering, struktur og registrering i repo eller hovmester.
---

# Create skill

Bruk denne når noen sier "jeg vil lage en skill", "kan vi dokumentere X som skill" eller trenger hjelp til å opprette en ny Copilot-skill.

## 1. Velg scenario

| Scenario | Bruk når | Hvor opprettes den | Registrering |
|---|---|---|---|
| Repo-lokal skill | Behovet er spesifikt for ett repo/team | `.github/skills/<navn>/SKILL.md` | Ingen |
| Hovmester-skill | Minst to Nav-team vil ha nytte av den | `dist/skills/<navn>/SKILL.md` | `collections.yml` |
| Meta-skill i hovmester | Hjelper hovmester-repoet selv, men skal ikke distribueres | `.github/skills/<navn>/SKILL.md` i hovmester | Ingen |

Start med spørsmålet: **Vil minst to Nav-team ha nytte av dette?**
- Ja → lag hovmester-skill
- Nei → lag repo-lokal skill
- Kun for arbeidsflyten i hovmester-repoet → lag meta-skill i `.github/skills/`

## 2. Skill vs instruction

- **Instruction**: auto-lastet via `applyTo`-glob og gjelder alltid for bestemte filer eller teknologier
- **Skill**: brukes on-demand når oppgaven matcher behovet

Hvis brukeren egentlig beskriver en fast regel per filtype, mappe eller teknologi:
1. Stopp
2. Forklar at dette høres ut som en instruction
3. Foreslå instruction i stedet for skill

## 3. Lean-filteret

Skillen må passere begge spørsmålene:

- Lærer dette modellen noe den **ikke** kan fra før?
- Lærer dette modellen noe **Nav- eller repo-spesifikt**?

Bruk denne sjekklisten:
- [ ] Dekker skillen et tilbakevendende arbeidsmønster
- [ ] Inneholder den konkrete beslutningsregler, ikke bare generell LLM-kunnskap
- [ ] Gir den Nav-, repo- eller arbeidsflytspesifikke føringer
- [ ] Kan den oppdages via en kort, presis description

Hvis svaret er **ja på første** og **nei på andre**, dropp skillen.

## 4. Mappestruktur

Bruk kebab-case:

```text
<navn>/
  SKILL.md
  references/   # valgfritt
```

- `SKILL.md` er obligatorisk
- `references/` brukes bare når hovedfilen blir for lang eller trenger støttedokumenter

## 5. Frontmatter-mal

```yaml
---
name: skill-navn
description: Kort tekst som gjør at agenten skjønner når skillen skal brukes.
---
```

- `name` skal matche mappenavnet
- `description` skal være konkret nok for discovery

## 6. Innholdsstruktur

Anbefalt oppsett:
1. H1 med tydelig navn
2. Kort intro: hva skillen gjør og når den brukes
3. Nummererte steg
4. ✅/❌-eksempler eller kodeeksempler ved behov
5. Grenser-seksjon
6. Nav-ressurser eller `references/` hvis relevant

Foretrekk korte avsnitt, tydelige overskrifter og handlingsorientert språk.

## 7. Betingede råd

Be modellen lese repoets faktiske stack og mønstre før den gir råd.

✅ Skriv:
- "Sjekk eksisterende kode og struktur før du foreslår løsning"
- "Verifiser språk, rammeverk og mapper i repoet"

❌ Ikke skriv:
- "Anta Kotlin/Spring som default"
- "Bruk Nav-standard X uten å verifisere repoet først"

## 8. Soft cap: 200 linjer

Hold `SKILL.md` lean. Hvis innholdet passerer ca. 200 linjer:
- flytt støttestoff til `references/`
- behold bare arbeidsflyt, beslutningsregler og grenser i hovedfilen

## 9. Scenario A — repo-lokal skill

Steg for steg:
1. Velg navn i kebab-case
2. Opprett `.github/skills/<navn>/`
3. Opprett `SKILL.md` med frontmatter og norsk innhold
4. Hold eksempler og regler repo-spesifikke
5. Ingen registrering er nødvendig
6. Ikke rør `.hovmester-manifest.json`

Eksempel:

```bash
mkdir -p .github/skills/min-skill
```

## 10. Scenario B — hovmester-skill

Steg for steg:
1. Velg navn i kebab-case
2. Opprett `dist/skills/<navn>/`
3. Opprett `dist/skills/<navn>/SKILL.md`
4. Legg til kortnavnet i riktig collection i `collections.yml`
5. Hold listen alfabetisk
6. Kjør relevante tester
7. Verifiser at sync-oppsettet fortsatt er konsistent

Eksempel:

```bash
mkdir -p dist/skills/min-skill
```

Ved registrering i `collections.yml`:
- bruk kun kortnavn, for eksempel `min-skill`
- legg det i riktig collection
- ikke skriv filendelser eller fulle stier

## 11. Grenser

### Alltid

- Kjør lean-filteret før du oppretter skillen
- Bruk korrekt frontmatter med `name` og beskrivende `description`
- Skriv innholdet på norsk hvis repoet forventer norsk
- Ta med konkrete kodeeksempler eller ✅/❌-eksempler der det hjelper

### Spør først

- Om skillen overlapper med en eksisterende skill
- Om behovet egentlig bør løses som instruction
- Hvilken collection en hovmester-skill skal registreres i

### Aldri

- Dupliser ren LLM-allmennkunnskap uten Nav- eller repo-verdi
- Bruk PII eller ekte sensitive data i eksempler
- Legg inn filendelser eller fulle stier i `collections.yml`
- Opprett `prompts/*.prompt.md` som erstatning for en skill

## 12. Sjekkliste før commit

- [ ] Lean-filteret er passert
- [ ] `SKILL.md` har korrekt frontmatter
- [ ] Innholdet er på norsk
- [ ] Scenario og plassering er riktig valgt
- [ ] `collections.yml` er oppdatert hvis dette er en hovmester-skill
- [ ] Listen i `collections.yml` er alfabetisk
- [ ] Skillen er kort nok, eller støttestoff er flyttet til `references/`
- [ ] Eksempler inneholder ikke PII eller hemmeligheter
- [ ] Relevante tester eller verifikasjoner er kjørt
