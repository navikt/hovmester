---
name: create-skill
description: Opprett nye agent-skills med riktig struktur, progressiv disclosure og medfølgende ressurser. Brukes når bruker vil lage, skrive eller bygge en ny skill.
---

# Lage skills

## 1. Velg scenario

| Scenario | Bruk når | Plassering | Registrering |
|---|---|---|---|
| **Repo-lokal** | Spesifikt for ett repo/team | `.github/skills/<navn>/SKILL.md` | Ingen |
| **Hovmester** | Minst to Nav-team har nytte | `dist/skills/<navn>/SKILL.md` | `collections.yml` |
| **Meta-skill** | Kun for hovmester-repoet selv | `.github/skills/<navn>/` i hovmester | Ingen |

## 2. Skill eller instruction?

- **Instruction**: auto-lastes via `applyTo`-glob, gjelder alltid for bestemte filer/teknologier
- **Skill**: on-demand, lastes når oppgaven matcher

Hvis brukeren beskriver en fast regel per filtype → foreslå instruction i stedet.

## 3. Prosess

1. **Samle krav** — hvilken oppgave/domene, bruksscenarier, trenger den skript eller kun instruksjoner?
2. **Skriv utkast** — SKILL.md maks ~100 linjer, referansefiler for utfyllende innhold, verktøyskript for deterministiske operasjoner
3. **Gjennomgå med brukeren** — dekker det bruksscenarier? Mangler noe?

## 4. Filstruktur

Kebab-case mappenavn:

```
skill-navn/
├── SKILL.md           # Hovedinstruksjoner (påkrevd)
├── references/        # Utfyllende dokumentasjon (ved behov)
└── scripts/           # Verktøyskript (ved behov)
```

Del opp når SKILL.md overskrider 100 linjer eller innholdet har distinkte domener.

## 5. SKILL.md-mal

```md
---
name: skill-navn
description: Kort beskrivelse. Brukes når [spesifikke triggere].
---

# Skill-navn

## Hurtigstart
[Minimalt fungerende eksempel]

## Arbeidsflyter
[Steg-for-steg med sjekklister]

## Grenser
### Alltid / Spør først / Aldri
```

`name` skal matche mappenavnet.

## 6. Krav til description

Beskrivelsen er **det eneste agenten ser** ved discovery — den vises i systemprompten sammen med alle installerte skills. Maks 1024 tegn, tredjeperson.

- Første setning: hva skillen gjør
- Andre setning: «Brukes når [triggere]»

```
# ✅
Opprett og administrer Kafka-topics, consumers og producers i Nav.
Brukes når bruker jobber med Kafka, meldingskøer eller event-strømmer.

# ❌
Hjelper med meldinger.
```

## 7. Betingede råd

Be modellen lese repoets faktiske stack og mønstre før den gir råd:

- ✅ «Sjekk eksisterende kode og struktur før du foreslår løsning»
- ❌ «Anta Kotlin/Spring som default»

## 8. Lean-filter

1. **Kan modellen dette fra før?** Dropp generell syntax og standardkunnskap.
2. **Lærer det å jobbe i Nav, eller styrker det agenten?** Behold Nav-spesifikke mønstre.

Drop hvis ja på 1 og nei på 2.

## 9. Registrering (hovmester-skills)

Legg til kortnavnet i riktig collection i `collections.yml`, alfabetisk sortert. Bruk kun kortnavn uten filendelse eller sti.

```yaml
hovmester:
  skills:
    - brainstorm
    - min-skill          # ← ny, alfabetisk plassert
    - nais-manifest
```

## 10. Grenser

### Alltid
- Kjør lean-filteret før opprettelse
- Skriv innholdet på norsk hvis repoet forventer norsk
- Konkrete ✅/❌-eksempler der det hjelper

### Spør først
- Om skillen overlapper med en eksisterende skill
- Om behovet bør løses som instruction i stedet
- Hvilken collection en hovmester-skill tilhører

### Aldri
- Dupliser ren LLM-allmennkunnskap uten Nav- eller repo-verdi
- Bruk PII eller sensitive data i eksempler
- Opprett `prompts/*.prompt.md` (deprecated)

## Sjekkliste

- [ ] Scenario og plassering valgt riktig
- [ ] Beskrivelsen inkluderer triggere («Brukes når ...»)
- [ ] SKILL.md under 100 linjer (eller splittet i referansefiler)
- [ ] `collections.yml` oppdatert og alfabetisk (hovmester-skills)
- [ ] Bestått lean-filteret
- [ ] Ingen PII eller hemmeligheter i eksempler
