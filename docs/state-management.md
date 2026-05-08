# State Management

Three layers, in order of "which to reach for first":

1. **Local component state** (`useState` / `useReducer`) — for ephemeral UI state (open/closed, draft input). Default for anything not shared across components.
2. **Server cache via React Query** — for anything fetched from gp-api. The `QueryClient` is configured in `app/shared/query-client.tsx` with a 5-minute stale time. Mutations should `invalidateQueries` on the relevant keys.
3. **React Context providers** — for cross-route state that doesn't fit a server cache: current user, current campaign, current organization, feature flags.

There is no Redux / Zustand / Jotai. Don't add one.

## App-wide providers

Mounted at the root in `app/layout.tsx` (or close to it). Order matters — children of a provider can read its context.

| Provider                  | File                                                   | Purpose                                                    |
| ------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| `UserProvider`            | `app/shared/user/UserProvider.tsx`                     | Auth state, loaded from cookie. Most app code starts here. |
| `ImpersonateUserProvider` | `app/shared/user/ImpersonateUserProvider.tsx`          | Impersonation state — drives the global banner.            |
| `CampaignProvider`        | `app/shared/hooks/CampaignProvider.tsx`                | Current campaign. Refreshes on user change.                |
| `CampaignStatusProvider`  | `app/shared/user/CampaignStatusProvider.tsx`           | Campaign-level status flag.                                |
| `FeatureFlagsProvider`    | `app/shared/experiments/FeatureFlagsProvider.tsx`      | Amplitude experiments — see `docs/feature-flags.md`.       |
| `QueryClientProvider`     | `app/shared/query-client.tsx`                          | React Query client.                                        |
| `Snackbar`                | `app/shared/utils/Snackbar.tsx`                        | App-wide toast surface. Use `helpers/useSnackbar.ts`.      |
| `NavigationProvider`      | `app/shared/layouts/navigation/NavigationProvider.tsx` | Sidebar / nav state.                                       |

## Feature-local providers

When state is bound to a single feature, wrap that feature — don't pollute the root tree. Examples:

- `app/dashboard/campaign-assistant/components/ChatProvider.tsx` — current chat thread + send action.
- `app/dashboard/outreach/hooks/OutreachContext.tsx` — selected outreach + audience filters.
- `app/shared/hooks/VoterContactsProvider.tsx` — voter-contact data; mounted by features that need it.

## Reading the user

```ts
import { useUser } from '@shared/hooks/useUser'

const [user, setUser, loading] = useUser()
// user:    User | null   (null until the cookie request resolves)
// setUser: (user?) => void
// loading: boolean       (true on first render — gate UI on this to avoid
//                         flashing the logged-out branch during hydration)
```

Server components: `helpers/userServerHelper.ts` (reads cookie via `next/headers`).

## React Query conventions

- Query keys follow `[entity, scope, params]` shape (e.g. `['campaign', campaignId, 'status']`). Keep them stable.
- 5-minute stale time is the default; override per query only with a reason.
- After mutations, invalidate the smallest affected key. Don't `invalidateQueries()` with no key — it nukes the whole cache.

## When to add a new provider

- It's needed by ≥3 unrelated routes/features and isn't fetchable.
- It's intrinsically global (e.g. theme, auth).

If it's only used by one feature, keep it in that feature's dir. Adding a provider at `app/shared/` is a tree-wide change — confirm scope before doing it.

## Anti-patterns

- Don't store fetched server data in context — let React Query own it.
- Don't deep-relative-import providers (`../../../shared/user/UserProvider`). Use the `@shared/*` alias.
- Don't re-wrap an already-mounted provider inside a feature.
