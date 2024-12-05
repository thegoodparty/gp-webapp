import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { appNav } from 'helpers/navHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

const testTopic = '#plan-section-why';
const testAccountLocal = process.env.TEST_USER_EMAIL_3;
const testPasswordLocal = process.env.TEST_USER_PASSWORD_3;

test('Create/refine campaign messaging', async ({ page }) => {
    const caseId = 38;
    await skipNonQA(test, runId, caseId);

    try {
        await loginAccount(page, true, testAccountLocal, testPasswordLocal);

        await appNav(page, 'AI Campaign Plan');

        // Verify user is on the AI campaign plan page
        await expect(page.getByRole('heading', { name: 'AI Campaign Plan' })).toBeVisible();

        // Select suggested messaging topic
        await page.locator(testTopic).getByTestId('faq-expandable').click();

        // Verify messaging window is populated
        await page.locator('.section-content-why').isVisible();
        await page.getByText('Refine Save').isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-ai-campaign_plan-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});