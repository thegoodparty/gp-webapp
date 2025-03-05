import 'dotenv/config';
import { test } from '@playwright/test';
import { addTestResult } from 'helpers/testrailHelper';
import { createAccount, deleteAccount } from 'helpers/accountHelpers';
import * as fs from 'fs';
const runId = fs.readFileSync('testRunId.txt', 'utf-8');

test('Onboarding', async ({page}) => {
    const caseId = 18;
    try {
        // Create account
        await createAccount(page);

        // Delete account after signup
        await deleteAccount(page);

        // Report test results
        await addTestResult(runId, caseId, 1, 'Test passed');
    } catch (error) {
        // Report test results
        await addTestResult(runId, caseId, 5, `Test failed: ${error.stack}`);
    }
});