import { test, expect } from '@playwright/test';
import { coreNav, checkButtons, checkImgAltText, userData } from '../../../helpers';
const { addTestResult } = require('../../../testrailHelper');
const fs = require('fs');
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify Explore Offices page', async ({ page }) => {
    const caseId = 8;

    const pageTitle = /Get Involved/;
    const pageHeader = /Turn dissatisfaction into action/;
    const pageButtons = [
        '#volunteer-hero-form-submit',
        '#cta-dissatisfaction',
        '[id="cta-Whatever you can do!"]',
        '[id="cta-Connect and make friends"]',
        '[id="cta-Real action = real electoral results"]',
        '#cta-benefits',
        '#cta-discord',
        '[id="from community"]',
        '#schedule-info-session'
    ];

    const pageImgAltText = [
        'megaphone', 'Whatever you can do!', 'Help with your creativity!', 
        'Connect and make friends', 'Real action = real electoral results', 'Sal Davis', 
        'Terry Vo', 'Kieryn McCann', 'Level up', 'Networking', 'Fun perks', 'Real Impact', 'discord', 'GoodParty'
    ];

    try {
        await page.goto('/');
        await coreNav(page, '#nav-nav-volunteer');

        // Verify page title
        await expect(page).toHaveTitle(pageTitle);

        // Verify page contents
        await expect(page.getByText(pageHeader)).toBeVisible();

        // Verify page buttons
        await checkButtons(page, pageButtons);

        // Verify page images with alt text
        await checkImgAltText(page, pageImgAltText);

        // Verify volunteer form
        await page.locator('#\\:r0\\:').fill(userData.firstName);
        await page.locator('#\\:r1\\:').fill(userData.lastName);
        await page.locator('#\\:r2\\:').fill(userData.phoneNumber);
        await page.locator('#\\:r3\\:').fill(userData.email);
        await page.locator('.PrivateSwitchBase-input').click();

        await page.locator('#volunteer-hero-form-submit').click();

        await expect(page.getByText('Thank you! we will be in touch soon.')).toBeVisible();

        // Locate all expandable sections
        const expandables = page.locator('.bg-slate-200.cursor-pointer');
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
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});
