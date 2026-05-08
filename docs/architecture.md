# Architecture

A pointer-heavy doc. Detailed conventions live in `CLAUDE.md` and feature-level `CLAUDE.md` files under `app/`.

## Stack

- **Next.js 15** App Router on Vercel (React 19)
- **TanStack React Query 5** (5-minute stale time) for server-state caching
- **Tailwind CSS v4** + custom design tokens (`styleguide/design-tokens.css`, `styleguide/tailwind-theme.css`)
- **MUI 7** for some legacy material primitives; new code prefers `@styleguide`
- **Clerk** for auth widgets (e2e setup), session JWT issued by gp-api
- **Amplitude** for analytics + feature flags
- **Sentry** for error reporting (`@sentry/nextjs`)
- **Vitest** + jsdom + React Testing Library for unit/component tests
- **Playwright** for end-to-end tests (`e2e-tests/`)

## Module shape

```
app/
  (candidate)/                # public candidate website (route group) — not yet present in this repo
  dashboard/
    <feature>/                # one dir per feature, owns its routes + components
      page.tsx
      components/
      hooks/
      shared/
    shared/                   # cross-feature dashboard primitives + access guards
    components/                # cross-feature dashboard widgets
  admin/                      # internal staff tools
  onboarding/                 # post-signup flow (step-driven)
  shared/                     # app-wide providers, hooks, UI primitives
  api/                        # Next.js route handlers (proxy + webhooks)
gpApi/                        # API client layer (typed + legacy)
helpers/                      # ~50 cross-cutting utilities (grab-bag)
e2e-tests/                    # Playwright suite (separate workspace)
docs/                         # this directory
ai-rules/                     # git submodule of org-wide AI rules
```

`app/dashboard/polls/` is a clean reference feature — copy that structure for new dashboard features.

## Auth

JWT in HTTP-only cookie issued by gp-api. Frontend attaches it via `credentials: 'include'`.

- `app/shared/user/UserProvider.tsx` loads the user on mount and exposes it via context.
- Server components / route handlers use `helpers/userServerHelper.ts` and `gpApi/server-request.ts` (Bearer via `getServerToken()`).
- Impersonation: `app/shared/user/ImpersonateUserProvider.tsx` + global `ImpersonationBanner`. Entered via `/impersonate/<token>`.

## Cross-service edges

| Direction | Service                              | Protocol                                   | Auth                    |
| --------- | ------------------------------------ | ------------------------------------------ | ----------------------- |
| outbound  | gp-api (NestJS, ECS)                 | HTTP via `clientRequest` / `serverRequest` | Cookie or Bearer        |
| outbound  | election-api                         | HTTP                                       | Configured baseURL      |
| outbound  | Stripe (Checkout Sessions, redirect) | HTTP via gp-api                            | gp-api owns Stripe keys |
| outbound  | Amplitude                            | JS SDK                                     | Public key              |
| outbound  | Sentry                               | JS SDK                                     | Public DSN              |

Shared types flow through hand-rolled `Request`/`Response` declarations on `gpApi/api-endpoints.ts`. Some shapes are mirrored in `gpApi/types/`. There is no auto-generated contract package between gp-webapp and gp-api today.

## Bootstrap

- `app/layout.tsx` — root layout, mounts every provider in `app/shared/`.
- `app/shared/AmplitudeInit.tsx`, `sentry.tsx`, `materialTheme.ts` — third-party init.
- `appEnv.ts` (repo root) — env constants. Defaults point at the dev API.

## Key patterns

- **Typed gp-api client is canonical.** Legacy `clientFetch` / `serverFetch` are deprecated. See `gpApi/CLAUDE.md` and `docs/api-clients.md`.
- **Feature-level CLAUDE.md files** live next to each major feature dir — read those before working in that feature. The root `CLAUDE.md` keeps repo-wide rules (commands, deployment, code style, styleguide) and a pointer table for everything else.
- **Design tokens, not raw hex.** See root `CLAUDE.md` § Design Tokens.
- **State management**: see `docs/state-management.md`.
- **Feature flags**: see `docs/feature-flags.md`.

## ADRs

None yet — add `docs/adr/` if/when non-obvious decisions need to be captured.
