import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { appNav } from 'helpers/navHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

const testAccountLocal = process.env.TEST_USER_LOCAL;
const testPasswordLocal = process.env.TEST_USER_LOCAL_PASSWORD;

test('Generate content with AI Campaign Tool', async ({ page }) => {
    const caseId = 40;
    await skipNonQA(test);
    test.setTimeout(90000);
    const testTemplate = 'Launch Email';

    try {
        await loginAccount(page, true, testAccountLocal, testPasswordLocal);

        await appNav(page, 'AI Campaign Tool');

        // Verify user is on the AI campaign tool page
        await expect(page.getByRole('heading', { name: 'My Content' })).toBeVisible();

        // Generate new content
        await page.getByRole('button', { name: 'Generate' }).click();
        await page.getByRole('heading', { name: 'Select a Template' }).isVisible();
        await page.getByRole('button', { name: testTemplate }).click();
        await page.getByRole('link', { name: testTemplate }).isVisible({timeout: 45000});

        // Verify new content
        await page.getByRole('link', { name: testTemplate, exact: true }).click();
        await expect(page.locator('.ql-editor')).toBeVisible();

        // Delete new content
        await page.locator('.ml-5 > .rounded-lg').click();
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('heading', { name: 'Delete Content' }).isVisible();
        await page.getByRole('button', { name: 'Proceed' }).click();
        await page.getByRole('link', { name: testTemplate, exact: true }).isHidden();

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