import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { upgradeToPro } from 'helpers/accountHelpers';
import { documentReady } from 'helpers/domHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
  storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
  await page.goto("/dashboard/voter-records");
  await documentReady(page);
});

test.describe.serial('Voter data pro features', () => {
  test.skip(
    !process.env.BASE_URL?.match(/^https?:\/\/(dev\.|qa\.|)goodparty\.org/),
    'Skipping GoodParty.org PRO / voter data tests on non-production environments'
  );

  test('Voter Data shows Upgrade to Pro prompt for free users', async ({ page }) => {
    const caseId = 41;

    try {
      // Verify user is on voter data (free) page
      await expect(page.getByRole('heading', { name: 'Why pay more for less?' })).toBeVisible();
      await page.getByRole('link', { name: 'Start today for just $10/month.' }).click();

      // Report test results
      await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
      await handleTestFailure(page, runId, caseId, error);
    }
  });

  test.skip('Upgrade user to Pro', async ({ page }) => {
    const caseId = 42;
    try {
      await upgradeToPro(page);
      await page.getByRole('link', { name: 'GoodParty.org PRO' }).isVisible();
      // Report test results
      await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
      await handleTestFailure(page, runId, caseId, error);
    }
  });
});