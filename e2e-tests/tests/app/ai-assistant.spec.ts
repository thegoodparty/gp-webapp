import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
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
            timeout: 30000
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
        await expect(responseElement).toBeVisible({ timeout: 30000 });

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);
    }
});