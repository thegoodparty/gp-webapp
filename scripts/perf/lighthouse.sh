#!/usr/bin/env bash
# Run Lighthouse against a URL or local path.
# Backs up ai-rules/performance-tools.md §8.
#
# Requires: a *production* server running on the target URL — Lighthouse
# against `npm run dev` gives meaningless numbers because dev mode disables
# minification and bundle splitting. Build and start first:
#   npm run build && npm run start-local &
#   sleep 5
#
# lighthouse is preferred installed globally; this script falls back to
# `npx --yes lighthouse` automatically when it isn't.
#
# Usage:
#   scripts/perf/lighthouse.sh                  # http://localhost:4000/
#   scripts/perf/lighthouse.sh /pricing
#   scripts/perf/lighthouse.sh https://goodparty.org/
#   scripts/perf/lighthouse.sh --form-factor desktop /pricing
#
# Env overrides:
#   LH_BASE  default http://localhost:4000
#   LH_OUT   default ./perf-reports
#
# Pass-through: any flag starting with - / -- is forwarded to lighthouse.
# The URL or path must be the LAST positional argument.
set -euo pipefail

DEFAULT_BASE="${LH_BASE:-http://localhost:4000}"
OUT_DIR="${LH_OUT:-./perf-reports}"

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  sed -n '2,/^set -/p' "$0" | sed 's/^# \{0,1\}//;/^set -/d'
  exit 0
fi

if command -v lighthouse >/dev/null 2>&1; then
  LIGHTHOUSE=(lighthouse)
else
  echo "→ lighthouse not on PATH; falling back to 'npx --yes lighthouse' (first run installs)" >&2
  LIGHTHOUSE=(npx --yes lighthouse)
fi

mkdir -p "$OUT_DIR"

ARGS=("$@")
if [[ ${#ARGS[@]} -eq 0 ]]; then
  TARGET="/"
else
  LAST_IDX=$(( ${#ARGS[@]} - 1 ))
  LAST="${ARGS[$LAST_IDX]}"
  if [[ "$LAST" == -* ]]; then
    # Last arg is itself a flag (`--foo`) — assume no path given, run against /.
    TARGET="/"
  elif [[ "$LAST" =~ ^(/|https?://) ]]; then
    TARGET="$LAST"
    unset 'ARGS[$LAST_IDX]'
  else
    # Last arg looks like a flag value (e.g. `--form-factor desktop`) rather
    # than a path. Without this check we'd benchmark http://host/<flag-value>
    # silently (404), matching the bug class fixed in bench-route.sh.
    echo "✗ Last argument must be a path (e.g. /pricing) or full URL — got: '$LAST'" >&2
    echo "  Usage: scripts/perf/lighthouse.sh [lighthouse-flags...] [path-or-url]" >&2
    echo "  (omit the trailing path to audit '/').";
    exit 2
  fi
fi

if [[ "$TARGET" =~ ^https?:// ]]; then
  URL="$TARGET"
else
  URL="${DEFAULT_BASE}${TARGET}"
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
SAFE="$(echo "$URL" | sed 's|[^A-Za-z0-9._-]|_|g')"
OUT_BASE="$OUT_DIR/lh-${STAMP}-${SAFE}"

echo "→ ${LIGHTHOUSE[*]} $URL"
echo "  Reports: ${OUT_BASE}.report.{html,json}"
exec "${LIGHTHOUSE[@]}" "$URL" \
  --output html --output json \
  --output-path "$OUT_BASE" \
  --chrome-flags="--headless --no-sandbox" \
  --quiet \
  "${ARGS[@]+${ARGS[@]}}"
