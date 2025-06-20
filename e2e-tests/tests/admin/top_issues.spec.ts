import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';
import * as fs from 'fs';
import * as path from 'path';

const adminSessionFile = path.resolve(__dirname, '../../admin-auth.json');
if (fs.existsSync(adminSessionFile)) {
    test.use({
        storageState: 'admin-auth.json',
    });
}

test.beforeEach(async ({ page }) => {
    await prepareTest('admin', '/admin/top-issues', 'Add a Top Issue', page);
});

const topIssuesCaseId = 27;
setupTestReporting(test, topIssuesCaseId);

test('Verify admin user can access Top Issues page', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Add a Top Issue' })
    ).toBeVisible();
});