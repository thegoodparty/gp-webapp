import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'admin-auth.json',
});

test('Verify admin user can access Top Issues page', async ({page}) => {
    const caseId = 27;

    try {
        await page.goto('/admin/top-issues');
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Add a Top Issue' }).isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');

    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});