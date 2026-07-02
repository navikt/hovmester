#!/usr/bin/env bash
# Human-in-the-loop reproduksjons-loop (siste utvei i fase 1).
# Kopier denne fila, rediger stegene under, og kjør den.
# Agenten kjører scriptet; brukeren følger prompts i sin egen terminal.
#
# Bruk:
#   bash hitl-loop.template.sh
#
# To hjelpere:
#   step "<instruksjon>"        -> vis instruksjon, vent på Enter
#   capture VAR "<spørsmål>"    -> vis spørsmål, les svar inn i VAR
#
# Til slutt skrives fangede verdier som KEY=VALUE for agenten å parse.

set -euo pipefail

step() {
  printf '\n>>> %s\n' "$1"
  read -r -p "    [Enter når ferdig] " _
}

capture() {
  local var="$1" question="$2" answer
  printf '\n>>> %s\n' "$question"
  read -r -p "    > " answer
  printf -v "$var" '%s' "$answer"
}

# --- rediger under ------------------------------------------------------

step "Start appen lokalt med ./gradlew run (eller port-forward mot dev-gcp)."

capture STATUS "curl -s -o /dev/null -w '%{http_code}' mot den feilende ruten. Hvilken HTTP-status?"

capture FEIL "Lim inn feilmeldingen fra appens logg (eller 'ingen'):"

# --- rediger over -------------------------------------------------------

printf '\n--- Fanget ---\n'
printf 'STATUS=%s\n' "$STATUS"
printf 'FEIL=%s\n' "$FEIL"
