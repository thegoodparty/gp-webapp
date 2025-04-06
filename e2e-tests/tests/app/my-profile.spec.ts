import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { generateTimeStamp } from 'helpers/dataHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/campaign-details", {waitUntil: "networkidle"});
});

test('Update Campaign Details', async ({ page }) => {
    const caseId = 46;
    const newCampaignCommittee = generateTimeStamp() + ' Committee';
    const newOccupation = generateTimeStamp() + ' Occupation';
    const newWebsite = 'http://www.' + generateTimeStamp() + '.com/'
    const newParty = 'Other';

    try {
        // Verify user is on campaign details page
        await expect(page.getByRole('heading', { name: 'Campaign Details' })).toBeVisible();

        // Update campaign details
        await page.getByPlaceholder('Campaign Committee').fill(newCampaignCommittee);
        await page.getByLabel('Occupation *').fill(newOccupation);
        await page.getByLabel('Campaign website').fill(newWebsite);
        await page.getByRole('combobox').click();
        await page.getByRole('combobox').selectOption(newParty);

        await page.locator('section').filter({ hasText: 'Campaign Details' }).getByRole('button').click();

        // Refresh page
        await page.reload({ waitUntil: 'networkidle' });

        // Confirm new campaign details are saved
        await expect(page.getByPlaceholder('Campaign Committee')).toHaveValue(newCampaignCommittee);
        await expect(page.getByLabel('Occupation *')).toHaveValue(newOccupation);
        await expect(page.getByLabel('Campaign website')).toHaveValue(newWebsite);
        await expect(page.getByRole('combobox')).toHaveValue(newParty);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        const currentUrl = await page.url();
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}: ${error.stack}`);
    }
});

test('Update Office Details', async ({ page }) => {
    const caseId = 47;
    try {
        // Verify user is on campaign details page
        await expect(page.getByRole('heading', { name: 'Campaign Details' })).toBeVisible();

        // Determine current office details and new state to select
        const newOfficeZip = '94080';
        const oldOfficeTitle = await page.getByLabel('Office').inputValue();
        const electionLevel = 'Local/Township/City';
        const electionDate = '2028-11-10';
        const electionRole = 'Daly City Clerk';

        // Select new office location
        await page.getByRole('button', { name: 'Edit Office Details' }).click();
        await page.getByText('To pull accurate results,').isVisible();
        await page.getByLabel('Zipcode *').fill(newOfficeZip);
        await page.getByRole('combobox').selectOption(electionLevel);
        await page.getByLabel('General Election Date (').fill(electionDate);
        await page.getByLabel('General Election Date (').press('Enter');

        // Wait for new office location results
        await expect(page.locator('div').filter({ hasText: /^Loading Races$/ })).toBeHidden();

        // Select first local office listing
        const officeSelection = page.getByRole('button', { name: electionRole }).first();
        await officeSelection.scrollIntoViewIfNeeded();
        await officeSelection.click();
        await page.getByRole('button', { name: 'Save' }).scrollIntoViewIfNeeded();
        await page.getByRole('button', { name: 'Save' }).click();

        // Confirm new office details
        await page.waitForLoadState('domcontentloaded');
        await page.reload({ waitUntil: 'domcontentloaded' });
        const newOfficeTitle = await page.getByLabel('Office').inputValue();
        await expect(oldOfficeTitle).not.toEqual(newOfficeTitle);
        await expect(await page.getByLabel('Office').inputValue()).toBe(newOfficeTitle);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        const currentUrl = await page.url();
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}: ${error.stack}`);
    }
});

test('Update Your Why Statement', async ({ page }) => {
    const caseId = 48;
    const newWhyStatement = generateTimeStamp() + ' Statement';

    try {
        // Verify user is on campaign details page
        await expect(page.getByRole('heading', { name: 'Campaign Details' })).toBeVisible();

        // Update Your Why Statement
        await page.getByPlaceholder('EXAMPLE: I have 5 years of').clear();
        await page.getByPlaceholder('EXAMPLE: I have 5 years of').fill(newWhyStatement);
        await page.getByRole('button', { name: 'Save' }).nth(2).click();
        await page.waitForLoadState("networkidle");

        // Refresh page
        await page.reload({ waitUntil: 'domcontentloaded' });

        // Confirm saved Why Statement
        await page.getByText(newWhyStatement).isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        const currentUrl = await page.url();
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}: ${error.stack}`);
    }
});


test('Update Fun Facts about Yourself', async ({ page }) => {
    const caseId = 49;
    const newFunFacts = generateTimeStamp() + ' Fun Fact';

    try {
        // Verify user is on campaign details page
        await expect(page.getByRole('heading', { name: 'Campaign Details' })).toBeVisible();

        // Update Your Why Statement
        await page.getByPlaceholder('EXAMPLE: In my free time, I').clear();
        await page.getByPlaceholder('EXAMPLE: In my free time, I').fill(newFunFacts);
        await page.getByRole('button', { name: 'Save' }).nth(3).click();
        await page.waitForLoadState("networkidle");

        // Refresh page
        await page.reload({ waitUntil: 'domcontentloaded' });

        // Confirm saved Why Statement
        await page.getByText(newFunFacts).isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        const currentUrl = await page.url();
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}: ${error.stack}`);
    }
});

test('Add/Edit/Delete Opponent', async ({ page }) => {
    const caseId = 50;
    const opponent = generateTimeStamp() + ' Opponent';
    const opponentDescription = generateTimeStamp() + ' Opponent Description';
    const newOpponent = generateTimeStamp() + ' New Opponent';
    const newOpponentDescription = generateTimeStamp() + ' New Opponent Description';

    try {
        // Verify user is on campaign details page
        await expect(page.getByRole('heading', { name: 'Campaign Details' })).toBeVisible();

        // Add new opponent data
        await page.getByRole('button', { name: 'Add New Opponent' }).click();
        await page.getByLabel('Name *').fill(opponent);
        await page.locator('form').getByRole('combobox').selectOption('Other');
        await page.getByPlaceholder('EXAMPLE: Republican hotel').fill(opponentDescription);
        await page.getByRole('button', { name: 'Add Opponent' }).click();
        await page.getByRole('button', { name: 'Save' }).nth(1).click();
        await page.waitForLoadState("networkidle");

        // Refresh page and confirm saved opponent data
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.getByText(opponent, { exact: true }).isVisible();

        // Edit opponent data
        await page.getByRole('button', { name: 'Edit', exact: true }).click();
        await page.getByLabel('Name *').fill(newOpponent);
        await page.locator('form').getByRole('combobox').selectOption('Independent');
        await page.getByPlaceholder('EXAMPLE: Republican hotel').fill(newOpponentDescription);
        await page.getByRole('button', { name: 'Finish Editing' }).click()
        await page.getByRole('button', { name: 'Save' }).nth(1).click();

        // Refresh page and confirm update to opponent data
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.getByText(newOpponent, { exact: true }).isVisible();

        // Delete opponent data
        await page.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Save' }).nth(1).click();

        // Refresh page and confirm deleted opponent data
        await page.reload({ waitUntil: 'domcontentloaded' });
        await expect(page.getByText(opponent)).toBeHidden();
        await expect(page.getByText(newOpponent)).toBeHidden();
    
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