import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { coreNav } from 'helpers/navHelpers';
import { checkButtons, checkImgAltText, documentReady } from "helpers/domHelpers";
import { setupTestReporting } from 'helpers/testrailHelper';

test.beforeEach(async ({ page }) => {
    await page.goto("/run-for-office");
    await documentReady(page);
});

// Setup reporting for campaign tools test
const campaignToolsCaseId = 4;
setupTestReporting(test, campaignToolsCaseId);

test('Verify Campaign Tools page', async ({ page }) => {
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

    // Verify page title
    await expect(page).toHaveTitle(pageTitle, { timeout: 5000 });

    // Verify page contents
    await expect(page.getByText(pageHeader)).toBeVisible();

    // Verify page buttons
    await checkButtons(page, pageButtons);

    // Verify page images with alt text
    await checkImgAltText(page, pageImgAltText);
});
