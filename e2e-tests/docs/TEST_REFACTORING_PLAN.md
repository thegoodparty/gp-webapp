# Test Automation Refactoring Plan

## Overview

This document outlines a systematic approach to refactor the entire test automation suite, addressing all issues identified in the review. We'll follow a **gradual migration strategy** to ensure stability and minimize disruption.

## 🎯 Strategy: Gradual Migration Approach

1. **Rename existing tests** to `tests-old/`
2. **Create new `tests/` folder** with improved architecture
3. **Migrate tests one by one** with fixes applied
4. **Validate each test** before moving to the next
5. **Remove old tests** once new ones are stable

---

## Phase 1: Foundation & Infrastructure

### 1.1 Project Structure Reorganization

```
test-automation/
├── tests-old/                    # Existing tests (renamed)
├── tests/                        # New refactored tests
│   ├── core/                     # Core functionality tests
│   ├── admin/                    # Admin panel tests
│   ├── app/                      # Application tests
│   └── fixtures/                 # Test fixtures and data
├── src/                          # New source structure
│   ├── config/                   # Configuration management
│   ├── helpers/                  # Simplified helper functions
│   ├── fixtures/                 # Test fixtures and components
│   ├── utils/                    # Utility functions
│   └── types/                    # TypeScript type definitions
├── playwright.config.ts          # Refactored configuration
└── docs/                         # Documentation
```

### 1.2 Configuration Refactoring

**File: `playwright.config.ts`**

**Changes:**

- Remove excessive browser flags (keep only essential 3-4)
- Remove console.log statements
- Increase workers to `process.env.CI ? 2 : 4`
- Standardize timeout values
- Implement proper environment configuration

**New Configuration Structure:**

```typescript
// src/config/playwright.config.ts
export const config = {
  timeout: 30000,
  expect: { timeout: 10000 },
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 1,
  // Minimal browser args
  launchOptions: {
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-web-security"],
  },
};
```

### 1.3 Environment Management

**New Files:**

- `src/config/environments.ts` - Environment-specific configurations
- `src/config/test-data.ts` - Test data management
- `src/config/constants.ts` - Application constants

**Environment Configuration:**

```typescript
// src/config/environments.ts
export const environments = {
  local: { baseURL: "http://localhost:4000", timeout: 30000 },
  qa: { baseURL: "https://qa.goodparty.org", timeout: 45000 },
  prod: { baseURL: "https://goodparty.org", timeout: 60000 },
};
```

### 1.4 TestRail Decoupling (Critical)

**Current Issues:**

- **Every test file** imports TestRail helpers (`setupTestReporting`, `setupMultiTestReporting`)
- **Global setup** creates TestRail runs before any tests execute
- **Test execution** is tightly coupled to external TestRail API
- **Tests fail** if TestRail is unavailable
- **Mixed concerns** - test logic mixed with reporting logic

**Decoupling Strategy:**

1. **Remove all TestRail imports** from test files
2. **Extract reporting** to separate optional layer
3. **Make tests runnable** without any external dependencies
4. **Optional TestRail integration** via Playwright reporters or CI/CD hooks

**New Approach:**

```typescript
// ❌ OLD: TestRail coupling in every test
import { setupTestReporting } from "helpers/testrailHelper";
setupTestReporting(test, TEST_IDS.LOGIN_FLOW);

// ✅ NEW: Clean tests, optional reporting
test("should login with valid credentials", async ({ page }) => {
  // Pure test logic, no external dependencies
});
```

### 1.5 Simplified Helper Functions

**New Helper Structure:**

```typescript
// src/helpers/
├── auth.helper.ts          # Single, reliable authentication
├── navigation.helper.ts    # Navigation utilities
├── wait.helper.ts         # Custom wait conditions
├── data.helper.ts         # Test data generation
└── cleanup.helper.ts      # Resource cleanup
```

**Key Principles:**

- **Single responsibility** - Each helper does one thing well
- **No retry logic** - Handle retries at framework level
- **Proper error handling** - Meaningful error messages
- **State-based waiting** - No hardcoded timeouts
- **No external system dependencies** - tests run independently
- **User-facing locators** - `getByRole`, `getByLabel`, `getByText` over CSS selectors
- **Web-first assertions** - Use `toBeVisible()`, `toHaveText()` with auto-waiting
- **Test user behavior** - Avoid implementation details

---

## Phase 2: Core Infrastructure Tests

### 2.1 Authentication System Refactor

**Priority: CRITICAL**

**Current Issues:**

- Complex `prepareTest` function (50+ lines)
- Multiple authentication approaches
- Nested retry mechanisms
- Resource leaks

**New Approach:**

