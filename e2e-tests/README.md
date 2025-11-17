# Test Automation Suite

A modern, reliable test automation framework for GoodParty.org built with Playwright and following industry best practices.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- GoodParty.org webapp running on `localhost:4000`

### Environment Variables (Optional)

```bash
# Set custom test password (recommended for security)
export TEST_DEFAULT_PASSWORD="YourSecureTestPassword123!"

# Admin credentials for admin tests (if available)
export TEST_USER_ADMIN="admin@example.com"
export TEST_USER_ADMIN_PASSWORD="AdminPassword123!"
```

### Installation

```bash
npm install
npx playwright install
```

### Run Tests

```bash
npm test                # Run all tests (includes setup/cleanup)
npm run test:core       # Core functionality tests
npm run test:app        # Application feature tests
npm run test:system     # System tests (sitemaps)

# Test specific areas
npx playwright test tests/onboarding/    # Test onboarding flow
npx playwright test tests/auth.setup.ts  # Test authentication setup
```

## 🏗️ Project Structure

```
test-automation/
├── tests/                        # Test files
│   ├── auth.setup.ts             # 🔐 Authentication setup (Playwright best practice)
│   ├── auth.cleanup.ts           # 🧹 Authentication cleanup
│   ├── onboarding/               # 🚀 Onboarding flow tests
│   │   └── onboarding-flow.spec.ts
│   ├── core/                     # Core functionality (no auth required)
│   │   ├── auth/                 # Authentication tests
│   │   ├── navigation/           # Navigation tests
│   │   └── pages/                # Public page tests
│   ├── app/                      # Application features (pre-authenticated)
│   │   ├── ai/                   # AI Assistant tests
│   │   ├── content/              # Content Builder tests
│   │   ├── profile/              # Profile management
│   │   └── mobile/               # Mobile navigation tests
│   └── system/                   # System-level tests
│       └── sitemaps/             # Sitemap validation
├── playwright/.auth/             # 🔐 Authenticated browser states (gitignored)
├── src/                          # Source code
│   ├── config/                   # Configuration management
│   ├── helpers/                  # Utility functions
│   │   └── onboarded-user.helper.ts  # Onboarding flow management
│   └── utils/                    # Test data management
└── docs/                         # Documentation
```

## 🎯 Modern Patterns & Best Practices

### Playwright Best Practices

```typescript
// ✅ Use user-facing locators
await page.getByRole("button", { name: "Login" });
await page.getByLabel("Email");
await page.getByText("Welcome");

// ✅ Web-first assertions with auto-waiting
await expect(page.getByText("Success")).toBeVisible();
await expect(page).toHaveURL(/\/dashboard$/);

// ✅ State-based waiting (never use waitForTimeout)
await page.waitForLoadState("domcontentloaded");
await page.waitForSelector("[data-testid='content']");
```

### Test Structure

```typescript
test("should [expected behavior] when [condition]", async ({ page }) => {
  // Arrange
  await setupTestCondition();

  // Act
  await performAction();

  // Assert
  await verifyResult();
});
```

### Error Handling

```typescript
test.afterEach(async ({ page }, testInfo) => {
  // Automatic screenshot on failure
  await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
});
```

## 🔧 Configuration

### Environment Configuration

Tests automatically adapt to different environments:

- **Local**: `http://localhost:4000`
- **DEV**: `https://dev.goodparty.org`
- **QA**: `https://qa.goodparty.org`
- **Production**: `https://goodparty.org`

### Browser Configuration

Optimized for performance and reliability:

- **Parallel execution** - 4 workers locally, 2 in CI
- **Cross-browser testing** - Chromium, Firefox, WebKit
- **Minimal browser flags** - Only essential flags for stability

## 🔐 Authentication Strategy (Playwright Best Practice)

### Storage State Authentication

