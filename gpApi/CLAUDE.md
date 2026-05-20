# gpApi/

API client layer. Two systems coexist — the **typed system is canonical**; the legacy fetch helpers are deprecated and being migrated out file-by-file.

## Key files

| File | Role |
|------|------|
| `api-endpoints.ts` | `APIEndpoints` registry — keys are `'METHOD /path/:param'`, values define `Request` / `Response`. **Cross-repo contract with gp-api — confirm before editing.** |
| `typed-request.ts` | `clientRequest<Route>(route, payload)` — browser. Throws on non-2xx. |
| `server-request.ts` | `serverRequest<Route>(route, payload)` — server components / route handlers / `'use server'`. |
| `unAuthFetch.ts` | Public endpoints. Sends no cookie / no Bearer — keep using for genuinely anonymous calls. |
| `gpFetch.ts`, `clientFetch.ts`, `serverFetch.ts`, `routes.ts` | Legacy. **Do not use in new code.** |
| `outreach.api.ts`, `types/outreach.types.ts` | Feature-specific bindings + shared shapes. |

## Use this for new code

- `clientRequest<Route>(route, payload)` from `typed-request.ts` (browser)
- `serverRequest<Route>(route, payload)` from `server-request.ts` (server components, route handlers)
- Routes are defined as keys in `APIEndpoints` in `api-endpoints.ts`
- Test mocks: `api.mock(route, ...)` from `helpers/test-utils/api-mocking.ts`

Returns a consistent `Response<T>`:

```ts
{
  ok: boolean
  data: T
  status: number
  headers: Headers
}
```

`ofetch` throws on 4xx/5xx — wrap calls in try/catch where you need to handle errors.

## Do NOT use for new code

- `gpFetch.ts` — deprecated
- `clientFetch.ts` — deprecated (still used in 85+ files; do not add more)
- `serverFetch.ts` — deprecated
- `routes.ts` — the `ApiRoute` registry consumed only by the deprecated helpers

These return polymorphic `T | Response | false` and never throw — callers must check `ok`/`status` manually. New code should not rely on this contract.

## Not deprecated

- `unAuthFetch.ts` — for public endpoints. Sends no cookie and no Bearer token, so gp-api treats the request as anonymous. Keep using it for genuinely unauthenticated calls; do NOT swap it for `clientRequest` / `serverRequest`, which always attach credentials.

## Adding a new endpoint

1. Add a route entry to `APIEndpoints` in `api-endpoints.ts`. The key is `'METHOD /path/:param'`. Define `Request` and `Response` types.

   ```ts
   'GET /v1/widgets/:widgetId': {
     Request: { include?: 'detail' }
     Response: Widget
   }
   ```

2. Call it:

   ```ts
   const { data } = await clientRequest('GET /v1/widgets/:widgetId', {
     widgetId,
     include: 'detail',
   })
   ```

   Path params and request payload share one object. The runtime strips path params from the body/query.

3. Add a test using the typed mocker:

   ```ts
   import { api } from 'helpers/test-utils/api-mocking'

   api.mock('GET /v1/widgets/:widgetId', {
     status: 200,
     data: { id: '1', name: 'foo' },
   })
   ```

Full recipe: `.claude/skills/add-typed-endpoint.md`.

## Migrating a legacy call

The endpoint-add recipe above is also the migration recipe. Short version:

1. Find the `routes.ts` entry for the call (`url`, `method`).
2. Add a corresponding `'METHOD /path'` entry to `APIEndpoints`.
3. Replace `clientFetch(routes.x.y.z, data)` with `clientRequest('METHOD /path', data)`.
4. Replace ad-hoc `if (!response.ok)` checks with try/catch (since `ofetch` throws).
5. Add or update a test that uses `api.mock(...)`.

## clientRequest vs serverRequest

| Concern  | `clientRequest`             | `serverRequest`                                     |
| -------- | --------------------------- | --------------------------------------------------- |
| Where    | Browser / client components | Server components / route handlers / `'use server'` |
| baseURL  | `/api` (Next.js rewrite)    | `API_ROOT` (direct to gp-api)                       |
| Auth     | Cookie via `credentials`    | Bearer via `getServerToken()`                       |
| Org slug | Cookie → `x-organization`   | `next/headers` cookies → `x-organization`           |

If you call from a context where `next/headers` is unavailable, use `clientRequest`.

## Error semantics

- **Typed system**: throws `FetchError` on non-2xx; caller wraps in try/catch.
- **Legacy system**: returns `Response` on non-2xx, `false` on parse failure, never throws. New code should not depend on this.

## Gotchas

- **`api-endpoints.ts` is a cross-repo contract** with gp-api. Don't change request/response shapes without coordinating.
- **Don't add to `routes.ts`** — it's the legacy registry. New routes go in `api-endpoints.ts`.
- **Path params share one object** with the body/query payload. The runtime strips path params from the body/query before sending — don't pre-strip them yourself.
- **Test mocks are typed against `APIEndpoints` keys** — the same string you call drives the mock.
- **`unAuthFetch` is not deprecated.** The typed helpers always attach credentials; it's the only anonymous variant.
- **Legacy returns `T | Response | false`, never throws.** New code shouldn't depend on that contract — port to typed first.

## Out-of-scope here

- Adding new entries to `routes.ts` — add to `api-endpoints.ts` instead.
- Wrapping legacy helpers with retry/error utilities — port the call to the typed system first.

## Related

- `docs/api-clients.md` — full decision tree, examples.
- `helpers/test-utils/api-mocking.ts` — MSW mocker with typed routes.
- `.claude/skills/add-typed-endpoint.md` — endpoint-add recipe (also the basis for legacy migration).
