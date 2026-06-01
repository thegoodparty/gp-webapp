#!/usr/bin/env bash
# Check that the local environment can run scripts/perf/*.sh end-to-end.
# Backs up ai-rules/performance-tools.md §11.6 (Agents in fresh worktrees).
#
# Reports — does NOT install anything, does NOT start any service.
# Exits 0 always; the report is informational. Treat any ✗ as something to
# fix before claiming a measurement from the affected tool.
#
# Usage:
#   scripts/perf/setup-check.sh
#   PORT=3000 scripts/perf/setup-check.sh
#
# Env overrides:
#   PORT   (default 4000 — gp-webapp start-local default)
#   HOST   (default localhost)
set -euo pipefail

PORT="${PORT:-4000}"
HOST="${HOST:-localhost}"

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  sed -n '2,/^set -/p' "$0" | sed 's/^# \{0,1\}//;/^set -/d'
  exit 0
fi

OK="✓"
NO="✗"
WARN="⚠"

check() {
  local label="$1" cmd="$2" hint="${3:-}"
  if eval "$cmd" >/dev/null 2>&1; then
    printf "  %s  %s\n" "$OK" "$label"
  else
    printf "  %s  %s\n" "$NO" "$label"
    [[ -n "$hint" ]] && printf "       %s\n" "$hint"
  fi
  return 0
}

note() {
  printf "  %s  %s\n" "$WARN" "$1"
}

echo
echo "scripts/perf/ environment check (gp-webapp)"
echo "==========================================="
echo

echo "Tools:"
check "node $(node --version 2>/dev/null || echo '(not found)')" \
      'command -v node' \
      'Install Node 22.x via nvm / fnm / mise.'
check "autocannon (SSR load — §1)" \
      'command -v autocannon' \
      'Falls back to: npx --yes autocannon (no install needed; first run is slow).'
check "lighthouse (Web Vitals — §8)" \
      'command -v lighthouse' \
      'Falls back to: npx --yes lighthouse (no install needed; first run is slow + downloads headless Chrome).'
check "hyperfine (statistical bench — §0)" \
      'command -v hyperfine' \
      'Install: brew install hyperfine  (mac) | cargo install hyperfine (linux).'
note "source-map-explorer is always run via npx — no install needed."

echo
echo "Build state:"
if [[ -d .next/static/chunks ]]; then
  CHUNK_COUNT="$(find .next/static/chunks -name '*.js' -type f 2>/dev/null | wc -l | tr -d ' ')"
  printf "  %s  .next/static/chunks present (%s JS files)\n" "$OK" "$CHUNK_COUNT"
  # Confirm source maps were emitted (productionBrowserSourceMaps).
  if find .next/static/chunks -name '*.js.map' -type f 2>/dev/null | head -1 | grep -q .; then
    printf "  %s  .js.map source maps present (bundle-analyze.sh will work)\n" "$OK"
  else
    printf "  %s  no .js.map files in .next/static/chunks — bundle-analyze.sh won't map back to source\n" "$WARN"
    echo "       Confirm productionBrowserSourceMaps: true in next.config.ts and rebuild."
  fi
else
  printf "  %s  no .next/static/chunks — Lighthouse + bundle-analyze need a build\n" "$NO"
  echo "       Run: npm run build && npm run start-local &"
fi

echo
echo "App:"
if command -v curl >/dev/null 2>&1; then
  if curl -fsS -o /dev/null --max-time 2 "http://${HOST}:${PORT}/" 2>/dev/null; then
    printf "  %s  webapp reachable at http://%s:%s/\n" "$OK" "$HOST" "$PORT"
  else
    printf "  %s  no listener on http://%s:%s (start: npm run start-local)\n" "$WARN" "$HOST" "$PORT"
  fi
else
  note "curl not available — skipping server reachability check"
fi

echo
echo "Repo state:"
if [[ -d node_modules ]]; then
  printf "  %s  node_modules present\n" "$OK"
else
  printf "  %s  node_modules missing (run: npm ci)\n" "$NO"
fi

# Check the file these wrapper scripts actually reference: performance-tools.md
# (the tools cookbook). performance.md is the critic rule; both should be
# present on a healthy submodule pointer, but performance-tools.md is what
# the scripts in this directory header-cite — so checking it gives a more
# faithful "is the submodule aligned with what this toolchain depends on"
# answer.
if [[ -f ai-rules/performance-tools.md ]]; then
  printf "  %s  ai-rules/performance-tools.md present (submodule initialized)\n" "$OK"
  # Sanity-check the critic rule file too — different file, same submodule;
  # if one is present and the other isn't, the pointer is partially stale.
  if [[ ! -f ai-rules/performance.md ]]; then
    printf "  %s  ai-rules/performance.md missing — submodule pointer may be partially stale\n" "$WARN"
    echo "       Sync: git submodule update ai-rules"
  fi
elif [[ -f ai-rules/README.md ]]; then
  printf "  %s  ai-rules submodule initialized but performance-tools.md missing — submodule out of sync with the recorded pointer\n" "$WARN"
  echo "       Sync: git submodule update ai-rules"
  echo "       (Don't 'git checkout origin/main' inside the submodule — that lands at a tree that may not contain performance-tools.md.)"
elif [[ -e ai-rules ]] || git config -f .gitmodules --get submodule.ai-rules.url >/dev/null 2>&1; then
  printf "  %s  ai-rules submodule NOT initialized\n" "$NO"
  echo "       Run: git submodule update --init --recursive"
else
  note "ai-rules submodule not present in this repo"
fi

echo
echo "Done. Anything marked ✗ above is a real blocker for the relevant tool."
echo "Anything marked ⚠ is informational — usually fine for some tools, not for others."
exit 0
