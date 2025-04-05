import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { checkImgAltText } from "helpers/domHelpers";
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.beforeEach(async ({ page }) => {
    await page.goto("/get-a-demo", {waitUntil: "commit"});
    await page.waitForLoadState('networkidle');
});

test('Verify Get a Demo page', async ({ page }) => {
    const caseId = 5;

    const pageTitle = /Book a Demo/;
    const pageHeader = /Get a demo of GoodParty.org's free tools for independent and 3rd party candidates/;
    const pageImgAltText = ['Jared and Rob', 'Lisa'];
    const hubSpotLocator = page.locator(`iframe[title="Book a Meeting"]`);

    try {
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

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}}`);
    }
});
