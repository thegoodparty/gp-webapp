# Tasks: E2E Tests Migration

## Relevant Files

### Configuration Files

- `gp-webapp/e2e-tests/playwright.config.ts` - Playwright configuration (copied from test-automation)
- `gp-webapp/e2e-tests/tsconfig.json` - TypeScript configuration for tests
- `gp-webapp/e2e-tests/biome.json` - Biome linting configuration
- `gp-webapp/e2e-tests/.gitignore` - Git ignore patterns for test artifacts
- `gp-webapp/package.json` - Add test dependencies to webapp package.json

### Test Files (to be migrated)

- `gp-webapp/e2e-tests/tests/auth.setup.ts` - Authentication setup
- `gp-webapp/e2e-tests/tests/auth.cleanup.ts` - Authentication cleanup
- `gp-webapp/e2e-tests/tests/core/auth/login.spec.ts` - Login test (validation spec)
- All other test files in `tests/core/`, `tests/app/`, `tests/system/`

### Helper Files

- `gp-webapp/e2e-tests/src/helpers/account.helper.ts` - Account management
- `gp-webapp/e2e-tests/src/helpers/data.helper.ts` - Test data generation
- `gp-webapp/e2e-tests/src/helpers/navigation.helper.ts` - Navigation utilities
- `gp-webapp/e2e-tests/src/helpers/onboarded-user.helper.ts` - Onboarding automation
- `gp-webapp/e2e-tests/src/helpers/wait.helper.ts` - Wait utilities

### Fixture Files

- `gp-webapp/e2e-tests/src/fixtures/heart.png` - Image test fixture
- `gp-webapp/e2e-tests/src/fixtures/high-confidence-poll-results.json` - Poll data
- `gp-webapp/e2e-tests/src/fixtures/low-confidence-poll-results.json` - Poll data
- `gp-webapp/e2e-tests/src/fixtures/testpdf.pdf` - PDF test fixture

### Documentation Files

- `gp-webapp/e2e-tests/docs/README.md` - Test suite documentation
- `gp-webapp/e2e-tests/docs/TEST_TAGGING_GUIDE.md` - Test tagging guide

### GitHub Actions

- `gp-webapp/.github/workflows/e2e-tests.yml` - E2E test workflow for CI/CD

### Notes

- All paths are relative to the workspace root
- The migration preserves the exact directory structure from test-automation
- Tests will run from `gp-webapp/e2e-tests` directory
- Authentication state will be stored in `gp-webapp/e2e-tests/playwright/.auth/`

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:

- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [ ] 0.0 Create feature branch

  - [ ] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/migrate-e2e-tests`)

- [ ] 1.0 Setup E2E Tests Directory Structure

  - [ ] 1.1 Verify `gp-webapp/e2e-tests` directory exists (should already exist with temp-docs)
  - [ ] 1.2 Create `gp-webapp/e2e-tests/tests` directory
  - [ ] 1.3 Create `gp-webapp/e2e-tests/src/helpers` directory
  - [ ] 1.4 Create `gp-webapp/e2e-tests/src/fixtures` directory
  - [ ] 1.5 Create `gp-webapp/e2e-tests/playwright/.auth` directory (will be gitignored)
  - [ ] 1.6 Create `gp-webapp/e2e-tests/docs` directory

- [ ] 2.0 Migrate Playwright Configuration Files

  - [ ] 2.1 Copy `test-automation/playwright.config.ts` to `gp-webapp/e2e-tests/playwright.config.ts`
  - [ ] 2.2 Update `testDir` path in playwright.config.ts to `./tests` if needed
  - [ ] 2.3 Verify authentication state paths point to `playwright/.auth/user.json`
  - [ ] 2.4 Copy `test-automation/tsconfig.json` to `gp-webapp/e2e-tests/tsconfig.json`
  - [ ] 2.5 Update tsconfig.json base paths if needed for the new location
  - [ ] 2.6 Copy `test-automation/biome.json` to `gp-webapp/e2e-tests/biome.json`
  - [ ] 2.7 Update biome.json file includes/excludes for new directory structure

- [ ] 3.0 Migrate Package Dependencies

  - [ ] 3.1 Read `test-automation/package.json` to identify all dependencies
  - [ ] 3.2 Read `gp-webapp/package.json` to check for existing dependencies
  - [ ] 3.3 Add Playwright dependencies to gp-webapp/package.json devDependencies: `@playwright/test: ^1.48.1`, `@types/xml2js: ^0.4.14`
  - [ ] 3.4 Add test utility dependencies to gp-webapp/package.json dependencies: `@aws-sdk/client-s3: ^3.948.0`, `@slack/web-api: ^7.13.0`, `xml2js: ^0.6.2`, `csv-parse: ^6.1.0`, `p-retry: ^7.1.1`
  - [ ] 3.5 Check if `axios` already exists in package.json (it likely does), keep existing version
  - [ ] 3.6 Check if `dotenv` already exists in package.json, add if missing: `dotenv: ^16.4.7`
  - [ ] 3.7 Add test scripts to gp-webapp/package.json scripts section: `"test:e2e": "cd e2e-tests && npx playwright test tests/ --reporter=list"`, `"test:e2e:core": "cd e2e-tests && npx playwright test tests/core/ --reporter=list"`, `"test:e2e:app": "cd e2e-tests && npx playwright test tests/app/ --reporter=list"`, `"test:e2e:system": "cd e2e-tests && npx playwright test tests/system/ --reporter=list"`
  - [ ] 3.8 Run `npm install` in gp-webapp root to install new dependencies

- [ ] 4.0 Create .gitignore for E2E Tests

  - [ ] 4.1 Create `gp-webapp/e2e-tests/.gitignore` file
  - [ ] 4.2 Add Playwright artifacts to .gitignore: `test-results/`, `playwright-report/`, `blob-report/`, `playwright/.cache/`, `screenshots/`, `playwright/.auth`
  - [ ] 4.3 Add test data to .gitignore: `auth.json`, `admin-auth.json`, `testAccount.json`, `playwright-results.json`, `testRunId.txt`, `reported-test-cases.json`
  - [ ] 4.4 Add environment files to .gitignore: `.env`

- [ ] 5.0 Migrate Helper Files

  - [ ] 5.1 Copy `test-automation/src/helpers/account.helper.ts` to `gp-webapp/e2e-tests/src/helpers/account.helper.ts`
  - [ ] 5.2 Copy `test-automation/src/helpers/data.helper.ts` to `gp-webapp/e2e-tests/src/helpers/data.helper.ts`
  - [ ] 5.3 Copy `test-automation/src/helpers/navigation.helper.ts` to `gp-webapp/e2e-tests/src/helpers/navigation.helper.ts`
  - [ ] 5.4 Copy `test-automation/src/helpers/onboarded-user.helper.ts` to `gp-webapp/e2e-tests/src/helpers/onboarded-user.helper.ts`
  - [ ] 5.5 Copy `test-automation/src/helpers/wait.helper.ts` to `gp-webapp/e2e-tests/src/helpers/wait.helper.ts`
  - [ ] 5.6 Review all helper files for any absolute path references that need updating

- [ ] 6.0 Migrate Test Fixtures

  - [ ] 6.1 Copy `test-automation/src/fixtures/heart.png` to `gp-webapp/e2e-tests/src/fixtures/heart.png`
  - [ ] 6.2 Copy `test-automation/src/fixtures/high-confidence-poll-results.json` to `gp-webapp/e2e-tests/src/fixtures/high-confidence-poll-results.json`
  - [ ] 6.3 Copy `test-automation/src/fixtures/low-confidence-poll-results.json` to `gp-webapp/e2e-tests/src/fixtures/low-confidence-poll-results.json`
  - [ ] 6.4 Copy `test-automation/src/fixtures/testpdf.pdf` to `gp-webapp/e2e-tests/src/fixtures/testpdf.pdf`

- [ ] 7.0 Migrate Authentication Setup and Cleanup

  - [ ] 7.1 Copy `test-automation/tests/auth.setup.ts` to `gp-webapp/e2e-tests/tests/auth.setup.ts`
  - [ ] 7.2 Update import paths in auth.setup.ts to use relative paths from new location (e.g., `../src/helpers/data.helper`)
  - [ ] 7.3 Verify authentication file paths are correct (should be `playwright/.auth/user.json`)
  - [ ] 7.4 Copy `test-automation/tests/auth.cleanup.ts` to `gp-webapp/e2e-tests/tests/auth.cleanup.ts`
  - [ ] 7.5 Update import paths in auth.cleanup.ts to use relative paths from new location

- [ ] 8.0 Migrate One Test Spec for Validation

  - [ ] 8.1 Create directory structure `gp-webapp/e2e-tests/tests/core/auth`
  - [ ] 8.2 Copy `test-automation/tests/core/auth/login.spec.ts` to `gp-webapp/e2e-tests/tests/core/auth/login.spec.ts`
  - [ ] 8.3 Update import paths in login.spec.ts to use relative paths (e.g., `../../../src/helpers/navigation.helper`)
  - [ ] 8.4 Verify all imports resolve correctly

- [ ] 9.0 Validate Setup with Test Run

  - [ ] 9.1 Install Playwright browsers: `cd gp-webapp/e2e-tests && npx playwright install`
  - [ ] 9.2 Ensure gp-webapp is running locally on `http://localhost:4000`
  - [ ] 9.3 Run the login test from gp-webapp/e2e-tests: `npx playwright test tests/core/auth/login.spec.ts --project=stable`
  - [ ] 9.4 Verify test passes and authentication setup works correctly
  - [ ] 9.5 Check that test artifacts are generated in correct locations (test-results/, playwright-report/)
  - [ ] 9.6 Review any errors and fix import paths or configuration issues
  - [ ] 9.7 Run TypeScript type checking: `npx tsc --noEmit` from e2e-tests directory
  - [ ] 9.8 Run linting: `npx biome check --diagnostic-level=error` from e2e-tests directory

