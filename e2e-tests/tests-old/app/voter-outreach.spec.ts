import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { prepareTest } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';
import { documentReady } from 'helpers/domHelpers';

const campaignTypes = ['Text message', 'Robocall', 'Door knocking', 'Phone banking', 'Social post'];
const campaignDate = '2026-12-12';
const campaignScript = 'Automated Test';

setupMultiTestReporting(test, {
    'Verify Voter Outreach page': TEST_IDS.VOTER_OUTREACH,
    'Schedule an outreach campaign': TEST_IDS.SCHEDULE_CAMPAIGN
});

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await prepareTest('user', '/dashboard/outreach', 'Create a new campaign', page);
  });

test.describe('Voter Outreach page', () => {
    test('Verify Voter Outreach page', async ({ page }) => {
        for (const campaignType of campaignTypes) {
            const campaignButton = page.getByRole('heading', { name: campaignType });
            await campaignButton.waitFor({ state: 'visible' });
        }
    });

    test('Schedule an outreach campaign', async ({ page }) => {
        await documentReady(page);
        const doorKnockingCard = await page.getByRole('heading', { name: /Door knocking/i }).first();

        await expect(doorKnockingCard).toBeVisible({ timeout: 30000 });
        await doorKnockingCard.click();
        
        await page.getByRole('button', { name: 'Next' }).click();
        await page.getByLabel('First Time Voters').check();
        await page.getByLabel('Independent / Non-Partisan').check();
        await page.getByRole('button', { name: 'Next' }).click();
        await page.getByRole('radio', { name: 'Add your own script' }).click();
        await page.getByRole('button', { name: 'Next' }).click();
        await page.getByPlaceholder('Add your script here...').fill(campaignScript);
        await page.getByRole('button', { name: 'Next' }).click();
        await expect(page.getByRole('heading', { name: 'Download your materials' })).toBeVisible();
        await page.getByRole('img').click();
        // Confirm campaign is scheduled
        await expect(page.getByRole('cell', { name: /Door knocking/i }).first()).toBeVisible();
    });
});