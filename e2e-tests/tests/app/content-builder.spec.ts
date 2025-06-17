import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/content", { waitUntil: "networkidle" });
    await documentReady(page);
});

// Setup reporting for content builder test
const contentBuilderCaseId = 40;
setupTestReporting(test, contentBuilderCaseId);

test.skip('Generate content with Content Builder', async ({ page }) => {
    const testTemplate = 'Launch Email';

    // Verify user is on the AI campaign tool page
    await expect(page.getByRole('heading', { name: 'Content Builder' })).toBeVisible({ timeout: 60000 });

    // Generate new content
    await page.getByRole('button', { name: 'Generate' }).click();
    await page.getByRole('heading', { name: 'Select a Template' }).isVisible();
    await page.getByRole('button', { name: testTemplate }).click();

    // Verify new content
    await page.getByRole('link', { name: testTemplate, exact: true }).click();
    await expect(page.getByRole('cell', { name: testTemplate })).toBeVisible({ timeout: 60000 });
});