Following [Playwright's authentication recommendations](https://playwright.dev/docs/auth):

```typescript
// Setup project creates authenticated state once
setup("authenticate with onboarded user", async ({ page }) => {
  // Create user and complete onboarding
  const user = await createUserWithOnboarding(page);

  // Save authenticated browser state
  await page.context().storageState({ path: authFile });
});
```

### Test Execution Flow

1. **Setup Project** (`auth.setup.ts`) - Creates authenticated user, saves browser state
2. **Main Tests** - Start pre-authenticated using `storageState`
3. **Cleanup Project** (`auth.cleanup.ts`) - Removes authentication user

### Benefits

- **⚡ Fast Tests** - No per-test authentication (4-8 seconds vs 30+ seconds)
- **🔒 Reliable** - Consistent authenticated state across all tests
- **🧹 Clean** - Single user creation/cleanup vs dozens per run
- **📏 Scalable** - Follows Playwright best practices for team environments

### Test Categories by Authentication

```typescript
// 🔐 Pre-authenticated tests (app features)
test.describe("AI Assistant", () => {
  // Uses storageState - starts authenticated
});

// 🌐 No authentication tests (public pages)
test.use({ storageState: { cookies: [], origins: [] } });
test.describe("Login Functionality", () => {
  // Resets auth state - starts unauthenticated
});

// 🚀 Custom authentication tests (onboarding)
test.describe("Onboarding Flow", () => {
  // Creates own users to test the onboarding process
});
```

## 🚨 Anti-Patterns Avoided

### ❌ Don't Do This

```typescript
// ❌ Hardcoded waits
await page.waitForTimeout(5000);

// ❌ CSS selectors
await page.locator('.btn-primary.submit');

// ❌ Non-web-first assertions
expect(await element.isVisible()).toBe(true);

// ❌ Page Object Models
class LoginPage { ... }
```

### ✅ Do This Instead

```typescript
// ✅ State-based waiting
await page.waitForSelector("[data-testid='content']");

// ✅ User-facing locators
await page.getByRole("button", { name: "Submit" });

// ✅ Web-first assertions
await expect(element).toBeVisible();

// ✅ Direct Playwright usage
await page.getByLabel("Email").fill("test@example.com");
```

## 🔍 Debugging

### Screenshots & Videos

Failed tests automatically capture:

- Screenshots in `test-results/` directory
- Videos for visual debugging
- Traces for detailed step-by-step analysis

### Traces

Use Playwright's trace viewer for detailed debugging:

```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

### Debug Mode

Run tests in debug mode to step through:

```bash
npx playwright test --debug
```

### Authentication State

Check saved authentication state:

```bash
ls -la playwright/.auth/
# user.json - Contains authenticated browser state
```

## 🔧 Troubleshooting

### Common Issues

**"Tests are failing with authentication errors"**

```bash
# Delete auth state and let setup recreate it
rm -rf playwright/.auth/
npm test
```

**"Onboarding tests are stuck"**

- Ensure your local server is running on `localhost:4000`
- Check that zip code `28739` has office data in your test environment
- Verify the "Office Level" dropdown has selectable options

**"Tests are slow"**

- Pre-authenticated tests should be 4-8 seconds
- If slower, check if onboarding completion is running unnecessarily
- Use `--reporter=list` for faster feedback

**"Browser context closed errors"**

- These should be eliminated with the new architecture
- If they occur, check server stability and network connectivity

### Performance Optimizations

- **Parallel execution** - Multiple workers
- **Browser optimization** - Install only needed browsers
- **Trace on failures** - Detailed debugging without performance cost

## 🤝 Contributing

When adding new tests, follow these patterns based on whether the page requires authentication.

### For Guest/Public Pages (No Authentication)

Place tests in `tests/core/pages/` for public-facing pages that don't require authentication.

**Example: Public Blog Page**

```typescript
import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Blog Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the public page
    await NavigationHelper.navigateToPage(page, "/blog");
    // Dismiss any overlays (cookie banners, modals, etc.)
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Automatically capture screenshot on test failure
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
  });

  test("should display page elements", async ({ page }) => {
    // Assert - verify page content using user-facing locators
    await expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();
    await expect(page.getByText(/Insights into politics/)).toBeVisible();
  });

  test("should navigate to content", async ({ page }) => {
    // Wait for dynamic content to load
    await WaitHelper.waitForPageReady(page);

    // Act - interact with page elements
    await page.getByRole("button", { name: "Read More" }).first().click();

    // Assert - verify navigation occurred
    await expect(page).toHaveURL(/.*\/article/);
  });
});
```

**Key Points for Guest Pages:**

- No `storageState` configuration needed (tests run unauthenticated by default in `tests/core/`)
- Use `NavigationHelper.navigateToPage()` for initial navigation
- Use `NavigationHelper.dismissOverlays()` to clear cookie banners/modals
- Use `CleanupHelper.takeScreenshotOnFailure()` in `afterEach` for debugging
- Use `WaitHelper.waitForPageReady()` when waiting for dynamic content

### For Authenticated Pages (Dashboard/App Features)

Place tests in `tests/app/` for features that require authentication. Tests automatically start pre-authenticated via `storageState`.

**Example: Authenticated Dashboard Feature**

```typescript
import { test, expect } from "@playwright/test";
import { NavigationHelper } from "../../../src/helpers/navigation.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";
import { WaitHelper } from "../../../src/helpers/wait.helper";

