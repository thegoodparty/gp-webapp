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
        // Wait for page to be fully loaded
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');
        
        await expect(page.getByRole('heading', { name: 'AI Assistant' })).toBeVisible({
            timeout: 20000  // Increased timeout
        });

        // Create new chat with additional waits
        const newChatButton = page.getByRole('button', { name: 'New Chat' });
        await expect(newChatButton).toBeVisible({ timeout: 10000 });
        await newChatButton.click();
        await page.waitForLoadState('networkidle');
        
        const topicButton = page.getByRole('button', { name: testTopic });
        await expect(topicButton).toBeVisible({ timeout: 10000 });
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
        
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}. 
        Screenshot saved to: ${screenshotPath}
        Error: ${error.stack}`);
    }
});

test('Delete a conversation', async ({ page }) => {
    const caseId = 37;
    try {
        // Wait for page to be fully loaded
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');

        // Create new chat with additional waits
        const newChatButton = page.getByRole('button', { name: 'New Chat' });
        await expect(newChatButton).toBeVisible({ timeout: 10000 });
        await newChatButton.click();
        
        const topicButton = page.getByRole('button', { name: testTopic });
        await expect(topicButton).toBeVisible({ timeout: 10000 });
        await topicButton.click();
        await page.waitForLoadState('networkidle');

        // Refresh page with explicit waits
        await page.reload();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');

        // Open history and delete conversation with additional waits
        const historyButton = page.getByRole('button', { name: 'View Chat History' });
        await expect(historyButton).toBeVisible({ timeout: 10000 });
        await historyButton.click();
        
        await page.waitForTimeout(1000); // Small delay for animation
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