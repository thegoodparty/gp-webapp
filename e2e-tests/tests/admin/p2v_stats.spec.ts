import 'dotenv/config';
import { test } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';

test.use({
    storageState: 'admin-auth.json',
});

// Setup reporting for P2V stats test
const p2vStatsCaseId = 29;
setupTestReporting(test, p2vStatsCaseId);

test('Verify admin user can access P2V Stats page', async ({ page }) => {
    await page.goto('/admin/p2v-stats');
    await documentReady(page);

    // Verify P2V Stats page
    await page.getByRole('heading', { name: 'P2V Stats' }).isVisible();
    await page.getByRole('button', { name: 'Refresh P2V Stats' }).isVisible();
});