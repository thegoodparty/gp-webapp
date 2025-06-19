import 'dotenv/config';
import { test } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';

test.use({
    storageState: 'auth.json',
});

// Setup reporting for onboarding test
const onboardingCaseId = 18;
setupTestReporting(test, onboardingCaseId);

test('Onboarding', async ({ page }) => {
    // Test verifies that registration was successful during global setup phase
    await page.goto('/profile');
    await documentReady(page);
    await page.locator("[data-testid='personal-first-name']").isVisible();
});