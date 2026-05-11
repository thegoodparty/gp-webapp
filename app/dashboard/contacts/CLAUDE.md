# app/dashboard/contacts/

Voter contact management. Browse the campaign's voter file, segment audiences, and drill into individual voter records. Powers audience selection for outreach.

## Key files

| File | Role |
|------|------|
| `[[...attr]]/page.tsx` | Single catch-all route — sub-views are query/path slugs handled inside |
| `[[...attr]]/components/` | Top-level layout + tab content |
| `[[...attr]]/components/segments/` | Saved audience segments (list, create, edit) |
| `[[...attr]]/components/person/` | Individual voter detail (`PersonOverlay.tsx`) |
| `[[...attr]]/components/configs/` | Filter / column configuration UI |
| `[[...attr]]/components/shared/` | Cross-tab primitives (table, filter chips) |
| `[[...attr]]/hooks/` | Data fetching hooks for voter file pages |

## Patterns

- **One catch-all route** (`[[...attr]]`) — all "tabs" (people, segments, settings) are handled inside that route's components, not as separate Next.js routes. Easier to share filter state.
- **Filters and segments are distinct**: filters are ephemeral (current view); segments are saved (named, reused in outreach). Don't conflate.
- **Voter file fetching** uses `helpers/createVoterFileFilter.ts` to build the filter payload — keep that helper as the single shape source.
- The `PersonOverlay` is a side-panel detail view that opens over the table; route-level navigation isn't used to drill in.

## Gotchas

- Optional catch-all route (`[[...attr]]`) means `/dashboard/contacts` and `/dashboard/contacts/whatever` both render the same page — sub-routing is internal.
- Voter-file payloads can be huge — pagination + cursor are mandatory; never request without them.
- A feature flag gates parts of `PersonOverlay` (see `app/shared/experiments/`).

## Related

- `helpers/createVoterFileFilter.ts` — filter payload builder.
- `app/dashboard/outreach/` — consumer of saved segments.
- `gpApi/api-endpoints.ts` — voter-file endpoints.
