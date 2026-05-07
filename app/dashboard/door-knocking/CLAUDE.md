# app/dashboard/door-knocking/

Door-knocking / canvassing dashboard. Tracks volunteer interactions logged in the field, summarizes by day / rating / survey, and lets campaigns design custom door-knocking surveys.

## Key files

| File | Role |
|------|------|
| `page.tsx` | Route entry |
| `components/DoorKnockingPage.tsx` | Top-level layout |
| `shared/DoorKnockingTabs.tsx` | Tab navigation (overview / surveys / individual record) |
| `components/InteractionsByDay.tsx` | Time-series chart |
| `components/InteractionsSummary.tsx` + `InteractionsSummaryPie.tsx` | Aggregate counts + breakdown chart |
| `components/RatingSummary.tsx` | Voter sentiment distribution |
| `components/interactionsColors.ts` | Color tokens for charts (single source) |
| `surveys/` | Custom survey designer (per-campaign question sets) |
| `shared/` | Cross-tab primitives |
| `components/` | Page-level widgets |

## Patterns

- **Charts use shared color tokens** from `components/interactionsColors.ts` — keep palette centralized; don't inline hex values.
- **Surveys are campaign-scoped**: each campaign authors its own survey questions, used by canvassers in the field. Survey CRUD lives in `surveys/`.
- **Aggregations come from gp-api**, not computed client-side. The components display rather than compute.

## Gotchas

- "Door-knocking" data is sourced from third-party canvassing tools (eCanvasser etc.) via gp-api — there's no in-app way to log a knock from this UI.
- `components/interactionsColors.ts` is the only place colors should be defined for charts in this feature.

## Related

- `app/shared/hooks/EcanvasserProvider.tsx` + `EcanvasserSurveyProvider.tsx` — eCanvasser auth/data.
- `helpers/` — eCanvasser-related helpers if any are added (currently none specific).
