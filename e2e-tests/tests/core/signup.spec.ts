import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import { createAccount, deleteAccount } from 'helpers/accountHelpers';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Sign up flow', async ({ page }) => {
    const caseId = 18;
    await skipNonQA(test);
    try {
        // Create account
        await createAccount(page);

        // Delete account after signup
        await deleteAccount(page);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-sign-up-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});

test('Onboarding - Just Browsing', async ({ page }) => {
    const caseId = 21;
    await skipNonQA(test);
    try {
        // Create account
        await createAccount(page, 'demo', true);

        // Confirm demo account dashboard
        await page.getByText('Demo Account Notice').isVisible();

        // Delete account after signup
        await deleteAccount(page);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-sign-up-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});

test('Onboarding - Running for Office', async ({ page }) => {
    const caseId = 20;
    await skipNonQA(test);
    const testZip = '94066';
    const role = 'California Attorney General';
    try {
        // Create account
        await createAccount(page, 'live', true, testZip, role);

        // Confirm live account dashboard
        await page.getByText('Learn how to use your personalized campaign plan').isVisible();

        // Delete account after signup
        await deleteAccount(page);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-sign-up-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});