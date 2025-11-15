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

When adding new tests:

### For Dashboard/App Features (Pre-authenticated)

```typescript
test.describe("New Feature", () => {
  test.beforeEach(async ({ page }) => {
    // Page starts authenticated via storageState
    await page.goto("/dashboard");
    // Complete onboarding if redirected (rare)
  });

  test("should test feature", async ({ page }) => {
    // Test your feature - user is already logged in
  });
});
```

### For Public Pages (No Authentication)

```typescript
// Reset storage state to start unauthenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Public Feature", () => {
  test("should test public feature", async ({ page }) => {
    // Test public pages - no authentication
  });
});
```

### For Onboarding/Registration (Custom Auth)

```typescript
// Reset storage state and create own users
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Registration Flow", () => {
  test("should test registration", async ({ page }) => {
    // Create and test new user registration
  });
});
```

### General Guidelines

1. **Use user-facing locators** (`getByRole`, `getByLabel`, `getByText`)
2. **Implement web-first assertions** with auto-waiting
3. **Never use hardcoded waits** (`waitForTimeout`)
4. **Test user behavior**, not implementation details
5. **Follow authentication patterns** based on test type
