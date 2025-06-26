import 'dotenv/config';
import { test } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';
import { prepareTest } from 'helpers/accountHelpers';

test.use({
    storageState: 'admin-auth.json',
});

// Setup reporting for P2V stats test
const p2vStatsCaseId = 29;
setupTestReporting(test, p2vStatsCaseId);

test('Verify admin user can access P2V Stats page', async ({ page }) => {
    await prepareTest('admin', '/admin/p2v-stats', 'P2V Stats', page);

    // Verify P2V Stats page
    await page.getByRole('heading', { name: 'P2V Stats' }).isVisible();
    await page.getByRole('button', { name: 'Refresh P2V Stats' }).isVisible();
});