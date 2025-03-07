import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify admin user can access AI Content page', async ({page}) => {
    const caseId = 29;
    const testAdmin = process.env.TEST_USER_ADMIN;
    const testAdminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

    try {
        await loginAccount(page, testAdmin, testAdminPassword);
        await page.waitForLoadState('networkidle');
        await page.goto('/admin/ai-content');
        await page.waitForLoadState('networkidle');

        // Verify Search input
        await page.locator('th[title="Toggle SortBy"] input').first().fill('launchEmail');
        await page.getByRole('cell', { name: 'launchEmail' }).isVisible();
        await page.locator('th[title="Toggle SortBy"] input').first().clear();
        await page.locator('th[title="Toggle SortBy"] input').first().fill('campaignUpdateEmail');
        await page.getByRole('cell', { name: 'campaignUpdateEmail' }).isVisible();
        
        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});