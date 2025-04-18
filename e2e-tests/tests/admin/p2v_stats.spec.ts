import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { documentReady } from 'helpers/domHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'admin-auth.json',
});

test('Verify admin user can access P2V Stats page', async ({page}) => {
    const caseId = 30;

    try {
        await page.goto('/admin/p2v-stats');
        await documentReady(page);

        // Verify P2V Stats page
        page.getByRole('heading', { name: 'P2V Stats' }).isVisible();
        page.getByRole('button', { name: 'Refresh P2V Stats' }).isVisible();
        
        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);    
    }
});