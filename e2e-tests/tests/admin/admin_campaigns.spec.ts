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

test.skip('Verify admin user can add/delete campaigns', async ({ page }) => {
    const testFirstName = faker.person.firstName();
    const testLastName = 'test';
    const testEmail = generateEmail();
    const testPhone = `5105${generateTimeStamp().slice(-6)}`;
    const testZipCode = '94066';
    const testParty = 'Independent';
    const role = "San Mateo Union School Board";
    const electionLevel = 'Local/Township/City';
    const electionDate = '2028-11-10';

    // Add a new campaign
    await page.getByRole('button', { name: 'Add a new campaign' }).click();
    await page.locator('h2').filter({ hasText: 'New Campaign' }).isVisible();
    await page.getByLabel('First Name *').fill(testFirstName);
    await page.getByLabel('Last Name *').fill(testLastName);
    await page.getByLabel('Email *').fill(testEmail);
    await page.getByLabel('Phone *').fill(testPhone);
    await page.getByLabel('Zip Code *').fill(testZipCode);
    await page.getByRole('combobox').selectOption(testParty);
    await page.getByRole('button', { name: 'Step 1 - Create Campaign' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Step 2 - Select Office' }).click();
    await page.getByText('To pull accurate results,').isVisible();
    await page.getByLabel('Zipcode *').fill(testZipCode);
    await page.getByRole('combobox').selectOption(electionLevel);
    await page.waitForLoadState('networkidle');
    await page.getByLabel('General Election Date (').fill(electionDate);
    await page.getByLabel('General Election Date (').press('Enter');
    await page.getByRole("button", { name: role }).first().click();
    await page.getByRole("button", { name: "Save" }).click();
    await page.waitForLoadState('networkidle');

    // Confirm campaign is created
    await page.goto('/admin/campaign-statistics', { waitUntil: 'domcontentloaded' });
    await page.getByLabel('User Email').fill(testEmail);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByRole('cell', { name: testEmail }).isVisible();
});