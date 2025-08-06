import 'dotenv/config';
import { test } from '@playwright/test';
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';
import { useAdminCredentials, useTestAccountCredentials } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';

const campaignTypes = ['Text message', 'Robocall', 'Door knocking', 'Phone banking', 'Social post'];

setupMultiTestReporting(test, {
    'Verify Voter Outreach page as new user': TEST_IDS.VOTER_OUTREACH,
    'Verify Voter Outreach page as pro user': TEST_IDS.NEW_VOTER_OUTREACH
});

test.describe('New User Voter Outreach', () => {
    test('Verify Voter Outreach page as new user', async ({ page }) => {
        await useTestAccountCredentials(page);
        await page.goto('/dashboard/outreach');
        await documentReady(page);

        for (const campaignType of campaignTypes) {
            const campaignButton = page.getByRole('heading', { name: campaignType });
            await campaignButton.waitFor({ state: 'visible' });
        }
    });
});

test.describe('Pro Voter Outreach', () => {    
    test('Verify Voter Outreach page as pro user', async ({ page }) => {
        await useAdminCredentials(page);
        await page.goto('/dashboard/outreach');
        await documentReady(page);

        for (const campaignType of campaignTypes) {
            const campaignButton = page.getByRole('heading', { name: campaignType });
            await campaignButton.waitFor({ state: 'visible' });
        }
    });
});