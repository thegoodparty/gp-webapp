# API clients

Two systems coexist in `gpApi/`. The typed system is canonical; the legacy helpers are deprecated.

## Decision tree

```
New code? ─────────────────► clientRequest / serverRequest (typed)
Existing legacy call?  ────► leave as-is OR port (see migrate-legacy-fetch skill)
```

## Typed (canonical)

- `clientRequest` — `gpApi/typed-request.ts`. Browser / client components.
- `serverRequest` — `gpApi/server-request.ts`. Server components, route handlers, `'use server'`.
- Routes are typed keys in `APIEndpoints` (`gpApi/api-endpoints.ts`): `'METHOD /path/:param'`.
- Returns `{ ok, status, data, headers }`. `ofetch` throws on non-2xx.

```ts
import { clientRequest } from 'gpApi/typed-request'

const { data: poll } = await clientRequest('GET /v1/polls/:pollId', {
  pollId,
})
```

## Legacy (deprecated)

- `clientFetch` — `gpApi/clientFetch.ts`
- `serverFetch` — `gpApi/serverFetch.ts`
- `gpFetch` — `gpApi/gpFetch.ts`
- Routes live in `gpApi/routes.ts` as `{ path, method }` records.
- Returns polymorphic `T | Response | false` — callers must check `ok`/`status` and never rely on a thrown error.

## For unauthenticated endpoints

- `unAuthFetch` — `gpApi/unAuthFetch.ts`. Use for public endpoints that should reach gp-api with no credentials. `clientRequest` and `serverRequest` always attach auth (cookie / Bearer token), so swapping a public call to the typed helpers silently changes server-side behavior. Keep using `unAuthFetch` for anonymous calls.

## Auth

- Cookie-based JWT. `clientRequest` sets `credentials: 'include'`. `serverRequest` reads `getServerToken()` and adds `Authorization: Bearer …`.
- The current organization slug (when impersonating) is read from the `goodparty-org-slug` cookie and forwarded as the `x-organization` header.

## Testing

Use the typed mocker — it is keyed off `APIEndpoints` so mocks stay in sync with the contract.

```ts
import { api } from 'helpers/test-utils/api-mocking'

api.mock('GET /v1/polls', {
  status: 200,
  data: { results: [], pagination: { nextCursor: undefined } },
})
```

See `helpers/test-utils/api-mocking.ts` for `mockOrdered`, dynamic handlers, and request-aware mocks.

## See also

- `gpApi/CLAUDE.md` — repo-local guide for working in `gpApi/`.
- `.claude/skills/add-typed-endpoint.md` — recipe for adding a new endpoint.
- `.claude/skills/migrate-legacy-fetch.md` — recipe for porting a legacy call.
