---
name: migrate-legacy-fetch
description: Port a gpFetch / clientFetch / serverFetch / unAuthFetch call site to clientRequest / serverRequest.
---

# Migrate a legacy fetch call

Use when a call site uses any of the deprecated helpers in `gpApi/`:

- `gpFetch` (`gpApi/gpFetch.ts`)
- `clientFetch` (`gpApi/clientFetch.ts`)
- `serverFetch` (`gpApi/serverFetch.ts`)
- `unAuthFetch` (`gpApi/unAuthFetch.ts`)

Background: see `gpApi/AGENTS.md`.

## Procedure

1. **Find the route definition in `gpApi/routes.ts`.**

   The legacy call looks like `clientFetch(apiRoutes.widgets.create, { ... })`. Chase the `apiRoutes.*.*` identifier back to its `{ path, method }` entry.

2. **Add a typed entry to `gpApi/api-endpoints.ts`.**

   Key is `'METHOD /path/:param'`. Define `Request` and `Response` from the call site payload shape and what the caller does with the return value. Do NOT use `Record<string, unknown>` — enumerate fields.

   ```ts
   'POST /v1/widgets': {
     Request: { name: string; color: 'red' | 'blue' }
     Response: Widget
   }
   ```

3. **Replace the call.**

   Before:

   ```ts
   const res = await clientFetch(apiRoutes.widgets.create, { name, color })
   if (!res.ok) return
   const widget = res.data
   ```

   After:

   ```ts
   import { clientRequest } from "gpApi/typed-request"

   try {
     const { data: widget } = await clientRequest("POST /v1/widgets", {
       name,
       color,
     })
   } catch (e) {
     // handle error - ofetch throws on non-2xx
   }
   ```

   Server contexts: swap `clientRequest` for `serverRequest` from `gpApi/server-request.ts`.

4. **Fix error handling.**

   Legacy returns `T | Response | false`; typed system throws on 4xx/5xx. If the call site had `if (!res.ok) ...` branches, convert to `try/catch` (or check `status` on the response for permission-denied-style flows).

5. **Update/add a test.**

   Use `api.mock(route, ...)` from `helpers/test-utils/api-mocking.ts`. Remove any manual `global.fetch` mocks at the call site.

6. **Delete the `routes.ts` entry** if nothing else references it. Confirm with a search:

   ```
   grep -r "apiRoutes.widgets.create" app gpApi helpers
   ```

7. **Verify.**

   ```bash
   npx tsc --noEmit
   npx vitest run <changed-files>
   npm run lint
   ```

## When to skip

- FormData uploads — both systems handle them, but the typed client routes through `ofetch` which auto-infers JSON content type. Verify behavior on a small test first.
- Call sites that depend on the polymorphic `Response | T | false` return — audit what downstream code does with each branch before flipping.

## Migration tracker

As of this skill creation there are ~85 files importing the legacy helpers. See `gpApi/AGENTS.md` for the canonical description of the target state.
