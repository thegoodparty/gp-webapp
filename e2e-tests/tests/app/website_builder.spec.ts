import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';
import { prepareTest } from 'helpers/accountHelpers';

test.use({
    storageState: 'auth.json',
});

let campaignSlug: string;
let candidateUrl: string;

test.beforeEach(async ({ page, browser }) => {
    await prepareTest('user', '/dashboard/website', 'Create your free website', page, browser);
    
    if (!campaignSlug) {
        try {
            await page.waitForTimeout(2000);
            
            const createButton = page.getByRole('button', { name: /Create your website/ });
            const websiteExists = page.getByText('Your campaign website');
            const createButtonVisible = await createButton.isVisible({ timeout: 5000 }).catch(() => false);
            const websiteExistsVisible = await websiteExists.isVisible({ timeout: 5000 }).catch(() => false);
            
            if (createButtonVisible) {
                // No website exists, create one
                console.log('No website found, creating new website...');
                await createButton.click();
                
                try {
                    await expect(page.getByText('What do you want your custom link to be?')).toBeVisible({ timeout: 30000 });
                } catch (error) {
                    console.log('Expected text not found, checking current page state...');
                    
                    const currentUrl = page.url();
                    if (currentUrl.includes('/dashboard/website')) {
                        await page.reload();
                        await documentReady(page);
                        
                        const newCreateButtonVisible = await createButton.isVisible({ timeout: 5000 }).catch(() => false);
                        const newWebsiteExistsVisible = await websiteExists.isVisible({ timeout: 5000 }).catch(() => false);
                        
                        if (newWebsiteExistsVisible) {
                            console.log('Website was created by another test, extracting slug...');
                            await extractCampaignSlug(page);
                            return;
                        } else if (newCreateButtonVisible) {
                            console.log('Retrying website creation...');
                            await createButton.click();
                            await expect(page.getByText('What do you want your custom link to be?')).toBeVisible({ timeout: 30000 });
                        } else {
                            throw new Error('Unexpected page state after retry');
                        }
                    } else {
                        throw error;
                    }
                }
                
                campaignSlug = await page.getByRole('textbox').first().inputValue();
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
            } else if (websiteExistsVisible) {
                // Website already exists, try to extract the campaign slug
                await extractCampaignSlug(page);
            } else {
                throw new Error('Neither create website button nor existing website found');
            }
        } catch (error) {
            console.error('Failed to handle website setup:', error);
            throw new Error(`Website setup failed: ${error.message}`);
        }
    }
    
    // Validate that we have a valid campaign slug
    if (!campaignSlug) {
        throw new Error('Campaign slug is not available. Website setup may have failed.');
    } else {
        if (process.env.BASE_URL == 'https://qa.goodparty.org/') {
            candidateUrl = `https://candidates-qa.goodparty.org/`;
        } else if (process.env.BASE_URL == 'https://goodparty.org/') {
            candidateUrl = `https://candidates.goodparty.org/`;
        } else {
            candidateUrl = `https://candidates-dev.goodparty.org/`;
        }
    }
});

// Helper function to extract campaign slug
async function extractCampaignSlug(page) {
    console.log('Website already exists, extracting campaign slug...');
    // Navigate to the website to get the slug from the URL
    await page.goto(`${process.env.BASE_URL}/dashboard/website`);
    await documentReady(page);
    
    // Try to find the website link or get the slug from the page
    const websiteLink = page.locator('a[href*="/c/"]').first();
    if (await websiteLink.isVisible()) {
        const href = await websiteLink.getAttribute('href');
        campaignSlug = href?.split('/c/')[1]?.split('/')[0] || href?.split('/c/')[1];
    }
    
    if (!campaignSlug) {
        throw new Error('Could not extract campaign slug from existing website');
    }
    console.log(`Extracted campaign slug: ${campaignSlug}`);
}

const websiteBuilderCaseId = 98;
setupTestReporting(test, websiteBuilderCaseId);

test('Generate New Website', async ({ page }) => {
    await expect(page.getByText('Your campaign website')).toBeVisible();
    await page.goto(`${candidateUrl}/${campaignSlug}`);
    await documentReady(page);
    await expect(page.getByText('Local Solutions, Not Party')).toBeVisible();
});

const websiteDashboardCaseId = 99;
setupTestReporting(test, websiteDashboardCaseId);

test('Verify website dashboard page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Published Your campaign/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Increase visitors/ })).toBeVisible();
});

const websiteFormCaseId = 100;
setupTestReporting(test, websiteFormCaseId);

test('Verify website form submission', async ({ page }) => {
    await page.goto(`${candidateUrl}/${campaignSlug}`);
    await documentReady(page);
    // Fill out form
    await page.getByPlaceholder('John Doe').fill('John Doe');
    await page.getByPlaceholder('john@example.com').fill('john@example.com');
    await page.getByLabel('Phone *').fill('5105555555');
    await page.getByPlaceholder('How can we help you?').fill('How can we help you?');
    await page.getByRole('checkbox').click();
    await page.getByRole('button', { name: 'Send Message' }).click();
    await expect(page.getByText('Thank you for your message!')).toBeVisible({ timeout: 30000 });
    await page.goto(`${process.env.BASE_URL}/dashboard/website`);
    await documentReady(page);
    await expect(page.getByRole('heading', { name: 'Your website form submissions' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'John Doe' }).first()).toBeVisible();
});