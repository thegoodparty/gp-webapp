import 'dotenv/config';
import { test } from '@playwright/test';
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { prepareTest, testAccountLastName } from 'helpers/accountHelpers';
import { userData } from 'helpers/dataHelpers';
import { documentReady } from 'helpers/domHelpers';
import { TEST_IDS } from 'constants/testIds';

test.use({
    storageState: 'admin-auth.json',
});

test.beforeEach(async ({ page }) => {
    await prepareTest('admin', '/admin/users', 'Users', page);
});

setupMultiTestReporting(test, {
    'Admin users page': TEST_IDS.USERS,
    'Send candidate invite': TEST_IDS.INVITE_CANDIDATE_USER,
    'Send sales invite': TEST_IDS.INVITE_SALES_USER
});

test('Admin users page', async ({ page }) => {
    await page.getByRole('heading', { name: 'Users' }).isVisible();

    await page.getByRole('columnheader', { name: 'Actions' }).isVisible();
    await page.getByRole('columnheader', { name: 'Name' }).isVisible();
    await page.getByRole('columnheader', { name: 'Email' }).isVisible();
    await page.getByRole('columnheader', { name: 'Campaign Role(s)' }).isVisible();
    await page.getByRole('columnheader', { name: 'Last Visit' }).isVisible();
    await page.locator('td').first().isVisible();
});

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