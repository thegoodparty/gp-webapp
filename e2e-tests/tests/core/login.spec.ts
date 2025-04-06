import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import { userData } from 'helpers/dataHelpers';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.beforeEach(async ({ page }) => {
    await page.goto("/login", {waitUntil: "networkidle"});
});

test('Verify invalid login credentials error message', async ({ page }) => {
    const caseId = 22;

    const loginPageHeader = 'Login to GoodParty.org';
    const invalidEmail = userData.email;
    const invalidPassword = userData.password + '1';
    const invalidErrorMessage = 'Invalid login. Please check your credentials and try again.';

    try {
        // Verify user is on login page
        await expect(page.getByText(loginPageHeader)).toBeVisible();

        // Input invalid login credentials
        await page.locator('input[data-testid="login-email-input"]').fill(invalidEmail);
        await page.locator('input[data-testid="login-password-input"]').fill(invalidPassword);
        await page.getByTestId('login-submit-button').click();

        // Verify error message
        await page.getByText(invalidErrorMessage).isVisible({timeout: 10000});

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        const currentUrl = await page.url();
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}: ${error.stack}`);
    }
});

test('Verify user can log in with valid credentials', async ({ page }) => {
    const caseId = 19;

    const testAdmin = process.env.TEST_USER_ADMIN;
    const testAdminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

    try {
        await loginAccount(page, testAdmin, testAdminPassword);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        const currentUrl = await page.url();
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}: ${error.stack}`);
    }
});