test.describe("Content Builder", () => {
  test.beforeEach(async ({ page }) => {
    // Page is already authenticated via storageState from auth.setup.ts
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

    // Dismiss any overlays
    await NavigationHelper.dismissOverlays(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Screenshot on failure and clear browser data
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
    await CleanupHelper.clearBrowserData(page);
  });

  test("should access feature page", async ({ page }) => {
    // Navigate to authenticated feature
    await page.goto("/dashboard/content");
    await WaitHelper.waitForPageReady(page);
    await WaitHelper.waitForLoadingToComplete(page);

    // Assert - verify page loads correctly
    await expect(
      page.getByRole("heading", { name: "Content Builder" })
    ).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard\/content$/);
  });

  test("should interact with feature", async ({ page }) => {
    await page.goto("/dashboard/content");
    await WaitHelper.waitForLoadingToComplete(page);

    // Test feature-specific functionality
    await page.getByRole("button", { name: "Create New" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
```

**Key Points for Authenticated Pages:**

- Tests automatically start authenticated (via `storageState` from `auth.setup.ts`)
- Navigate directly to `/dashboard` or feature routes
- Use `page.goto()` directly (no need for `NavigationHelper.navigateToPage()`)
- Use `CleanupHelper.clearBrowserData()` in `afterEach` to reset state between tests
- Use `WaitHelper.waitForLoadingToComplete()` for loading spinners

### For Onboarding/Registration (Custom Auth)

Place tests in `tests/onboarding/` or `tests/core/auth/` for flows that create new users.

**Example: User Registration Flow**

```typescript
import { test, expect } from "@playwright/test";
import { AccountHelper } from "../../../src/helpers/account.helper";
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";

// Reset storage state to start unauthenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Registration Flow", () => {
  test.afterEach(async ({ page }, testInfo) => {
    await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
  });

  test("should create new account", async ({ page }) => {
    // Create a test account (automatically tracked for cleanup)
    const testUser = await AccountHelper.createTestAccount(page);

    // Assert - verify account creation succeeded
    await expect(page).toHaveURL(/\/onboarding/);
    console.log(`✅ Test account created: ${testUser.email}`);
  });
});
```

**Key Points for Registration Tests:**

- Use `test.use({ storageState: { cookies: [], origins: [] } })` to reset auth state
- Use `AccountHelper.createTestAccount()` for automatic cleanup
- Test accounts are automatically deleted by `auth.cleanup.ts`

### Common Helpers Reference

**NavigationHelper** - Page navigation and overlay management

```typescript
import { NavigationHelper } from "../../../src/helpers/navigation.helper";

// Navigate to a page (handles base URL automatically)
await NavigationHelper.navigateToPage(page, "/blog");

// Dismiss cookie banners, modals, and overlays
await NavigationHelper.dismissOverlays(page);
```

**WaitHelper** - Smart waiting for dynamic content

```typescript
import { WaitHelper } from "../../../src/helpers/wait.helper";

// Wait for page to be fully ready
await WaitHelper.waitForPageReady(page);

// Wait for loading spinners to disappear
await WaitHelper.waitForLoadingToComplete(page);
```

**CleanupHelper** - Test cleanup and debugging

```typescript
import { CleanupHelper } from "../../../src/helpers/cleanup.helper";

// Take screenshot on test failure (use in afterEach)
await CleanupHelper.takeScreenshotOnFailure(page, testInfo);

// Clear browser data between tests (for authenticated tests)
await CleanupHelper.clearBrowserData(page);
```

**AccountHelper** - User account management

```typescript
import { AccountHelper } from "../../../src/helpers/account.helper";

// Create test account (auto-cleanup)
const testUser = await AccountHelper.createTestAccount(page);

// Login with test credentials
await AccountHelper.loginWithTestAccount(page, testUser);

// Use global test user (created in globalSetup)
const globalUser = await AccountHelper.useGlobalTestUser(page);
```

**AuthHelper** - Authentication operations

```typescript
import { AuthHelper } from "../../../src/helpers/auth.helper";

// Login as a specific user
await AuthHelper.loginAsUser(page, {
  email: "test@example.com",
  password: "password",
});

// Login as admin (requires env vars)
await AuthHelper.loginAsAdmin(page);

// Logout current user
await AuthHelper.logout(page);
```

### General Guidelines

1. **Use user-facing locators** - `getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`
2. **Implement web-first assertions** - `toBeVisible()`, `toBeEnabled()`, `toHaveURL()`
3. **Never use hardcoded waits** - Use `WaitHelper` or state-based waiting instead of `waitForTimeout`
4. **Test user behavior**, not implementation details
5. **Follow authentication patterns** based on test type:
   - Guest pages → `tests/core/pages/`
   - Authenticated pages → `tests/app/`
   - Registration flows → `tests/onboarding/` or `tests/core/auth/`
6. **Import helpers from `src/helpers/`** - Use established patterns for consistency
7. **Always include cleanup** - Use `afterEach` with `CleanupHelper.takeScreenshotOnFailure()`