- [ ] 10.0 Migrate Documentation

  - [ ] 10.1 Copy `test-automation/README.md` to `gp-webapp/e2e-tests/docs/README.md`
  - [ ] 10.2 Update README.md to reflect new location and paths
  - [ ] 10.3 Update command examples in README.md to work from e2e-tests directory
  - [ ] 10.4 Add section about running tests from gp-webapp root using npm scripts
  - [ ] 10.5 Copy `test-automation/docs/TEST_TAGGING_GUIDE.md` to `gp-webapp/e2e-tests/docs/TEST_TAGGING_GUIDE.md`
  - [ ] 10.6 Review TEST_TAGGING_GUIDE.md and update any paths or references

- [ ] 11.0 Create GitHub Actions Workflow

  - [ ] 11.1 Create `.github/workflows` directory in gp-webapp if it doesn't exist
  - [ ] 11.2 Create `gp-webapp/.github/workflows/e2e-tests.yml` file
  - [ ] 11.3 Configure workflow to trigger on pull_request events
  - [ ] 11.4 Add job to setup Node.js 22
  - [ ] 11.5 Add step to install dependencies: `npm install`
  - [ ] 11.6 Add step to install Playwright browsers: `cd e2e-tests && npx playwright install --with-deps`
  - [ ] 11.7 Add job for stable tests: `cd e2e-tests && npx playwright test --project=stable --reporter=list`
  - [ ] 11.8 Add job for experimental tests: `cd e2e-tests && npx playwright test --project=experimental --reporter=list`
  - [ ] 11.9 Configure stable tests as required check (blocking)
  - [ ] 11.10 Configure experimental tests to continue on error (non-blocking)
  - [ ] 11.11 Add step to upload test artifacts on failure: screenshots, videos, traces
  - [ ] 11.12 Set environment variables: BASE_URL, TEST_DEFAULT_PASSWORD (from secrets)
  - [ ] 11.13 Add matrix strategy for running setup, cleanup, and test projects

