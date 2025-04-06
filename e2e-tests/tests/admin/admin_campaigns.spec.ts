import 'dotenv/config';
import { expect, test } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { testAccountLastName } from 'helpers/accountHelpers';
import { faker } from '@faker-js/faker';
import { generateEmail, generateTimeStamp } from 'helpers/dataHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'admin-auth.json',
});

const testSearchEmail = 'dustin@goodparty.org';

test.beforeEach(async ({page}) => {
    await page.goto('/admin/campaign-statistics');
    await page.waitForLoadState('networkidle');
});


test('Verify admin user can access Admin Campaigns page', async ({page}) => {
    const caseId = 25;
    try {
        // Verify Campaigns page
        await page.getByRole('heading', { name: 'Campaigns' }).first().isVisible();
        await page.getByRole('button', { name: 'Add a new campaign' }).isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}): ${error.stack}`);
    }
});

test.skip('Verify admin user can impersonate user', async ({page}) => {
    const caseId = 73;
    try {
        // Search and select user for impersonation
        await page.getByLabel('User Email').fill(testSearchEmail);
        await page.getByRole('button', { name: 'Search' }).click();
        await page.getByRole('cell', { name: testSearchEmail }).isVisible();
        await page.getByRole('row', { name: 'dustin-sison Dustin Sison No' }).locator('div').getByRole('img').click();
        await page.getByRole('button', { name: 'Impersonate' }).click();
        // Confirm impersonation
        await page.waitForLoadState('networkidle');
        await page.goto('/profile');
        await expect(page.getByTestId('personal-email')).toHaveValue(testSearchEmail);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}): ${error.stack}`);
    }
});

test.skip('Verify admin user can add/delete campaigns', async ({page}) => {
    const caseId = 74;
    const testFirstName = faker.person.firstName();
    const testLastName = testAccountLastName;
    const testEmail = generateEmail();
    const testPhone = `5105${generateTimeStamp().slice(-6)}`;
    const testZipCode = '94066';
    const testParty = 'Independent';
    const role = "San Mateo Union School Board";
    const electionLevel = 'Local/Township/City';
    const electionDate = '2028-11-10';

    try {
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
        await page
          .getByRole("progressbar")
          .waitFor({ state: "hidden", timeout: 20000 });
        await page.getByRole("button", { name: role }).first().click();
        await page.getByRole("button", { name: "Save" }).click();
        await page.waitForLoadState('networkidle');

        // Confirm campaign is created
        await page.goto('/admin/campaign-statistics');
        await page.getByLabel('User Email').fill(testEmail);
        await page.getByRole('button', { name: 'Search' }).click();
        await page.getByRole('cell', { name: testEmail }).isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        const currentUrl = await page.url();
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}: ${error.stack}`);
    }
});