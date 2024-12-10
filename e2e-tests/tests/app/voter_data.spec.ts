import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { appNav } from 'helpers/navHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

const testAccountState = process.env.TEST_USER_STATE;
const testStatePassword = process.env.TEST_USER_STATE_PASSWORD;

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
        const screenshotPath = `screenshots/test-failure-new-chat-campaign-assistant-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});