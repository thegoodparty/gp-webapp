import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { appNav } from 'helpers/navHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { createAccount, deleteAccount } from 'helpers/accountHelpers';
import { generateTimeStamp } from 'helpers/dataHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.beforeEach(async ({ page }) => {
    const testZip = '94066';
    const role = 'San Bruno City Council';
    await createAccount(page, 'live', true, testZip, role);
});

test.afterEach(async ({ page }) => {
    await deleteAccount(page);
});

test('Update Campaign Details', async ({ page }) => {
    const caseId = 46;
    await skipNonQA(test);

    const newCampaignCommittee = generateTimeStamp() + ' Committee';
    const newOccupation = generateTimeStamp() + ' Occupation';
    const newWebsite = 'http://www.' + generateTimeStamp() + '.com/'
    const newParty = 'Other';

    try {
        await appNav(page, 'Campaign Details');

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
        await page.reload({ waitUntil: 'domcontentloaded' });

        // Confirm new campaign details are saved
        await expect(page.getByPlaceholder('Campaign Committee')).toHaveValue(newCampaignCommittee);
        await expect(page.getByLabel('Occupation *')).toHaveValue(newOccupation);
        await expect(page.getByLabel('Campaign website')).toHaveValue(newWebsite);
        await expect(page.getByRole('combobox')).toHaveValue(newParty);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-campaign-details${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});

test('Update Office Details', async ({ page }) => {
    const caseId = 47;
    await skipNonQA(test);

    try {
        await appNav(page, 'Campaign Details');

        // Verify user is on campaign details page
        await expect(page.getByRole('heading', { name: 'Campaign Details' })).toBeVisible();

        // Determine current office details and new state to select
        const newOfficeZip = '10001';
        const oldOfficeState = await page.getByLabel('State').inputValue();
        const oldOfficeTitle = await page.getByLabel('Office').inputValue();

        // Select new office location
        await page.getByRole('button', { name: 'Edit Office Details' }).click();
        await expect(page.locator('div').filter({ hasText: /^Loading Races$/ })).toBeHidden();
        await page.getByRole('button').first().click();
        await page.getByRole('textbox').fill(newOfficeZip);
        await page.getByRole('button', { name: 'Save' }).click();

        // Wait for new office location results
        await expect(page.locator('div').filter({ hasText: /^Loading Races$/ })).toBeHidden();

        // Select first local office listing
        const officeSelection = page.getByRole('button', { name: 'Local' }).first();
        await officeSelection.scrollIntoViewIfNeeded();
        await officeSelection.click();
        const modal = page.locator('div').filter({ hasText: 'What office are you' }).nth(2);
        await modal.evaluate((element) => {
            element.scrollTop = element.scrollHeight;
        });
        await page.getByRole('button', { name: 'Save' }).click();

        // Confirm new office details
        await expect
            .poll(async () => await page.getByLabel('State').inputValue())
            .not.toBe(oldOfficeState);
        const newOfficeTitle = await page.getByLabel('Office').inputValue();
        await expect(oldOfficeTitle).not.toEqual(newOfficeTitle);
        await expect(await page.getByLabel('Office').inputValue()).toBe(newOfficeTitle);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-office-details${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});

test('Update Your Why Statement', async ({ page }) => {
    const caseId = 48;
    await skipNonQA(test);

    const newWhyStatement = generateTimeStamp() + ' Statement';

    try {
        await appNav(page, 'Campaign Details');

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
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-why-statement${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});


test('Update Fun Facts about Yourself', async ({ page }) => {
    const caseId = 49;
    await skipNonQA(test);

    const newFunFacts = generateTimeStamp() + ' Fun Fact';

    try {
        await appNav(page, 'Campaign Details');

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
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-fun-facts${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});

test('Add/Edit/Delete Opponent', async ({ page }) => {
    const caseId = 50;
    await skipNonQA(test);

    const opponent = generateTimeStamp() + ' Opponent';
    const opponentDescription = generateTimeStamp() + ' Opponent Description';
    const newOpponent = generateTimeStamp() + ' New Opponent';
    const newOpponentDescription = generateTimeStamp() + ' New Opponent Description';

    try {
        await appNav(page, 'Campaign Details');

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
        // Capture screenshot on error
        const screenshotPath = `screenshots/test-failure-opponent-data${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});