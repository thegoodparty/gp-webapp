import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await prepareTest('user', '/dashboard', 'Campaign progress', page);
});

// Setup reporting for dashboard verification test
const dashboardVerificationCaseId = 90;
setupTestReporting(test, dashboardVerificationCaseId);

test.skip('Verify Dashboard page', async ({ page }) => {
    // Verify user is on dashboard page
    await expect(page.getByRole('heading', { name: /Campaign progress/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Tasks for this week/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Record voter contacts/ })).toBeVisible();
});

// Setup reporting for voter contact test
const voterContactCaseId = 91;
setupTestReporting(test, voterContactCaseId);

test.skip('Log voter contact data', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Record voter contacts/ })).toBeVisible({ timeout: 30000 });
    await page.getByRole('button', { name: /Record voter contacts/ }).click();
    await page.getByLabel('Text Messages Sent').click();
    await page.getByLabel('Text Messages Sent').fill('100');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText(/100 voters contacted/)).toBeVisible();
});