# scripts/perf/

Performance tooling wrappers for the Next.js webapp. Convenience scripts behind the canonical commands in [`ai-rules/performance-tools.md`](../../ai-rules/performance-tools.md).

| Script | What it does | Cookbook section |
|---|---|---|
| `lighthouse.sh` | Web Vitals + perf audit for a page (headless Chrome) | §8 |
| `bundle-analyze.sh` | Inspect what's bloating the JS bundle (`source-map-explorer`) | §9 |
| `bench-route.sh` | SSR load test for a route (autocannon) | §1 |

`productionBrowserSourceMaps: true` is already set in `next.config.ts`, so `source-map-explorer` works on the production build out of the box.

## Prereqs

```bash
brew install hyperfine
npm i -g lighthouse autocannon         # or use npx
```

## Examples

```bash
# Build for production first (Lighthouse + bundle analysis need a real build)
npm run build
npm run start-local &
sleep 5   # let it boot

# Audit a page
scripts/perf/lighthouse.sh /                    # home page
scripts/perf/lighthouse.sh /pricing
scripts/perf/lighthouse.sh --form-factor desktop /

# Compare a route across two branches
hyperfine --warmup 1 --runs 3 \
  'git checkout main      && scripts/perf/bench-route.sh -c 10 -d 10 /pricing' \
  'git checkout my-branch && scripts/perf/bench-route.sh -c 10 -d 10 /pricing'

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
