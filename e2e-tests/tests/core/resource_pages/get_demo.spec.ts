import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { checkImgAltText, documentReady } from "helpers/domHelpers";
import { setupTestReporting } from 'helpers/testrailHelper';

test.beforeEach(async ({ page }) => {
    await page.goto("/get-a-demo");
    await documentReady(page);
});

// Setup reporting for get demo test
const getDemoCaseId = 5;
setupTestReporting(test, getDemoCaseId);

test('Verify Get a Demo page', async ({ page }) => {
    const pageTitle = /Book a Demo/;
    const pageHeader = /Get a demo of GoodParty.org's free tools for independent and 3rd party candidates/;
    const pageImgAltText = ['Jared and Rob', 'Lisa'];
    const hubSpotLocator = page.locator(`iframe[title="Book a Meeting"]`);

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
});
