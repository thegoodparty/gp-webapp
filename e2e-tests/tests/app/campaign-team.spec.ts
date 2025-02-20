import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { appNav } from 'helpers/navHelpers';
import { addTestResult, authFileCheck, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

authFileCheck(test);

test.beforeEach(async ({ page }) => {
    await skipNonQA(test);
    await page.goto("/dashboard")
    await appNav(page, 'Campaign Team');
});

test('Displays blank campaign team members page', async ({ page }) => {
    const caseId = 45;
    try {
        // Verify user is on the Campaign Team page
        await expect(page.getByRole('heading', { name: 'Campaign Team' })).toBeVisible();
        await expect(page.url()).toContain('/dashboard/team');

        // Verify campaign team members are displayed
        await page.getByRole('heading', { name: 'You do not have any team members yet.' });

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});