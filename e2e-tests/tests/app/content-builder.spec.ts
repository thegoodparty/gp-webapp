import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';
import { prepareTest } from 'helpers/accountHelpers';

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page, browser }) => {
    await prepareTest('user', '/dashboard/content', 'Content Builder', page, browser);
});

// Setup reporting for content builder test
const contentBuilderCaseId = 40;
setupTestReporting(test, contentBuilderCaseId);

test.skip('Generate content with Content Builder', async ({ page }) => {
    const testTemplate = /Voter Registration Drive Email/;

    // Generate new content
    await expect(page.getByRole('button', { name: /Generate/ })).toBeVisible({ timeout: 30000 });
    await page.getByRole('button', { name: /Generate/ }).click();
    await page.getByRole('heading', { name: 'Select a Template' }).isVisible();
    await page.getByRole('button', { name: testTemplate }).click();
    await documentReady(page);

    // Verify new content
    await expect(page.getByRole('link', { name: testTemplate}).first()).toBeVisible({ timeout: 30000 });
    await page.getByRole('link', { name: testTemplate}).first().click();
    await expect(page.getByRole('cell', { name: testTemplate })).toBeVisible();
});