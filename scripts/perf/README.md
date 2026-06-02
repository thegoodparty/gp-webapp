# scripts/perf/

Performance tooling wrappers for the Next.js webapp. Convenience scripts behind the canonical commands in [`ai-rules/performance-tools.md`](../../ai-rules/performance-tools.md).

| Script              | What it does                                                  | Cookbook section |
| ------------------- | ------------------------------------------------------------- | ---------------- |
| `setup-check.sh`    | Audit the local env — what can/can't be measured right now    | §11.6            |
| `lighthouse.sh`     | Web Vitals + perf audit for a page (headless Chrome)          | §8               |
| `bundle-analyze.sh` | Inspect what's bloating the JS bundle (`source-map-explorer`) | §9               |
| `bench-route.sh`    | SSR load test for a route (autocannon)                        | §1               |

`productionBrowserSourceMaps: true` is already set in `next.config.ts`, so `source-map-explorer` works on the production build out of the box.

Every script supports `-h` / `--help` and prints its prerequisites at the top of the help block.

## Quick start

```bash
# What's available locally?
scripts/perf/setup-check.sh
```

If `setup-check.sh` is clean, the rest will work. If something is ✗, the script tells you the install command (or the no-install fallback).

## Prereqs

The scripts try hard not to require global installs:

- **autocannon / lighthouse / source-map-explorer** — `npx --yes <tool>` fallback is automatic when not installed globally. First `npx` run downloads (and `npx --yes lighthouse` also pulls headless Chrome the first time, which is slow).
- **hyperfine** — no convenient `npx` equivalent; install if you want statistical comparison runs:
  ```bash
  brew install hyperfine        # mac
  cargo install hyperfine       # linux / cross-platform
  ```

**Don't benchmark `npm run dev`.** All measurements should be against a production build (`npm run build && npm run start-local`). Dev mode disables minification, adds HMR overhead, and runs extra dev-only React work — the numbers are not representative.

For agents working in a fresh `git worktree`, also see `ai-rules/performance-tools.md` §11.6 — `.env` and the `ai-rules` submodule are common first-time stumbling blocks.

## Examples

```bash
# Build for production first (Lighthouse + bundle analysis need a real build)
npm run build
npm run start-local &
sleep 5   # let it boot

# Audit a page (npx fallback if lighthouse isn't on PATH)
scripts/perf/lighthouse.sh /                    # home page
scripts/perf/lighthouse.sh /pricing
scripts/perf/lighthouse.sh --form-factor desktop /

# Compare a route across two branches.
#
# IMPORTANT: a single hyperfine arm with `git checkout && bench-route.sh`
# does NOT work for Next.js — `git checkout` only swaps source files, but
# the already-running `npm run start-local` server keeps serving the
# original compiled bundle. Both arms would hit identical code and the
# delta would be meaningless.
#
# Correct flow: kill, checkout, rebuild, restart per branch. Two runs:
git checkout main      && npm run build && npm run start-local &
sleep 8
scripts/perf/bench-route.sh -c 10 -d 10 /pricing | tee /tmp/bench-main.txt
pkill -f 'next start' || true

git checkout my-branch && npm run build && npm run start-local &
sleep 8
scripts/perf/bench-route.sh -c 10 -d 10 /pricing | tee /tmp/bench-branch.txt
pkill -f 'next start' || true

# What's in the bundle?
scripts/perf/bundle-analyze.sh --summary          # text top-level summary
scripts/perf/bundle-analyze.sh --html             # interactive treemap
scripts/perf/bundle-analyze.sh --json             # machine-readable, for diffing
```

## Critic tie-in

Per the [performance critic rules](../../ai-rules/performance.md):

- **Page render claims** need a before/after Lighthouse run (or Chrome DevTools Performance recording with numbers).
- **Bundle-size claims** need a before/after `bundle-analyze.sh --json` diff (or `npm run build` output diff for first-load JS).
- **SSR throughput claims** need `bench-route.sh` numbers (or `autocannon` directly).

Without one of those, downgrade the claim to "refactor."

When the critic itself is an agent with shell access, it should run `setup-check.sh` first, then use any GREEN tool it has the prerequisites for (see the readiness table in `performance-tools.md`). It should never fabricate measurements.
