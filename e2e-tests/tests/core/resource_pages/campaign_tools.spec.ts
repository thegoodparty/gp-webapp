import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { coreNav} from 'helpers/navHelpers';
import { checkButtons, checkImgAltText } from "helpers/domHelpers";
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.beforeEach(async ({ page }) => {
    await page.goto("/run-for-office")
});

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
        // Verify page title
        await expect(page).toHaveTitle(pageTitle, { timeout: 5000 });

        // Verify page contents
        await expect(page.getByText(pageHeader)).toBeVisible();

        // Verify page buttons
        await checkButtons(page, pageButtons);

        // Verify page images with alt text
        await checkImgAltText(page, pageImgAltText);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}}`);
    }
});
