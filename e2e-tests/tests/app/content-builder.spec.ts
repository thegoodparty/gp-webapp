import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/content", {
        waitUntil: "networkidle"
    });
        await expect(page).toHaveURL(/.*\/dashboard\/content/);
});

test('Generate content with Content Builder', async ({page}) => {
    const caseId = 40;
    const testTemplate = 'Launch Email';

    try {
        // Verify user is on the AI campaign tool page
        await expect(page.getByRole('heading', { name: 'Content Builder' })).toBeVisible();

        // Generate new content
        await page.getByRole('button', { name: 'Generate' }).click();
        await page.getByRole('heading', { name: 'Select a Template' }).isVisible();
        await page.getByRole('button', { name: testTemplate }).click();

        // Verify new content
        await page.getByRole('link', { name: testTemplate, exact: true }).click();
        await expect(page.locator('.ql-editor')).toBeVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);
    }
});