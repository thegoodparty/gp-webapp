import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { appNav } from 'helpers/navHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

const testAccountState = process.env.TEST_USER_STATE;
const testStatePassword = process.env.TEST_USER_STATE_PASSWORD;
const testAccountLocalPro = process.env.TEST_USER_LOCAL_PRO;
const testLocalProPassword = process.env.TEST_USER_LOCAL_PRO_PASSWORD;

test('Voter Data shows Upgrade to Pro prompt for free users', async ({ page }) => {
    const caseId = 41;
    await skipNonQA(test);

    try {
        await loginAccount(page, true, testAccountState, testStatePassword);
        await appNav(page, 'Voter Data');

        // Verify user is on voter data (free) page
        await expect(page.getByRole('heading', { name: 'Upgrade to Pro for just $10 a month!' })).toBeVisible();
        await page.getByRole('button', { name: 'Join Pro Today' }).click();

        // Verify office details confirmation page
        await page.getByRole('heading', { name: 'Please confirm your office details.' }).isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-voter-data-free-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});

test('Voter Data (Pro) shows Voter File section', async ({ page }) => {
    const caseId = 42;
    await skipNonQA(test);

    try {
        await loginAccount(page, true, testAccountLocalPro, testLocalProPassword);
        await appNav(page, 'Voter Data');

        // Verify user is on voter data (pro) page
        await expect(page.getByRole('heading', { name: 'Voter File' })).toBeVisible();

        // Verify generated voter files are displayed
        await page.getByText('Voter file', { exact: true }).isVisible();
        await page.getByText('Door Knocking', { exact: true }).isVisible();
        await page.getByText('Texting', { exact: true }).isVisible();
        await page.getByText('Direct Mail', { exact: true }).isVisible();
        await page.getByText('Facebook', { exact: true }).isVisible();
        await page.getByText('Phone Banking', { exact: true }).isVisible();

        // View voter file details
        await page.getByRole('link', { name: 'Voter file (All Fields)' }).click();
        await page.getByRole('button', { name: 'Download CSV' }).isVisible();
        await expect(page.getByTestId('articleTitle')).toHaveText(/.+/, {timeout: 30000});

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-voter-data-free-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});

test('Can generate custom voter file (Pro)', async ({ page }) => {
    const caseId = 43;
    await skipNonQA(test);

    try {
        await loginAccount(page, true, testAccountLocalPro, testLocalProPassword);
        await appNav(page, 'Voter Data');

        // Verify user is on voter data (pro) page
        await expect(page.getByRole('heading', { name: 'Voter File' })).toBeVisible();

        // Count current number of custom voter files
        const initialCount = await page.getByText('Custom Voter File').count();

        // Generate custom voter file
        await page.getByRole('button', { name: 'Create a custom voter file' }).first().click();
        await page.getByRole('heading', { name: 'Voter File Assistant' }).isVisible();
        await page.getByLabel('Channel *').click();
        await page.getByRole('option', { name: 'Direct Mail' }).click();
        await page.getByLabel('Purpose').click();
        await page.getByRole('option', { name: 'Persuasion' }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        // Apply filters
        await page.getByLabel('Male', { exact: true }).click();
        await page.getByLabel('Super Voters (75% +)').click();

        await page.getByRole('button', { name: 'Create Voter File' }).click();

        // Confirm the updated count
        await page.reload({ waitUntil: 'networkidle' });
        const updatedCount = await page.getByText('Custom Voter File').count();
        expect(updatedCount).toBe(initialCount + 1);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-voter-data-free-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});