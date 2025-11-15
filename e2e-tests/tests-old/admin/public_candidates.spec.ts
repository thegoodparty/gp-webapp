import 'dotenv/config';
import { test } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';

test.use({
    storageState: 'admin-auth.json',
});

setupTestReporting(test, TEST_IDS.PUBLIC_CANDIDATES);

test('Verify admin user can access public candidates page', async ({ page }) => {
    await prepareTest('admin', '/admin/public-candidates', 'Public Candidates', page);

    // Verify Public Candidates page
    await page.getByRole('heading', { name: 'Public Candidates' }).isVisible();
});