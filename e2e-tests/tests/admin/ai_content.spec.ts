import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'admin-auth.json',
});

test('Verify admin user can access AI Content page', async ({page}) => {
    const caseId = 29;

    try {
        await page.goto('/admin/ai-content');
        await page.waitForLoadState('networkidle');
        
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