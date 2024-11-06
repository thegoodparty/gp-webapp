import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { coreNav, checkButtons, checkImgAltText } from '@helpers';
import { addTestResult } from '@testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Verify Campaign Tools page', async ({ page }) => {
    const caseId = 4;

    const pageTitle = /Campaign Tools/;
    const pageHeader = /Supercharge your local campaign/;
    const pageButtons = [
        'Get Started', 
        'Book a free demo', 
        'Get free tools',
        'Interactive demo'
    ];
    const pageImgAltText = [
        'run for office', 
        'content', 
        'GoodParty'
    ];

    try {
        await page.goto('/');
        await coreNav(page, 'nav-campaign-tools');

        // Verify page title
        await expect(page).toHaveTitle(pageTitle);

        // Verify page contents
        await expect(page.getByText(pageHeader)).toBeVisible();

        // Verify page buttons
        await checkButtons(page, pageButtons);

        // Verify page images with alt text
        await checkImgAltText(page, pageImgAltText);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});
