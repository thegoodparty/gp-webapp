import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { appNav } from 'helpers/navHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { createAccount, deleteAccount, loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

const testTopic = '#plan-section-why';
const testAccountLocal = process.env.TEST_USER_LOCAL;
const testPasswordLocal = process.env.TEST_USER_LOCAL_PASSWORD;

test('Complete AI Campaign Plan introduction', async ({ page }) => {
    const caseId = 39;
    await skipNonQA(test);

    const testZip = '94066';
    const role = 'California Attorney General';
    try {
        // Create account
        await createAccount(page, 'live', true, testZip, role);

        // Confirm live account dashboard
        await page.getByText('Learn how to use your personalized campaign plan').isVisible();
        await page.goto('/');
        await page.getByRole('link', { name: 'Dashboard' }).click();
        await appNav(page, 'AI Campaign Plan');

        // Verify user is on the AI campaign plan page
        await expect(page.getByRole('heading', { name: 'AI Campaign Plan' })).toBeVisible();

        // Confirm introduction pop-up is visible
        await page.locator('.introjs-tooltiptext').isVisible();

        // Complete introduction
        await page.locator('.introjs-nextbutton').click();
        await expect(page.getByRole('heading', { name: 'Generate your campaign plan' })).toBeVisible();
        await page.locator('.introjs-nextbutton').click();
        await expect(page.getByRole('heading', { name: 'Provide your additional' })).toBeVisible();
        await page.locator('.introjs-nextbutton').click();
        await expect(page.getByRole('heading', { name: 'What is your current' })).toBeVisible();
        await page.locator('.introjs-overlay').isHidden();

        // Delete account after test
        await deleteAccount(page);

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

test('Create/refine campaign messaging', async ({ page }) => {
    const caseId = 38;
    await skipNonQA(test);

    const testChanges = 'Be Assertive';

    try {
        await loginAccount(page, true, testAccountLocal, testPasswordLocal);

        await appNav(page, 'AI Campaign Plan');

        try {
            // Wait for up to 10 seconds to check if the tutorial pop-up is visible
            await page.locator('.introjs-skipbutton').waitFor({ state: 'visible', timeout: 10000 });

            // If visible, click the skip button and wait for the overlay to be hidden
            await page.locator('.introjs-skipbutton').click();
            await page.locator('.introjs-overlay').waitFor({ state: 'hidden' });
        } catch (e) {
            console.log('Tutorial pop-up was not visible within 10 seconds.');
        }

        // Verify user is on the AI campaign plan page
        await expect(page.getByRole('heading', { name: 'AI Campaign Plan' })).toBeVisible();

        // Select suggested messaging topic
        await page.locator(testTopic).getByTestId('faq-expandable').click();

        // Verify messaging window is populated
        await page.locator('.section-content-why').isVisible();
        await page.getByText('Refine Save').isVisible();

        // Refine the message
        await page.getByRole('button', { name: 'Refine' }).click();
        await page.getByText('Refine your campaign plan').isVisible();
        await page.getByLabel('Ask the AI Campaign Manager').fill(testChanges);
        await page.getByRole('button', { name: 'Submit' }).click();

        // Confirm new message is generating
        await page.locator('.MuiLinearProgress-indeterminate').isVisible();

        // Verify messaging window is repopulated
        await page.locator('.MuiLinearProgress-indeterminate').isHidden();
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