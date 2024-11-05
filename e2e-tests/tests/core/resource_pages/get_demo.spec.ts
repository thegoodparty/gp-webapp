import { test, expect } from '@playwright/test';
import { coreNav } from '../../../helpers';
const { addTestResult } = require('../../../testrailHelper');
const fs = require('fs');
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify Get a Demo page', async ({ page }) => {
    const caseId = 5;

    const pageTitle = /Book a Demo/;
    const pageHeader = /Get a demo of GoodParty.org's free tools for independent and 3rd party candidates/;
    const pageImgAltText = ['Jared and Rob', 'Lisa'];
    const hubSpotLocator = page.locator(`iframe[title="Book a Meeting"]`);

    try {
        await page.goto('/');
        await coreNav(page, '#nav-nav-get-demo');

        // Verify page title
        await expect(page).toHaveTitle(pageTitle);

        // Verify page contents
        await expect(page.getByText(pageHeader)).toBeVisible();

        // Verify page images with alt text
        for (const altText of pageImgAltText) {
            const imgLocators = page.locator(`img[alt="${altText}"]`);
            const count = await imgLocators.count();

            expect(count).toBeGreaterThan(0);
            if (count > 0) {
                await expect(imgLocators.first()).toBeVisible({ timeout: 5000 });
            }
        }

        // Verify HubSpot demo calendar
        await expect(hubSpotLocator).toBeVisible();
        const frame = await hubSpotLocator.contentFrame();

        if (!frame) {
            throw new Error('Could not access iframe content');
        }

        // Click the first available date within the calendar
        await frame.locator(`text="Find a time to meet with Good Party"`).isVisible();
        await frame.locator('[data-test-id="available-date"]').first().click();
        
        // click first available time
        await frame.locator(`text="What time works best?"`).isVisible();
        await frame.locator('[data-test-id="time-picker-btn"]').first().click();

        // Verify "Your Information" page
        await frame.locator(`text="Your information"`).isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});
