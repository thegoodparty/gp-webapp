import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { appNav } from 'helpers/navHelpers';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

const testAdmin = process.env.TEST_USER_ADMIN;
const testAdminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

test.skip('Generate content with Content Builder', async ({page}) => {
    const caseId = 40;
    const testTemplate = 'Launch Email';

    try {
        await loginAccount(page, testAdmin, testAdminPassword);
        await page.goto('/dashboard/content');
        await page.waitForLoadState('networkidle');

        // Verify user is on the AI campaign tool page
        await expect(page.getByRole('heading', { name: 'My Content' })).toBeVisible();

        // Generate new content
        await page.getByRole('button', { name: 'Generate' }).click();
        await page.getByRole('heading', { name: 'Select a Template' }).isVisible();
        await page.getByRole('button', { name: testTemplate }).click();

        // Verify new content
        await page.getByRole('link', { name: testTemplate, exact: true }).click();
        await expect(page.locator('.ql-editor')).toBeVisible();

        // Delete new content
        await page.locator('.ml-5 > .rounded-lg').click();
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('heading', { name: 'Delete Content' }).isVisible();
        await page.getByRole('button', { name: 'Proceed' }).click();
        await page.getByRole('link', { name: testTemplate, exact: true }).isHidden();
        await page.waitForLoadState('networkidle');

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});