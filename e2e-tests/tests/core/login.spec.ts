import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { coreNav } from 'helpers/navHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import { userData } from 'helpers/dataHelpers';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify invalid login credentials error message', async ({ page }) => {
    const caseId = 22;

    const loginPageHeader = 'Login to GoodParty.org';
    const invalidEmail = userData.email;
    const invalidPassword = invalidEmail;
    const invalidErrorMessage = 'The email or password are wrong.';

    try {
        await page.goto('/');
        await coreNav(page, 'nav-login');

        // Verify user is on login page
        await expect(page.getByText(loginPageHeader)).toBeVisible();

        // Input invalid login credentials
        await page.locator('input[data-testid="login-email-input"]').fill(invalidEmail);
        await page.locator('input[data-testid="login-password-input"]').fill(invalidPassword);
        await page.getByTestId('login-submit-button').click();

        // Verify error message
        await page.getByText(invalidErrorMessage).isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-invalid-login-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});

test('Verify user can log in with valid credentials', async ({ page }) => {
    const caseId = 19;
    await skipNonQA(test, runId, caseId);

    const testAccountOnboarding = process.env.TEST_USER_EMAIL_1;
    const testOnboardingPassword = process.env.TEST_USER_PASSWORD_1;

    try {
        await loginAccount(page, false, testAccountOnboarding, testOnboardingPassword);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-valid-login-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});