import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { appNav } from 'helpers/navHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { createAccount, deleteAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

const testZip = '94066';
const role = 'California Attorney General';

test('Generate content with AI Campaign Tool', async ({ page }) => {
    const caseId = 40;
    await skipNonQA(test);
    const testTemplate = 'Launch Email';

    try {
        await createAccount(page, 'live', true, testZip, role);

        await appNav(page, 'AI Campaign Tool');

        // Verify user is on the AI campaign tool page
        await expect(page.getByRole('heading', { name: 'My Content' })).toBeVisible();

        // Dismiss tutorial (if visible)
        if(page.getByRole('heading', { name: 'Content Creation, Simplified' }).isVisible()) {
            await page.getByRole('button', { name: '×' }).click();
        }

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

        // Delete account after signup
        await deleteAccount(page);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }

});