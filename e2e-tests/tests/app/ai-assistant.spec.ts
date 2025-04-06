import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

const testTopic = 'Campaign Strategy';
const testTopicChat = /^Can you help me with my campaign strategy\?$/;

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/campaign-assistant", {
        waitUntil: "networkidle"
    });
        await expect(page).toHaveURL(/.*\/dashboard\/campaign-assistant/);
});

test('Create new conversation', async ({ page }) => {
    const caseId = 36;
    try {
        await expect(page.getByRole('heading', { name: 'AI Assistant' })).toBeVisible({
            timeout: 10000
        });

        // Create new chat 
        const newChatButton = page.getByRole('button', { name: 'New Chat' });
        await expect(newChatButton).toBeVisible();
        await newChatButton.click();
        
        const topicButton = page.getByRole('button', { name: testTopic });
        await expect(topicButton).toBeVisible();
        await topicButton.click();

        await page.waitForLoadState('networkidle');
        
        const chatElement = page.locator('div').filter({ hasText: testTopicChat }).first();
        await expect(chatElement).toBeVisible({ timeout: 10000 });
        
        const responseElement = page.locator('.font-normal > div:nth-child(2)');
        await expect(responseElement).toBeVisible({ timeout: 20000 });

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        const currentUrl = await page.url();
        
        // Capture screenshot on failure
        const screenshotPath = `test-results/failures/test-${caseId}-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        await addTestResult(
            runId, 
            caseId, 
            5, 
            `Test failed (${testrailUrl}) at page ${currentUrl}. Error: ${error.stack}`,
            screenshotPath
        );
    }
});

test('Delete a conversation', async ({ page }) => {
    const caseId = 37;
    try {
        // Create new chat
        await page.getByRole('button', { name: 'New Chat' }).click();
        await page.getByRole('button', { name: testTopic }).click();

        // Wait for response to generate
        await page.waitForLoadState('networkidle');

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
        // Report test results
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        const currentUrl = await page.url();
        
        // Capture screenshot on failure
        const screenshotPath = `test-results/failures/test-${caseId}-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}. 
        Screenshot saved to: ${screenshotPath}
        Error: ${error.stack}`);
    }
});