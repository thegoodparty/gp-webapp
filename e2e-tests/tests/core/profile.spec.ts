import 'dotenv/config';
import { expect, test } from '@playwright/test';
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
import { generateEmail, userData } from 'helpers/dataHelpers';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');
import * as path from 'path';
import { documentReady } from 'helpers/domHelpers';

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
    await documentReady(page);
});

test('Adjust Personal Information', async ({ page }) => {
    const caseId = 33;
    const firstName = userData.firstName;
    const newEmailAddress = generateEmail();
    const phoneNumber = userData.phoneNumber;
    const zipCode = userData.zipCode.substring(0, 5);

    try {
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

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);    
    }
});

test('Adjust Notification Settings', async ({ page }) => {
    const caseId = 34;

    try {
        const switchElements = await page.getByRole('checkbox');
        const switchCount = await switchElements.count();
        expect(switchCount).toBeGreaterThanOrEqual(4);

        // Click the notification switches and ensure they are checked
        for (let i = 0; i < 4; i++) {
            const switchToClick = switchElements.nth(i);
            await switchToClick.click();

            // Wait for the state to change to checked
            await expect(page.locator('.MuiSwitch-switchBase').nth(i)).toHaveClass(/Mui-checked/);
            await page.waitForTimeout(500);
        }
        const checkedElements = page.locator('.MuiSwitch-switchBase.Mui-checked');
        const checkedCount = await checkedElements.count();

        // Verify that 4 notification switches are checked
        expect(checkedCount).toBe(4);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);    
    }
});

test.skip('Change Account Password', async ({ page }) => {
    const caseId = 35;
    const testAccountPath = path.resolve(__dirname, '../../testAccount.json');
    const { password } = JSON.parse(
        fs.readFileSync(testAccountPath, 'utf-8')
    );

    try {
        // Change account password
        await page.getByLabel('Old Password *').fill(`${password}`);
        await page.getByLabel('New Password *').fill(`${password}`);
        await page.getByRole('button', { name: 'Save Changes' }).nth(1).click();

        // Wait for the response and check its status
        await page.waitForResponse((response) => 
            response.status() === 200
        );

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);    
    }
});