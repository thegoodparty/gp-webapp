import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { userData } from 'helpers/dataHelpers';
import { checkButtons, checkImgAltText, documentReady } from "helpers/domHelpers";
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { TEST_IDS } from 'constants/testIds';

test.beforeEach(async ({ page }) => {
    await page.goto("/volunteer");
    await documentReady(page);
});
    
setupMultiTestReporting(test, {
    'Verify For Voters / Volunteer page': TEST_IDS.FOR_VOTERS_VOLUNTEER
});

test('Verify For Voters / Volunteer page', async ({ page }) => {
    const pageTitle = /Get Involved/;
    const pageHeader = /Turn dissatisfaction into action/;
    const pageButtons = [
        'Start taking action',
        'Get Involved'
    ];
    const pageImgAltText = [
        'megaphone', 'Whatever you can do!', 'Help with your creativity!',
        'Connect and make friends', 'Real action = real electoral results', 'Sal Davis',
        'Terry Vo', 'Kieryn McCann', 'Level up', 'Networking', 'Fun perks', 'Real Impact', 'GoodParty'
    ];
    const volunteerButton = /Start taking action/
    const volunteerConfirm = /Thank you! we will be in touch soon./

    // Verify page title
    await expect(page).toHaveTitle(pageTitle, { timeout: 5000 });

    // Verify page contents
    await expect(page.getByText(pageHeader)).toBeVisible();

    // Verify page buttons
    await checkButtons(page, pageButtons);

    // Verify page images with alt text
    await checkImgAltText(page, pageImgAltText);

    // Verify volunteer form
    await page.locator("input[name='First Name']").fill(userData.firstName);
    await page.locator("input[name='Last Name']").fill(userData.lastName);
    await page.locator("input[name='phone']").fill(userData.phoneNumber);
    await page.locator("input[name='email']").fill(userData.email);
    await page.locator("input[type='checkbox']").click();
    await page.locator('button', { hasText: volunteerButton }).click();
    await expect(page.getByText(volunteerConfirm)).toBeVisible({ timeout: 30000 });

    // Locate all expandable sections
    const expandables = page.getByTestId('faq-expandable');
    const count = await expandables.count();

    // Loop through each FAQ section and expand it
    for (let i = 0; i < count; i++) {
        const expandButton = expandables.nth(i).locator('button[aria-label="expand"]');
        await expect(expandButton).toHaveAttribute('aria-label', 'expand');
        await expandButton.click();
        const collapseButton = expandables.nth(i).locator('button[aria-label="collapse"]');
        await expect(collapseButton).toBeVisible();
    }
});
