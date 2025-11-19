import { test, expect } from '@playwright/test';
import { AccountHelper } from 'src/helpers/account.helper';
import { NavigationHelper } from 'src/helpers/navigation.helper';
import { CleanupHelper } from 'src/helpers/cleanup.helper';

test.describe('Upgrade Pro Candidate Test Account', () => {
    test.use({ storageState: 'playwright/.auth/user2.json' });

    test.beforeEach(async ({ page }) => {
        await NavigationHelper.navigateToPage(page, "/dashboard/upgrade-to-pro");
        await NavigationHelper.dismissOverlays(page);
      });
    
      test.afterEach(async ({ page }, testInfo) => {
        await CleanupHelper.takeScreenshotOnFailure(page, testInfo);
        await CleanupHelper.clearBrowserData(page);
        await CleanupHelper.cleanupTestData(page);
      });
  
    test('Should upgrade pro candidate test account', async ({ page }) => {
      await AccountHelper.upgradeToPro(page);
      // Header should display "GoodParty.org PRO" logo
      await expect(page.getByRole('link', { name: 'GoodParty.org PRO' })).toBeVisible({timeout: 30000});
  });
});