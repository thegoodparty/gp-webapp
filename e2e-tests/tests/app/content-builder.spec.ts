import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';
import { prepareTest } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';

const SECOND = 1000;

test.use({
    storageState: 'auth.json',
});

test.beforeEach(async ({ page, browser }) => {
    await prepareTest('user', '/dashboard/content', 'Content Builder', page, browser);
});

setupMultiTestReporting(test, {
    'Generate content with Content Builder': TEST_IDS.GENERATE_CAMPAIGN_ASSETS
});

test('Generate content with Content Builder', async ({ page }) => {
    try {
        const testTemplate1 = /Voter Registration Drive Email/;
        const testTemplate2 = /General Interview Prep/;
        await documentReady(page);

        try {
            await page.waitForFunction(() => {
                const loadingElements = document.querySelectorAll('[class*="loading"], [class*="Loading"], .MuiCircularProgress-root');
                return loadingElements.length === 0;
            }, { timeout: 30 * SECOND });
        } catch (error) {
            console.log('Loading state check timed out, continuing...');
        }
    
        await expect(page.getByRole('button', { name: /Generate/ })).toBeVisible({ timeout: 30 * SECOND });
        await page.getByRole('button', { name: /Generate/ }).click();
        await expect(page.getByRole('heading', { name: 'Select a Template' })).toBeVisible();
        await expect(page.getByRole('button', { name: testTemplate1 })).toBeVisible();
        await page.getByRole('button', { name: testTemplate1 }).click();
        await documentReady(page);
        await expect(page.getByText(testTemplate1)).toBeVisible({ timeout: 30 * SECOND });
        await page.getByRole('button', { name: /Generate/ }).click();
        await expect(page.getByRole('heading', { name: 'Select a Template' })).toBeVisible();
        await expect(page.getByRole('button', { name: testTemplate2 })).toBeVisible();
        await page.getByRole('button', { name: testTemplate2 }).click();
        await documentReady(page);
        await expect(page.getByText(testTemplate2)).toBeVisible({ timeout: 30 * SECOND });
    } catch (error) {
        // Log current page state before re-throwing
        try {
            const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
            console.log('=== TEST ERROR - CURRENT PAGE HEADINGS ===');
            console.log('Page URL:', page.url());
            if (headings.length > 0) {
                headings.forEach((heading, index) => {
                    console.log(`Heading ${index + 1}: "${heading}"`);
                });
            } else {
                console.log('No headings found on page');
            }
            console.log('==========================================');
        } catch (headingError) {
            console.log('Failed to capture headings during error:', headingError);
        }
        throw error;
    }
});