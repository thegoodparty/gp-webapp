import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount, testAccountLastName } from 'helpers/accountHelpers';
import { userData } from 'helpers/dataHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

const testAdmin = process.env.TEST_USER_ADMIN;
const testAdminPassword = process.env.TEST_USER_ADMIN_PASSWORD;

test('Admin users page', async ({page}) => {
    const caseId = 26;
    await skipNonQA(test);

    try {
        await loginAccount(page, testAdmin, testAdminPassword);
        
        await page.waitForLoadState('networkidle');
        await page.goto('/admin');
        await page.getByRole('button', { name: 'Users', exact: true }).click();

        // Verify admin users page
        await page.waitForLoadState('networkidle');
        await page.getByRole('heading', { name: 'Users' }).isVisible();

        await page.getByRole('columnheader', { name: 'Actions' }).isVisible();
        await page.getByRole('columnheader', { name: 'Name' }).isVisible();
        await page.getByRole('columnheader', { name: 'Email' }).isVisible();
        await page.getByRole('columnheader', { name: 'Campaign Role(s)' }).isVisible();
        await page.getByRole('columnheader', { name: 'Last Visit' }).isVisible();
        await page.locator('td').first().isVisible();

        // Report test results  
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});

test('Send candidate invite', async ({page}) => {
    const caseId = 53;
    await skipNonQA(test);

    const inviteFirstName = userData.firstName;
    const inviteLastName = testAccountLastName;
    const inviteEmail = userData.email;

    try {
        await loginAccount(page, testAdmin, testAdminPassword);
        await page.waitForLoadState('networkidle');
        await page.goto('/admin');
        await page.getByRole('button', { name: 'Users', exact: true }).click();
        await page.waitForLoadState('networkidle');
        await page.getByRole('heading', { name: 'Users' }).isVisible();
        await page.getByRole('button', { name: 'Add User' }).click();

        // Add and submit user information
        await page.getByRole('heading', { name: 'Add User' }).isVisible();
        await page.getByLabel('First Name').fill(inviteFirstName);
        await page.getByLabel('Last Name').fill(inviteLastName);
        await page.getByLabel('Email').fill(inviteEmail);
        await page.getByRole('button', { name: 'Select' }).click();
        await page.getByRole('option', { name: 'campaign' }).click();
        await page.getByRole('button', { name: 'Cancel' }).isVisible();

        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Add User' }).click();

        await page.getByText('User created successfully').isVisible();

        // Report test results  
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});

test('Send sales invite', async ({page}) => {
    const caseId = 54;
    await skipNonQA(test);

    const inviteFirstName = userData.firstName;
    const inviteLastName = testAccountLastName;
    const inviteEmail = userData.email;

    try {
        await loginAccount(page, testAdmin, testAdminPassword);
        await page.waitForLoadState('networkidle');
        await page.goto('/admin');
        await page.getByRole('button', { name: 'Users', exact: true }).click();
        await page.waitForLoadState('networkidle');
        await page.getByRole('heading', { name: 'Users' }).isVisible();
        await page.getByRole('button', { name: 'Add User' }).click();

        // Add and submit user information
        await page.getByRole('heading', { name: 'Add User' }).isVisible();
        await page.getByLabel('First Name').fill(inviteFirstName);
        await page.getByLabel('Last Name').fill(inviteLastName);
        await page.getByLabel('Email').fill(inviteEmail);
        await page.getByRole('button', { name: 'Select' }).click();
        await page.getByRole('option', { name: 'sales' }).click();
        await page.getByRole('button', { name: 'Cancel' }).isVisible();

        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Add User' }).click();

        await page.getByText('User created successfully').isVisible();

        // Report test results  
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});