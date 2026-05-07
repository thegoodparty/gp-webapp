# e2e-tests/

End-to-end tests using Playwright. Runs against a deployed environment (local app, dev, qa, prod). Separate from Vitest unit/component tests under `helpers/test-utils/`.

## Key files

| File | Role |
|------|------|
| `playwright.config.ts` | Playwright config — testDir is `./tests`, BASE_URL required, visual diff thresholds tuned for CI |
| `global-setup.ts` | One-shot `clerkSetup()` before tests run |
| `tests/core/` | Cross-cutting tests (auth, navigation, public pages) |
| `tests/app/` | Feature-area tests mirroring `app/` (`organizations/`, `polls/`, `website/`, `contacts/`, `content/`, `dashboard/`, `profile/`, `mobile/`, `ai/`) |
| `tests/utils/` | Test-only helpers (selectors, factories) |
| `tests/__visual_snapshots__/` | Pixel snapshots — versioned per-platform |
| `src/fixtures/` | Static fixtures (PDFs, images, JSON poll results) |
| `src/helpers/` | Reusable test helpers (clerk, navigation, account, organizations, contacts, visual, wait, data) |
| `.env.example` | Required env (`BASE_URL`, secrets per `#devs-only`) |

## Patterns

- **One config, many environments.** Set `BASE_URL` in `.env` to point at local / dev / qa. Tests fail-fast if missing.
- **Authenticated flows** use Clerk via `@clerk/testing/playwright`. `clerkSetup()` runs once in `global-setup.ts`; per-test sign-in helpers live in `src/helpers/clerk.helper.ts`.
- **Visual diffs**: thresholds are deliberately permissive (`maxDiffPixels: 25000`, ratio `0.045`) to absorb font/layout drift across machines. Tighten only with a clear reason.
- **Mirroring**: a feature dir under `app/` should have a matching dir under `tests/app/`. Add tests in the matching dir, not at the top of `tests/`.

## Running

```bash
# From repo root
npm run test:e2e                                   # all tests, headless
# From this dir (e2e-tests/)
npx playwright test                                # all
npx playwright test tests/core/pages/blog.spec.ts  # one file
npx playwright test polls                          # name pattern
npm run test:visual:update                         # refresh visual snapshots (use carefully)
```

Some tests need AWS auth: `aws sso login --profile gp-engineer`.

## Gotchas

- **Visual snapshots are platform-specific** — refreshing them on a Mac may not match CI Linux. Prefer letting CI regenerate via PR if you change UI.
- `BASE_URL` is enforced in `playwright.config.ts` — there's no default. Configure `.env` first.
- Don't import from `app/` or `helpers/` here. This dir is a separate workspace with its own `tsconfig` and no Next runtime — pulling in app code drags in client-only modules (`next/navigation`, the `@shared/*` alias, MUI, etc.) that fail to resolve under Playwright. Put shared test-side helpers in `e2e-tests/src/helpers/` instead.

## Related

- `e2e-tests/README.md` — onboarding + setup details (env vars, secret handoff).
- `docs/testing.md` — Vitest (unit/component) testing.
