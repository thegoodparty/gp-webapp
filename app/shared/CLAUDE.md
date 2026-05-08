# app/shared/

Cross-route building blocks: providers, hooks, UI primitives, layouts, and feature-flag plumbing. Imported as `@shared/*` (alias maps to `app/shared/*`).

## Key files

| Subdir / file | Role |
|---------------|------|
| `user/UserProvider.tsx` | Auth state — loaded from cookie, exposed to the tree |
| `user/ImpersonateUserProvider.tsx`, `ImpersonationBanner.tsx`, `ImpersonatingTracker.tsx` | Impersonation state + global UI |
| `user/CampaignStatusProvider.tsx` | Campaign-level status flag |
| `hooks/CampaignProvider.tsx` + `useCampaign.ts` | Current campaign context |
| `hooks/VoterContactsProvider.tsx` | Voter-contact data shared across dashboard features |
| `experiments/FeatureFlagsProvider.tsx`, `FeatureFlagGuard.tsx` | Amplitude feature flags + JSX gate |
| `layouts/`, `cards/`, `inputs/`, `buttons/`, `typography/`, `ui/` | Reusable primitives |
| `query-client.tsx` | React Query client + provider |
| `materialTheme.ts`, `sentry.tsx`, `AmplitudeInit.tsx` | App bootstrap pieces |

## Patterns

- **Providers compose at the root** (`app/layout.tsx`). Don't re-wrap providers inside features; consume via the matching `use*` hook.
- **Feature flags**: gate UI with `<FeatureFlagGuard flagKey="..."/>` or `useFlagOn(key)` (boolean) / `useFeatureFlags()` (full variant). See `docs/feature-flags.md`.
- **Path alias** `@shared/*` is mandatory in this dir — never deep-relative-import (`../../shared/...`) into here.
- **UI primitives**: raw atoms (`Button`, `Input`, `Label`, etc.) live in `@styleguide` and should always be imported from there. The `cards/`, `inputs/`, `buttons/`, `typography/`, `ui/` dirs under `app/shared/` are app-specific compositions on top of those atoms — reach for them only when the styleguide doesn't already provide what you need.

## Gotchas

- **Adding a provider here is a tree-wide change.** Confirm scope before introducing new context — most features should use a feature-local provider instead.
- `app/shared/utils/` (deeply nested) is a small utility bag distinct from top-level `helpers/` — when in doubt, prefer `helpers/` for new pure helpers (see `helpers/CLAUDE.md`).
- `query-client.tsx` defines stale time / retry policy — changing it affects every `useQuery` in the app.

## Related

- Root `CLAUDE.md` — `state-management` and `auth` overview.
- `docs/state-management.md` — provider order + when to use which.
- `docs/feature-flags.md` — feature-flag patterns.
