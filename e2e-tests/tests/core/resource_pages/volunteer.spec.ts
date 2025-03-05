import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { coreNav } from 'helpers/navHelpers';
import { userData } from 'helpers/dataHelpers';
import { checkButtons, checkImgAltText } from "helpers/domHelpers";
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.beforeEach(async ({ page }) => {
    await page.goto("/volunteer");
    await page.waitForLoadState('networkidle');
});

test('Verify Explore Offices page', async ({ page }) => {
    const caseId = 8;

    const pageTitle = /Get Involved/;
    const pageHeader = /Turn dissatisfaction into action/;
    const pageButtons = [
        'Start taking action',
        'Get Involved',
        'Join our Discord',
        'Schedule info session'
    ];
    const pageImgAltText = [
        'megaphone', 'Whatever you can do!', 'Help with your creativity!', 
        'Connect and make friends', 'Real action = real electoral results', 'Sal Davis', 
        'Terry Vo', 'Kieryn McCann', 'Level up', 'Networking', 'Fun perks', 'Real Impact', 'discord', 'GoodParty'
    ];
    const volunteerButton = /Start taking action/
    const volunteerConfirm = /Thank you! we will be in touch soon./
    const volunteerError = /Error submitting your form. Please refresh and try again./

    try {
        // Verify page title
        await expect(page).toHaveTitle(pageTitle, { timeout: 5000 });

        // Verify page contents
        await expect(page.getByText(pageHeader)).toBeVisible();

        // Verify page buttons
        await checkButtons(page, pageButtons);

        // Verify page images with alt text
        await checkImgAltText(page, pageImgAltText);

        // Verify volunteer form
        await page.locator("input[name='First Name']").fill(userData.firstName);
        await page.locator("input[name='Last Name']").fill(userData.lastName);
        await page.locator("input[name='phone']").fill(userData.phoneNumber);
        await page.locator("input[name='email']").fill(userData.email);
        await page.locator("input[type='checkbox']").click();
        await page.locator('button', { hasText: volunteerButton}).click();
        try { 
            // The volunteer sign-up form works on dev/qa/prod
            await expect(page.getByText(volunteerConfirm)).toBeVisible();
        } catch (e) { 
            // On Vercel, this form does not work, so this checks that a submission was at least attempted
            await expect(page.getByText(volunteerError)).toBeVisible();
        }

        // Locate all expandable sections
        const expandables = page.getByTestId('faq-expandable');
        const count = await expandables.count();

        // Loop through each FAQ section and expand it
        for (let i = 0; i < count; i++) {
            const expandButton = expandables.nth(i).locator('button[aria-label="expand"]');
            await expect(expandButton).toHaveAttribute('aria-label', 'expand');
            await expandButton.click();

            // Verify the section is expanded by checking the button changes to 'collapse'
            const collapseButton = expandables.nth(i).locator('button[aria-label="collapse"]');
            await expect(collapseButton).toBeVisible();
        }

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});
