# Product Requirements Document: E2E Tests Migration

## Introduction/Overview

This document outlines the migration of all end-to-end (e2e) tests from the standalone `test-automation` repository to the `gp-webapp` repository under the `e2e-tests` folder. This migration will consolidate testing infrastructure with the application codebase, simplifying developer workflows and improving CI/CD pipeline efficiency.

The migration will preserve the existing test structure, maintain the Playwright setup with authentication patterns, and integrate the GitHub Actions workflow to run stable tests as blocking PR checks while experimental tests run as non-blocking checks.

## Goals

1. **Consolidate Testing Infrastructure**: Move all e2e tests, configuration, helpers, and fixtures from the `test-automation` repository into `gp-webapp/e2e-tests`
2. **Maintain Test Functionality**: Ensure all tests continue to work exactly as they do currently with no loss of functionality
3. **Preserve Test Organization**: Keep the existing test structure (`tests/core`, `tests/app`, `tests/system`) that developers are familiar with
4. **Integrate CI/CD Pipeline**: Update GitHub Actions workflow to run e2e tests as part of webapp PR checks
5. **Archive Old Repository**: Mark the `test-automation` repository as archived and read-only after successful migration
6. **Simplify Developer Workflow**: Enable developers to work with both webapp code and tests in a single repository checkout

## User Stories

**As a developer:**
- I want to run e2e tests locally without checking out a separate repository, so I can quickly validate my changes
- I want to see e2e test results directly in my webapp PR, so I have immediate feedback on my changes
- I want the same test organization and patterns I'm familiar with, so I don't need to relearn the test structure

**As a QA engineer:**
- I want all test infrastructure in one place, so I can maintain and update tests more easily
- I want to ensure stable tests block PRs while experimental tests provide non-blocking feedback, so we maintain code quality without blocking development

**As a DevOps engineer:**
- I want e2e tests integrated into the webapp CI/CD pipeline, so tests run automatically on the correct environment
- I want test artifacts (screenshots, videos, traces) stored with the webapp build artifacts, so debugging is easier

## Functional Requirements

### Phase 1: Initial Setup and Test Infrastructure

1. The system must copy the entire Playwright configuration from `test-automation` to `gp-webapp/e2e-tests`
   - `playwright.config.ts` with all projects (setup, cleanup, stable, experimental)
   - `tsconfig.json` with TypeScript configuration
   - `biome.json` for linting rules

2. The system must migrate all package dependencies to `gp-webapp/package.json`
   - Add Playwright and related testing packages
   - Add AWS SDK, Slack API, and other test dependencies
   - Preserve exact version numbers from test-automation

3. The system must copy the `.gitignore` patterns specific to Playwright
   - Test results, reports, and artifacts
   - Authentication state files
   - Screenshots and videos

4. The system must create the directory structure under `gp-webapp/e2e-tests`:
   - `tests/` - All test spec files
   - `src/helpers/` - Test helper functions
   - `src/fixtures/` - Test data files
   - `playwright/.auth/` - Authentication state storage
   - `docs/` - Test documentation

### Phase 2: Test Migration

5. The system must migrate all test files maintaining the exact directory structure:
   - `tests/core/` - Core functionality tests (auth, navigation, pages)
   - `tests/app/` - Authenticated application feature tests
   - `tests/system/` - System-level tests (sitemaps)
   - `tests/auth.setup.ts` - Authentication setup
   - `tests/auth.cleanup.ts` - Authentication cleanup

6. The system must migrate all helper files:
   - `account.helper.ts` - Account creation and management
   - `data.helper.ts` - Test data generation
   - `navigation.helper.ts` - Page navigation and overlay handling
   - `onboarded-user.helper.ts` - Onboarding flow automation
   - `wait.helper.ts` - Smart waiting utilities

