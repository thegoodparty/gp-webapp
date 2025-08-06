import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { checkImgAltText, documentReady } from "helpers/domHelpers";
import { setupMultiTestReporting, setupTestReporting } from 'helpers/testrailHelper';
import { TEST_IDS } from 'constants/testIds';

test.describe.serial('Elections page', () => {
    test.skip(
        !process.env.BASE_URL?.match(/^https?:\/\/(dev\.|qa\.|)goodparty\.org/),
        'Skipping elections page tests on non-production environments'
    );

setupMultiTestReporting(test, {
    'Verify Explore Offices page': TEST_IDS.FOR_CANDIDATES_EXPLORE_OFFICES,
    'Verify State-level Election page': TEST_IDS.STATE_ELECTION_PAGE,
    'Verify County-level Election page': TEST_IDS.COUNTY_ELECTION_PAGE,
    'Verify Municipal-level Election page': TEST_IDS.MUNICIPAL_ELECTION_PAGE
});

    test('Verify Explore Offices page', async ({ page }) => {
        const pageTitle = /Election Research/;
        const pageHeader = /Explore elections in your community/;
        const pageImgAltText = [
            'map', 'Dashboard', 'GoodParty.org AI can help you', 'Carlos Rousselin', 'Breanna Stott', 'Victoria Masika'
        ];

        await page.goto("/elections");
        await documentReady(page);
        // Verify page title
        await expect(page).toHaveTitle(pageTitle);

        // Verify page contents
        await expect(page.getByText(pageHeader)).toBeVisible();

        // Verify page images with alt text
        await checkImgAltText(page, pageImgAltText);
    });

    test.skip('Verify State-level Election page', async ({ page }) => {
        const pageTitle = /Run for Office in California/;
        const pageHeader = /California state elections/;
        const countyElectionsHeader = /Explore county elections in California/;
        const testElection = /Davis/;

        await page.goto("/elections/ca");
        await documentReady(page);

        // Verify page title
        await expect(page).toHaveTitle(pageTitle);

        // Verify page contents
        await expect(page.getByText(pageHeader)).toBeVisible();
        await expect(page.getByRole('link', { name: /Governor/ }).first()).toBeVisible();
        await expect(page.getByText(countyElectionsHeader)).toBeVisible();
        await expect(page.getByRole('link', { name: testElection, exact: true })).toBeVisible();
    });

    test('Verify County-level Election page', async ({ page }) => {
        const pageTitle = /Run for Office in Dublin county, California/;
        const pageHeader = /Dublin elections/;
        const testRole = /City Legislature/;
        const fastFactsHeader = /Dublin Fast facts/;

        await page.goto("/elections/ca/dublin");
        await documentReady(page);

        // Verify page title
        await expect(page).toHaveTitle(pageTitle);

        // Verify page contents
        await expect(page.getByText(pageHeader)).toBeVisible();
        await expect(page.getByRole('link', { name: testRole }).first()).toBeVisible();
        await expect(page.getByText(fastFactsHeader)).toBeVisible();
    });

    test('Verify Municipal-level Election page', async ({ page }) => {
        const pageTitle = /Run for Office in Beverly township, Illinois/;
        const pageHeader = /Beverly township elections/;
        const testRole = /Parks and Recreation District/;
        const fastFactsHeader = /Beverly township fast facts/;

        await page.goto("/elections/il/adams-county/beverly-township");
        await documentReady(page);

        // Verify page title
        await expect(page).toHaveTitle(pageTitle);

        // Verify page contents
        await expect(page.getByText(pageHeader)).toBeVisible();
        await expect(page.getByRole('link', { name: testRole }).first()).toBeVisible();
        await expect(page.getByText(fastFactsHeader)).toBeVisible();
    });
});
