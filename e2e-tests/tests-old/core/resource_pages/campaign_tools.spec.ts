import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { checkButtons, checkImgAltText, documentReady } from "helpers/domHelpers";
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { TEST_IDS } from 'constants/testIds';

test.beforeEach(async ({ page }) => {
    await page.goto("/run-for-office");
    await documentReady(page);
});

setupMultiTestReporting(test, {
    'Verify Campaign Tools page': TEST_IDS.FOR_CANDIDATES_CAMPAIGN_TOOLS
});

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
