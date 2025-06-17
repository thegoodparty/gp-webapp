import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';

const pageTitle = /GoodParty.org/
const bannerText = /Join the GoodParty.org Community on Circle/

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await documentReady(page);
});

// Setup reporting for homepage test
const homepageCaseId = 1;
setupTestReporting(test, homepageCaseId);

test('Verify Homepage', async ({ page }) => {
  // Verify page title
  await expect(page).toHaveTitle(pageTitle);

  // Verify navbar and footer presence
  await expect(page.getByTestId('navbar')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();

  // Verify banner
  await expect(page.getByText(bannerText)).toBeVisible();
});