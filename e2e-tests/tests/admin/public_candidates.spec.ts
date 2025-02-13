import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify admin user can access public candidates page', async ({page}) => {
    const caseId = 32;
    await skipNonQA(test);

    const testAdmin = process.env.TEST_USER_ADMIN;
    const testAdminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

    try {
        await loginAccount(page, testAdmin, testAdminPassword);
        await page.waitForLoadState('networkidle');
        await page.goto('/admin');
        await page.getByRole('button', { name: 'Public Candidates' }).isVisible();
        await page.getByRole('button', { name: 'Public Candidates' }).click();


        // Verify Public Candidates page
        await page.getByRole('heading', { name: 'Public Candidates' }).isVisible();
        await page.getByPlaceholder('/candidate/[name]/[office]').fill('/candidate/office');
        await page.getByRole('button', { name: 'Delete Candidate' }).isEnabled();
        
        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});