import 'dotenv/config';
import { expect, test } from '@playwright/test';
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { generateEmail, userData } from 'helpers/dataHelpers';
import * as fs from 'fs';
import * as path from 'path';
import { documentReady } from 'helpers/domHelpers';
import { prepareTest } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await prepareTest('user', '/profile', 'Personal Information', page);
});

setupMultiTestReporting(test, {
    'Adjust Personal Information': TEST_IDS.PERSONAL_INFORMATION,
    'Adjust Notification Settings': TEST_IDS.NOTIFICATION_SETTINGS,
    'Change Account Password': TEST_IDS.CHANGE_ACCOUNT_PASSWORD
});

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

test('Adjust Notification Settings', async ({ page }) => {
    await page.getByRole('checkbox').first().waitFor({ state: 'visible', timeout: 60000 });
    await page.getByRole('checkbox').first().click();
    await expect(page.locator('.MuiSwitch-switchBase').first()).toHaveClass(/Mui-checked/);
    await page.waitForTimeout(500);
});

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