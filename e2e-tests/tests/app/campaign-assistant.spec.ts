import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { appNav } from 'helpers/navHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

const testTopic = 'Campaign Strategy';
const testTopicChat = /^Can you help me with my campaign strategy\?$/;
const testAccount = 'automation1@goodparty.org'

test('Create new conversation', async ({ page }) => {
    await skipNonQA(test);
    const caseId = 36;

    try {
        await loginAccount(page, true, testAccount, testAccount);
        await appNav(page, 'Campaign Assistant');

        // Verify user is on campaign assistant page
        await expect(page.getByRole('heading', { name: 'Campaign Assistant' })).toBeVisible();

        // Create new chat
        await page.getByRole('button', { name: 'New Chat' }).click();

        // Select suggested topic
        await page.getByRole('button', { name: testTopic }).click();

        // Verify conversation window
        await page.locator('div').filter({ hasText: testTopicChat }).first().isVisible();
        await page.locator('.font-normal > div:nth-child(2)').isVisible({timeout: 20000});

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

test('Delete a conversation', async ({ page }) => {
    await skipNonQA(test);
    const caseId = 37;

    try {
        await loginAccount(page, true, testAccount, testAccount);
        await appNav(page, 'Campaign Assistant');

        // Create new chat
        await page.getByRole('button', { name: 'New Chat' }).click();
        await page.getByRole('button', { name: testTopic }).click();

        // Verify conversation window
        await page.locator('div').filter({ hasText: testTopicChat }).first().isVisible();
        await page.locator('.font-normal > div:nth-child(2)').isVisible({timeout: 20000});

        // Refresh page
        await page.reload({ waitUntil: 'domcontentloaded' });

        // Open history and delete conversation
        await page.getByRole('button', { name: 'View Chat History' }).click();
        await page.getByRole('img').nth(1).click();
        await page.getByText('Delete').click();

        // Confirm conversation deletion
        await page.getByRole('heading', { name: 'Delete Chat' }).isVisible();
        await page.getByRole('button', { name: 'Delete' }).click();

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