```typescript
// src/helpers/auth.helper.ts
export class AuthHelper {
  static async loginAsUser(page: Page): Promise<void>;
  static async loginAsAdmin(page: Page): Promise<void>;
  static async createTestAccount(): Promise<TestAccount>;
  static async cleanup(): Promise<void>;
}
```

**Implementation Plan:**

1. Create simple, single-purpose authentication functions
2. Use Playwright's storage state properly
3. Implement proper session management
4. Add comprehensive error handling
5. Remove all hardcoded waits

### 2.2 Wait Conditions Refactor

**Create Custom Wait Helpers:**

```typescript
// src/helpers/wait.helper.ts
export class WaitHelper {
  static async waitForPageReady(page: Page): Promise<void>;
  static async waitForElementVisible(
    page: Page,
    selector: string
  ): Promise<void>;
  static async waitForApiResponse(page: Page, url: string): Promise<void>;
  static async waitForCondition(
    page: Page,
    condition: () => Promise<boolean>
  ): Promise<void>;
}
```

**Replace All Hardcoded Waits:**

- Identify all 50+ instances of `waitForTimeout`
- Replace with appropriate state-based waits
- Create reusable wait conditions

### 2.3 Test Base Classes

**Create Foundation Classes:**

```typescript
// src/utils/base-test.ts
export class BaseTest {
  protected page: Page;
  protected context: BrowserContext;

  async setup(): Promise<void>;
  async cleanup(): Promise<void>;
  async takeScreenshot(name: string): Promise<void>;
}

// src/utils/authenticated-test.ts
export class AuthenticatedTest extends BaseTest {
  async setupWithAuth(userType: "user" | "admin"): Promise<void>;
}
```

---

## Phase 3: Core Tests Migration

### 3.1 Login Tests (`tests/core/auth/`)

**Files to Migrate:**

- `tests-old/core/login.spec.ts`

**Current Issues:**

- Using admin credentials for user login tests
- Hardcoded test data
- Poor error handling

**Refactoring Plan:**

1. Create dedicated test accounts
2. Implement proper test data management
3. Add comprehensive assertions
4. Remove hardcoded waits
5. Add proper cleanup

**New Structure:**

```typescript
// tests/core/auth/login.spec.ts
describe("Login Functionality", () => {
  test("should login with valid credentials", async ({ page }) => {
    // Clear, focused test with proper assertions
  });

  test("should show error for invalid credentials", async ({ page }) => {
    // Proper error validation
  });
});
```

### 3.2 Registration Tests (`tests/core/auth/`)

**Files to Migrate:**

- `tests-old/core/signup.spec.ts`

**Current Issues:**

- Test only verifies global setup success
- No actual registration flow testing
- Missing onboarding flow handling

**Refactoring Plan:**

1. Create complete registration flow test
2. Add form validation tests
3. Test error scenarios
4. **Handle complete onboarding flow:**
   - **Step 1**: Office Selection (zip code, office level, office name)
   - **Step 2**: Party Selection (political affiliation)
   - **Step 3**: Pledge Agreement ("I Agree" to terms)
   - **Step 4**: Complete Step ("View Dashboard" button)
5. Verify account creation and dashboard access

### 3.3 Navigation Tests (`tests/core/navigation/`)

**Files to Migrate:**

- `tests-old/core/navigation/navbar.spec.ts`

**Current Issues:**

- Completely skipped
- Poor selector strategies
- No mobile testing

**Refactoring Plan:**

1. Unskip and fix all navigation tests
2. Create reusable navigation fixtures
3. Add mobile navigation testing
4. Test all dropdown menus and links

---

## Phase 4: Resource Pages Migration

### 4.1 Homepage Tests (`tests/core/pages/`)

**Files to Migrate:**

- `tests-old/core/resource_pages/homepage.spec.ts`

**Current Issues:**

- Minimal assertions
- No content validation
- Missing accessibility checks

**Refactoring Plan:**

1. Add comprehensive content validation
2. Test all interactive elements
3. Add accessibility checks
4. Verify SEO elements

### 4.2 Blog Tests (`tests/core/pages/`)

**Files to Migrate:**

- `tests-old/core/resource_pages/blog.spec.ts`

**Current Issues:**

- Article test skipped
- Poor selector strategies
- No content validation

**Refactoring Plan:**

1. Unskip article tests
2. Add content validation
3. Test filtering functionality
4. Verify social sharing

### 4.3 Campaign Tools Tests (`tests/core/pages/`)

**Files to Migrate:**

- `tests-old/core/resource_pages/campaign_tools.spec.ts`
- `tests-old/core/resource_pages/get_demo.spec.ts`
- `tests-old/core/resource_pages/volunteer.spec.ts`

**Refactoring Plan:**

