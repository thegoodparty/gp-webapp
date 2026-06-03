#!/usr/bin/env bash
# Inspect Next.js bundle composition using source-map-explorer.
# Backs up ai-rules/performance-tools.md §9.
#
# Requires:
#   1. `npm run build` (or build-local) must have been run — needs .next/static/chunks
#      with source maps. `productionBrowserSourceMaps: true` in next.config.ts
#      is already set, so this works on the default build.
#   2. No global install needed; source-map-explorer is always run via npx.
#
# Usage:
#   scripts/perf/bundle-analyze.sh                # text summary (top contributors)
#   scripts/perf/bundle-analyze.sh --html         # interactive treemap (opens HTML)
#   scripts/perf/bundle-analyze.sh --json         # machine-readable, for diffing
#
# Output directory: $PERF_OUT (default ./perf-reports)
set -euo pipefail

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  sed -n '2,/^set -/p' "$0" | sed 's/^# \{0,1\}//;/^set -/d'
  exit 0
fi

if [[ ! -d .next/static/chunks ]]; then
  echo "✗ No .next/static/chunks found. Run 'npm run build' first." >&2
  exit 1
fi

MODE="${1:---summary}"
OUT="${PERF_OUT:-./perf-reports}"
mkdir -p "$OUT"
STAMP="$(date +%Y%m%d-%H%M%S)"

case "$MODE" in
  --html)
    OUT_FILE="$OUT/bundle-${STAMP}.html"
    echo "→ source-map-explorer (HTML) → $OUT_FILE"
    npx --yes source-map-explorer '.next/static/chunks/**/*.js' --html "$OUT_FILE"
    echo "✓ Open: $OUT_FILE"
    ;;
  --json)
    OUT_FILE="$OUT/bundle-${STAMP}.json"
    echo "→ source-map-explorer (JSON) → $OUT_FILE"
    npx --yes source-map-explorer '.next/static/chunks/**/*.js' --json "$OUT_FILE"
    echo "✓ Saved: $OUT_FILE"
    echo "  Diff two runs:  diff <(jq -S . a.json) <(jq -S . b.json)"
    ;;
  --summary|"")
    echo "→ source-map-explorer (top-level text summary)"
    npx --yes source-map-explorer '.next/static/chunks/**/*.js' --no-border-checks
    echo
    echo "(re-run with --html or --json for fuller output)"
    ;;
  *)
    echo "✗ Unknown option: $MODE" >&2
    echo "Usage: $0 [--html|--json|--summary]" >&2
    exit 2
    ;;
esac
