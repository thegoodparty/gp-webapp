# app/dashboard/website/

Candidate website builder. Lets a campaign create a public site, edit content sections, and connect a custom domain. Public visitor view does not currently live under a dedicated route group in this repo.

## Key files

| File | Role |
|------|------|
| `create/` | First-time setup flow — name, slug, theme |
| `editor/` | Section-by-section editor (the bulk of the feature) |
| `domain/` | Custom domain connection / DNS instructions |
| `shared/` | Cross-flow helpers, constants, types |
| `components/` | Page-level scaffolding (header, footer, save bar) |
| `util/` | Pure helpers (slug validation, content shaping) |
| `README.md` | Full feature layout — read this before substantial changes |

## Patterns

- **Three sub-flows, one feature**: `create/`, `editor/`, `domain/` are sibling routes under `/dashboard/website/`. They share state through `shared/` rather than via context — most flows are short-lived single-page interactions.
- **AI-generated content** flows through `helpers/buildAiContentSections.ts` and friends; the editor surfaces "regenerate" actions but the heavy lifting is in `helpers/`.
- **Slug uniqueness** is checked at create-time against gp-api; treat the slug as immutable once a site is published.

## Gotchas

- The public-facing candidate site is rendered from `app/(candidate)/` (route group), NOT from this dir. Editing site appearance often touches both.
- `editor/` has its own `components/` subdir — don't confuse with `dashboard/website/components/`. The former is editor-internal; the latter is feature-wide.
- Domain DNS state has multiple "verifying / verified / failed" sub-states — see `domain/components/` rather than rolling your own status logic.

## Related

- `app/(candidate)/` — the public website pages this feature edits.
- `helpers/buildAiContentSections.ts`, `helpers/generateAIContent.ts` — AI content generation.
- `app/dashboard/website/README.md` — pre-existing feature notes.
