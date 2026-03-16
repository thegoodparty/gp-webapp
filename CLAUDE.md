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

### Route Groups

- `(candidate)/` - Protected candidate dashboard (campaign tools, polls, voter outreach)
- `(company)/` - Public pages (about, team, volunteer)
- `(entrance)/` - Auth flows (login, signup, password)
- `(landing)/` - Marketing landing pages
- `(user)/` - User profile
- `admin/` - Admin tools

### Two API Client Systems

The codebase has two parallel fetch systems — a legacy one and a newer typed one:

**Legacy system** (`gpApi/gpFetch.ts`, `gpApi/clientFetch.ts`, `gpApi/serverFetch.ts`):
- `clientFetch<T>(endpoint, data)` - Browser-side, sends JWT via cookies
- `serverFetch<T>(endpoint, data)` - Server-side, injects Bearer token from `getServerToken()`
- `unAuthFetch` - Public endpoints (no auth)
- Routes defined in `gpApi/routes.ts` as `ApiRoute` objects with `path` and `method`
- URL building via `@shared/utils/buildUrl` (replaces `:param` placeholders, appends query strings)
- **Error handling:** Returns polymorphic types — parsed JSON on 2xx, raw `Response` on non-2xx, `false` on parse failure. Callers must check `ok`/status manually; errors are never thrown.

**Typed system** (`gpApi/typed-request.ts`, `gpApi/api-endpoints.ts`):
- `clientRequest<Route>(route, payload)` - Browser-side typed requests via `ofetch`
- `serverRequest<Route>(route, payload)` - Server-side typed requests
- Routes are string keys like `'GET /v1/polls/:pollId'` with typed `Request`/`Response` in `APIEndpoints`
- Path params auto-extracted from route string via `PathParamsOf<Route>` type
- **Error handling:** Returns a consistent `Response<T>` shape with `{ ok, status, data, headers }`. `ofetch` throws on 4xx/5xx by default, so callers should use try/catch.
- This is the newer pattern — prefer it for new code

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

### API Mocking

MSW-based via `helpers/test-utils/api-mocking.ts`:

```typescript
import { api } from 'helpers/test-utils/api-mocking'

// Static response
api.mock('GET /v1/polls', { status: 200, data: { results: [], pagination: { nextCursor: undefined } } })

// Ordered responses (returned one at a time in sequence)
api.mockOrdered('GET /v1/polls/:pollId', [
  { status: 200, data: firstPoll },
  { status: 200, data: updatedPoll },
])

// Dynamic handler with access to request params/body
api.mock('POST /v1/polls/initial-poll', ({ body }) => ({
  status: 200,
  data: { ...mockPoll, message: body.message },
}))

api.reset() // Clear all handlers (also auto-clears in beforeEach)
```

Routes must match keys in `APIEndpoints` type (e.g., `'GET /v1/contacts/stats'`).

### Test Utilities

- `helpers/test-utils/render.tsx` - Custom render wrapping `QueryClientProvider`
- `helpers/test-utils/router-mocking.ts` - Mocked `useRouter()` (auto-applied in `vitest.setup.ts`)
- `vitest.setup.ts` - Loads jest-dom matchers, clears React Query cache between tests, mocks `next/navigation`

### AI Code Review

The `ai-rules/` directory is a git submodule with rule files for focused code review. Before using the critics, always pull the latest rules first: `npm run ai-rules:update`. When writing or modifying code, consider spawning a critic subagent for each relevant rule file:

```
Read each .md file in ai-rules/. For each rule file relevant to my changes,
review the code I changed against those rules. For each violation, cite the
rule number, quote the offending code, and explain what to change.
```

## Code Style

- No semicolons, single quotes, trailing commas (Prettier)
- `@shared/*` path alias maps to `app/shared/*`
- Strict TypeScript: `noImplicitAny`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`
- ESLint enforces no unused imports via `unused-imports/no-unused-imports`
