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

test('Displays blank campaign team members page', async ({ page }) => {
    const caseId = 45;
    await skipNonQA(test);

    try {
        await loginAccount(page, true, testAccountState, testStatePassword);
        await appNav(page, 'Campaign Team');

        // Verify user is on the Campaign Team page
        await expect(page.getByRole('heading', { name: 'Campaign Team' })).toBeVisible();
        await expect(page.url()).toContain('/dashboard/team');

        // Verify campaign team members are displayed
        await page.getByRole('heading', { name: 'You do not have any team members yet.' })

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-blank-team-members-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});

test('Displays campaign team members', async ({ page }) => {
    const caseId = 44;
    await skipNonQA(test);

    try {
        await loginAccount(page, true, testAccountLocalPro, testLocalProPassword);
        await appNav(page, 'Campaign Team');

        // Verify user is on the Campaign Team page
        await expect(page.getByRole('heading', { name: 'Campaign Team' })).toBeVisible();
        await expect(page.url()).toContain('/dashboard/team');

        // Verify campaign team members are displayed
        await page.getByText('Campaign Manager').first().isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-team-members-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});