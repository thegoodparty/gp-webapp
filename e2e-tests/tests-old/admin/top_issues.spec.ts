import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';
import { documentReady } from 'helpers/domHelpers';
import { TEST_IDS } from 'constants/testIds';

test.use({
    storageState: 'admin-auth.json',
});

test.beforeEach(async ({ page }) => {
    await prepareTest('admin', '/admin/top-issues', 'Add a Top Issue', page);
});

setupTestReporting(test, TEST_IDS.TOP_ISSUES);
test.skip('Verify admin user can access Top Issues page', async ({ page }) => {
    await documentReady(page);
    const addButton = page.getByRole('button', { name: 'Add a Top Issue' });
    await expect(addButton).toBeVisible({ timeout: 60000 });
});