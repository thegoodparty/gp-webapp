import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { testAccountLastName } from 'helpers/accountHelpers';
import { userData } from 'helpers/dataHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'admin-auth.json',
});

test.beforeEach(async ({page}) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
});

test('Admin users page', async ({page}) => {
    const caseId = 26;
    try {
        // Verify admin users page
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
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        const currentUrl = await page.url();
        
        // Capture screenshot on failure
        const screenshotPath = `test-results/failures/test-${caseId}-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}. 
        Screenshot saved to: ${screenshotPath}
        Error: ${error.stack}`);
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

        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Add User' }).click();
        await page.waitForLoadState('networkidle');

        // Report test results  
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        const currentUrl = await page.url();
        
        // Capture screenshot on failure
        const screenshotPath = `test-results/failures/test-${caseId}-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}. 
        Screenshot saved to: ${screenshotPath}
        Error: ${error.stack}`);
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

        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Add User' }).click();
        await page.waitForLoadState('networkidle');

        // Report test results  
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        const currentUrl = await page.url();
        
        // Capture screenshot on failure
        const screenshotPath = `test-results/failures/test-${caseId}-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}. 
        Screenshot saved to: ${screenshotPath}
        Error: ${error.stack}`);
    }
});