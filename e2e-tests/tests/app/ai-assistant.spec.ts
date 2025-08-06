import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';

const testTopic = 'Campaign Strategy';

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await prepareTest('user', '/dashboard/campaign-assistant', 'AI Assistant', page);
});

setupMultiTestReporting(test, {
    'Create new conversation': TEST_IDS.CREATE_CONVERSATION
});

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

    await expect(topicButton).toBeHidden();
});