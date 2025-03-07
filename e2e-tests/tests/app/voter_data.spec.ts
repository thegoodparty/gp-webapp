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

test('Voter Data (Pro) shows Voter File section', async ({ page }) => {
    const caseId1 = 42;
    const caseId2 = 43;
    try {
        await page.waitForLoadState('networkidle');
        await upgradeToPro(page);
        await page.goto('/dashboard/voter-records')

        // Verify user is on voter data (pro) page
        await expect(page.getByRole('heading', { name: 'Voter File' })).toBeVisible();

        // Verify generated voter files are displayed
        await page.getByText('Voter file', { exact: true }).isVisible();
        await page.getByText('Door Knocking', { exact: true }).isVisible();
        await page.getByText('Texting', { exact: true }).isVisible();
        await page.getByText('Direct Mail (Default)', { exact: true }).isVisible();
        await page.getByText('Facebook', { exact: true }).isVisible();
        await page.getByText('Phone Banking', { exact: true }).isVisible();

        // View voter file details
        await page.getByRole('link', { name: 'Voter file (All Fields)' }).click();
        await page.getByRole('button', { name: 'Download CSV' }).isVisible();
        await expect(page.getByTestId('articleTitle')).toHaveText(/.+/, {timeout: 30000});

        await page.goto('/dashboard/voter-records')

        // Verify user is on voter data (pro) page
        await expect(page.getByRole('heading', { name: 'Voter File' })).toBeVisible();

        // Generate custom voter file
        await page.getByRole('button', { name: 'Create a custom voter file' }).first().click();
        await page.getByRole('heading', { name: 'Voter File Assistant' }).isVisible();
        await page.getByLabel('Channel *').click();
        await page.getByRole('option', { name: 'Direct Mail' }).click();
        await page.getByLabel('Purpose').click();
        await page.getByRole('option', { name: 'Persuasion' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        // Apply filters
        await page.getByLabel('Male', { exact: true }).click();
        await page.getByLabel('Super Voters (75% +)').click();

        await page.getByRole('button', { name: 'Create Voter File' }).click();

        await page.reload({ waitUntil: 'networkidle' });
        await page.getByText('Custom Voter File', { exact: true }).isVisible();

        // Report test results
        await addTestResult(runId, caseId1, 1, 'Test passed');
        await addTestResult(runId, caseId2, 1, 'Test passed');
    } catch (error) {
        // Report test results
        await addTestResult(runId, caseId1, 5, `Test failed: ${error.stack}`);
        await addTestResult(runId, caseId2, 5, `Test failed: ${error.stack}`);
    }
});