import 'dotenv/config';
import { expect, test } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { generateEmail, userData } from 'helpers/dataHelpers';
import * as fs from 'fs';
import * as path from 'path';
import { documentReady } from 'helpers/domHelpers';

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await page.goto('/profile', {
        waitUntil: "networkidle"
    });
    await documentReady(page);
});

// Setup reporting for personal information test
const personalInfoCaseId = 33;
setupTestReporting(test, personalInfoCaseId);

test('Adjust Personal Information', async ({ page }) => {
    const firstName = userData.firstName;
    const newEmailAddress = generateEmail();
    const phoneNumber = userData.phoneNumber;
    const zipCode = userData.zipCode.substring(0, 5);

    await page.locator("[data-testid='personal-first-name']").waitFor({ state: 'visible', timeout: 60000 });
    await page.locator("[data-testid='personal-first-name']").fill(firstName);
    await page.locator("[data-testid='personal-email']").fill(newEmailAddress);
    await page.locator("input[name='phone']").fill(phoneNumber);
    await page.locator("[data-testid='personal-zip']").fill(zipCode);
    await page.locator('form').filter({ hasText: 'Save Changes' }).getByRole('button').first().click();

    // Waits for save to complete
    await documentReady(page);

    // Verifies changes are saved
    await expect(page.locator("[data-testid='personal-first-name']")).toHaveValue(firstName);
    await expect(page.locator("[data-testid='personal-email']")).toHaveValue(newEmailAddress);
    await expect(page.locator("input[name='phone']")).toHaveValue(phoneNumber);
    await expect(page.locator("[data-testid='personal-zip']")).toHaveValue(zipCode);
});

// Setup reporting for notification settings test
const notificationSettingsCaseId = 34;
setupTestReporting(test, notificationSettingsCaseId);

test('Adjust Notification Settings', async ({ page }) => {
    await page.getByRole('checkbox').first().waitFor({ state: 'visible', timeout: 60000 });
    await page.getByRole('checkbox').first().click();
    await expect(page.locator('.MuiSwitch-switchBase').first()).toHaveClass(/Mui-checked/);
    await page.waitForTimeout(500);
});

// Setup reporting for password change test
const passwordChangeCaseId = 35;
setupTestReporting(test, passwordChangeCaseId);

test.skip('Change Account Password', async ({ page }) => {
    const testAccountPath = path.resolve(__dirname, '../../testAccount.json');
    const { password } = JSON.parse(
        fs.readFileSync(testAccountPath, 'utf-8')
    );

    // Change account password
    await page.getByLabel('Old Password *').fill(`${password}`);
    await page.getByLabel('New Password *').fill(`${password}`);
    await page.getByRole('button', { name: 'Save Changes' }).nth(1).click();

    // Wait for the response and check its status
    await page.waitForResponse((response) =>
        response.status() === 200
    );
});