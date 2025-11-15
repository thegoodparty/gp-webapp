import 'dotenv/config';
import { expect, test } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';
import { faker } from '@faker-js/faker';
import { generateEmail, generateTimeStamp } from 'helpers/dataHelpers';
import { TEST_IDS } from 'constants/testIds';
test.use({
    storageState: 'admin-auth.json',
});

const testSearchEmail = 'dustin@goodparty.org';

test.beforeEach(async ({ page }) => {
    await prepareTest('admin', '/admin/campaign-statistics', 'Campaigns', page);
});

setupTestReporting(test, TEST_IDS.CAMPAIGNS);

test('Verify admin user can access Admin Campaigns page', async ({ page }) => {
    // Verify Campaigns page
    await page.getByRole('heading', { name: 'Campaigns' }).first().isVisible();
    await page.getByRole('button', { name: 'Add a new campaign' }).isVisible();
});

setupTestReporting(test, TEST_IDS.IMPERSONATE_USER);

test.skip('Verify admin user can impersonate user', async ({ page }) => {
    // Search and select user for impersonation
    await page.getByLabel('User Email').fill(testSearchEmail);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByRole('cell', { name: testSearchEmail }).isVisible();
    await page.getByRole('row', { name: 'dustin-sison Dustin Sison No' }).locator('div').getByRole('img').click();
    await page.getByRole('button', { name: 'Impersonate' }).click();
    // Confirm impersonation
    await page.waitForLoadState('networkidle');
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('personal-email')).toHaveValue(testSearchEmail);
});

setupTestReporting(test, TEST_IDS.ADD_CAMPAIGN_AS_ADMIN);

