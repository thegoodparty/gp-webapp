# Testing

Vitest + React Testing Library + jsdom. Globals enabled — no need to import `describe`, `it`, `expect`, `vi`.

## Run

```bash
npm run test                                 # one shot
npm run test:watch                           # watch
npx vitest run path/to/file.test.tsx         # single file
npx vitest run -t "creates a poll"           # by name pattern
npx vitest --watch path/to/file.test.tsx     # watch a single file
```

E2E:

```bash
npm run test:e2e                             # Playwright (installs chromium first run)
npm run test:visual:update                   # update snapshots
```

## API mocking

MSW-based, keyed off `APIEndpoints`:

```ts
import { api } from 'helpers/test-utils/api-mocking'

// Static
api.mock('GET /v1/polls', {
  status: 200,
  data: { results: [], pagination: { nextCursor: undefined } },
})

// Dynamic — body / query / params are typed
api.mock('POST /v1/polls/initial-poll', ({ body }) => ({
  status: 200,
  data: { ...mockPoll, message: body.message },
}))

// Ordered — each response served exactly once
api.mockOrdered('GET /v1/polls/:pollId', [
  { status: 200, data: firstPoll },
  { status: 200, data: updatedPoll },
])

api.reset() // also runs automatically in beforeEach
```

If the route does not exist in `APIEndpoints` yet, add it (see `.claude/skills/add-typed-endpoint.md`).

## Test utilities

- `helpers/test-utils/render.tsx` — custom render wrapping `QueryClientProvider`. Use this instead of `render` from `@testing-library/react` whenever the component pulls from React Query.
- `helpers/test-utils/router-mocking.ts` — `useRouter` mock applied automatically in `vitest.setup.ts`.
- `vitest.setup.ts` — loads jest-dom matchers, clears React Query cache between tests, mocks `next/navigation`.

## Patterns

- Prefer `screen.findBy*` over `await waitFor(() => screen.getBy*)`.
- `userEvent.setup()` once per test, not per interaction.
- Don't reach for `vi.spyOn(global, 'fetch')` — use `api.mock` instead.

## Gold-standard examples

- `app/dashboard/polls/` — typed-request + MSW + tests, end-to-end.
- `gpApi/typed-request.test.ts` — tests for the request layer itself.
