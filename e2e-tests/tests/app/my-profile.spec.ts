import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { generateTimeStamp } from 'helpers/dataHelpers';
import { documentReady } from 'helpers/domHelpers';
import { prepareTest } from 'helpers/accountHelpers';

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await prepareTest('user', '/dashboard/campaign-details', 'Campaign Details', page);
});

// Setup reporting for campaign details test
const campaignDetailsCaseId = 46;
setupTestReporting(test, campaignDetailsCaseId);

test('Update Campaign Details', async ({ page }) => {
    const newCampaignCommittee = generateTimeStamp() + ' Committee';
    const newOccupation = generateTimeStamp() + ' Occupation';
    const newWebsite = 'http://www.' + generateTimeStamp() + '.com/'
    const newParty = 'Other';
    const committeeInput = page.getByPlaceholder('Campaign Committee');

    await page.getByPlaceholder('Campaign Committee').isVisible({ timeout: 30000 });
    await page.getByPlaceholder('Campaign Committee').fill(newCampaignCommittee);
    await page.getByLabel('Occupation *').fill(newOccupation);
    await page.getByLabel('Campaign website').fill(newWebsite);
    await page.getByRole('combobox').selectOption(newParty);
    await page.locator('section').filter({ hasText: 'Campaign Details' }).getByRole('button').click();
    await page.waitForTimeout(15000);
    await documentReady(page);
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
    await page.getByRole('button', { name: 'Edit Office Details' }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Edit Office Details' }).waitFor({ state: 'visible', timeout: 45000 });
    await page.getByRole('button', { name: 'Edit Office Details' }).click();
    await documentReady(page);
    await page.getByText('To pull accurate results,').isVisible();

    // Select first local office listing
    await page.getByRole('button', { name: electionRole }).first().click();
    await page.getByRole('button', { name: 'Save' }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Save' }).click();
    await documentReady(page);

    // Refresh page with error handling
    await page.waitForTimeout(10000);
    try {
        await page.reload({ waitUntil: 'domcontentloaded' });
        await documentReady(page);
        await page.getByLabel('Office').waitFor({ state: 'visible', timeout: 30000 });
        await expect(await page.getByLabel('Office').inputValue()).toBe(electionRole);
    } catch (error) {
        console.log('Page reload failed, trying navigation instead...');
        const currentUrl = page.url();
        await page.goto(currentUrl, { waitUntil: 'domcontentloaded' });
        await documentReady(page);
        await page.getByLabel('Office').waitFor({ state: 'visible', timeout: 30000 });
        await expect(await page.getByLabel('Office').inputValue()).toBe(electionRole);
    }
});

// Setup reporting for why statement test
const whyStatementCaseId = 48;
setupTestReporting(test, whyStatementCaseId);

test('Update Your Why Statement', async ({ page }) => {
    const newWhyStatement = generateTimeStamp() + ' Statement';
    // Update Your Why Statement
    await page.getByPlaceholder('EXAMPLE: I have 5 years of').clear();
    await page.getByPlaceholder('EXAMPLE: I have 5 years of').fill(newWhyStatement);
    await page.getByRole('button', { name: 'Save' }).nth(2).click();
    await documentReady(page);
    
    try {
        await page.reload();
        await documentReady(page);
        await page.getByText(newWhyStatement).isVisible();
    } catch (error) {
        console.log('Page reload failed, trying navigation instead...');
        const currentUrl = page.url();
        await page.goto(currentUrl);
        await documentReady(page);
        await page.getByText(newWhyStatement).isVisible();
    }
});

const funFactsCaseId = 49;
setupTestReporting(test, funFactsCaseId);

test('Update Fun Facts about Yourself', async ({ page }) => {
    const newFunFacts = generateTimeStamp() + ' Fun Fact';

    await page.getByPlaceholder('EXAMPLE: In my free time, I').clear();
    await page.getByPlaceholder('EXAMPLE: In my free time, I').fill(newFunFacts);
    await page.getByRole('button', { name: 'Save' }).nth(3).click();
    await documentReady(page);
    
    try {
        await page.reload();
        await documentReady(page);
        await page.getByText(newFunFacts).isVisible();
    } catch (error) {
        console.log('Page reload failed, trying navigation instead...');
        const currentUrl = page.url();
        await page.goto(currentUrl);
        await documentReady(page);
        await page.getByText(newFunFacts).isVisible();
    }
});

// Setup reporting for opponent test
const opponentCaseId = 50;
setupTestReporting(test, opponentCaseId);

test('Add Opponent', async ({ page }) => {
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

    // Refresh page and confirm saved opponent data with error handling
    try {
        await page.reload();
        await documentReady(page);
        await page.getByText(opponent, { exact: true }).isVisible();
    } catch (error) {
        console.log('Page reload failed, trying navigation instead...');
        const currentUrl = page.url();
        await page.goto(currentUrl);
        await documentReady(page);
        await page.getByText(opponent, { exact: true }).isVisible();
    }
});