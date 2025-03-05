import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify admin user can access P2V Stats page', async ({page}) => {
    const caseId = 30;
    const testAdmin = process.env.TEST_USER_ADMIN;
    const testAdminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

    try {
        await loginAccount(page, testAdmin, testAdminPassword);
        await page.waitForLoadState('networkidle');
        await page.goto('/admin/p2v-stats');

        // Verify P2V Stats page
        await page.getByRole('heading', { name: 'P2V Stats' }).isVisible();
        await page.getByRole('button', { name: 'Refresh P2V Stats' }).click();
        await page.getByText('Completed').isVisible();
        await page.getByRole('cell', { name: /[1-9]\d*/ }).first().isVisible();
        await page.getByRole('cell', { name: /[0-9]\d*/ }).nth(1).isVisible();
        await page.getByRole('cell', { name: /[0-9]\d*/ }).nth(2).isVisible();
        await page.getByRole('cell', { name: /[0-9]\d*/ }).nth(3).isVisible();
        
        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});