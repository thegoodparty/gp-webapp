import 'dotenv/config';
import { test } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';

test.use({
    storageState: 'admin-auth.json',
});

// Setup reporting for pro users test
const proUsersCaseId = 30;
setupTestReporting(test, proUsersCaseId);

test('Verify admin user can access Pro users w/o voter file page', async ({ page }) => {
    await prepareTest('admin', '/admin/pro-no-voter-file', 'Pro Users without L2 Data', page);

    // Verify Pro users w/o voter file page
    await page.getByRole('heading', { name: 'Pro Users without L2 Data' }).isVisible();
});