- [ ] 12.0 Migrate Remaining Test Specs

  - [ ] 12.1 Create directory structure for all test categories: `tests/core/navigation`, `tests/core/pages`, `tests/app/ai`, `tests/app/content`, `tests/app/dashboard`, `tests/app/mobile`, `tests/app/outreach`, `tests/app/polls`, `tests/app/profile`, `tests/app/resources`, `tests/app/upgrade-pro`, `tests/app/website`, `tests/system/sitemaps`
  - [ ] 12.2 Copy all test files from `test-automation/tests/core/` to `gp-webapp/e2e-tests/tests/core/` preserving structure
  - [ ] 12.3 Copy all test files from `test-automation/tests/app/` to `gp-webapp/e2e-tests/tests/app/` preserving structure
  - [ ] 12.4 Copy all test files from `test-automation/tests/system/` to `gp-webapp/e2e-tests/tests/system/` preserving structure
  - [ ] 12.5 Update import paths in all migrated test files to use relative paths from new location
  - [ ] 12.6 Run TypeScript type checking on all test files: `npx tsc --noEmit`
  - [ ] 12.7 Run linting on all test files: `npx biome check --diagnostic-level=error`
  - [ ] 12.8 Fix any linting errors or type errors

- [ ] 13.0 Validate Full Test Suite

  - [ ] 13.1 Run all stable tests: `cd e2e-tests && npx playwright test --project=stable`
  - [ ] 13.2 Review test results and compare with test-automation repo results
  - [ ] 13.3 Verify all tests that passed in test-automation also pass in gp-webapp/e2e-tests
  - [ ] 13.4 Run experimental tests: `cd e2e-tests && npx playwright test --project=experimental`
  - [ ] 13.5 Document any failing tests and investigate root causes
  - [ ] 13.6 Verify authentication setup and cleanup projects work correctly
  - [ ] 13.7 Check that test artifacts (screenshots, videos, traces) are stored correctly

- [ ] 14.0 Update Webapp Documentation

  - [ ] 14.1 Update `gp-webapp/README.md` to mention e2e tests location
  - [ ] 14.2 Add section about running e2e tests in webapp README
  - [ ] 14.3 Document environment variables needed for e2e tests
  - [ ] 14.4 Add link to `e2e-tests/docs/README.md` for detailed test documentation

- [ ] 15.0 Create Pull Request

  - [ ] 15.1 Commit all changes to the feature branch
  - [ ] 15.2 Push branch to remote repository
  - [ ] 15.3 Create pull request with comprehensive description
  - [ ] 15.4 Add PR description explaining the migration and what was changed
  - [ ] 15.5 Reference this PRD and task list in PR description
  - [ ] 15.6 Request review from team members
  - [ ] 15.7 Verify GitHub Actions e2e-tests workflow runs successfully on PR
  - [ ] 15.8 Address any review comments or test failures

- [ ] 16.0 Archive Test-Automation Repository

  - [ ] 16.1 Create final README in test-automation repo explaining migration
  - [ ] 16.2 Add prominent notice at top of test-automation README: "⚠️ This repository has been archived. All e2e tests have been migrated to gp-webapp/e2e-tests"
  - [ ] 16.3 Add link to new location in gp-webapp repository
  - [ ] 16.4 Commit the updated README to test-automation
  - [ ] 16.5 Archive the test-automation repository on GitHub (Settings > Archive this repository)
  - [ ] 16.6 Verify repository is marked as read-only
  - [ ] 16.7 Update any documentation or wiki pages that reference the old test-automation repo

- [ ] 17.0 Post-Migration Validation
  - [ ] 17.1 Have another developer clone gp-webapp and run e2e tests to verify setup works
  - [ ] 17.2 Verify GitHub Actions workflow runs on subsequent PRs
  - [ ] 17.3 Monitor test results for any flakiness or issues after migration
  - [ ] 17.4 Update team documentation/wiki with new test location and commands
  - [ ] 17.5 Announce migration completion to team with updated workflows
