#!/usr/bin/env bash
# SSR load test for a Next.js route using autocannon.
# Backs up ai-rules/performance-tools.md §1.
#
# Requires: a production server listening on the target URL (default
# http://localhost:4000). Build and start it first:
#   npm run build && npm run start-local &
#   sleep 5
# Benchmarking against `npm run dev` gives meaningless numbers — the dev
# server has HMR overhead and dev-only React work.
#
# autocannon is preferred installed globally; this script falls back to
# `npx --yes autocannon` automatically when it isn't.
#
# Usage:
#   scripts/perf/bench-route.sh /                  # home page, defaults
#   scripts/perf/bench-route.sh -c 50 -d 30 /pricing
#   scripts/perf/bench-route.sh https://goodparty.org/
#
# Env overrides:
#   PORT   (default 4000)
#   HOST   (default localhost)
#   PROTO  (default http)
#
# Any extra flags are passed through to autocannon.
# If no -c / -d are passed, defaults are 10 connections and 20 seconds.
set -euo pipefail

PORT="${PORT:-4000}"
HOST="${HOST:-localhost}"
PROTO="${PROTO:-http}"

if [[ $# -eq 0 || "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  sed -n '2,/^set -/p' "$0" | sed 's/^# \{0,1\}//;/^set -/d'
  [[ $# -eq 0 ]] && exit 2 || exit 0
fi

if command -v autocannon >/dev/null 2>&1; then
  AUTOCANNON=(autocannon)
else
  echo "→ autocannon not on PATH; falling back to 'npx --yes autocannon' (first run installs)" >&2
  AUTOCANNON=(npx --yes autocannon)
fi

ARGS=("$@")
HAS_C=false; HAS_D=false
for a in "${ARGS[@]}"; do
  case "$a" in
    -c|--connections) HAS_C=true ;;
    -d|--duration)    HAS_D=true ;;
  esac
done
$HAS_C || ARGS=(-c 10 "${ARGS[@]}")
$HAS_D || ARGS=(-d 20 "${ARGS[@]}")

LAST_IDX=$(( ${#ARGS[@]} - 1 ))
TARGET="${ARGS[$LAST_IDX]}"
unset 'ARGS[$LAST_IDX]'

if [[ "$TARGET" =~ ^https?:// ]]; then
  URL="$TARGET"
else
  URL="${PROTO}://${HOST}:${PORT}${TARGET}"
fi

echo "→ ${AUTOCANNON[*]} ${ARGS[*]} $URL"
exec "${AUTOCANNON[@]}" "${ARGS[@]}" "$URL"