1. Create reusable test fixtures and components
2. Add comprehensive form testing
3. Test all interactive elements
4. Verify external integrations (HubSpot, etc.)

---

## Phase 5: Application Tests Migration

### 5.1 Dashboard Tests (`tests/app/dashboard/`)

**Files to Migrate:**

- `tests-old/app/dashboard.spec.ts`

**Current Issues:**

- Minimal functionality testing
- No data validation
- Missing edge cases

**Refactoring Plan:**

1. Test all dashboard widgets
2. Validate data accuracy
3. Test user interactions
4. Add responsive design tests

### 5.2 Profile Management (`tests/app/profile/`)

**Files to Migrate:**

- `tests-old/app/my-profile.spec.ts`
- `tests-old/core/profile.spec.ts`

**Current Issues:**

- Complex beforeEach setup
- Hardcoded waits
- Poor error handling
- Skipped tests

**Refactoring Plan:**

1. Simplify test setup
2. Remove all hardcoded waits
3. Unskip password change tests
4. Add comprehensive validation
5. Test all profile sections

### 5.3 Content Builder (`tests/app/content/`)

**Files to Migrate:**

- `tests-old/app/content-builder.spec.ts`

**Current Issues:**

- Complex error handling
- Hardcoded waits
- Poor debugging information

**Refactoring Plan:**

1. Simplify test logic
2. Remove hardcoded waits
3. Add proper assertions
4. Test template selection
5. Verify content generation

### 5.4 AI Assistant (`tests/app/ai/`)

**Files to Migrate:**

- `tests-old/app/ai-assistant.spec.ts`

**Current Issues:**

- Minimal testing
- No conversation validation
- Missing error scenarios

**Refactoring Plan:**

1. Test conversation creation
2. Validate AI responses
3. Test different topics
4. Add error handling tests

### 5.5 Contacts & Voter Data (`tests/app/contacts/`)

**Files to Migrate:**

- `tests-old/app/contacts.spec.ts`
- `tests-old/app/custom_voter_file.spec.ts`
- `tests-old/app/voter_data.spec.ts`

**Current Issues:**

- Complex beforeEach with retry logic
- All tests skipped
- Hardcoded waits
- File download testing issues

**Refactoring Plan:**

1. Remove complex retry logic
2. Unskip all tests
3. Fix file download testing
4. Add data validation
5. Test segment creation

### 5.6 Website Builder (`tests/app/website/`)

**Files to Migrate:**

- `tests-old/app/website_builder.spec.ts`

**Current Issues:**

- Serial test execution
- Complex authentication
- Skipped domain purchase test

**Refactoring Plan:**

1. Make tests independent
2. Simplify authentication
3. Fix domain purchase flow
4. Add website validation

### 5.7 Voter Outreach (`tests/app/outreach/`)

**Files to Migrate:**

- `tests-old/app/voter-outreach.spec.ts`

**Current Issues:**

- Limited campaign type testing
- No validation of created campaigns
- Missing error scenarios

**Refactoring Plan:**

1. Test all campaign types
2. Validate campaign creation
3. Test scheduling functionality
4. Add error handling

### 5.8 Mobile App Tests (`tests/app/mobile/`)

**Files to Migrate:**

- `tests-old/app/mobile-app.spec.ts`

**Current Issues:**

- Completely skipped
- No mobile-specific testing
- Poor navigation testing

**Refactoring Plan:**

1. Unskip all mobile tests
2. Add comprehensive mobile navigation
3. Test responsive design
4. Verify mobile-specific features

---

## Phase 6: System Tests Migration

### 6.1 Sitemap Tests (`tests/system/sitemaps/`)

**Files to Migrate:**

- `tests-old/core/sitemap.spec.ts`

**Current Issues:**

- All tests skipped
- No sitemap validation
- Missing URL testing

**Refactoring Plan:**

1. Unskip all sitemap tests
2. Add comprehensive URL validation
3. Test sitemap accessibility
4. Validate lastmod dates

---

## Phase 7: Integration & Cleanup

**Note: Admin Tests Skipped**
Admin tests require existing admin credentials and cannot be created programmatically. These tests depend on:

- Existing admin user accounts
- Admin-specific permissions and access levels
- External admin panel functionality

Admin tests should be handled separately with existing admin credentials when needed.

### 7.1 Test Data Management

**Create Comprehensive Test Data System:**

```typescript
// src/utils/test-data-manager.ts
export class TestDataManager {
  static async createTestUser(): Promise<TestUser>;
  static async createAndTrackTestAccount(
    page: Page,
    userData: TestUser
  ): Promise<TestUser>;
  static async completeOnboarding(page: Page): Promise<void>;
  static async deleteAccount(page: Page): Promise<void>;
  static async cleanup(page?: Page): Promise<void>;
}
```

