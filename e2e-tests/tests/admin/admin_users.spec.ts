import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { testAccountLastName } from 'helpers/accountHelpers';
import { userData } from 'helpers/dataHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'admin-auth.json',
});

test.beforeEach(async ({page}) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('domcontentloaded');
});

test('Admin users page', async ({page}) => {
    const caseId = 26;
    try {
        // Verify admin users page
        page.getByRole('heading', { name: 'Users' }).isVisible();

        page.getByRole('columnheader', { name: 'Actions' }).isVisible();
        page.getByRole('columnheader', { name: 'Name' }).isVisible();
        page.getByRole('columnheader', { name: 'Email' }).isVisible();
        page.getByRole('columnheader', { name: 'Campaign Role(s)' }).isVisible();
        page.getByRole('columnheader', { name: 'Last Visit' }).isVisible();
        page.locator('td').first().isVisible();

        // Report test results  
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);    
    }
});

test.skip('Send candidate invite', async ({page}) => {
    const caseId = 53;
    const inviteFirstName = userData.firstName;
    const inviteLastName = testAccountLastName;
    const inviteEmail = userData.email;

    try {
        await page.getByRole('heading', { name: 'Users' }).isVisible();
        await page.getByRole('button', { name: 'Add User' }).click();

        // Add and submit user information
        await page.getByRole('heading', { name: 'Add User' }).isVisible();
        await page.getByLabel('First Name').fill(inviteFirstName);
        await page.getByLabel('Last Name').fill(inviteLastName);
        await page.getByLabel('Email').fill(inviteEmail);
        await page.getByRole('button', { name: 'Select' }).click();
        await page.getByRole('option', { name: 'candidate' }).click();
        await page.getByRole('button', { name: 'Cancel' }).isVisible();

        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('button', { name: 'Add User' }).click();
        await page.waitForLoadState('domcontentloaded');

        // Report test results  
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);    
    }
});

test.skip('Send sales invite', async ({page}) => {
    const caseId = 54;
    const inviteFirstName = userData.firstName;
    const inviteLastName = testAccountLastName;
    const inviteEmail = userData.email;

    try {
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

        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('button', { name: 'Add User' }).click();
        await page.waitForLoadState('domcontentloaded');

        // Report test results  
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);    
    }
});