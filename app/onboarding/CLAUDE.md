# app/onboarding/

Post-signup onboarding flow. New users land here after registration to pick the office they're running for, fill in basic campaign info, and reach a "complete" state that hands off to the dashboard.

## Key files

| File | Role |
|------|------|
| `page.tsx` | Route entry — redirects to first step |
| `[slug]/[step]/` | Dynamic route — `slug` = section, `step` = step within section |
| `onboarding.consts.ts` | Step IDs (`REGISTRATION`, `STEP_1`, `STEP_2`, `STEP_3`, `COMPLETE`) |
| `components/onboardingConfig.ts` | Step definitions / order — single source for what each step renders |
| `components/OnboardingFlow.tsx` | Top-level controller — current step, navigation |
| `components/OfficeSelectionStep.tsx` + `ManualOfficeEntryStep.tsx` | Office-selection UX (search + manual fallback) |
| `components/onboardingHelpers.ts`, `onboardingTypes.ts` | Pure helpers + types |
| `shared/` | Layout, stepper, modal, ajax helpers |
| `office-selection/` | Office-selection page bits used inside the flow |

## Patterns

- **Step-driven flow**: each step is config-defined in `onboardingConfig.ts`. To add a step, add it to the config — `OnboardingFlow` picks it up. Don't add new routes by hand.
- **Reset scroll** on step change — handled by the layout per the root CLAUDE.md navigation rule.
- **Two office-selection paths**: search (`OfficeSelectionStep`) and manual entry (`ManualOfficeEntryStep`). Manual is the fallback when search fails — keep both.

## Gotchas

- `[slug]/[step]/` route is dynamic; URLs look like `/onboarding/onboarding-1/...`. Don't link to `step` numerically — go through the constants.
- Tests exist for the office-selection steps — run them when changing office logic (`OfficeSelectionStep.test.tsx`, `ManualOfficeEntryStep.test.tsx`, `OnboardingFlow.test.tsx`).
- Versioning helper lives at `shared/useVersions.ts` and returns a `useQuery` result (`{ data, error, isPending, ... }`). Consumers must handle the error and pending states — the previous mount-time `useEffect` fetch silently swallowed failures.

## Related

- `app/post-auth-redirect/` — decides whether to send users into onboarding vs dashboard.
- `helpers/resolvePostAuthRedirectPath.util.ts` — same logic, server side.
