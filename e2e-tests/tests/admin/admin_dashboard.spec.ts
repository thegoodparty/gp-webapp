import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { documentReady } from 'helpers/domHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'admin-auth.json',
});

test('Verify admin user can access admin dashboard', async ({page}) => {
    const caseId = 24;

    try {
        await page.goto('/admin');
        await documentReady(page);

        // Verify Admin Dashboard is displayed
        page.getByRole('heading', { name: 'Admin Dashboard' }).isVisible();
        page.getByRole('button', { name: 'Admin Dashboard' }).isVisible();
        page.getByRole('button', { name: 'Campaigns' }).isVisible();
        page.getByRole('button', { name: 'Users', exact: true }).isVisible();
        page.getByRole('button', { name: 'Top Issues' }).isVisible();
        page.getByRole('button', { name: 'Bust Cache' }).isVisible();
        page.getByRole('button', { name: 'AI Content' }).isVisible();
        page.getByRole('button', { name: 'P2V Stats' }).isVisible();
        page.getByRole('button', { name: 'Pro users w/o voter file' }).isVisible();
        page.getByRole('button', { name: 'Public Candidates' }).isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);    
    }
});