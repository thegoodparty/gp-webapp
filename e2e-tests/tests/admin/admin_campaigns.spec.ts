import 'dotenv/config';
import { expect, test } from '@playwright/test';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount, testAccountLastName } from 'helpers/accountHelpers';
import { faker } from '@faker-js/faker';
import { generateEmail, generateTimeStamp } from 'helpers/dataHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

const testAdmin = process.env.TEST_USER_ADMIN;
const testAdminPassword = process.env.TEST_USER_ADMIN_PASSWORD;
const testSearchEmail = 'test@pro.co';

test.beforeEach(async ({page}) => {
    await skipNonQA(test);
    await loginAccount(page, testAdmin, testAdminPassword);
    await page.waitForLoadState('networkidle');
    await page.goto('/admin');
    await page.getByRole('button', { name: 'Campaigns' }).isVisible();
    await page.getByRole('button', { name: 'Campaigns' }).click();
});


test('Verify admin user can access Admin Campaigns page', async ({page}) => {
    const caseId = 25;
    try {
        // Verify Campaigns page
        await page.getByRole('heading', { name: 'Campaigns' }).isVisible();
        await page.getByRole('button', { name: 'Add a new campaign' }).isVisible();

        // Test search functionality
        await page.getByLabel('User Email').fill(testSearchEmail);
        await page.getByRole('button', { name: 'Search' }).click();
        await page.getByRole('cell', { name: testSearchEmail }).isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});

test('Verify admin user can impersonate user', async ({page}) => {
    const caseId = 73;
    try {
        // Search and select user for impersonation
        await page.getByLabel('User Email').fill(testSearchEmail);
        await page.getByRole('button', { name: 'Search' }).click();
        await page.getByRole('cell', { name: testSearchEmail }).isVisible();

        await page.getByRole('row', { name: 'test-pro Test Pro No (' }).getByRole('img').click();
        await page.getByRole('button', { name: 'Impersonate' }).click();

        // Confirm impersonation
        await page.waitForLoadState('networkidle');
        await page.locator('#nav-run-dropdown').getByRole('button').click();
        await page.getByRole('link', { name: 'Settings' }).click();
        await expect(page.getByTestId('personal-email')).toHaveValue(testSearchEmail);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});

test('Verify admin user can add/delete campaigns', async ({page}) => {
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
        await page.getByLabel('General Election Date *').fill(electionDate);
        await page.getByRole('button', { name: 'Next' }).click();
        await page.getByText("What office are you interested in?").isVisible();
        await page
          .getByRole("progressbar")
          .waitFor({ state: "hidden", timeout: 20000 });
        await page.getByRole("button", { name: role }).first().click();
        await page.getByRole("button", { name: "Save" }).click();
        await page.getByText('Saved').isVisible();
        await page.waitForLoadState('networkidle');

        // Confirm campaign is created
        await page.goto('/admin/campaign-statistics');
        await page.getByLabel('User Email').fill(testEmail);
        await page.getByRole('button', { name: 'Search' }).click();
        await page.getByRole('cell', { name: testEmail }).isVisible();

        // Delete campaign
        await page.getByRole('row', { name: `${testFirstName} ${testLastName}` }).getByRole('img').click();
        await page.getByRole('button', { name: 'Delete Campaign' }).click();
        await page.getByRole('heading', { name: 'Delete Campaign' }).isVisible();
        await page.getByRole('button', { name: 'Proceed' }).click();
        await page.getByText('Deleted').isVisible();
        await page.waitForLoadState('networkidle');

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});