import 'dotenv/config';
import { test } from '@playwright/test';
import { coreNav } from 'helpers/navHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify admin user can access admin dashboard', async ({ page }) => {
    const caseId = 24;
    await skipNonQA(test);

    const testAdmin = process.env.TEST_USER_ADMIN;
    const testAdminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

    try {
        await loginAccount(page, true, testAdmin, testAdminPassword);

        await page.goto('/admin');

        // Verify Admin Dashboard is displayed
        await page.getByRole('heading', { name: 'Admin Dashboard' }).isVisible();
        await page.getByRole('button', { name: 'Admin Dashboard' }).isVisible();
        await page.getByRole('button', { name: 'Campaigns' }).isVisible();
        await page.getByRole('button', { name: 'Users', exact: true }).isVisible();
        await page.getByRole('button', { name: 'Top Issues' }).isVisible();
        await page.getByRole('button', { name: 'Bust Cache' }).isVisible();
        await page.getByRole('button', { name: 'AI Content' }).isVisible();
        await page.getByRole('button', { name: 'P2V Stats' }).isVisible();
        await page.getByRole('button', { name: 'Pro users w/o voter file' }).isVisible();
        await page.getByRole('button', { name: 'Public Candidates' }).isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-admin-dashboard-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});