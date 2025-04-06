import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'admin-auth.json',
});

test('Verify admin user can access admin dashboard', async ({page}) => {
    const caseId = 24;

    try {
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        // Verify Admin Dashboard is displayed
        await page.getByRole('heading', { name: 'Admin Dashboard' }).isVisible();
        await page.getByRole('button', { name: 'Admin Dashboard' }).isVisible();
        await page.getByRole('button', { name: 'Campaigns' }).isVisible();
        await page.getByRole('button', { name: 'Users', exact: true }).isVisible();
        await page.getByRole('button', { name: 'Top Issues' }).isVisible();
        await page.getByRole('button', { name: 'Bust Cache' }).isVisible();
        await page.getByRole('button', { name: 'AI Content' }).isVisible();
        await page.getByRole('button', { name: 'P2V Stats' }).isVisible();
        await page.getByRole('button', { name: 'Pro users w/o voter file' }).isVisible();
        await page.getByRole('button', { name: 'Public Candidates' }).isVisible();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
        const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
        const currentUrl = await page.url();
        
        // Capture screenshot on failure
        const screenshotPath = `test-results/failures/test-${caseId}-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}. 
        Screenshot saved to: ${screenshotPath}
        Error: ${error.stack}`);
    }
});