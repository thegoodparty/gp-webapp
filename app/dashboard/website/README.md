# Website Feature

Candidates can create/manage their campaign websites here.

## Quick Overview

- **Main page**: `/dashboard/website` - Status, contacts, visits graph
- **Create**: `/dashboard/website/create` - New website setup flow
- **Editor**: `/dashboard/website/editor` - Edit existing website
- **Domain**: `/dashboard/website/domain` - Custom domain management

## Layout

```
website/
  page.tsx                  # main dashboard
  components/               # main dashboard UI
  create/
    page.tsx
    components/             # WebsiteCreateFlow, WebsiteCreatePage
  editor/
    page.tsx
    components/             # WebsiteEditFlow + step components (shared with create)
  domain/
    page.tsx
    components/
  shared/
    websiteConstants.const.ts
  util/
    website.util.ts         # API calls + helpers
    domain.util.ts
    domainFetch.util.ts
```

## Dashboard Page (`website/`)

Components in `website/components/`:

- `WebsiteProvider.tsx` - Context for website/contacts state, used across all website pages
- `WebsitePage.tsx` - Main page; renders different states (empty / draft / published) based on website status
- `WebsiteCard.tsx` - Website info display
- `WebsiteVisits.tsx` - 7-day visits graph
- `WebsiteInbox.tsx` - Table of contact form submissions
- `EmptyState.tsx`, `DraftState.tsx`, `PublishedState.tsx` - Per-status views
- `ShareButtons.tsx`, `ShareModal.tsx`, `StatusChip.tsx`, `StepList.tsx`

Utils in `website/util/`:

- `website.util.ts` - API calls and helpers

## Create Flow (`website/create/`)

Step-by-step website creation for new candidates.

Components in `create/components/`:

- `WebsiteCreatePage.tsx` - Page component with dashboard layout
- `WebsiteCreateFlow.tsx` - Main creation flow entry; consumes the step components from `editor/components/`

Steps (in order):

1. **Vanity Path** - Custom URL path selection
2. **Logo** - Upload campaign logo
3. **Theme** - Color scheme selection (themes hardcoded in `WEBSITE_THEMES`)
4. **Hero** - Title, tagline, hero image
5. **About** - Bio and key issues
6. **Contact** - Address, email, phone
7. **Complete** - Success view + share buttons

## Editor Flow (`website/editor/`)

Edit existing website content.

Components in `editor/components/`:

- `WebsiteEditorPage.tsx` - Page component with dashboard layout
- `WebsiteEditFlow.tsx` - Main editor flow entry
- `WebsiteEditorPageCaption.tsx`, `WebsiteEditorPageStepper.tsx`, `WebsitePreview.tsx`
- `EditSection.tsx`, `EditSectionButton.tsx`, `EditSettingsMenu.tsx`

Step components (shared with the create flow):

- `VanityPathStep.tsx` - Custom URL path selection and validation
- `LogoStep.tsx` - Campaign logo upload (uses `ImageInput` from shared)
- `ThemeStep.tsx` - Color theme selection (`WEBSITE_THEMES` constant)
- `HeroStep.tsx` - Title, tagline, hero image (uses `ImageInput`)
- `AboutStep.tsx` - Bio + key issues (`IssuesForm.tsx`)
- `ContactStep.tsx` - Contact info (uses `AddressAutocomplete`, a thin wrapper over Google Places)
- `CompleteStep.tsx` - Success view after publishing
- `Label.tsx`, `ThemeSwatch.tsx` - Shared UI atoms

## Domain (`website/domain/`)

Custom-domain configuration. See `util/domain.util.ts` and `util/domainFetch.util.ts`.
