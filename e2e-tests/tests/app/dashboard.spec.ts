import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupMultiTestReporting} from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';

test.use({
    storageState: 'auth.json',
});

setupMultiTestReporting(test, {
    'Verify Dashboard page': TEST_IDS.DASHBOARD_PAGE,
    'Log voter contact data': TEST_IDS.LOG_VOTER_CONTACT_DATA
});

test.beforeEach(async ({ page }) => {
    await prepareTest('user', '/dashboard', 'Campaign progress', page);
});

test.skip('Verify Dashboard page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Campaign progress/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Tasks for this week/ })).toBeVisible();
});

test.skip('Log voter contact data', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Record voter contacts/ })).toBeVisible({ timeout: 30000 });
    await page.getByRole('button', { name: /Record voter contacts/ }).click();
    await page.getByLabel('Text Messages Sent').click();
    await page.getByLabel('Text Messages Sent').fill('100');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText(/100 voters contacted/)).toBeVisible();
});