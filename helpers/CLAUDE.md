# helpers/

Top-level utility grab-bag. ~50 files of pure helpers + a few thin gp-api wrappers. **Already large** — root CLAUDE.md flags adding new helpers here as "ask first." Check for an existing helper before adding.

## Key files

Grouped by category:

| Category | Files |
|----------|-------|
| Auth / users / cookies | `authHelper.ts`, `userHelper.ts`, `userServerHelper.ts`, `cookieHelper.ts`, `tokenHelper.ts`, `clerkErrors.ts` |
| Campaigns / candidates | `campaignHelper.ts`, `candidateHelper.tsx`, `campaignOfficeFields.ts`, `fetchCampaignStatus.ts` |
| Voter / outreach data shaping | `createOutreach.ts`, `createP2pPhoneList.ts`, `createVoterFileFilter.ts`, `scheduleVoterMessagingCampaign.ts`, `voterFileDownload.ts` |
| AI content | `buildAiContentSections.ts`, `generateAIContent.ts`, `getAiTemplatesFromCategories.ts`, `getNewAiContentSectionKey.ts`, `fetchPromptInputFields.ts`, `setRequiresQuestionsOnTemplates.ts` |
| Analytics / segment | `analyticsHelper.ts`, `buildUserTraits.ts`, `segmentHelper.ts` |
| Routing / redirects | `resolvePostAuthRedirectPath.util.ts`, `linkhelper.ts`, `metadataHelper.ts`, `urlIncludesPath.ts`, `URLSearchParamsToObject.ts`, `handleApiRequestRewrite.ts` |
| Date / number / string / object | `dateHelper.ts`, `dateColumnSort.ts`, `numberHelper.ts`, `stringHelper.ts`, `objectHelper.ts`, `debounceHelper.ts` |
| Forms / validation | `validations.ts`, `packageFormData.ts`, `extractApiErrorInfo.ts` |
| State / common | `statesHelper.ts` (US states), `articleHelper.ts`, `useSnackbar.ts`, `purchaseTypes.ts`, `types.ts` |
| Test utilities | `test-utils/` (`render.tsx`, `api-mocking.ts`, `router-mocking.ts`), `test-users.ts` |

## Patterns

- **Pure functions** preferred. Hooks are an exception — they live here only when reused across features (e.g. `useSnackbar.ts`).
- **Server-only helpers** carry a `*ServerHelper.ts` or `.util.ts` suffix when they call `serverRequest` or use `next/headers`. Don't import these from client components.
- **Tests live alongside** the helper as `*.test.ts`. Add one when you add behavior worth pinning.
- **Naming convention** is mostly `xxxHelper.ts`, but several files (e.g. `linkhelper.ts`, `createOutreach.ts`) don't follow it — match the existing neighborhood, don't rename.

## Gotchas

- **It's a 50+ file dumping ground.** Before adding a new helper, grep for the same idea — it likely exists. If unsure, ask.
- `linkhelper.ts` is lowercase (legacy). Don't rename casually — many imports.
- `test-utils/` is the canonical Vitest helper set; don't duplicate. See `docs/testing.md`.

## Related

- `app/shared/utils/` — small utility bag inside `app/shared/`. Convention: prefer this dir for new pure helpers; reserve `app/shared/utils/` for app-shell-internal bits.
- `gpApi/CLAUDE.md` — fetch-helper rules.
