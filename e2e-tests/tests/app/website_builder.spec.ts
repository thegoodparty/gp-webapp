import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';
import { authenticateWithTimeout } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';
import { IS_PROD } from 'constants/envConfig';
import { generateWebsiteUrl } from 'helpers/dataHelpers';

const websiteUrl = generateWebsiteUrl();

test.use({
    storageState: 'auth.json',
});

test.describe.serial('Website Builder Tests', () => {
    test.beforeEach(async ({ page }) => {
        try {
            await authenticateWithTimeout(page, '/dashboard/website', 'Your campaign website');
            await documentReady(page);
        } catch (error) {
            console.error('Authentication failed in beforeEach:', error);
            throw error;
        }
    });

    setupMultiTestReporting(test, {
        'Generate New Website': TEST_IDS.GENERATE_NEW_WEBSITE,
        'Verify website dashboard page': TEST_IDS.WEBSITE_DASHBOARD_PAGE,
        'Verify domain purchase flow': TEST_IDS.DOMAIN_PURCHASE_FLOW
    });

    test('Generate New Website', async ({ page }) => {
        if(await page.getByText(/Complete and publish/).isVisible()) {
            await page.getByText(/Complete and publish/).click();
        } else {
            await page.getByText(/Create your website/).click();
        }

        await expect(page.getByText('What do you want your custom link to be?')).toBeVisible({ timeout: 30000 });
        await page.locator('[id="_r_0_"]').fill(websiteUrl);
        await page.getByRole('button', { name: /Next/ }).click();
        await expect(page.getByText('Upload your campaign logo if you have one')).toBeVisible();
        await page.getByRole('button', { name: /Next/ }).click();
        await expect(page.getByText('Choose a color theme')).toBeVisible();
        await page.getByRole('button', { name: /Next/ }).click();
        await expect(page.getByText('Customize the content visitors will see first')).toBeVisible();
        await page.getByRole('button', { name: /Next/ }).click();
        await expect(page.getByText('What is your campaign about?')).toBeVisible();
        await page.getByRole('button', { name: /Next/ }).click();
        await expect(page.getByText('How can voters contact you?')).toBeVisible();
        await page.getByRole('button', { name: /Publish website/ }).click();
        await documentReady(page);
        await expect(page.getByText(/your website is live!/)).toBeVisible();
        await page.getByText(/Done/).click();
        await documentReady(page);
        await expect(page.getByText('Your campaign website')).toBeVisible();
        console.log('Website created successfully');
    });

    test('Verify website dashboard page', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /Published Your campaign/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /Increase visitors/ })).toBeVisible({ timeout: 60000 });
    });

    test.skip(IS_PROD, 'Skipping domain purchase test on production');
    // Affected by 500 server error issue
    test.skip('Verify domain purchase flow', async ({ page }) => {
        await page.getByText(/Add a domain/).click();
        await page.getByRole('button', { name: 'Search' }).click();
        await page.getByText(/.net/).first().click();
        await page.getByRole('button', { name: 'Checkout' }).click();
        await expect(page.getByRole('heading', { name: 'Domain Registration' })).toBeVisible({ timeout: 30000 });
        await page.locator('iframe[name^="__privateStripeFrame"][title="Secure payment input frame"][src*="elements-inner-payment"]').contentFrame().getByPlaceholder('1234 1234 1234').fill('4111 1111 1111 1111');
        await page.locator('iframe[name^="__privateStripeFrame"][title="Secure payment input frame"][src*="elements-inner-payment"]').contentFrame().getByPlaceholder('MM / YY').fill('01 / 30');
        await page.locator('iframe[name^="__privateStripeFrame"][title="Secure payment input frame"][src*="elements-inner-payment"]').contentFrame().getByPlaceholder('CVC').fill('123');
        await page.locator('iframe[name^="__privateStripeFrame"][title="Secure payment input frame"][src*="elements-inner-payment"]').contentFrame().getByPlaceholder('12345').fill('99504');
        await expect(page.getByRole('button', { name: 'Complete Purchase' })).toBeVisible({ timeout: 60000 });
    });
});