import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { addTestResult, handleTestFailure } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { documentReady } from 'helpers/domHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test.use({
    storageState: 'admin-auth.json',
});

test.skip('Generate default voter file', async ({ page }) => {
    const caseId = 95;
    try {
        await page.goto("/dashboard/voter-records");
        await documentReady(page);
        await page.getByRole('link', { name: "Voter file (All Fields)" }).first().isVisible();
        await page.getByRole('link', { name: "Voter file (All Fields)" }).first().click();
        await documentReady(page);
        await page.getByRole('heading', { name: "Voter file (All Fields)" }).isVisible();

        // Wait for and handle the download
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', { name: 'Download CSV' }).click();
        const download = await downloadPromise;

        // Save the file to a temporary location and check its size
        const tempFilePath0 = 'temp-download0.csv';
        await download.saveAs(tempFilePath0);
        const stats = fs.statSync(tempFilePath0);
        expect(stats.size).toBeGreaterThan(200);

        // Clean up the temporary file
        fs.unlinkSync(tempFilePath0);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);
    }
});

test.skip('Generate custom voter file', async ({ page }) => {
    const caseId = 43;
    try {
        await page.goto("/dashboard/voter-records");
        await documentReady(page);
        await page.locator('div').filter({ hasText: /^Create a custom voter file$/ }).getByRole('button').click();
        await page.getByLabel('Channel *').click();
        await page.getByRole('option', { name: 'Direct Mail' }).click();
        await page.getByLabel('Purpose').click();
        await page.getByRole('option', { name: 'GOTV' }).click();
        await page.getByRole('button', { name: 'Next' }).click();
        await page.getByRole('button', { name: 'Create Voter File' }).click();
        await documentReady(page);
        await page.getByRole('link', { name: /Direct Mail - GOTV/ }).last().isVisible();
        await page.getByRole('link', { name: /Direct Mail - GOTV/ }).last().click();
        await documentReady(page);
        await page.getByRole('heading', { name: /Direct Mail - GOTV/ }).isVisible();

        // Wait for and handle the download
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', { name: 'Download CSV' }).click();
        const download = await downloadPromise;

        // Save the file to a temporary location and check its size
        const tempFilePath1 = 'temp-download1.csv';
        await download.saveAs(tempFilePath1);
        const stats = fs.statSync(tempFilePath1);
        expect(stats.size).toBeGreaterThan(150);

        // Clean up the temporary file
        fs.unlinkSync(tempFilePath1);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        await handleTestFailure(page, runId, caseId, error);
    }
});