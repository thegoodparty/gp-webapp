import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { upgradeToPro } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/voter-records");
    await page.waitForLoadState('networkidle');
});

test('Voter Data shows Upgrade to Pro prompt for free users', async ({ page }) => {
    const caseId = 41;

    try {
        // Verify user is on voter data (free) page
        await expect(page.getByRole('heading', { name: 'Upgrade to Pro for just $10 a month!' })).toBeVisible();
        await page.getByRole('button', { name: 'Join Pro Today' }).click();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});

test.skip('Upgrade user to Pro', async ({ page }) => {
    const caseId = 42;
    try {
        await upgradeToPro(page);
        await page.goto('/dashboard/voter-records')
        await page.waitForLoadState('networkidle');
        // Verify user is on voter data (pro) page
        await expect(page.getByRole('heading', { name: 'Voter File' })).toBeVisible();

        // Verify generated voter files are displayed
        await page.getByText('Voter file', { exact: true }).isVisible();
        await page.getByText('Door Knocking', { exact: true }).isVisible();
        await page.getByText('Texting', { exact: true }).isVisible();
        await page.getByText('Direct Mail (Default)', { exact: true }).isVisible();
        await page.getByText('Facebook', { exact: true }).isVisible();
        await page.getByText('Phone Banking', { exact: true }).isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});