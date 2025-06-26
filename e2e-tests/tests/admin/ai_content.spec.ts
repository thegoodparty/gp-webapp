import 'dotenv/config';
import { test } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';

test.use({
    storageState: 'admin-auth.json',
});

const caseId = 29;
setupTestReporting(test, caseId);

test('Verify admin user can access AI Content page', async ({ page }) => {

    await prepareTest('admin', '/admin/ai-content', 'AI Content', page);

    // Verify Search input
    await page.getByRole('heading', { name: 'AI Content' }).isVisible();
});