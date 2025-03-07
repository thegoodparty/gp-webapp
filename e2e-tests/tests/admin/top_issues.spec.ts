import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify admin user can access Top Issues page', async ({page}) => {
    const caseId = 27;
    const testAdmin = process.env.TEST_USER_ADMIN;
    const testAdminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

    try {
        await loginAccount(page, testAdmin, testAdminPassword);
        await page.waitForLoadState('networkidle');
        await page.goto('/admin/top-issues');
        await page.waitForLoadState('networkidle');

        // Add a new issue
        await page.getByRole('button', { name: 'Add a Top Issue' }).click();
        await page.getByLabel('Top Issue Name').fill('Test Issue');
        await page.getByRole('button', { name: 'Save' }).click();

        // Add a new position
        await page.getByRole('button', { name: /Add a position for/}).first().click();
        await page.getByLabel('Position Name').fill('Test Position');
        await page.getByRole('button', { name: 'Save New Position' }).click();

        // Refresh page
        await page.reload({ waitUntil: 'domcontentloaded' });

        // Verify new issue and position is saved
        await page.getByRole('button', { name: 'Add a position for Test Issue' }).isVisible();
        await page.getByText('Test Position').isVisible();
        await page.getByText('Test Position').scrollIntoViewIfNeeded();

        // Delete issue and position
        await page.locator('div.flex.items-center')
            .filter({ hasText: 'Test Issue' })
            .locator('div.text-red-600.inline-block')
            .click();
        await page.getByRole('heading', { name: 'Delete Issue?' }).isVisible();
        await page.getByRole('button', { name: 'Proceed' }).click();
        await page.getByText('Deleting...').isVisible();

        await page.reload({ waitUntil: 'domcontentloaded' });

        // Verify new issue and position is deleted
        await page.getByRole('button', { name: 'Add a position for Test Issue' }).isHidden();
        await page.getByText('Test Position').isHidden();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');

    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});