7. The system must migrate all test fixtures:
   - `heart.png` - Image upload test fixture
   - `high-confidence-poll-results.json` - Poll test data
   - `low-confidence-poll-results.json` - Poll test data
   - `testpdf.pdf` - PDF upload test fixture

8. The system must migrate test documentation:
   - `README.md` - Comprehensive test documentation
   - `TEST_TAGGING_GUIDE.md` - Guide for stable vs experimental tagging

### Phase 3: CI/CD Integration

9. The system must create a GitHub Actions workflow file for e2e tests in `gp-webapp/.github/workflows/`
   - Trigger on pull requests
   - Install dependencies and Playwright browsers
   - Run stable tests as a blocking check
   - Run experimental tests as a non-blocking check
   - Upload test artifacts (screenshots, videos, traces) on failure

10. The system must configure the workflow to set the correct base URL:
    - Use appropriate environment variables for different environments
    - Default to the webapp's deployment URL for PR previews

### Phase 4: Validation and Cleanup

11. The system must verify one test spec runs successfully in the new location:
    - Copy a simple test like `tests/core/auth/login.spec.ts`
    - Run it locally to verify the setup works
    - Ensure all imports resolve correctly

12. The system must update path references in configuration files:
    - Update `testDir` in `playwright.config.ts` if needed
    - Verify authentication state paths are correct
    - Ensure all relative imports work from the new location

13. The system must document the migration in `gp-webapp/e2e-tests/README.md`:
    - Add instructions for running tests locally
    - Document any differences from the old setup
    - Provide troubleshooting guidance

## Non-Goals (Out of Scope)

1. **Rewriting or refactoring existing tests** - Tests should be moved as-is without modification
2. **Changing test organization or structure** - Keep the existing `tests/core`, `tests/app`, `tests/system` structure
3. **Migrating test history or git blame** - Only current state of files will be migrated
4. **Running tests on multiple environments simultaneously** - Keep the same single-environment approach
5. **Adding new tests or test coverage** - Focus only on migration, not expansion
6. **Modifying authentication patterns or helper functions** - Preserve existing patterns exactly
7. **Integrating with other testing frameworks** - Only migrate Playwright tests, not add new frameworks

## Design Considerations

### Directory Structure

```
gp-webapp/
├── e2e-tests/
│   ├── playwright.config.ts
│   ├── tsconfig.json
│   ├── biome.json
│   ├── tests/
│   │   ├── auth.setup.ts
│   │   ├── auth.cleanup.ts
│   │   ├── core/
│   │   │   ├── auth/
│   │   │   ├── navigation/
│   │   │   └── pages/
│   │   ├── app/
│   │   │   ├── ai/
│   │   │   ├── content/
│   │   │   ├── dashboard/
│   │   │   ├── mobile/
│   │   │   ├── outreach/
│   │   │   ├── polls/
│   │   │   ├── profile/
│   │   │   ├── resources/
│   │   │   ├── upgrade-pro/
│   │   │   └── website/
│   │   └── system/
│   │       └── sitemaps/
│   ├── src/
│   │   ├── helpers/
│   │   │   ├── account.helper.ts
│   │   │   ├── data.helper.ts
│   │   │   ├── navigation.helper.ts
│   │   │   ├── onboarded-user.helper.ts
│   │   │   └── wait.helper.ts
│   │   └── fixtures/
│   │       ├── heart.png
│   │       ├── high-confidence-poll-results.json
│   │       ├── low-confidence-poll-results.json
│   │       └── testpdf.pdf
│   ├── playwright/
│   │   └── .auth/
│   ├── docs/
│   │   ├── README.md
│   │   └── TEST_TAGGING_GUIDE.md
│   └── temp-docs/
│       ├── prd-e2e-tests-migration.md
│       └── tasks-e2e-tests-migration.md
```

### Path Resolution

- All imports in test files must use relative paths from the new location
- TypeScript path mappings in `tsconfig.json` should be updated if necessary
- Playwright config `testDir` should point to `./tests`

