import 'dotenv/config';
import { test } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';

test.use({
    storageState: 'admin-auth.json',
});

setupTestReporting(test, TEST_IDS.AI_CONTENT);

test('Verify admin user can access AI Content page', async ({ page }) => {

    await prepareTest('admin', '/admin/ai-content', 'AI Content', page);

    // Verify Search input
    await page.getByRole('heading', { name: 'AI Content' }).isVisible();
});