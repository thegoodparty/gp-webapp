import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';

const testTopic = 'Campaign Strategy';
const testTopicChat = /Crafting a why statement/;

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await prepareTest('user', '/dashboard/campaign-assistant', 'AI Assistant', page);
});

// Setup reporting for AI assistant test
const aiAssistantCaseId = 36;
setupTestReporting(test, aiAssistantCaseId);

test.skip('Create new conversation', async ({ page }) => {
    const heading = page.getByRole('heading', { name: 'AI Assistant' });
    await expect(heading).toBeVisible({ timeout: 30000 });

    const newChatButton = page.getByRole('button', { name: 'New Chat' });
    await expect(newChatButton).toBeVisible({ timeout: 15000 });
    await newChatButton.click();
    
    try {
        await page.waitForLoadState('networkidle', { timeout: 15000 });
    } catch (error) {
        console.log('Network idle timeout after new chat, continuing...');
    }


    const topicButton = page.getByRole('button', { name: testTopic });
    await expect(topicButton).toBeVisible({ timeout: 15000 });
    await topicButton.click();
    
    try {
        await page.waitForLoadState('networkidle', { timeout: 15000 });
    } catch (error) {
        console.log('Network idle timeout after topic selection, continuing...');
    }

    const responseElement = page.locator('.font-normal > div:nth-child(2)');
    await expect(responseElement).toBeVisible({ timeout: 45000 });
});