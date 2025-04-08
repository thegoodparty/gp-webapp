import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { checkImgAltText } from "helpers/domHelpers";
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.beforeEach(async ({ page }) => {
    await page.goto("/elections", {waitUntil: "commit"})
});

test('Verify Explore Offices page', async ({ page }) => {
    const caseId = 7;

    const pageTitle = /Election Research/;
    const pageHeader = /Explore elections in your community/;
    const pageImgAltText = [
        'map', 'Dashboard', 'GoodParty.org AI can help you', 'Carlos Rousselin', 'Breanna Stott', 'Victoria Masika'
    ];

    try {
        // Verify page title
        await expect(page).toHaveTitle(pageTitle, { timeout: 5000 });

        // Verify page contents
        await expect(page.getByText(pageHeader)).toBeVisible();

        // Verify page images with alt text
        await checkImgAltText(page, pageImgAltText);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);    
    }
});
