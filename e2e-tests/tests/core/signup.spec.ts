import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'auth.json',
});

test('Onboarding', async ({page}) => {
    const caseId = 18;
    // Test verifies that registration was successful during global setup phase
    try {
        await page.goto('/profile', {waitUntil: "commit"});
        await page.waitForLoadState('networkidle');
        await page.locator("[data-testid='personal-first-name']").isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});