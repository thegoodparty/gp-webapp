# app/dashboard/polls/

Custom polling. Campaigns commission AI-assisted polls of their district, pay (Stripe), and view results. Public poll-share pages live separately under `app/polls/`.

## Key files

| File | Role |
|------|------|
| `page.tsx` | Polls list — `PollsPage` + `PollsTable` |
| `create/` | Multi-step poll creation flow |
| `[id]/` | Poll detail + extension flows (`expand/`, `expand-payment/`, `expand-payment-success/`, `expand-review/`, `issue/`) |
| `components/` | List-page widgets (`PollPreview`, `PollImageUpload`, `StatusBadge`, scheduled-date selector) |
| `shared/components/` + `shared/hooks/` | Reused across create + detail (form fields, validation hooks) |

## Patterns

- **`[id]/expand*` are payment sub-flows**, not separate pages — a campaign extends an existing poll's reach by paying more. Each step (review → payment → success) is its own route.
- **Status badge** semantics live in `components/StatusBadge.tsx` — single source of truth for status colors / labels.
- **Image upload** pattern (`PollImageUpload`) is poll-specific; for general uploads use shared inputs from `app/shared/inputs/`.
- Stripe checkout-session redirect pattern (not Stripe Elements) — payment flows hand off to gp-api, return via `expand-payment-success`.

## Gotchas

- The public poll-results page (`/polls/[slug]`) lives at `app/polls/`, NOT here. Don't conflate dashboard poll detail with the public share view.
- `shared/` here is poll-feature-shared, not app-wide shared. App-wide stuff is at `app/shared/`.
- Poll status transitions (draft → scheduled → running → complete) are gp-api-driven; the dashboard reflects state, doesn't drive it.

## Related

- `app/polls/` — public poll-share pages.
- `app/shared/inputs/` — generic form inputs the create flow uses.
