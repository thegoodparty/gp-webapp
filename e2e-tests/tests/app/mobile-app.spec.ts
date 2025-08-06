import 'dotenv/config';
import { expect, test } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { appNav } from '@helpers';
import { prepareTest } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';

test.describe('Mobile viewport tests - App pages', () => {
    test.use({
        storageState: 'auth.json',
        viewport: { width: 375, height: 667 }
    });

    setupTestReporting(test, TEST_IDS.MOBILE_VIEW);

    test.skip('Verify app pages in mobile view', async ({ page }) => {
        await prepareTest('user', '/dashboard', 'Campaign progress', page);

        const verifyPage = async (navItem: string, expectedHeading: string) => {
            await appNav(page, navItem, true);
            await page.waitForLoadState('networkidle');
            await expect(page.getByRole('heading', { name: expectedHeading }))
                .toBeVisible({ timeout: 10000 });
        };

        await verifyPage('AI Assistant', 'AI Assistant');
        await expect(page.getByPlaceholder('Ask me anything about your campaign...')).toBeVisible({ timeout: 10000 });
        await verifyPage('Content Builder', 'Content Builder');
        await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible({ timeout: 10000 });
        await appNav(page, 'My Profile', true);
        await expect(page.getByRole('heading', { name: 'Campaign Details' })).toBeVisible();
        await expect(page.getByPlaceholder('Campaign Committee')).toBeVisible();
        await expect(page.getByLabel('Occupation *')).toBeVisible();
        await expect(page.getByLabel('Campaign website')).toBeVisible();
        await expect(page.locator('section').filter({ hasText: 'Campaign Details' }).getByRole('button')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Office Details' })).toBeVisible();
        await expect(page.getByRole('heading', { name: "Who you're running against" })).toBeVisible();
        await expect(page.getByRole('heading', { name: "Fun Fact About Yourself" })).toBeVisible();
        await expect(page.getByRole('heading', { name: "Your Top Issues" })).toBeVisible();
    });
});