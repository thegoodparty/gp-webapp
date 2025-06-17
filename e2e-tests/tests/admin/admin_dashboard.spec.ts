import 'dotenv/config';
import { test } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';

test.use({
    storageState: 'admin-auth.json',
});

// Setup reporting for admin dashboard test
const adminDashboardCaseId = 24;
setupTestReporting(test, adminDashboardCaseId);

test('Verify admin user can access admin dashboard', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await documentReady(page);

    // Verify Admin Dashboard is displayed
    await page.getByRole('heading', { name: 'Admin Dashboard' }).isVisible();
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