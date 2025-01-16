import 'dotenv/config';
import { test, expect } from '@playwright/test';
import { appNav } from 'helpers/navHelpers';
import { addTestResult, skipNonQA } from 'helpers/testrailHelper';
import * as fs from 'fs';
import { createAccount, deleteAccount } from 'helpers/accountHelpers';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

const testTopic = 'Campaign Strategy';
const testTopicChat = /^Can you help me with my campaign strategy\?$/;

test.beforeEach(async ({ page }) => {
    const testZip = '94066';
    const role = 'California Attorney General';
    await createAccount(page, 'live', true, testZip, role);
});

test.afterEach(async ({ page }) => {
    await deleteAccount(page);
});

test('Create new conversation', async ({ page }) => {
    const caseId = 36;
    await skipNonQA(test);

    try {
        await appNav(page, 'Campaign Assistant');

        // Verify user is on campaign assistant page
        await expect(page.getByRole('heading', { name: 'Campaign Assistant' })).toBeVisible();

        // Create new chat
        await page.getByRole('button', { name: 'New Chat' }).click();
        await page.getByRole('button', { name: testTopic }).click();

        // Wait for response to generate
        await page.waitForLoadState('networkidle');

        // Verify conversation window
        await page.locator('div').filter({ hasText: testTopicChat }).first().isVisible();
        await page.locator('.font-normal > div:nth-child(2)').isVisible({timeout: 20000});

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {

        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});

test('Delete a conversation', async ({ page }) => {
    const caseId = 37;
    await skipNonQA(test);

    try {
        await appNav(page, 'Campaign Assistant');

        // Create new chat
        await page.getByRole('button', { name: 'New Chat' }).click();
        await page.getByRole('button', { name: testTopic }).click();

        // Wait for response to generate
        await page.waitForLoadState('networkidle');

        // Refresh page
        await page.reload({ waitUntil: 'domcontentloaded' });
        await appNav(page, 'Campaign Assistant');

        // Open history and delete conversation
        await page.getByRole('button', { name: 'View Chat History' }).click();
        await page.getByRole('img').nth(1).click();
        await page.getByText('Delete').click();

        // Confirm conversation deletion
        await page.getByRole('heading', { name: 'Delete Chat' }).isVisible();
        await page.getByRole('button', { name: 'Delete' }).click();

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results with screenshot path
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});