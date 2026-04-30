---
name: prototype
description: "Rask prototyping for Nav-designere — Figma-skissering med Aksel-komponenter via MCP, eller lokal HTML-prototype med Playwright-visning. Brukes via /prototype når et konsept skal visualiseres."
---

# Prototype — fra konsept til synlig skisse

Visualiser et designkonsept raskt, enten direkte i Figma med Aksel-komponenter eller som lokal HTML-prototype.

## Når brukes denne?

- Designer vil se et konsept visuelt (ikke bare beskrevet)
- Et UI-mønster skal utforskes før det bygges i kode
- Rask validering av layout, hierarki eller flyt

## Velg modus

### A) Figma-prototype

Opprett en Figma-fil med Aksel-komponenter direkte via MCP.

**Krav**: Figma MCP-verktøy tilgjengelig.

Flyt: `whoami` → `create_new_file` → `search_design_system` → `use_figma` → lever lenke.

Se `references/figma-prototype.md` for Nav-spesifikke detaljer.

### B) Lokal HTML-prototype

Bygg en standalone HTML-fil med Aksel CDN-styling, vis via Playwright.

**Krav**: Playwright MCP-verktøy tilgjengelig.

Flyt: Opprett HTML → `npx serve` → `browser_navigate` → `browser_take_screenshot` → vis til designer.

Se `references/local-prototype.md` for oppsett og Aksel CDN-detaljer.

## Iterasjon

Begge modi støtter iterasjon:
1. Vis resultat (Figma-lenke eller screenshot)
2. Designer gir feedback
3. Juster og vis på nytt
4. Gjenta til fornøyd

## Overgang mellom modi

- Lokal prototype → Figma: Bruk `generate_figma_design` for å fange HTML-prototypen til Figma
- Figma → kode: Routing til Konditor med `/figma-workflow`

## Boundaries

### ✅ Alltid
- Bruk Aksel-komponenter (aldri custom styling for standard UI)
- Returner klikkbar lenke (Figma) eller screenshot (lokal)
- Spør designer før større endringer

### 🚫 Aldri
- Lagre prototypefiler i prosjektets kildekode
- Bruk prosjektets build-system (alltid standalone)
- Lever prototype som ferdig kode
