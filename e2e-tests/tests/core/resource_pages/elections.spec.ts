import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { checkImgAltText, documentReady } from "helpers/domHelpers";
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
import * as fs from 'fs';

const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.describe.serial('Elections page', () => {
    test.skip(
        !process.env.BASE_URL?.match(/^https?:\/\/(dev\.|qa\.|)goodparty\.org/),
        'Skipping elections page tests on non-production environments'
    );

    test('Verify Explore Offices page', async ({ page }) => {
        const caseId = 7;
        const pageTitle = /Election Research/;
        const pageHeader = /Explore elections in your community/;
        const pageImgAltText = [
            'map', 'Dashboard', 'GoodParty.org AI can help you', 'Carlos Rousselin', 'Breanna Stott', 'Victoria Masika'
        ];

        try {
            await page.goto("/elections");
            await documentReady(page);
            // Verify page title
            await expect(page).toHaveTitle(pageTitle);

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

    test('Verify State-level Election page', async ({ page }) => {
        const caseId = 92;
        const pageTitle = /Run for California state office/;
        const pageHeader = /California state elections/;
        const countyElectionsHeader = /Explore county elections in California/;
        const testElection = /Davis/;

        try {
            await page.goto("/elections/ca");
            await documentReady(page);

            // Verify page title
            await expect(page).toHaveTitle(pageTitle);

            // Verify page contents
            await expect(page.getByText(pageHeader)).toBeVisible();
            await expect(page.getByRole('link', { name: /Governor/ }).first()).toBeVisible();
            await expect(page.getByText(countyElectionsHeader)).toBeVisible();
            await expect(page.getByRole('link', { name: testElection, exact: true })).toBeVisible();

            // Report test results
            await addTestResult(runId, caseId, 1, 'Test passed');
        } catch (error) {
            await handleTestFailure(page, runId, caseId, error);    
        }
    });

    test('Verify County-level Election page', async ({ page }) => {
        const caseId = 93;
        const pageTitle = /Run for Dublin, CA office/;
        const pageHeader = /Dublin elections/;
        const testRole = /City Legislature/;
        const fastFactsHeader = /Dublin Fast facts/;
        
        try {
            await page.goto("/elections/ca/dublin");
            await documentReady(page);

            // Verify page title
            await expect(page).toHaveTitle(pageTitle);

            // Verify page contents
            await expect(page.getByText(pageHeader)).toBeVisible();
            await expect(page.getByRole('link', { name: testRole }).first()).toBeVisible();
            await expect(page.getByText(fastFactsHeader)).toBeVisible();

            // Report test results
            await addTestResult(runId, caseId, 1, 'Test passed');
        } catch (error) {
            await handleTestFailure(page, runId, caseId, error);    
        }
    });

    test('Verify Municipal-level Election page', async ({ page }) => {
        const caseId = 94;
        const pageTitle = /Run for Beverly township/;
        const pageHeader = /Beverly township elections/;
        const testRole = /Parks and Recreation District/;
        const fastFactsHeader = /Beverly township fast facts/;

        try {
            await page.goto("/elections/il/adams-county/beverly-township");
            await documentReady(page);

            // Verify page title
            await expect(page).toHaveTitle(pageTitle);

            // Verify page contents
            await expect(page.getByText(pageHeader)).toBeVisible();
            await expect(page.getByRole('link', { name: testRole }).first()).toBeVisible();
            await expect(page.getByText(fastFactsHeader)).toBeVisible();

            // Report test results
            await addTestResult(runId, caseId, 1, 'Test passed');
        } catch (error) {
            await handleTestFailure(page, runId, caseId, error);    
        }
    });
});
