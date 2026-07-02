---
name: resolving-merge-conflicts
description: "Brukes når en git-merge eller -rebase har stoppet med konflikter — 'CONFLICT (content)', '<<<<<<< HEAD'-markører i koden, 'fix conflicts and then commit', eller en merge/rebase som henger fast. Også når oppdatering mot main eller en PR-branch ender i konflikt. Kalles via /resolving-merge-conflicts."
---

# Løse merge-konflikter

Du løser en pågående merge/rebase-konflikt i dette repoet. Aldri `--abort` — alltid løs konflikten.

## Arbeidsflyt

1. **Kartlegg tilstanden.** Hva slags operasjon kjører, og hvilke filer kolliderer?
   ```bash
   git status              # merge eller rebase? hvilke filer er "both modified"?
   git log --oneline --graph -15
   git diff                # se konfliktmarkørene i kontekst
   ```
   Rebase snur betydningen av `HEAD` (= det du rebaser PÅ) og `incoming` (= din egen commit). Sjekk hvilken vei det går før du velger side.

2. **Finn primærkilden for hver konflikt.** Forstå hvorfor hver side endret koden — ikke bare hva som står der.
   ```bash
   git log --merge -p -- <fil>     # commits på begge sider som rører filen
   git blame <fil>
   ```
   Les commit-meldinger, PR-er og issues. I dette domenet er intensjonen ofte ikke synlig i diffen: en endring i auth (TokenX/Azure AD), `accessPolicy` i NAIS-yaml, en Flyway-migrasjon eller en Kafka-konsument kan ha en grunn som bare står i PR-en.

3. **Løs hver hunk.** Behold begge intensjoner der det går. Der de er uforenlige, velg den som matcher mergens uttalte mål og noter avveiningen. Ikke finn opp ny oppførsel. Vær spesielt varsom med:
   - **Flyway-migrasjoner** (`src/main/resources/db/migration/`): to brancher som begge la til `V<n>__...sql` med samme nummer må omdøpes til fortløpende, unike versjoner — ikke slå sammen innholdet til én fil. En allerede kjørt migrasjon endres aldri; legg til en ny.
   - **`gradle/libs.versions.toml` / `build.gradle.kts`**: ta den nyeste forenlige versjonen, ikke begge linjer. Sjekk at Ktor-BOM/`ktorLibs` og Kotlin-versjon henger sammen.
   - **NAIS-yaml** (`.nais/`): `accessPolicy`, env og scaling slås sammen som mengder — behold oppføringer fra begge sider.
   - **Kotlin-imports og DI/routing-oppsett** (`Application.kt`, moduler): behold begge nye ruter/plugins; pass på doble `install(...)`.

4. **Kjør prosjektets automatiske sjekker** og fiks det mergen brøt:
   ```bash
   ./gradlew build         # kompilering + test
   ./gradlew test          # raskere når bare logikk endret seg
   ```
   Kjør på nytt til grønt. En merge som kompilerer men feiler tester betyr at to korrekte endringer er logisk uforenlige — løs det semantisk, ikke ved å fjerne testen.

5. **Fullfør operasjonen.**
   ```bash
   git add -A
   git commit              # merge: behold/rediger den genererte meldingen
   # eller, ved rebase:
   git rebase --continue   # gjenta steg 1–4 for hver gjenværende commit
   ```
   Ved rebase løses konflikter per commit — du kan måtte gjennom løkka flere ganger.

## Sikkerhetsnett
- Før en stor/risikabel merge: `git merge --no-commit --no-ff <branch>` lar deg inspektere før du binder deg.
- Mister du oversikten under rebase, er ikke `--abort` nederlag — men i denne flyten fullfører vi. `git rebase --abort` kun hvis brukeren ber om det.
- `git checkout --ours <fil>` / `--theirs <fil>` for filer som helt klart skal komme fra én side (f.eks. genererte filer). Husk at "ours"/"theirs" er snudd under rebase.
