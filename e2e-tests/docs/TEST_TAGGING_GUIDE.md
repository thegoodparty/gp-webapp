# Test Tagging Guide

## Overview

Our E2E test suite uses a tag-based system to control which tests run in different contexts. This ensures PR stability while providing visibility into experimental test health.

## Tag System

### Default Behavior (Stable Tests)

- **No tag required** - Tests are stable by default
- Run on every PR (blocking)
- Must pass for PR to merge
- Examples: Login, navigation, core functionality

### @experimental Tag

- **Add `@experimental`** to test names for new/unstable tests
- Run on every PR (non-blocking)
- Failures don't prevent PR merge
- Provides early feedback on test health

## How It Works

### On Every PR, Two Test Suites Run in Parallel:

1. **Stable Tests (Blocking)**

   - All tests WITHOUT `@experimental` tag
   - Must pass for PR to merge
   - Fast feedback on core functionality

2. **Experimental Tests (Non-blocking)**
   - Only tests WITH `@experimental` tag
   - Run for visibility, failures don't block
   - Early warning system for new tests

## Usage Examples

### Stable Test (Default)

```typescript
test.describe("Login Flow", () => {
  test("should login successfully", async ({ page }) => {
    // This test runs in the stable suite (blocking)
  });
});
```

### Experimental Test

```typescript
test.describe("New Feature @experimental", () => {
  test("should handle new feature", async ({ page }) => {
    // This test runs in the experimental suite (non-blocking)
  });
});
```

## Test Promotion Process

### Daily Workflow:

1. **Add new tests** with `@experimental` tag
2. **Monitor experimental results** on PRs for stability
3. **Remove `@experimental` tag** once test is proven stable
4. **Test becomes stable** and blocks future PRs

### Local Testing:

```bash
# Run all tests (default)
npm test

# Run only stable tests
npx playwright test --project=stable

# Run only experimental tests
npx playwright test --project=experimental

# Run specific test suites
npm run test:core     # Core functionality
npm run test:app      # Application features
npm run test:system   # System tests
```

## Benefits

✅ **Fast PR feedback** - Stable tests run quickly and block only on real issues  
✅ **Early experimental visibility** - See new test results before merge  
✅ **No surprises** - Experimental failures are visible but don't block development  
✅ **Gradual promotion** - Tests prove themselves before becoming blocking  
✅ **Parallel execution** - Both suites run simultaneously for efficiency

## PR Comments

Each PR will receive two automated comments:

### Stable Test Results (Blocking)

- ✅/❌ Status based on test results
- Must be ✅ for PR to merge
- Lists any failed stable tests

### Experimental Test Results (Non-blocking)

- ✅/⚠️ Status (⚠️ even with failures)
- Informational only
- Lists failed experimental tests
- Shows "No experimental tests" if none exist

## Migration

All existing tests are automatically considered **stable** (no changes needed). Simply add `@experimental` to new test names as you create them.
