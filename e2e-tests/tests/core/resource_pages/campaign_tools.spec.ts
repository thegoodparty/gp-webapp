import { test, expect } from '@playwright/test';
import { coreNav } from '../../../helpers';
const { addTestResult } = require('../../../testrailHelper');
const fs = require('fs');
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify Campaign Tools page', async ({ page }) => {
    const caseId = 4;

    const pageTitle = /Campaign Tools/;
    const pageHeader = /Supercharge your local campaign/;
    const pageButtons = [
        '#hero-get-started', '#hero-demo', '#tools-winning-content', '#tools-data-campaign', 
        '#tools-access-experts', '#tools-volunteer-network', '#tools-resource-library', 
        '#started-card-voter-data', '#started-card-texting-tools', '#started-card-expert-support', 
        '#free-candidate'
    ];
    const pageImgAltText = ['run for office', 'content', 'GoodParty'];

    try {
        await page.goto('/');
        await coreNav(page, '#nav-nav-campaign-tools');

        // Verify page title
        await expect(page).toHaveTitle(pageTitle);

        // Verify page contents
        await expect(page.getByText(pageHeader)).toBeVisible();

        // Verify page buttons
        for (const selector of pageButtons) {
            const buttonLocators = page.locator(selector);
            const count = await buttonLocators.count();

            if (count > 0) {
                await expect(buttonLocators.first()).toBeVisible({ timeout: 5000 });
            } else {
                throw new Error(`No elements found for selector: ${selector}`);
            }
        }

        // Verify page images with alt text
        for (const altText of pageImgAltText) {
            const imgLocators = page.locator(`img[alt="${altText}"]`);
            const count = await imgLocators.count();

            expect(count).toBeGreaterThan(0);
            if (count > 0) {
                await expect(imgLocators.first()).toBeVisible({ timeout: 5000 });
            }
        }

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});
