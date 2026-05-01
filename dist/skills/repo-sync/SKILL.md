---
name: repo-sync
description: "Henter siste endringer fra Git — fetch, pull og branch-sjekk for oppdatert kodebase. Brukes via /repo-sync ved oppstart eller når koden kan være utdatert."
---

# Repo Sync — hold kodebasen oppdatert

Sørger for at den lokale kodebasen er oppdatert med siste versjon fra Git. Laget for å være trygt å kjøre automatisk — ingen destruktive operasjoner.

## Når brukes denne?

- Ved oppstart av en ny samtale i et repo
- Når agenten mistenker at koden er utdatert
- Designere og andre ikke-tekniske brukere som ikke kjenner Git

## Oppskrift

Kjør følgende steg sekvensielt:

### 1. Finn hovedbranch

```bash
git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@'
```

Fallback: prøv `main`, deretter `master`.

### 2. Sjekk at vi er på hovedbranch

```bash
current=$(git branch --show-current)
```

Hvis `current` ≠ hovedbranch:

```bash
git checkout <hovedbranch>
```

⚠️ Hvis checkout feiler (lokale endringer): informer brukeren og stopp. Ikke bruk `--force`.

### 3. Hent siste endringer

```bash
git fetch origin <hovedbranch> --quiet
```

### 4. Sjekk om det finnes oppdateringer

```bash
behind=$(git rev-list HEAD..origin/<hovedbranch> --count)
```

- Hvis `behind` = 0 → kodebasen er oppdatert. Gå videre stille.
- Hvis `behind` > 0 → pull og informer.

### 5. Pull (kun ved endringer)

```bash
git pull --ff-only origin <hovedbranch>
```

⚠️ Hvis pull feiler (divergert historikk): informer brukeren og stopp. Ikke bruk `--force` eller `--rebase`.

### 6. Informer

Vis kun når det faktisk var endringer:

> Kodebasen er oppdatert — hentet `N` nye endringer. ✅

Hvis alt var oppdatert: si ingenting, gå rett videre til oppgaven.

## Feilhåndtering

| Situasjon | Handling |
|---|---|
| Ikke et git-repo | Informer brukeren, stopp |
| Lokale endringer blokkerer checkout | Informer at det er ulagrede endringer, stopp |
| `--ff-only` feiler | Informer at historikken har divergert, stopp |
| Nettverksfeil på fetch | Informer, fortsett med lokal kode |

Ved feil: gi en kort, ikke-teknisk forklaring. Unngå git-jargong for ikke-tekniske brukere.

## Boundaries

### ✅ Alltid
- Bruk `--ff-only` (aldri merge-commits)
- Informer om hva som skjedde
- Stopp ved problemer — aldri force-push eller force-checkout

### 🚫 Aldri
- `git reset --hard`
- `git push`
- `git rebase`
- `git checkout --force`
- Slette branches
- Installere dependencies (npm install etc.)
