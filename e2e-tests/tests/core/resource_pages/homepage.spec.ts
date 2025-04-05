import { test, expect } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

const pageTitle = /GoodParty.org/
const bannerText = /Join our Discord/
const bannerButton = /Join Now/
const candidatesButton = /Find Candidates/

test.beforeEach(async ({ page }) => {
  await page.goto('/', {waitUntil: "commit"});
});

test('Verify Homepage', async ({ page }) => {
  const caseId = 1;

  try {
    // Verify page title
    await expect(page).toHaveTitle(pageTitle);

    // Verify navbar and footer presence
    expect(page.getByTestId('navbar')).toBeVisible();
    expect(page.locator('footer')).toBeVisible();

    // Verify Discord banner
    expect(page.getByText(bannerText));
    expect(page.getByRole('button', { name: bannerButton }));

    // Verify links in body
    expect(page.getByRole('button', { name: candidatesButton }));
    await expect(page.locator('#prefooter_demo')).toBeVisible();


    await addTestResult(runId, caseId, 1, 'Test passed');
  } catch (error) {

    // Report test results
    await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
  }
});