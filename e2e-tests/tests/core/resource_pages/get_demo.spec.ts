import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { coreNav, checkImgAltText } from '@helpers';
import { addTestResult } from '@testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify Get a Demo page', async ({ page }) => {
    const caseId = 5;

    const pageTitle = /Book a Demo/;
    const pageHeader = /Get a demo of GoodParty.org's free tools for independent and 3rd party candidates/;
    const pageImgAltText = ['Jared and Rob', 'Lisa'];
    const hubSpotLocator = page.locator(`iframe[title="Book a Meeting"]`);
    const calendarDateTitle = /Find a time to meet with Good Party/
    const calendarTimeTitle = /What time works best\?/
    const calendarInfoTitle = /Your information/

    try {
        await page.goto('/');
        await coreNav(page, 'nav-get-demo');

        // Waits for page to load completely
        await page.waitForLoadState('networkidle');

        // Verify page title
        await expect(page).toHaveTitle(pageTitle, { timeout: 5000 });

        // Verify page contents
        await expect(page.getByText(pageHeader)).toBeVisible();

        // Verify page images with alt text
        await checkImgAltText(page, pageImgAltText);

        // Verify HubSpot demo calendar
        await expect(hubSpotLocator).toBeVisible({ timeout: 5000 });
        const frame = await hubSpotLocator.contentFrame();

        if (!frame) {
            throw new Error('Could not access iframe content');
        }

        // Click the first available date within the calendar
        await frame.locator(`text="${calendarDateTitle}"`).isVisible();
        await frame.locator('[data-test-id="available-date"]').first().click({ timeout: 10000 });
        
        // click first available time
        await frame.locator(`text="${calendarTimeTitle}"`).isVisible();
        await frame.locator('[data-test-id="time-picker-btn"]').first().click({ timeout: 10000 });

        // Verify "Your Information" page
        await frame.locator(`text="${calendarInfoTitle}"`).isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});
