# app/dashboard/

The candidate dashboard. Authenticated shell that hosts campaign tools, polls, voter outreach, content, and admin-adjacent flows. Every route under `dashboard/` runs inside `DashboardLayout` and assumes a logged-in user with a current campaign.

## Key files

| File | Role |
|------|------|
| `page.tsx` | Dashboard home — campaign overview |
| `shared/DashboardLayout.tsx` | Layout wrapper — sidebar, header, auth gating |
| `shared/DashboardMenu.tsx` | Sidebar nav items (per-feature visibility lives here) |
| `shared/candidateAccess.ts` + `serveAccess.ts` | Access predicates (`canViewX` helpers) — client + server variants |
| `shared/ProUpgradeModal.tsx` / `ProUpgradePrompt.tsx` | Pro-tier gating UI |
| `components/` | Cross-feature dashboard widgets (alert banners, progress bars, `campaignManager/`) |

## Patterns

- **Per-feature dirs** under `dashboard/` own their own routes, components, and (sometimes) hooks. Keep cross-feature components in `dashboard/components/` and cross-feature primitives/access checks in `dashboard/shared/`.
- **Access gating**: use `candidateAccess.ts` from client code, `serveAccess.ts` from server components. Don't read the user object directly to gate UI — go through the helpers so rules stay in one place.
- **Pro-only features** wrap their content in `ProUpgradeModal` / `ProUpgradePrompt`. Free users see the prompt; pro users see the feature.
- **Sidebar visibility** is driven by the menu config in `DashboardMenu.tsx` — adding a feature route means adding a menu entry there too.

## Gotchas

- The directory has more subdirs than the sidebar exposes (`account/`, `briefings/`, `campaign-details/`, `campaign-plan/`, `election-result/`, `pro-sign-up/`, `profile/`, `purchase/`, `questions/`, `upgrade-to-pro/`, `voter-records/`). These are mostly internal flows / sub-pages reached from within other features — don't assume "directory exists" means "menu item exists."
- `dashboard/shared/` and `dashboard/components/` overlap in spirit. Convention: `shared/` = layout, access, modals reused across features; `components/` = card-style widgets composed onto pages. Check both before adding a new file.
- `DashboardLayout` enforces auth. Pages don't need their own redirect-to-login logic.

## Related

- Feature dirs each have their own `CLAUDE.md` — start there if you're working in `outreach/`, `polls/`, `website/`, etc.
- `app/shared/user/UserProvider.tsx` — auth state the layout reads.
- `app/shared/hooks/CampaignProvider.tsx` — current campaign context.
