import 'dotenv/config';
import { test } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';

test.use({
    storageState: 'admin-auth.json',
});

setupTestReporting(test, TEST_IDS.P2V_STATS);

test('Verify admin user can access P2V Stats page', async ({ page }) => {
    await prepareTest('admin', '/admin/p2v-stats', 'P2V Stats', page);

    // Verify P2V Stats page
    await page.getByRole('heading', { name: 'P2V Stats' }).isVisible();
    await page.getByRole('button', { name: 'Refresh P2V Stats' }).isVisible();
});