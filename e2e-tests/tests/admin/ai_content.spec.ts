import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { documentReady } from 'helpers/domHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'admin-auth.json',
});

test('Verify admin user can access AI Content page', async ({page}) => {
    const caseId = 29;

    try {
        await page.goto('/admin/ai-content');
        await documentReady(page);
    
        // Verify Search input
        await page.getByRole('heading', { name: 'AI Content' }).isVisible();
        
        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);    
    }
});