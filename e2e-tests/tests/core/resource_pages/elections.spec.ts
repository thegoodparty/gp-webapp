import { test, expect } from '@playwright/test';
import { coreNav, checkImgAltText } from '../../../helpers';
const { addTestResult } = require('../../../testrailHelper');
const fs = require('fs');
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify Explore Offices page', async ({ page }) => {
    const caseId = 7;

    const pageTitle = /Election Research/;
    const pageHeader = /Explore elections in your community/;
    const pageImgAltText = [
        'map', 'Dashboard', 'GoodParty.org AI can help you', 'Carlos Rousselin', 'Breanna Stott', 'Victoria Masika'
    ];

    try {
        await page.goto('/');
        await coreNav(page, '#nav-nav-explore-offices');

        // Verify page title
        await expect(page).toHaveTitle(pageTitle);

        // Verify page contents
        await expect(page.getByText(pageHeader)).toBeVisible();

        // Verify page images with alt text
        await checkImgAltText(page, pageImgAltText);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});
