import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';
import { prepareTest } from 'helpers/accountHelpers';

const VoterOutreachCaseId = 96;
const NewVoterOutreachCaseId = 97;
const campaignTypes = ['Text message', 'Robocall', 'Door knocking', 'Phone banking', 'Social post'];

test.describe('New User Voter Outreach', () => {
    test.use({
        storageState: 'auth.json',
    });
    
    setupTestReporting(test, NewVoterOutreachCaseId);
    
    test.skip('Verify Voter Outreach page as new user', async ({ page }) => {
        test.setTimeout(200000);
        const outreachPageHeader = 'Create your first campaign';
        await prepareTest('user', '/dashboard/outreach', outreachPageHeader, page);
        await documentReady(page);
        await page.waitForTimeout(10000);

        await expect(page.getByText(outreachPageHeader)).toBeVisible();

        for (const campaignType of campaignTypes) {
            const campaignButton = page.getByRole('heading', { name: campaignType });
            await campaignButton.waitFor({ state: 'visible' });
        }
    });
});

test.describe('Pro Voter Outreach', () => {
    test.use({
        storageState: 'admin-auth.json',
    });
    
    setupTestReporting(test, VoterOutreachCaseId);
    
    test.skip('Verify Voter Outreach page', async ({ page }) => {
        test.setTimeout(200000);
        const outreachPageHeader = 'Create a new campaign';
        await prepareTest('admin', '/dashboard/outreach', outreachPageHeader, page);
        await documentReady(page);
        await page.waitForTimeout(10000);

        await expect(page.getByText(outreachPageHeader)).toBeVisible();

        for (const campaignType of campaignTypes) {
            const campaignButton = page.getByRole('heading', { name: campaignType });
            await campaignButton.waitFor({ state: 'visible' });
        }
    });
});