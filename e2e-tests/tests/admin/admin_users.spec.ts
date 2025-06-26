import 'dotenv/config';
import { test } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { prepareTest, testAccountLastName } from 'helpers/accountHelpers';
import { userData } from 'helpers/dataHelpers';
import { documentReady } from 'helpers/domHelpers';

test.use({
    storageState: 'admin-auth.json',
});

test.beforeEach(async ({ page }) => {
    await prepareTest('admin', '/admin/users', 'Users', page);
});

// Setup reporting for each test
const adminUsersCaseId = 26;
setupTestReporting(test, adminUsersCaseId);

test('Admin users page', async ({ page }) => {
    // Verify admin users page
    await page.getByRole('heading', { name: 'Users' }).isVisible();

    await page.getByRole('columnheader', { name: 'Actions' }).isVisible();
    await page.getByRole('columnheader', { name: 'Name' }).isVisible();
    await page.getByRole('columnheader', { name: 'Email' }).isVisible();
    await page.getByRole('columnheader', { name: 'Campaign Role(s)' }).isVisible();
    await page.getByRole('columnheader', { name: 'Last Visit' }).isVisible();
    await page.locator('td').first().isVisible();
});

// Setup reporting for candidate invite test
const candidateInviteCaseId = 53;
setupTestReporting(test, candidateInviteCaseId);

test.skip('Send candidate invite', async ({ page }) => {
    const inviteFirstName = userData.firstName;
    const inviteLastName = testAccountLastName;
    const inviteEmail = userData.email;

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

    await documentReady(page);
    await page.getByRole('button', { name: 'Add User' }).click();
    await documentReady(page);
});

// Setup reporting for sales invite test
const salesInviteCaseId = 54;
setupTestReporting(test, salesInviteCaseId);

test.skip('Send sales invite', async ({ page }) => {
    const inviteFirstName = userData.firstName;
    const inviteLastName = testAccountLastName;
    const inviteEmail = userData.email;

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

    await documentReady(page);
    await page.getByRole('button', { name: 'Add User' }).click();
    await documentReady(page);
});