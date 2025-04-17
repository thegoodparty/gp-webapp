import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'admin-auth.json',
});

test('Verify admin user can access Pro users w/o voter file page', async ({page}) => {
    const caseId = 31;

    try {
        await page.goto('/admin/pro-no-voter-file');
        await page.waitForLoadState('domcontentloaded');

        // Verify Pro users w/o voter file page
        page.getByRole('heading', { name: 'Pro Users without L2 Data' }).isVisible();
        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);    
    }
});