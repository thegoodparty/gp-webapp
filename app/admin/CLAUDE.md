# app/admin/

Internal admin tools. GoodParty staff use this to manage users, impersonate candidates for support, and trigger account-recovery actions. Not exposed to candidates.

## Key files

| File | Role |
|------|------|
| `shared/ImpersonateAction.tsx` | Per-user "impersonate" action — flips session to view as that user |
| `shared/sendSetPasswordEmail.ts` | Triggers password-reset email for a user |
| `users/components/ResendPasswordEmailAction.tsx` | Resend password-set email from the user list |
| `shared/` | Layout, table primitives, access guards used across admin pages |

## Patterns

- **Admin gating**: routes here are reachable only by users with admin role. Auth/role check happens in `app/shared/user/UserProvider.tsx` and at the page level — don't rely on the URL alone.
- **Impersonation** uses the `ImpersonateUser` provider in `app/shared/user/`. After kicking off, the global `ImpersonationBanner` shows on every page until exited.
- **Server actions** (`shared/sendSetPasswordEmail.ts`) call gp-api directly via `serverRequest`; admin actions tend to be one-shot rather than form-driven.

## Gotchas

- `app/shared/user/ImpersonatingTracker.tsx` and `ImpersonationBanner.tsx` are the global hooks for impersonation state — don't roll your own banner / exit flow inside admin.
- Admin routes are mostly server-rendered; resist the urge to add heavy client state. If you need a form, follow the pattern in `users/`.
- Adding a new admin action: cross-cutting actions live in `shared/`, list-page actions in `users/components/`. Reuse `shared/` primitives. Keep actions discoverable from the user list page.

## Related

- `app/shared/user/UserProvider.tsx`, `ImpersonateUserProvider.tsx`, `ImpersonationBanner.tsx`.
- `app/impersonate/` — public route used to enter impersonation by token.
- `helpers/authHelper.ts` — role checks.
