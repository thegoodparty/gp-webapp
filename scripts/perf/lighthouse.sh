#!/usr/bin/env bash
# Run Lighthouse against a URL or local path.
# Backs up ai-rules/performance-tools.md §8.
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

if ! command -v lighthouse >/dev/null 2>&1; then
  echo "✗ lighthouse not found. Install: npm i -g lighthouse" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

ARGS=("$@")
if [[ ${#ARGS[@]} -eq 0 ]]; then
  TARGET="/"
else
  LAST_IDX=$(( ${#ARGS[@]} - 1 ))
  LAST="${ARGS[$LAST_IDX]}"
  if [[ "$LAST" == -* ]]; then
    TARGET="/"
  else
    TARGET="$LAST"
    unset 'ARGS[$LAST_IDX]'
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

echo "→ lighthouse $URL"
echo "  Reports: ${OUT_BASE}.report.{html,json}"
exec lighthouse "$URL" \
  --output html --output json \
  --output-path "$OUT_BASE" \
  --chrome-flags="--headless --no-sandbox" \
  --quiet \
  "${ARGS[@]+${ARGS[@]}}"
