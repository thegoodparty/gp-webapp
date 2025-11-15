import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';
import { documentReady } from 'helpers/domHelpers';

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

test('Create new conversation', async ({ page }) => {
    await documentReady(page);
    await expect(page.getByRole('heading', { name: 'AI Assistant' })).toBeVisible();
    await documentReady(page);
    await page.getByRole('button', { name: testTopic }).click();
    await documentReady(page);
    await expect(page.getByText('Ask me anything related to your campaign.')).toBeHidden({ timeout: 30000 });
});