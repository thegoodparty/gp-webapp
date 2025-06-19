import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';

test.use({
    storageState: 'admin-auth.json',
});

const topIssuesCaseId = 27;
setupTestReporting(test, topIssuesCaseId);

test('Verify admin user can access Top Issues page', async ({ page }) => {
    await page.goto('/admin/top-issues', { waitUntil: 'networkidle' });
    await documentReady(page);

    await expect(page.getByRole('button', { name: 'Add a Top Issue' })
    ).toBeVisible({ timeout: 1000 });
});