### Environment Variables

Tests currently use these environment variables:
- `BASE_URL` - Application base URL (defaults to `http://localhost:4000`)
- `TEST_DEFAULT_PASSWORD` - Default password for test users
- `TEST_USER_ADMIN` - Admin user email
- `TEST_USER_ADMIN_PASSWORD` - Admin user password
- `AUTH_SETUP_USER_EMAIL` - Set by auth.setup.ts
- `AUTH_SETUP_USER_PASSWORD` - Set by auth.setup.ts
- `AUTH_SETUP_USER2_EMAIL` - Set by auth.setup.ts for second user
- `AUTH_SETUP_USER2_PASSWORD` - Set by auth.setup.ts for second user

## Technical Considerations

### Dependencies to Add to gp-webapp/package.json

**DevDependencies:**
- `@playwright/test: ^1.48.1` - Test framework
- `@types/xml2js: ^0.4.14` - Type definitions
- `xml2js: ^0.6.2` - XML parsing for sitemap tests

**Dependencies:**
- `@aws-sdk/client-s3: ^3.948.0` - AWS S3 operations
- `@slack/web-api: ^7.13.0` - Slack notifications
- `axios: ^1.7.7` - HTTP client
- `csv-parse: ^6.1.0` - CSV parsing
- `p-retry: ^7.1.1` - Retry logic

**Note:** Some dependencies may already exist in gp-webapp. Check for version conflicts and use the newer version where appropriate.

### Biome Linting Integration

The test-automation repo uses Biome for linting. Consider:
- Whether to adopt Biome linting rules for e2e tests
- Whether to keep separate linting rules for e2e tests vs webapp
- How to integrate `npm run lint` from e2e-tests into webapp workflows

### GitHub Actions Considerations

- Run e2e tests after webapp builds successfully
- Use matrix strategy if testing multiple browsers (currently only Chromium)
- Cache Playwright browsers to speed up CI runs
- Set appropriate timeout values (tests can take 5-10 minutes)
- Store test artifacts for failed runs (7 day retention recommended)

### Base URL Configuration

In CI/CD, the `BASE_URL` should be:
- For local development: `http://localhost:4000`
- For PR previews: The Vercel/deployment preview URL
- For QA: `https://qa.goodparty.org`
- For production: `https://goodparty.org`

## Success Metrics

1. **All tests pass in new location**: 100% of tests that passed in test-automation should pass in gp-webapp/e2e-tests
2. **CI/CD integration successful**: GitHub Actions workflow runs on every PR with stable tests blocking and experimental tests non-blocking
3. **No increase in test execution time**: Tests should take the same amount of time to run in the new location
4. **Zero breaking changes for developers**: Developers can run tests locally with the same commands
5. **Test-automation repo archived**: Old repository is marked as read-only with clear redirect to new location
6. **Documentation updated**: README and guides accurately reflect the new location and any setup changes

## Open Questions

1. **Environment variable management**: Should we use GitHub Secrets for sensitive test credentials, or keep them in a `.env` file that's gitignored?

2. **Playwright browser installation**: Should browsers be committed to the repo, cached in CI, or installed fresh each time?

3. **Test reporting**: Do we want to integrate test results with any reporting tools (e.g., Playwright reporter, Slack notifications)?

4. **Separate package.json**: Should `e2e-tests` have its own `package.json` or share the webapp's root `package.json`?

5. **Migration strategy for remaining specs**: After validating the setup with one spec, should we migrate all specs at once or incrementally over multiple PRs?

6. **Backward compatibility**: Do we need to maintain the test-automation repo for any period, or can it be archived immediately after migration?

7. **Test execution scope**: Should the GitHub Actions workflow run all tests, or only tests related to changed files?

8. **Monorepo considerations**: Since gp-webapp is in a multi-workspace setup, how should the e2e-tests integrate with the workspace configuration?

