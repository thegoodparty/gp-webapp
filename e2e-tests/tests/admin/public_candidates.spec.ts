import 'dotenv/config';
import { test } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';

test.use({
    storageState: 'admin-auth.json',
});

const caseId = 32;
setupTestReporting(test, caseId);

test('Verify admin user can access public candidates page', async ({ page }) => {
    await page.goto('/admin/public-candidates');
    await documentReady(page);

    // Verify Public Candidates page
    await page.getByRole('heading', { name: 'Public Candidates' }).isVisible();
});