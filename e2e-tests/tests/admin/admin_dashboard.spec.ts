import 'dotenv/config';
import { test } from '@playwright/test';
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';

test.use({
    storageState: 'admin-auth.json',
});

setupMultiTestReporting(test, { 'Verify admin user can access admin dashboard': TEST_IDS.ADMIN_DASHBOARD });

test('Verify admin user can access admin dashboard', async ({ page }) => {
    await prepareTest('admin', '/admin', 'Admin Dashboard', page);

    // Verify Admin Dashboard is displayed
    await page.getByRole('heading', { name: 'Admin Dashboard' }).isVisible({ timeout: 30000 });
    await page.getByRole('button', { name: 'Admin Dashboard' }).isVisible();
    await page.getByRole('button', { name: 'Campaigns' }).isVisible();
    await page.getByRole('button', { name: 'Users', exact: true }).isVisible();
    await page.getByRole('button', { name: 'Top Issues' }).isVisible();
    await page.getByRole('button', { name: 'Bust Cache' }).isVisible();
    await page.getByRole('button', { name: 'AI Content' }).isVisible();
    await page.getByRole('button', { name: 'P2V Stats' }).isVisible();
    await page.getByRole('button', { name: 'Pro users w/o voter file' }).isVisible();
    await page.getByRole('button', { name: 'Public Candidates' }).isVisible();
});