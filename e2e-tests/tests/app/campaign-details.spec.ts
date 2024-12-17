import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { appNav } from 'helpers/navHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { loginAccount } from 'helpers/accountHelpers';
import { generateTimeStamp } from 'helpers/dataHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

const testAccountState = process.env.TEST_USER_LOCAL_PRO;
const testStatePassword = process.env.TEST_USER_LOCAL_PRO_PASSWORD;

test('Update Campaign Details', async ({ page }) => {
    const caseId = 46;
    await skipNonQA(test);

    const newCampaignCommittee = generateTimeStamp() + ' Committee';
    const newOccupation = generateTimeStamp() + ' Occupation';
    const newWebsite = 'http://www.' + generateTimeStamp() + '.com/'

    try {
        await loginAccount(page, true, testAccountState, testStatePassword);
        await appNav(page, 'Campaign Details');

        // Verify user is on campaign details page
        await expect(page.getByRole('heading', { name: 'Campaign Details' })).toBeVisible();

        // Gather existing campaign details and ensure that they differ from new details
        const oldCampaignCommittee = await page.getByPlaceholder('Campaign Committee').inputValue();
        await expect(oldCampaignCommittee).not.toBe(newCampaignCommittee);
        const oldOccupation = await page.getByLabel('Occupation *').inputValue();
        await expect(oldOccupation).not.toBe(newOccupation);
        const oldWebsite = await page.getByLabel('Campaign website').inputValue();
        await expect(oldWebsite).not.toBe(newWebsite);
        const oldParty = await page.getByRole('combobox').inputValue();
        var newParty = '';
        if(oldParty == 'Independent') {
            newParty = 'Other'
        } else {
            newParty = 'Independent'
        }

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
        await loginAccount(page, true, testAccountState, testStatePassword);
        await appNav(page, 'Campaign Details');

        // Verify user is on campaign details page
        await expect(page.getByRole('heading', { name: 'Campaign Details' })).toBeVisible();

        // Determine current office details and new state to select
        var newOfficeState = ''
        var newOfficeZip = ''
        var oldOfficeZip = ''
        const oldOfficeState = await page.getByLabel('State').inputValue();
        const oldOfficeTitle = await page.getByLabel('Office').inputValue();
        if(oldOfficeState == 'CA') {
            newOfficeState == 'NY'
            newOfficeZip = '10001'
            oldOfficeZip = '94066'
        } else {
            newOfficeState =='CA'
            newOfficeZip = '94066'
            oldOfficeZip = '10001'
        }

        // Select new office location
        await page.getByRole('button', { name: 'Edit Office Details' }).click();
        await expect(page.locator('div').filter({ hasText: /^Loading Races$/ })).toBeHidden({timeout:15000});
        await page.getByRole('button').first().click();
        await page.getByRole('textbox').fill(newOfficeZip);
        await page.getByRole('button', { name: 'Save' }).click();

        // Wait for new office location results
        await expect(page.locator('div').filter({ hasText: /^Loading Races$/ })).toBeHidden({timeout:15000});

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
        const screenshotPath = `screenshots/test-failure-campaign-details${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}\nScreenshot: ${screenshotPath}`);
    }
});