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
# autocannon accepts -c/-d four ways: `-c 50`, `-c50` (joined short),
# `--connections 50`, `--connections=50`. Match all four so we don't inject
# a duplicate default — minimist/yargs-parser silently merge duplicates into
# arrays or pick the last value, either of which breaks the run.
for a in "${ARGS[@]}"; do
  case "$a" in
    -c|--connections|-c[0-9]*|-c=*|--connections=*) HAS_C=true ;;
    -d|--duration|-d[0-9]*|-d=*|--duration=*)       HAS_D=true ;;
  esac
done
$HAS_C || ARGS=(-c 10 "${ARGS[@]}")
$HAS_D || ARGS=(-d 20 "${ARGS[@]}")

LAST_IDX=$(( ${#ARGS[@]} - 1 ))
TARGET="${ARGS[$LAST_IDX]}"

# Reject flags-only invocations (e.g. `bench-route.sh -c 10 -d 20`): we'd
# otherwise grab the last flag value (20) as the path and benchmark
# http://host:port/20, which silently 404s and returns misleading numbers.
# Valid targets must start with `/` (relative path) or `http(s)://`.
if [[ ! "$TARGET" =~ ^(/|https?://) ]]; then
  echo "✗ Last argument must be a path (e.g. /pricing) or full URL — got: '$TARGET'" >&2
  echo "  Usage: scripts/perf/bench-route.sh [autocannon-flags...] <path-or-url>" >&2
  exit 2
fi

unset 'ARGS[$LAST_IDX]'

if [[ "$TARGET" =~ ^https?:// ]]; then
  URL="$TARGET"
else
  URL="${PROTO}://${HOST}:${PORT}${TARGET}"
fi

# Redact `-H` header and `-b` body values from the printed command. They
# commonly carry secrets (`-H 'authorization: Bearer <token>'`) or PII
# (`-b '{"name":"...","dob":"..."}'`) that would otherwise land in
# terminal output, CI logs, and shell history. The exec() below uses the
# unmodified ARGS, so autocannon still sends the real values — only the
# display is sanitised.
DISPLAY_ARGS=()
skip_next=false
for a in "${ARGS[@]}"; do
  if $skip_next; then
    DISPLAY_ARGS+=("<redacted>")
    skip_next=false
  elif [[ "$a" == "-H" || "$a" == "--header" || "$a" == "-b" || "$a" == "--body" ]]; then
    DISPLAY_ARGS+=("$a")
    skip_next=true
  elif [[ "$a" == "-H"?* ]]; then
    DISPLAY_ARGS+=("-H<redacted>")
  elif [[ "$a" == "--header="* ]]; then
    DISPLAY_ARGS+=("--header=<redacted>")
  elif [[ "$a" == "-b"?* ]]; then
    DISPLAY_ARGS+=("-b<redacted>")
  elif [[ "$a" == "--body="* ]]; then
    DISPLAY_ARGS+=("--body=<redacted>")
  else
    DISPLAY_ARGS+=("$a")
  fi
done

echo "→ ${AUTOCANNON[*]} ${DISPLAY_ARGS[*]} $URL"
exec "${AUTOCANNON[@]}" "${ARGS[@]}" "$URL"
