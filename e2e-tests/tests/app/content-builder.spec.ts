import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';
import { prepareTest } from 'helpers/accountHelpers';
import * as fs from 'fs';
import * as path from 'path';

// Try to use existing session, but fall back to manual login if needed
const sessionFile = path.resolve(__dirname, '../../auth.json');
if (fs.existsSync(sessionFile)) {
    test.use({
        storageState: 'auth.json',
    });
}

test.beforeEach(async ({ page }) => {
    await prepareTest('user', '/dashboard/content', 'Generate', page);
});

// Setup reporting for content builder test
const contentBuilderCaseId = 40;
setupTestReporting(test, contentBuilderCaseId);

test('Generate content with Content Builder', async ({ page }) => {
    const testTemplate = 'Launch Email';

    // Generate new content
    await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible();
    await page.getByRole('button', { name: 'Generate' }).click();
    await page.getByRole('heading', { name: 'Select a Template' }).isVisible();
    await page.getByRole('button', { name: testTemplate }).click();
    await documentReady(page);

    // Verify new content
    await expect(page.getByRole('link', { name: testTemplate, exact: true })).toBeVisible();
    await page.getByRole('link', { name: testTemplate, exact: true }).click();
    await expect(page.getByRole('cell', { name: testTemplate })).toBeVisible();
});