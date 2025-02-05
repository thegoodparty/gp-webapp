import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import { createAccount, deleteAccount } from 'helpers/accountHelpers';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Onboarding - Just Browsing', async ({page}) => {
    const caseId1 = 18;
    const caseId2 = 21;
    await skipNonQA(test);
    try {
        // Create account
        await createAccount(page);

        // Confirm demo account dashboard
        await page.getByText('Demo Account Notice').isVisible();

        // Delete account after signup
        await deleteAccount(page);

        // Report test results
        await addTestResult(runId, caseId1, 1, 'Test passed');
        await addTestResult(runId, caseId2, 1, 'Test passed');
    } catch (error) {
        // Report test results
        await addTestResult(runId, caseId1, 5, `Test failed: ${error.stack}`);
        await addTestResult(runId, caseId2, 5, `Test failed: ${error.stack}`);
    }
});

test('Onboarding - Running for Office', async ({page}) => {
    const caseId = 20;
    await skipNonQA(test);
    const testZip = '94066';
    const role = 'San Bruno City Council';
    try {
        // Create account
        await createAccount(page, testZip, role);

        // Confirm live account dashboard
        await page.getByText('Learn how to use your personalized campaign plan').isVisible();

        // Delete account after signup
        await deleteAccount(page);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});