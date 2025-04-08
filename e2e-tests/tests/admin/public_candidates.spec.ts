import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'admin-auth.json',
});

test('Verify admin user can access public candidates page', async ({page}) => {
    const caseId = 32;

    try {
        await page.goto('/admin/public-candidates');
        await page.waitForLoadState('networkidle');

        // Verify Public Candidates page
        await page.getByRole('heading', { name: 'Public Candidates' }).isVisible();
        
        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);    
    }
});