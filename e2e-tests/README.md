# E2E Tests

End-to-end tests for GoodParty.org built with [Playwright](https://playwright.dev/).

## Quick Start

#### Setup

```bash
# Install dependencies and browser
npm install
npx playwright install chromium

# Copy and configure env
cp .env.example .env
```

**Notes**:

- The `BASE_URL` in `.env` controls which app to test against. Values you can use:

  - `http://localhost:4000` (test against a local-running app)
  - `http://dev.goodparty.org` (test against the dev app)
  - ...etc

- Reach out to other engineers (or in `#devs-only`) for any secret values that are needed in `.env`.

- Some tests require you to be authenticated to the AWS CLI (e.g. via `aws sso login --profile gp-engineer`).

#### Run Tests

```bash
# Run all tests
npx playwright test

# Run a specific test file or directory
npx playwright test tests/core/pages/blog.spec.ts
npx playwright test polls
```

## Authentication

Tests that need an authenticated user call `authenticateTestUser(page)` from `tests/utils/api-registration.ts`. This:

1. Registers a user via the API
2. Completes the full onboarding flow via API calls
3. Injects `token` and `user` cookies into the browser context
4. Auto-deletes created users after the test run

By default, a single user is cached and shared across tests in a worker. Pass `{ isolated: true }` to create a dedicated user for a test.

```typescript
import { authenticateTestUser } from '../utils/api-registration'

test('my authenticated test', async ({ page }) => {
  await authenticateTestUser(page)
  await page.goto('/dashboard')
  // ...
})
```

## Visual Tests

Visual regression snapshots are taken with Playwright `toHaveScreenshot` through `visualSnapshot(...)` in the test specs.

### How visual tests run

- Baselines are committed under `e2e-tests/tests/__visual_snapshots__/...`.
- Visual assertions run in the `stable` Playwright project (`e2e-tests/playwright.config.ts`).
- Current global visual tolerance is `maxDiffPixels: 75`.
- Snapshot path template is configured so each spec stores its own baseline images alongside its test path.

Important: baselines should be generated in Linux CI (not locally on macOS) to avoid font-rendering drift.

### Updating visual snapshots

Use the PR comment command:

```text
/update-snapshots
```

This uses the workflow at `.github/workflows/update-snapshots.yml` and will:

1. Resolve the PR head SHA and deployment preview URL.
2. Run Playwright in CI with `--update-snapshots` (trace/video disabled for this run).
3. Commit updated images under `e2e-tests/tests/__visual_snapshots__/`.
4. Push the commit back to the same PR branch (no new PR is created).

Notes:

- Only repository owners/members/collaborators can trigger the command.
- Fork PRs are intentionally blocked for auto-push with `GITHUB_TOKEN`.
- The workflow checks out an immutable SHA before executing (TOCTOU-safe), then pushes to the branch ref.

### Why masks are used

Masks are used only for known dynamic regions (user-specific text, dates, rotating content, third-party embeds) so visual tests remain stable while still catching real UI regressions.

Current masked areas:

- **Dashboard (`dashboard.png`)**
  - Masks election countdown heading (`X weeks until Election Day!`) because the number changes over time.
- **Profile snapshots (`profile.png`, `mobile-profile.png`, `profile-page.png`)**
  - Mask personal fields (first/last name, email, phone, zip) because test users are generated dynamically.
- **Onboarding step 1 (`onboarding-step1.png`, `onboarding-step1-office-selection.png`)**
  - Masks welcome heading (`Welcome, <name>`) because name is per-test dynamic.
  - Snapshot is taken after office options load to avoid loading-state flake.
- **Poll creation (`polls-created-scheduled.png`)**
  - Masks scheduled and estimated-completion value spans, status alert, and message card.
  - Date values and message content vary between runs.
  - Uses per-snapshot `maxDiffPixels: 125` to reduce edge flake from narrow mask-width shifts.
- **Blog snapshots (`blog-listing.png`, `blog-news-category.png`, `blog-article.png`)**
  - Masks featured article image/title and article-body dynamic content because CMS content rotates.
- **Contacts snapshots**
  - Masks contacts table/body and person overlay due to dynamic constituent data.
- **Get Demo / Poll expansion payment**
  - Masks embedded iframes (`Book a Meeting`, Stripe) because third-party content is non-deterministic.
