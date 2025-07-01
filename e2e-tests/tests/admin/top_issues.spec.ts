import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';
import { documentReady } from 'helpers/domHelpers';

test.use({
    storageState: 'admin-auth.json',
});

test.beforeEach(async ({ page }) => {
    await prepareTest('admin', '/admin/top-issues', 'Add a Top Issue', page);
});

const topIssuesCaseId = 27;
setupTestReporting(test, topIssuesCaseId);
test.skip('Verify admin user can access Top Issues page', async ({ page }) => {
    await documentReady(page);
    const addButton = page.getByRole('button', { name: 'Add a Top Issue' });
    await expect(addButton).toBeVisible({ timeout: 60000 });
});