import 'dotenv/config';
import axios from 'axios';
import * as fs from 'fs';
import { Page } from '@playwright/test';

const TESTRAIL_URL = process.env.TESTRAIL_URL;
const AUTH = {
    username: process.env.TESTRAIL_USERNAME,
    password: process.env.TESTRAIL_API_KEY,
};

const testResultStatuses = [];

// Helper to post results to TestRail
export async function addTestResult(runId, caseId, statusId, comment = '') {
    try {
        const response = await axios.post(
            `${TESTRAIL_URL}/index.php?/api/v2/add_result_for_case/${runId}/${caseId}`,
            { status_id: statusId, comment: comment },
            { auth: AUTH }
        );
        console.log(`Successfully updated TestRail case ID ${caseId} with status ${statusId}`);

        // Store the status ID for tracking
        testResultStatuses.push(statusId);

        return response.data;
    } catch (error) {
        console.error(`Failed to update TestRail case ID ${caseId}:`, error.message);
        testResultStatuses.push(5);
        throw error;
    }
}

// Helper to create a new test run
export async function createTestRun(name: string, caseIds: number[], baseUrl: string) {
    const description = `Test Environment URL: ${baseUrl}\n\nAutomated test run created at ${new Date().toISOString()}`;

    const response = await axios.post(
        `${TESTRAIL_URL}/index.php?/api/v2/add_run/${process.env.TESTRAIL_PROJECT_ID}`,
        {
            name: name,
            include_all: false,
            case_ids: caseIds,
            description: description
        },
        {
            auth: AUTH
        }
    );

    console.log(`Test run created with ID: ${response.data.id}`);
    return response.data.id;
}

export async function checkForTestFailures() {
    const TESTRAIL_URL = process.env.TESTRAIL_URL;
    const AUTH = {
        username: process.env.TESTRAIL_USERNAME,
        password: process.env.TESTRAIL_API_KEY,
    };
    const runId = fs.readFileSync('testRunId.txt', 'utf-8');

    try {
        const response = await axios.get(`${TESTRAIL_URL}/index.php?/api/v2/get_tests/${runId}`, { auth: AUTH });
        const tests = response.data.tests;

        const failedTests = tests.filter((test) => test.status_id === 5);

        if (failedTests.length > 0) {
            console.error(`Detected ${failedTests.length} failed test(s) in TestRail:`);
            failedTests.forEach((test) => console.error(`- Test ID: ${test.case_id}, Title: ${test.title}`));
            process.exit(1); // Exit with non-zero code to signal failure
        }

        console.log('All tests executed successfully.');
    } catch (error) {
        console.error('Error while checking TestRail results:', error.message);
        process.exit(1); // Exit with non-zero code if there's an error
    }
}

export async function authFileCheck(test) {
    test.use({
        storageState: 'auth.json',
    });
}

export async function handleTestFailure(page: Page, runId: string, caseId: number, error: Error) {
    try {
        // Check if page is still connected
        if (!page.isClosed()) {
            // Capture screenshot on failure
            const screenshotPath = `test-results/failures/test-${caseId}-${Date.now()}.png`;
            await page.screenshot({ path: screenshotPath, fullPage: true }).catch(screenshotError => {
                console.error('Failed to capture screenshot:', screenshotError);
            });

            // Get current URL (if page is still available)
            let currentUrl = 'URL not available';
            try {
                currentUrl = await page.url();
            } catch (urlError) {
                console.error('Failed to get current URL:', urlError);
            }

            // Report test results
            const testrailBaseUrl = process.env.TESTRAIL_URL || 'https://goodparty.testrail.io';
            const testrailUrl = `${testrailBaseUrl}/index.php?/tests/view/${runId}_${caseId}`;
            await addTestResult(runId, caseId, 5, `Test failed (${testrailUrl}) at page ${currentUrl}. 
            Error: ${error.stack}`);
        } else {
            console.error('Page was already closed when attempting to capture failure');
            await addTestResult(runId, caseId, 5, `Test failed but screenshot couldn't be captured - browser was closed. 
            Error: ${error.stack}`);
        }
    } catch (handlingError) {
        console.error('Error during failure handling:', handlingError);
        // Ensure the test failure is still reported even if screenshot fails
        await addTestResult(runId, caseId, 5, `Test failed with error: ${error.stack}
        Additional error during failure handling: ${handlingError.message}`);
    }
}

export async function setupTestReporting(test: any, caseId: number) {
    const runId = fs.readFileSync('testRunId.txt', 'utf-8');

    test.afterEach(async ({ page }, testInfo) => {
        // Only report after all retries are complete
        if (testInfo.retry === testInfo.retries) {
            if (testInfo.status === 'passed') {
                await addTestResult(runId, caseId, 1, 'Test passed');
            } else if (testInfo.status === 'failed') {
                await handleTestFailure(page, runId, caseId, testInfo.error);
            }
        }
    });
}

module.exports = { addTestResult, createTestRun, checkForTestFailures, authFileCheck, handleTestFailure, setupTestReporting };