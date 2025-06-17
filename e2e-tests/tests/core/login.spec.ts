import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { userData } from 'helpers/dataHelpers';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
import { documentReady } from 'helpers/domHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await documentReady(page);
});

// Setup reporting for invalid login test
const invalidLoginCaseId = 22;
setupTestReporting(test, invalidLoginCaseId);

test('Verify invalid login credentials error message', async ({ page }) => {
    const loginPageHeader = 'Login to GoodParty.org';
    const invalidEmail = userData.email;
    const invalidPassword = userData.password + '1';
    const invalidErrorMessage = 'Invalid login. Please check your credentials and try again.';

    // Verify user is on login page
    await expect(page.getByText(loginPageHeader)).toBeVisible();

    // Input invalid login credentials
    await page.locator('input[data-testid="login-email-input"]').fill(invalidEmail);
    await page.locator('input[data-testid="login-password-input"]').fill(invalidPassword);
    await page.getByTestId('login-submit-button').click();

    // Verify error message
    await page.getByText(invalidErrorMessage).isVisible({ timeout: 10000 });
});

// Setup reporting for valid login test
const validLoginCaseId = 19;
setupTestReporting(test, validLoginCaseId);

test.skip('Verify user can log in with valid credentials', async ({ page }) => {
    const testAdmin = process.env.TEST_USER_ADMIN;
    const testAdminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

    await loginAccount(page, testAdmin, testAdminPassword);
});