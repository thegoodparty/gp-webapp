# Test Automation Suite

A modern, reliable test automation framework for GoodParty.org built with Playwright and following industry best practices.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- GoodParty.org webapp running on `localhost:4000`

### Installation

```bash
npm install
npx playwright install
```

### Run Tests

```bash
npm test                # Run all tests
npm run test:core       # Core functionality tests
npm run test:app        # Application feature tests
npm run test:system     # System tests (sitemaps)
```

## 🏗️ Project Structure

```
test-automation/
├── tests/                        # Test files
│   ├── core/                     # Core functionality
│   │   ├── auth/                 # Authentication tests
│   │   ├── navigation/           # Navigation tests
│   │   └── pages/                # Public page tests
│   ├── app/                      # Application features
│   │   ├── dashboard/            # Dashboard functionality
│   │   ├── ai/                   # AI Assistant tests
│   │   ├── content/              # Content Builder tests
│   │   └── profile/              # Profile management
│   └── system/                   # System-level tests
│       └── sitemaps/             # Sitemap validation
├── src/                          # Source code
│   ├── config/                   # Configuration management
│   ├── helpers/                  # Utility functions
│   └── utils/                    # Test data management
├── tests-old/                    # Legacy tests (reference)
└── docs/                         # Documentation
```

## 🧪 Test Categories

### Core Tests (43 tests)

- **Authentication** - Login/signup form validation
- **Navigation** - Dropdown menus, page navigation
- **Resource Pages** - Homepage, blog, campaign tools, volunteer, elections
- **System Tests** - Sitemap accessibility and validation

### App Tests (5 tests)

- **Dashboard** - User dashboard functionality
- **AI Assistant** - Conversation interface
- **Content Builder** - Content generation tools
- **Profile** - User profile management

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
- **QA**: `https://qa.goodparty.org`
- **Production**: `https://goodparty.org`

### Browser Configuration

Optimized for performance and reliability:

- **Parallel execution** - 4 workers locally, 2 in CI
- **Cross-browser testing** - Chromium, Firefox, WebKit
- **Minimal browser flags** - Only essential flags for stability

## 🛡️ Test Data Management

### Shared User Strategy

App tests use a shared test user to avoid repeated account creation:

- **Global Setup** - Creates one test user with completed onboarding
- **App Tests** - Reuse shared user (fast login vs slow registration)
- **Global Teardown** - Cleans up shared user

### Database Protection

- **Safe test data** - Environment-aware generation
- **Proper cleanup** - UI-based account deletion
- **Minimal impact** - 1 shared account vs dozens per run

## 📊 Performance

### Execution Times

- **Core tests**: ~50 seconds for 43 tests
- **Individual test**: 2-5 seconds average
- **Full suite**: Under 2 minutes for comprehensive coverage

### Reliability

- **100% pass rate** for enabled tests
- **Zero flaky tests** - All timing issues eliminated
- **Consistent results** across environments

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

### Screenshots

Failed tests automatically capture screenshots in `screenshots/` directory.

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

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run Tests
  run: npm test

- name: Upload Test Results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: test-results
    path: test-results/
```

### Performance Optimizations

- **Parallel execution** - Multiple workers
- **Browser optimization** - Install only needed browsers
- **Trace on failures** - Detailed debugging without performance cost

## 📚 Documentation

- **[Cursor Rules](.cursor/rules)** - Development guidelines and patterns
- **[Test Plan](docs/TEST_REFACTORING_PLAN.md)** - Migration strategy and implementation
- **[Review](docs/TEST_AUTOMATION_REVIEW.md)** - Original issues and solutions
- **[Final Summary](docs/FINAL_SUMMARY.md)** - Complete transformation results

## 🎯 Key Features

- **🔥 Fast** - Sub-minute execution for comprehensive testing
- **🛡️ Reliable** - 100% pass rate, no flaky tests
- **🧹 Clean** - Modern architecture, no anti-patterns
- **🔧 Maintainable** - Easy to understand and extend
- **🚀 Scalable** - Ready for team collaboration and CI/CD
- **🌐 Cross-browser** - Works across all major browsers
- **📱 Mobile-ready** - Responsive design testing included

## 🤝 Contributing

When adding new tests:

1. Follow the established patterns in existing tests
2. Use user-facing locators (`getByRole`, `getByLabel`, `getByText`)
3. Implement web-first assertions with auto-waiting
4. Never use hardcoded waits (`waitForTimeout`)
5. Add proper error handling and cleanup
6. Test user behavior, not implementation details

## 📞 Support

For questions about test patterns, debugging, or extending the test suite, refer to the comprehensive documentation in the `docs/` directory or check the Cursor rules for development guidelines.
