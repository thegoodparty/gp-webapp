---
name: add-typed-endpoint
description: Add a new gp-api endpoint to the typed client (gpApi/api-endpoints.ts) and consume it from the webapp.
---

# Add a typed endpoint

Use when adding a new gp-api route to the webapp, or porting one off the legacy `clientFetch`/`gpFetch` helpers.

Background: see `gpApi/AGENTS.md`. The typed system is canonical; legacy fetch helpers are deprecated.

## Procedure

1. **Add the route to `APIEndpoints`.**

   Edit `gpApi/api-endpoints.ts`. Add an entry keyed by the literal `'METHOD /path/:param'`. Define `Request` and `Response` types.

   ```ts
   'POST /v1/widgets': {
     Request: { name: string; color: 'red' | 'blue' }
     Response: { id: string; name: string; color: string }
   }
   ```

   - Path params (`:widgetId`) are extracted from the route key automatically.
   - For GET/DELETE, `Request` becomes querystring params. For POST/PUT/PATCH, it's the JSON body.
   - Avoid `Record<string, unknown>` — define explicit shapes.

2. **Choose `clientRequest` or `serverRequest`.**

   - Browser / client component → `import { clientRequest } from 'gpApi/typed-request'`
   - Server component / route handler / `'use server'` → `import { serverRequest } from 'gpApi/server-request'`

3. **Call it.**

   ```ts
   const { data, ok } = await clientRequest('POST /v1/widgets', {
     name: 'foo',
     color: 'red',
   })
   ```

   `ofetch` throws on 4xx/5xx — wrap in try/catch where you need to handle errors.

4. **Test it with the typed mocker.**

   ```ts
   import { api } from 'helpers/test-utils/api-mocking'

   it('creates a widget', async () => {
     api.mock('POST /v1/widgets', ({ body }) => ({
       status: 200,
       data: { id: '1', name: body.name, color: body.color },
     }))
     // render component, trigger action, assert
   })
   ```

   `api.reset()` runs automatically in `beforeEach` (see `vitest.setup.ts`).

5. **Verify.**

   ```bash
   npx tsc --noEmit
   npx vitest run path/to/your.test.tsx
   ```

## When to skip

- The route already exists in `APIEndpoints` — just call it.
- The route will be invoked exactly once by a server action wrapping the deprecated `serverFetch`, and you have a strong reason not to migrate. Document the reason; the default expectation is the typed system.

## Common mistakes

- Forgetting that path params live alongside the request body in the payload object — they are stripped out before the body is sent.
- Pulling response types from feature folders (e.g. `app/dashboard/.../poll-types.ts`) instead of `gpApi/types/`. New types should live next to the route or in `gpApi/types/`.
- Using `Record<string, unknown>` to dodge the type system — defeats the typed client.
