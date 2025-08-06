import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { setupMultiTestReporting } from 'helpers/testrailHelper';
import { documentReady } from 'helpers/domHelpers';
import * as fs from 'fs';
import { prepareTest } from 'helpers/accountHelpers';
import { TEST_IDS } from 'constants/testIds';

test.use({
    storageState: 'admin-auth.json',
});

setupMultiTestReporting(test, {
    'Download default voter file': TEST_IDS.DEFAULT_VOTER_FILES,
    'Generate custom voter file': TEST_IDS.CUSTOM_VOTER_FILES
});

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

test.skip('Generate custom voter file', async ({ page }) => {
    await prepareTest('admin', '/dashboard/voter-records', 'Voter File', page);
    
    // Wait for and click create custom voter file button
    const createButton = page.getByRole('button', { name: /Create a custom voter file/i }).first();
    await createButton.waitFor({ state: 'visible'});
    await expect(createButton).toBeEnabled();
    await createButton.click();

    // Wait for form to be ready
    await documentReady(page);

    // Select channel with proper waiting
    const channelSelect = page.getByLabel('Channel *');
    await channelSelect.waitFor({ state: 'visible'});
    await expect(channelSelect).toBeEnabled();
    await channelSelect.click();

    const directMailOption = page.getByRole('option', { name: 'Direct Mail' });
    await directMailOption.waitFor({ state: 'visible'});
    await directMailOption.click();

    const purposeSelect = page.getByLabel('Purpose');
    await purposeSelect.waitFor({ state: 'visible'});
    await expect(purposeSelect).toBeEnabled();
    await purposeSelect.click();

    const gotvOption = page.getByRole('option', { name: 'GOTV' });
    await gotvOption.waitFor({ state: 'visible'});
    await gotvOption.click();

    const nextButton = page.getByRole('button', { name: 'Next' });
    await nextButton.waitFor({ state: 'visible'});
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    await documentReady(page);

    const createVoterFileButton = page.getByRole('button', { name: 'Create Voter File' });
    await createVoterFileButton.waitFor({ state: 'visible', timeout: 30000 });
    await expect(createVoterFileButton).toBeEnabled({ timeout: 30000 });
    await createVoterFileButton.click();

    await documentReady(page);

    const generatedFileLink = page.getByRole('link', { name: /Direct Mail - GOTV/ }).last();
    await generatedFileLink.waitFor({ state: 'visible', timeout: 60000 });
    await expect(generatedFileLink).toBeEnabled({ timeout: 30000 });
    await generatedFileLink.click();

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