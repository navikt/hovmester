#!/usr/bin/env bash
# present.sh — Generisk lokal server for hovmester-presentasjoner.
#
# Bruk:
#   ./presentations/_shared/present.sh              → åpner presentations/-roten
#   ./presentations/_shared/present.sh _template    → åpner _template/-decken
#   ./presentations/_shared/present.sh 2026-04-16-fagtorsdag/html → åpner spesifikk deck
#
# Serveren startes fra presentations/-roten slik at relative stier til
# _shared/deck-stage.js og andre delte resurser fungerer uansett deck.
#
# Scriptet finner en ledig port, feiler tydelig hvis stien ikke finnes,
# normaliserer trailing slash og rydder opp serveren ved avslutning.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRESENTATIONS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# --- Argumenthåndtering ---

SUBPATH="${1:-}"

# Normaliser: fjern leading/trailing slashes, legg til trailing slash for URL
if [ -n "$SUBPATH" ]; then
  SUBPATH="${SUBPATH#/}"
  SUBPATH="${SUBPATH%/}"

  # Sjekk at stien finnes
  if [ ! -d "$PRESENTATIONS_ROOT/$SUBPATH" ]; then
    echo "Feil: Stien '$SUBPATH' finnes ikke under presentations/."
    echo ""
    echo "Tilgjengelige kataloger:"
    find "$PRESENTATIONS_ROOT" -mindepth 1 -maxdepth 2 -type d \
      -not -path '*/\.*' -not -path '*/node_modules/*' -not -path '*/src/*' \
      | sed "s|$PRESENTATIONS_ROOT/||" | sort | head -20
    exit 1
  fi

  URL_PATH="/${SUBPATH}/"
else
  URL_PATH="/"
fi

# --- Finn ledig port ---

find_free_port() {
  local port
  for port in 8765 8766 8767 8768 8769 8770 8771 8772 8773 8774; do
    if ! lsof -ti :"$port" >/dev/null 2>&1; then
      echo "$port"
      return 0
    fi
  done
  # Fallback: la OS velge
  python3 -c "import socket; s=socket.socket(); s.bind(('',0)); print(s.getsockname()[1]); s.close()"
}

PORT="$(find_free_port)"
URL="http://localhost:${PORT}${URL_PATH}"

# --- Start server ---

cd "$PRESENTATIONS_ROOT"

python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER_PID=$!

cleanup() {
  local exit_code="${1:-$?}"

  if kill -0 "$SERVER_PID" 2>/dev/null; then
    echo ""
    echo "Stopper server (pid $SERVER_PID)…"
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi

  return "$exit_code"
}
trap 'exit_code=$?; trap - INT TERM EXIT; cleanup "$exit_code"; exit "$exit_code"' EXIT
trap 'trap - INT TERM EXIT; cleanup 130; exit 130' INT
trap 'trap - INT TERM EXIT; cleanup 143; exit 143' TERM

# Vent til serveren svarer
for _ in 1 2 3 4 5 6 7 8 9 10; do
  if curl -s -o /dev/null "http://localhost:${PORT}/" 2>/dev/null; then
    break
  fi
  sleep 0.2
done

# Åpne i nettleser (macOS: open, Linux: xdg-open)
if command -v open >/dev/null 2>&1; then
  open "$URL"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL"
fi

echo ""
echo "  ┌─────────────────────────────────────────────┐"
echo "  │  Hovmester-presentasjon kjører              │"
echo "  │  → $URL"
echo "  │                                             │"
echo "  │  Piltaster  navigere                        │"
echo "  │  Home/End   første/siste slide              │"
echo "  │  R          reset                           │"
echo "  │  F          fullscreen                      │"
echo "  │  ?          alle hurtigtaster               │"
echo "  │                                             │"
echo "  │  Ctrl+C     stoppe server                   │"
echo "  └─────────────────────────────────────────────┘"
echo ""

# Hold i live til Ctrl+C
wait "$SERVER_PID"