**Onboarding Flow Handling:**

The registration process requires completing a 4-step onboarding flow:

1. **Step 1 - Office Selection** (`/onboarding/{slug}/1`):

   - Fill "Zip Code" field with test zip code
   - Select "Office Level" dropdown → "Local/Township/City"
   - Fill "Office Name" field → "Green River City Council - Ward 1"
   - Click office suggestion button when it appears
   - Click "Next" or "Save" button

2. **Step 2 - Party Selection** (`/onboarding/{slug}/2`):

   - Fill "Other" label field → "Independent"
   - Click "Next" button

3. **Step 3 - Pledge Agreement** (`/onboarding/{slug}/3`):

   - Review terms and conditions
   - Click "I Agree" button

4. **Step 4 - Complete Onboarding** (`/onboarding/{slug}/4`):
   - Click "View Dashboard" button
   - Redirects to `/dashboard`

**Implementation Notes:**

- Each step automatically progresses to the next via URL routing
- Form validation must be satisfied before proceeding
- Office selection requires matching against ballot data
- Final step launches the campaign and redirects to dashboard

### 7.2 Test Fixtures & Components

**Create Reusable Test Components:**

- Authentication fixtures
- Form interaction helpers
- Data validation utilities
- Common UI component helpers

### 7.3 Global Setup Refactor

**New Global Setup:**

```typescript
// global-setup.ts
export default async function globalSetup() {
  // Minimal setup - only essential configurations
  // NO TestRail integration - tests run independently
  // Optional: Create base test accounts if needed
  // Optional: Environment validation
}
```

### 7.4 CI/CD Configuration

**Update CI/CD Pipeline:**

- Optimize for new test structure
- Add proper test reporting
- Implement test result caching
- Add performance monitoring

---

## Implementation Guidelines

### Testing Standards

1. **Test Structure:**

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

2. **Wait Conditions:**

   - Use `waitForSelector` instead of `waitForTimeout`
   - Implement custom wait conditions for complex scenarios
   - Maximum wait time: 30 seconds for any operation

3. **Error Handling:**

   - Provide meaningful error messages
   - Include page state in error context
   - Use proper assertions with descriptive messages

4. **Resource Management:**
   - Clean up all created resources
   - Close browser contexts properly
   - Remove temporary files

### Migration Checklist (Per Test File)

- [ ] **Remove TestRail imports** (`setupTestReporting`, `setupMultiTestReporting`)
- [ ] **Remove TEST_IDS references** from test setup
- [ ] Remove all hardcoded waits (`waitForTimeout`)
- [ ] Replace with state-based waits
- [ ] **Replace CSS selectors** with user-facing locators (`getByRole`, `getByLabel`, `getByText`)
- [ ] **Use web-first assertions** (`toBeVisible()`, `toHaveText()` instead of `expect(await element.isVisible()).toBe(true)`)
- [ ] **Handle onboarding flow** for authenticated tests (4-step process)
- [ ] **Implement account cleanup** via UI deletion flow
- [ ] **Mock external dependencies** instead of testing third-party services
- [ ] Simplify authentication
- [ ] Add proper assertions
- [ ] Implement error handling
- [ ] Add resource cleanup
- [ ] Unskip all tests
- [ ] **Test user behavior** not implementation details
- [ ] Validate test passes consistently **without TestRail**
- [ ] Add to new test structure
- [ ] Update documentation

### Quality Gates

**Before Moving to Next Phase:**

1. All tests in current phase pass consistently (95%+ success rate)
2. No hardcoded waits remain
3. All tests are unskipped
4. Proper error handling implemented
5. Resource cleanup verified
6. Documentation updated

### Risk Mitigation

1. **Parallel Development:**

   - Keep old tests running until new ones are stable
   - Gradual migration reduces risk

2. **Rollback Plan:**

   - Keep `tests-old/` until full migration complete
   - Easy rollback if issues arise

3. **Validation:**
   - Run new tests in CI/CD pipeline
   - Compare results with old tests
   - Monitor for regressions

---

## Success Metrics

### Target Metrics (End of Migration):

- **Test Execution Rate:** 95%+ (currently ~33%)
- **Test Pass Rate:** 90%+ in CI/CD
- **Test Execution Time:** Reduce by 40%
- **Code Reduction:** 40% less code through simplification
- **Maintenance Overhead:** 60% reduction in test maintenance

### Weekly Progress Tracking:

- Number of tests migrated
- Test pass rate improvement
- Hardcoded waits eliminated
- Code complexity reduction
- CI/CD stability improvement

---

## Expected Outcome

This plan provides a systematic approach to completely refactor the test automation suite while maintaining stability and ensuring all identified issues are addressed. The result will be a reliable, maintainable test suite with 95%+ execution rate.
