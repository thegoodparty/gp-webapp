# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Dev server on :4000 with local API (localhost:3000)
npm run dev-dev          # Dev server on :4000 with remote dev API
npm run build            # Production build
npm run lint             # ESLint + Prettier check
npm run lint:fix         # Auto-fix lint issues
npm run test             # Vitest (single run)
npm run test:watch       # Vitest in watch mode
npm run test:e2e         # Playwright E2E tests
npm run types            # TypeScript type check
npm run storybook        # Component library on :6006
```

## Architecture

Next.js 15 App Router deployed on Vercel. Calls gp-api (NestJS backend on ECS) and election-api for data.

### Deployment

Vercel auto-deploys on push. Branch mapping:

- `develop` → `dev.goodparty.org` (API: `gp-api-dev.goodparty.org`)
- `qa` → `qa.goodparty.org` (API: `gp-api-qa.goodparty.org`)
- `master` → `goodparty.org` (API: `api.goodparty.org`)
- PR branches → Vercel preview environments

### Top-level routes (`app/`)

- `dashboard/` - Candidate dashboard (campaign tools, polls, voter outreach, website, contacts, content, meetings)
- `admin/` - Admin tools
- `polls/` - Public poll results
- `onboarding/` - Post-signup onboarding flow
- `login/`, `sign-up/`, `logout/`, `post-auth-redirect/`, `impersonate/` - Auth + session flows
- `api/` - Next.js route handlers (proxy + webhooks)
- `shared/` - Providers, hooks, UI atoms, utils shared across routes
- `layout.tsx`, `page.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx` - App Router roots

### API clients

Two systems coexist in `gpApi/`. **The typed system is canonical for new code.** The legacy fetch helpers are `@deprecated` and being migrated out.

- Typed: `clientRequest` / `serverRequest`, routes in `gpApi/api-endpoints.ts`. Throws on non-2xx.
- Legacy (deprecated): `gpFetch`, `clientFetch`, `serverFetch`, `unAuthFetch`, routes in `gpApi/routes.ts`. Returns `T | Response | false`, never throws.

Full reference + decision tree: `docs/api-clients.md` and `gpApi/AGENTS.md`. To add an endpoint or migrate a legacy call, see `.claude/skills/`.

### State Management

React Context providers wrap the app (in `app/shared/hooks/`):

- `UserProvider` - Auth state, loaded from cookie
- `CampaignProvider` - Current campaign, refreshes on user change
- `FeatureFlagsProvider` - Amplitude experiments
- React Query (`@tanstack/react-query`) with 5min stale time for data fetching

### Auth

JWT stored in HTTP-only cookie by gp-api. Frontend includes it via `credentials: 'include'`. User loaded on mount in `UserProvider`. Protected routes check user context and redirect to login.

### Environment Config

`appEnv.ts` exports all env-derived constants: `API_ROOT`, `ELECTION_API_ROOT`, `APP_BASE`, `IS_PROD`, `IS_LOCAL`, etc. Defaults point to dev API when env vars are unset.

## Testing

Vitest + React Testing Library + jsdom. Test globals enabled (no imports needed for `describe`, `it`, `expect`, `vi`).

### Targeted runs

```bash
npx vitest run path/to/file.test.tsx     # single file
npx vitest run -t "creates a poll"       # by name pattern
npx vitest --watch path/to/file.test.tsx # single file in watch mode
```

Full guide: `docs/testing.md`.

### API Mocking

MSW-based via `helpers/test-utils/api-mocking.ts`. Routes must match keys in `APIEndpoints`:

```typescript
import { api } from 'helpers/test-utils/api-mocking'

api.mock('GET /v1/polls', {
  status: 200,
  data: { results: [], pagination: { nextCursor: undefined } },
})
```

Other patterns (`mockOrdered`, dynamic handlers): `docs/testing.md`.

### Test Utilities

- `helpers/test-utils/render.tsx` - Custom render wrapping `QueryClientProvider`
- `helpers/test-utils/router-mocking.ts` - Mocked `useRouter()` (auto-applied in `vitest.setup.ts`)
- `vitest.setup.ts` - Loads jest-dom matchers, clears React Query cache between tests, mocks `next/navigation`

### AI Code Review

`ai-rules/` is a git submodule with focused rule files. Run `npm run ai-rules:update` to pull the latest. The wired-up critic agent lives at `.claude/agents/code-critic.md` — invoke it via `@code-critic` (or just spawn a subagent that loads the rule files and reviews the diff).

## Boundaries

- **Never** edit `middleware.ts`, `app/api/revalidate/route.ts`, or `gpApi/api-endpoints.ts` without explicit confirmation. The first two affect every request; the third is a cross-repo contract with `gp-api`.
- **Never** commit env files. `.env.example` only.
- **Never** push to `develop` directly — open a PR.
- **Ask first** before adding new utilities to `helpers/` (it is already a 50+ file dumping ground; check whether the helper exists). See `gpApi/AGENTS.md` for fetch-helper rules.
- **Deploys** are automatic via Vercel on push to `develop` / `qa` / `master`. There is no manual deploy command.

## Observability

- **Frontend errors → Sentry.** Org slug `goodparty`. https://goodparty.sentry.io.
- **Backend logs → Grafana Cloud Loki.** `{service_name="gp-api", deployment_environment_name="dev|qa|prod"}`. https://goodparty.grafana.net.
- Recipe for reproducing a Sentry issue locally: `docs/debugging.md`.

## Docs

- `docs/api-clients.md` - Typed vs legacy fetch, decision tree
- `docs/testing.md` - Vitest patterns, MSW mocking
- `docs/debugging.md` - Sentry / Loki, repro recipe
- `gpApi/AGENTS.md` - Working in the gpApi/ directory
- `app/dashboard/website/README.md` - Website feature layout

## Code Style

- No semicolons, single quotes, trailing commas (Prettier)
- `@shared/*` path alias maps to `app/shared/*`
- Strict TypeScript: `noImplicitAny`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`
- ESLint enforces no unused imports via `unused-imports/no-unused-imports`
