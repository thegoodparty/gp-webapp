import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { coreNav } from 'helpers/navHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import { userData, generateEmail, generatePhone } from 'helpers/dataHelpers';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Sign up flow', async ({ page }) => {
    await skipNonQA(test);

    const caseId = 18;
    const loginPageHeader = 'Join GoodParty.org';
    const firstName = userData.firstName;
    const lastName = userData.lastName;
    const emailAddress = generateEmail();
    const phoneNumber = generatePhone();
    const zipCode = userData.zipCode;
    const password = userData.password;

    try {
        await page.goto('/');
        await coreNav(page, 'nav-sign-up');

        // Verify user is on login page
        await expect(page.getByText(loginPageHeader)).toBeVisible();

        // Fill in sign up page
        await page.getByRole('textbox', { name: 'First Name'}).fill(firstName);
        await page.getByRole('textbox', { name: 'Last Name'}).fill(lastName);
        await page.getByRole('textbox', { name: 'email'}).fill(emailAddress);
        await page.getByRole('textbox', { name: 'phone'}).fill(phoneNumber);
        await page.getByRole('textbox', { name: 'Zip Code'}).fill(zipCode);
        await page.getByRole('textbox', { name: 'password'}).fill(password);
        await page.getByRole('button', { name: 'Join'}).click();

        // Verify user is in onboarding flow
        await page.getByRole('link', { name: 'Finish Later' }).isVisible({ timeout: 5000 });
        await page.waitForURL('**/onboarding/account-type', {
            timeout: 10000,
        });

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