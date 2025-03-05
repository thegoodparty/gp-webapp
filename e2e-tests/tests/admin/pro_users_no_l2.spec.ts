import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify admin user can access Pro users w/o voter file page', async ({page}) => {
    const caseId = 31;
    const testAdmin = process.env.TEST_USER_ADMIN;
    const testAdminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

    try {
        await loginAccount(page, testAdmin, testAdminPassword);
        await page.waitForLoadState('networkidle');
        await page.goto('/admin/pro-no-voter-file');

        // Verify Pro users w/o voter file page
        await page.getByRole('heading', { name: 'Pro Users without L2 Data' }).isVisible();

        // Verify search bar
        await page.getByRole('columnheader', { name: 'Actions' }).isVisible();
        await page.getByRole('columnheader', { name: 'Profile' }).isVisible();
        await page.getByRole('columnheader', { name: 'Candidate User' }).isVisible();
        await page.getByRole('columnheader', { name: 'Campaign Manager(s)' }).isVisible();

        // Confirm results are displayed
        const placeholderText = await page.getByRole('columnheader', { name: 'Actions' })
            .getByPlaceholder(/Search \d+ records.../)
            .getAttribute('placeholder');
            
        const recordCount = parseInt(placeholderText.match(/\d+/)[0]);
        if (recordCount === 0) {
            throw new Error('No records found in the table');
        }
        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});