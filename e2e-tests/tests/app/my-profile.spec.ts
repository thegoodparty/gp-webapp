import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { generateTimeStamp } from 'helpers/dataHelpers';
import { documentReady } from 'helpers/domHelpers';

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/campaign-details");
    await documentReady(page);
});

// Setup reporting for campaign details test
const campaignDetailsCaseId = 46;
setupTestReporting(test, campaignDetailsCaseId);

test.skip('Update Campaign Details', async ({ page }) => {
    const newCampaignCommittee = generateTimeStamp() + ' Committee';
    const newOccupation = generateTimeStamp() + ' Occupation';
    const newWebsite = 'http://www.' + generateTimeStamp() + '.com/'
    const newParty = 'Other';

    // Update campaign details
    await page.getByPlaceholder('Campaign Committee').isVisible({ timeout: 30000 });
    await page.getByPlaceholder('Campaign Committee').fill(newCampaignCommittee);
    await page.getByLabel('Occupation *').fill(newOccupation);
    await page.getByLabel('Campaign website').fill(newWebsite);
    await page.getByRole('combobox').selectOption(newParty);

    await page.locator('section').filter({ hasText: 'Campaign Details' }).getByRole('button').click();
    await page.waitForTimeout(15000);

    await documentReady(page);

    // Confirm new campaign details are saved with more robust assertions
    const committeeInput = page.getByPlaceholder('Campaign Committee');
    await committeeInput.waitFor({ state: 'visible', timeout: 30000 });
    await expect(committeeInput).toHaveValue(newCampaignCommittee, { timeout: 30000 });
    await expect(page.getByLabel('Occupation *')).toHaveValue(newOccupation);
    await expect(page.getByLabel('Campaign website')).toHaveValue(newWebsite);
    await expect(page.getByRole('combobox')).toHaveValue(newParty);
});

// Setup reporting for office details test
const officeDetailsCaseId = 47;
setupTestReporting(test, officeDetailsCaseId);

test.skip('Update Office Details', async ({ page }) => {
    const electionRole = 'California Controller';

    // Select new office location
    await page.getByRole('button', { name: 'Edit Office Details' }).waitFor({ state: 'visible', timeout: 30000 });
    await page.getByRole('button', { name: 'Edit Office Details' }).click();
    await page.getByText('To pull accurate results,').isVisible();

    // Select first local office listing
    const officeSelection = await page.getByRole('button', { name: electionRole }).first();
    await officeSelection.click();
    await page.getByRole('button', { name: 'Save' }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Save' }).click();

    // Refresh page
    await page.waitForTimeout(10000);
    await page.reload();
    await documentReady(page);

    // Confirm new office details
    await page.getByLabel('Office').waitFor({ state: 'visible', timeout: 30000 });
    await expect(await page.getByLabel('Office').inputValue()).toBe(electionRole);
});

// Setup reporting for why statement test
const whyStatementCaseId = 48;
setupTestReporting(test, whyStatementCaseId);

test.skip('Update Your Why Statement', async ({ page }) => {
    const newWhyStatement = generateTimeStamp() + ' Statement';
    // Update Your Why Statement
    await page.getByPlaceholder('EXAMPLE: I have 5 years of').clear();
    await page.getByPlaceholder('EXAMPLE: I have 5 years of').fill(newWhyStatement);
    await page.getByRole('button', { name: 'Save' }).nth(2).click();
    await documentReady(page);
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Confirm saved Why Statement
    await page.getByText(newWhyStatement).isVisible();
});

const funFactsCaseId = 49;
setupTestReporting(test, funFactsCaseId);

test.skip('Update Fun Facts about Yourself', async ({ page }) => {
    const newFunFacts = generateTimeStamp() + ' Fun Fact';

    // Update Your Why Statement
    await page.getByPlaceholder('EXAMPLE: In my free time, I').clear();
    await page.getByPlaceholder('EXAMPLE: In my free time, I').fill(newFunFacts);
    await page.getByRole('button', { name: 'Save' }).nth(3).click();
    await documentReady(page);
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Confirm saved Why Statement
    await page.getByText(newFunFacts).isVisible();
});

// Setup reporting for opponent test
const opponentCaseId = 50;
setupTestReporting(test, opponentCaseId);

test.skip('Add Opponent', async ({ page }) => {
    const opponent = generateTimeStamp() + ' Opponent';
    const opponentDescription = generateTimeStamp() + ' Opponent Description';

    // Add new opponent data
    await page.getByRole('button', { name: 'Add New Opponent' }).click();
    await page.getByLabel('Name *').fill(opponent);
    await page.locator('form').getByRole('combobox').selectOption('Other');
    await page.getByPlaceholder('EXAMPLE: Republican hotel').fill(opponentDescription);
    await page.getByRole('button', { name: 'Add Opponent' }).click();
    await page.getByRole('button', { name: 'Save' }).nth(1).click();
    await documentReady(page);

    // Refresh page and confirm saved opponent data
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByText(opponent, { exact: true }).isVisible();
});