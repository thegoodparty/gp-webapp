import 'dotenv/config';
import { test } from '@playwright/test';
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';
import { TEST_IDS } from 'constants/testIds';

test.use({
    storageState: 'auth.json',
});

setupMultiTestReporting(test, {
    'Verify onboarding': TEST_IDS.REGISTRATION_FLOW
});

test('Verify onboarding', async ({ page }) => {
    // Test verifies that registration was successful during global setup phase
    await page.goto('/profile');
    await documentReady(page);
    await page.locator("[data-testid='personal-first-name']").isVisible();
});