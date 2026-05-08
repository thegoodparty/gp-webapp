# app/dashboard/outreach/

Voter outreach hub. Lets a campaign create text/voicemail/script outreach to voter audiences and tracks impact. Note: the directory is `outreach/` even though the tech design refers to it as "voter-outreach."

## Key files

| File | Role |
|------|------|
| `page.tsx` | Route entry — renders `OutreachPage` |
| `components/OutreachPage.tsx` | Top-level layout for the feature |
| `hooks/OutreachContext.tsx` | Feature-level context — current outreach selection, audience filters |
| `components/OutreachCreateCards.tsx` / `OutreachCreateCard.tsx` | Channel picker (text, voicemail, etc.) |
| `components/OutreachActions.tsx` + `*ActionOption.tsx` | Per-channel actions (download audience, copy script) |
| `components/OutreachImpact.tsx` | Sent / delivered metrics |
| `hooks/` | Feature-local hooks (audience fetching, scheduling) |
| `util/` | Pure helpers — message templating, audience shaping |
| `constants.tsx` | Channel definitions, status labels |

## Patterns

- **Context-driven**: `OutreachContext` holds the selected outreach + audience. Components read from context rather than threading props through the action menus.
- **Action options compose**: each `*ActionOption.tsx` is a self-contained menu item (icon + label + handler). New channels = new option components, registered in `OutreachActions`.
- **Audience downloads** go through `helpers/createOutreach.ts` and `helpers/createP2pPhoneList.ts` — don't reinvent the file shape.

## Gotchas

- The `FreeTextsBanner` nag is part of free-tier gating — check `app/dashboard/shared/ProUpgradeModal.tsx` rules before changing it.
- Scheduled-send logic lives in `helpers/scheduleVoterMessagingCampaign.ts`, not in this dir.
- Status labels in `constants.tsx` are mirrored on gp-api — keep them in sync if either side changes.

## Related

- `helpers/createOutreach.ts`, `helpers/createP2pPhoneList.ts`, `helpers/scheduleVoterMessagingCampaign.ts`.
- `gpApi/outreach.api.ts` + `gpApi/types/outreach.types.ts` — shared shapes.
