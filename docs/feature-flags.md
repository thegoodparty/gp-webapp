# Feature Flags

Feature flags are powered by **Amplitude Experiment**. The provider in `app/shared/experiments/FeatureFlagsProvider.tsx` boots the SDK with the current user's traits and exposes hooks for reading variants.

## Hooks

```ts
import {
  useFeatureFlags,
  useFlagOn,
} from '@shared/experiments/FeatureFlagsProvider'

// Boolean check — most common use case
const { ready, on } = useFlagOn('my-feature-key')
if (!ready) return <Spinner />
return on ? <NewUI /> : <OldUI />

// Full variant (e.g. multi-arm experiment)
const { ready, variant } = useFeatureFlags()
const v = variant('my-feature-key')
// v.value: undefined | 'control' | 'treatment-a' | ...
```

`useFlagOn(key)` is the right default. Reach for `useFeatureFlags` only when you need the variant payload, all flags at once, or to fire an explicit `exposure()`.

## Components

### `FeatureFlagGuard`

Redirects away from a route if the flag is off. Use as a route-level wrapper:

```tsx
import FeatureFlagGuard from '@shared/experiments/FeatureFlagGuard'

export default function Page() {
  return (
    <FeatureFlagGuard flagKey="my-feature-key" redirectTo="/dashboard">
      <MyFeature />
    </FeatureFlagGuard>
  )
}
```

While the flag is loading, the guard renders a centered spinner. While the flag is off, it returns `null` and triggers a `router.replace`.

## Per-flag wrapper hooks

When a flag is read in many places, wrap it once and export a named hook so the key is centralized. Example: `app/shared/experiments/proUpgradeFlag.ts`:

```ts
export const PRO_UPGRADE_FLAG_KEY = 'pro-upgrade1'

export const useProUpgradeFlag = () => {
  const { ready, on } = useFlagOn(PRO_UPGRADE_FLAG_KEY)
  return { ready, enabled: on }
}
```

This keeps the key out of feature code and gives you one place to remove the flag when the experiment ends.

## User traits

The provider builds an Amplitude `ExperimentUser` from the current user via `helpers/buildUserTraits.ts`. When the user changes (login / logout / impersonation), the provider clears its cache and re-fetches variants. Don't try to manually re-init.

## Server-side flags

Server components currently can't read Amplitude experiments — the provider is client-only. If you need server-side gating, gate at the gp-api layer or pass the flag down to a `'use client'` boundary.

## Adding a new flag

1. Create the flag in Amplitude Experiment with a stable key (kebab-case, e.g. `outreach-bulk-send`).
2. If the key is read in more than one component, add a wrapper hook under `app/shared/experiments/`.
3. Use `useFlagOn(key)` (or your wrapper) at the call site.
4. **Removing the flag**: delete the wrapper hook + key constant, then grep for stragglers.

## Anti-patterns

- Don't read flags during render without the `ready` check — variant defaults to `undefined` while loading and you'll flash the wrong branch.
- Don't keep flags around forever. Once an experiment ships, delete the gate.
- Don't gate critical security checks behind a feature flag — gate the UX, but enforce auth/permission in `app/dashboard/shared/candidateAccess.ts` (client) / `serveAccess.ts` (server) and at gp-api.

## Related

- `app/shared/experiments/FeatureFlagsProvider.tsx` — provider + hooks.
- `app/shared/experiments/FeatureFlagGuard.tsx` — route-level guard.
- `helpers/buildUserTraits.ts` — user traits passed to Amplitude.
- `appEnv.ts` — `NEXT_PUBLIC_AMPLITUDE_API_KEY`.
