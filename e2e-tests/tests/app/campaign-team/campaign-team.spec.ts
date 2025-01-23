import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { appNav } from 'helpers/navHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
  storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard")
});

test('Displays blank campaign team members page', async ({ page }) => {
    const caseId = 45;
    await skipNonQA(test);

    try {
        await appNav(page, 'Campaign Team');

        // Verify user is on the Campaign Team page
        await expect(page.getByRole('heading', { name: 'Campaign Team' })).toBeVisible();
        await expect(page.url()).toContain('/dashboard/team');

        // Verify campaign team members are displayed
        await page.getByRole('heading', { name: 'You do not have any team members yet.' })

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});