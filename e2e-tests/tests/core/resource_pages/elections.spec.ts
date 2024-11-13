import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { coreNav, checkImgAltText } from '@helpers';
import { addTestResult } from '@testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify Explore Offices page', async ({ page }) => {
    const caseId = 7;

    const pageTitle = /Election Research/;
    const pageHeader = /Explore elections in your community/;
    const pageImgAltText = [
        'map', 'Dashboard', 'GoodParty.org AI can help you', 'Carlos Rousselin', 'Breanna Stott', 'Victoria Masika'
    ];

    try {
        await page.goto(process.env.BASE_URL);
        await coreNav(page, 'nav-explore-offices');

        // Waits for page to load completely
        await page.waitForLoadState('networkidle');

        // Verify page title
        await expect(page).toHaveTitle(pageTitle, { timeout: 5000 });

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
