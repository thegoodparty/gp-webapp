import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';
import * as fs from 'fs';
import { prepareTest } from 'helpers/accountHelpers';

test.use({
    storageState: 'admin-auth.json',
});

// Setup reporting for default voter file test
const defaultVoterFileCaseId = 95;
setupTestReporting(test, defaultVoterFileCaseId);

test.skip('Download default voter file', async ({ page }) => {
    const voterFileName = 'Door Knocking (Default)';
    await prepareTest('admin', '/dashboard/voter-records/doorknocking', voterFileName, page);
    await documentReady(page);

    const heading = page.getByRole('heading', { name: voterFileName });
    await heading.waitFor({ state: 'visible', timeout: 30000 });

    const downloadButton = page.getByRole('button', { name: 'Download CSV' });
    await downloadButton.waitFor({ state: 'visible', timeout: 30000 });
    await expect(downloadButton).toBeEnabled({ timeout: 30000 });

    // Wait for and handle the download
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    // Save the file to a temporary location and check its size
    const tempFilePath0 = 'temp-download0.csv';
    await download.saveAs(tempFilePath0);
    const stats = fs.statSync(tempFilePath0);
    expect(stats.size).toBeGreaterThan(100);

    // Clean up the temporary file
    fs.unlinkSync(tempFilePath0);
});

// Setup reporting for custom voter file test
const customVoterFileCaseId = 43;
setupTestReporting(test, customVoterFileCaseId);

test.skip('Generate custom voter file', async ({ page }) => {
    await prepareTest('admin', '/dashboard/voter-records', 'Voter File', page);
    
    // Wait for and click create custom voter file button
    const createButton = page.getByRole('button', { name: /Create a custom voter file/i }).first();
    await createButton.waitFor({ state: 'visible', timeout: 60000 });
    await expect(createButton).toBeEnabled({ timeout: 30000 });
    await createButton.click();

    // Wait for form to be ready
    await page.waitForLoadState('networkidle');
    await documentReady(page);

    // Select channel with proper waiting
    const channelSelect = page.getByLabel('Channel *');
    await channelSelect.waitFor({ state: 'visible', timeout: 30000 });
    await expect(channelSelect).toBeEnabled({ timeout: 30000 });
    await channelSelect.click();

    const directMailOption = page.getByRole('option', { name: 'Direct Mail' });
    await directMailOption.waitFor({ state: 'visible', timeout: 30000 });
    await directMailOption.click();

    const purposeSelect = page.getByLabel('Purpose');
    await purposeSelect.waitFor({ state: 'visible', timeout: 30000 });
    await expect(purposeSelect).toBeEnabled({ timeout: 30000 });
    await purposeSelect.click();

    const gotvOption = page.getByRole('option', { name: 'GOTV' });
    await gotvOption.waitFor({ state: 'visible', timeout: 30000 });
    await gotvOption.click();
    const nextButton = page.getByRole('button', { name: 'Next' });
    await nextButton.waitFor({ state: 'visible', timeout: 30000 });
    await expect(nextButton).toBeEnabled({ timeout: 30000 });
    await nextButton.click();

    await page.waitForLoadState('networkidle');
    await documentReady(page);

    // Wait for and click create voter file button
    const createVoterFileButton = page.getByRole('button', { name: 'Create Voter File' });
    await createVoterFileButton.waitFor({ state: 'visible', timeout: 30000 });
    await expect(createVoterFileButton).toBeEnabled({ timeout: 30000 });
    await createVoterFileButton.click();

    // Wait for file generation and page load
    await page.waitForLoadState('networkidle');
    await documentReady(page);

    // Wait for and click the generated file link
    const generatedFileLink = page.getByRole('link', { name: /Direct Mail - GOTV/ }).last();
    await generatedFileLink.waitFor({ state: 'visible', timeout: 60000 });
    await expect(generatedFileLink).toBeEnabled({ timeout: 30000 });
    await generatedFileLink.click();

    // Wait for navigation and page load
    await page.waitForLoadState('networkidle');
    await documentReady(page);

    // Wait for heading with retry
    const heading = page.getByRole('heading', { name: /Direct Mail - GOTV/ });
    await heading.waitFor({ state: 'visible', timeout: 30000 });

    // Wait for download button to be ready
    const downloadButton = page.getByRole('button', { name: 'Download CSV' });
    await downloadButton.waitFor({ state: 'visible', timeout: 30000 });
    await expect(downloadButton).toBeEnabled({ timeout: 30000 });

    // Wait for and handle the download
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;

    // Save the file to a temporary location and check its size
    const tempFilePath1 = 'temp-download1.csv';
    await download.saveAs(tempFilePath1);
    const stats = fs.statSync(tempFilePath1);
    expect(stats.size).toBeGreaterThan(150);

    // Clean up the temporary file
    fs.unlinkSync(tempFilePath1);
});