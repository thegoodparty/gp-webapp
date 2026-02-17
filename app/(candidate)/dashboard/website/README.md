# Website Feature

Candidates can create/manage their campaign websites here.

## Quick Overview

- **Main page**: `/dashboard/website` - Shows website status, contacts, and visits graph
- **Create**: `/dashboard/website/create` - New website setup flow
- **Editor**: `/dashboard/website/editor` - Edit existing website

## Key Files

### Pages

- `page.js` - Main dashboard (handles empty/draft/published states)
- `create/page.js` - Website creation flow
- `editor/page.js` - Website editor

## Dashboard Page (`website/`)

**Components**

- `WebsiteProvider.js` - Context for website/contacts state **used for all of these pages**
- `WebsitePage.js` - Main page component, renders different states depending on website status
- `WebsiteCard.js` - Website info display
- `WebsiteVisits.js` - Graph of visits for the last 7 days
- `WebsiteInbox.js` - Table of contact form submissions

**Utils**

- `website.util.js` - API calls and helpers

## Create Flow (`website/create`)

**Purpose**: Step-by-step website creation for new candidates

**Components**:

- `WebsiteCreatePage.js` - Page component with dashboard layout
- `WebsiteCreateFlow.js` - Main creation flow entry

**Steps** (6 total):

1. **Vanity Path** - Custom URL path selection
2. **Logo** - Upload campaign logo
3. **Theme** - Color scheme selection (themes are hardcoded in `WEBSITE_THEMES` constant)
4. **Hero** - Title, tagline, hero image
5. **About** - Bio and key issues
6. **Contact** - Address, email, phone
7. **Complete** - Success view after publishing, displays share buttons

## Editor Flow (`website/editor`)

**Purpose**: Edit existing website content

**Components**:

- `WebsiteEditorPage.js` - Page component with dashboard layout
- `WebsiteEditFlow.js` - Main editor flow entry

**Editable Sections**:

- **Link** - Custom URL (read-only)
- **Logo** - Campaign logo upload
- **Theme** - Color scheme
- **Title** - Title, tagline, hero image
- **About** - Bio and key issues
- **Contact** - Address, email, phone

## Shared flow components

The create and editor flows share these Step components from the editor folder:

### `VanityPathStep.js`

- **Purpose**: Custom URL path selection and validation

### `LogoStep.js`

- **Purpose**: Campaign logo upload
- **Notes**:
  - Uses new `ImageInput` component (see shared folder)

### `ThemeStep.js`

- **Purpose**: Color theme selection
- **Notes**:
  - Uses hardcoded `WEBSITE_THEMES` constant, these came from the original Lovable mock

### `HeroStep.js`

- **Purpose**: Title, tagline, and hero image setup
- **Notes**:
  - Also uses `ImageInput` component

### `AboutStep.js`

- **Purpose**: Bio and key issues setup

### `ContactStep.js`

- **Purpose**: Contact information setup
- **Notes**
  - Uses `AddressAutocomplete` component that has simple google API searching.
  - Easy to replace with pre-packaged component at some point.

### `CompleteStep.js`

- **Purpose**: Success view after publishing

## Published Website (`(candidateWebsite)/c/[vanityPath]/`)

**Purpose**: Publicly accessible campaign website

**Components**:

- `page.js` - Main published website page
- `WebsiteContent.js` - Renders website sections
- `WebsiteViewTracker.js` - Tracks page views
- `WebsiteHeader.js` - Header with logo/nav
- `HeroSection.js` - Main hero content
- `AboutSection.js` - Bio and issues
- `ContactSection.js` - Contact form and info
- `WebsiteFooter.js` - Footer with privacy policy
- `PrivacyPolicyModal.js` - Privacy policy popup

**URL Structure**: `/c/{vanityPath}`

## Preview Website (`(candidateWebsite)/c/[vanityPath]/preview/`)

**Purpose**: Authenticated preview for unpublished websites

**Components**:

- `page.js` - Preview page (no tracking)
- Uses same `WebsiteContent.js` as published site

**URL Structure**: `/c/{vanityPath}/preview`
