import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { documentReady } from 'helpers/domHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/");
    await documentReady(page);
});

test('Verify Dashboard page', async ({ page }) => {
    const caseId = 90;

    try {
        // Verify user is on dashboard page
        await expect(page.getByRole('heading', { name: /until Election Day!/ })).toBeVisible();
        await expect(page.getByRole('heading', { name: /Campaign progress/ })).toBeVisible();
        await expect(page.getByRole('heading', { name: /Tasks for this week/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /Record voter contacts/ })).toBeVisible();
        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);
    }
});

test('Log voter contact data', async ({ page }) => {
    const caseId = 91;

    try {
        // Verify user is on dashboard page
        await page.getByRole('button', { name: /Record voter contacts/ }).click();
        await page.getByLabel('Text Messages Sent').click();
        await page.getByLabel('Text Messages Sent').fill('100');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText(/100 voters contacted/)).toBeVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);
    }
});