import 'dotenv/config';
import axios from 'axios';
import * as fs from 'fs';
import { Page } from '@playwright/test';
import * as path from 'path';

// Test status enum to replace string literals
const enum TestStatus {
    PASSED = 'passed',
    FAILED = 'failed',
    SKIPPED = 'skipped',
    TIMED_OUT = 'timedOut'
}

const TESTRAIL_URL = process.env.TESTRAIL_URL;
const AUTH = {
    username: process.env.TESTRAIL_USERNAME,
    password: process.env.TESTRAIL_API_KEY,
};

const testResultStatuses = [];
const reportedTestCases = new Set<string>();
const REPORTED_CASES_FILE = path.resolve(__dirname, '../reported-test-cases.json');

function loadReportedTestCases(): Set<string> {
    try {
        if (fs.existsSync(REPORTED_CASES_FILE)) {
            const data = fs.readFileSync(REPORTED_CASES_FILE, 'utf-8');
            const cases = JSON.parse(data);
            console.log(`Loaded ${cases.length} previously reported test cases from file`);
            return new Set(cases);
        }
    } catch (error) {
        console.log('Error loading reported test cases file:', error.message);
    }
    return new Set<string>();
}

function saveReportedTestCases(cases: Set<string>) {
    try {
        const casesArray = Array.from(cases);
        fs.writeFileSync(REPORTED_CASES_FILE, JSON.stringify(casesArray, null, 2));
        console.log(`Saved ${casesArray.length} reported test cases to file`);
    } catch (error) {
        console.log('Error saving reported test cases file:', error.message);
    }
}

function clearReportedTestCases() {
    try {
        if (fs.existsSync(REPORTED_CASES_FILE)) {
            fs.unlinkSync(REPORTED_CASES_FILE);
            console.log('Cleared reported test cases file');
        }
        reportedTestCases.clear();
    } catch (error) {
        console.log('Error clearing reported test cases file:', error.message);
    }
}

const reportedTestCasesFromFile = loadReportedTestCases();
reportedTestCasesFromFile.forEach(caseKey => reportedTestCases.add(caseKey));


// Helper to post results to TestRail
export async function addTestResult(runId, caseId, statusId, comment = '') {
    console.log(`Attempting to update TestRail: runId=${runId}, caseId=${caseId}, statusId=${statusId}`);
    
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
        console.error(`Error response:`, error.response?.data);
        testResultStatuses.push(5);
        throw error;
    }
}

// Helper to create a new test run
export async function createTestRun(name: string, caseIds: number[], baseUrl: string) {
    // Clear reported test cases at the start of a new test run
    clearReportedTestCases();
    
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
    const runId = fs.readFileSync('testRunId.txt', 'utf-8').trim();
    const testKey = `${runId}_${caseId}`;

    test.afterEach(async ({ page }, testInfo) => {
        if (reportedTestCases.has(testKey)) {
            console.log(`Test case ${caseId} already reported, skipping duplicate report`);
            return;
        }

        if (testInfo.retries !== undefined && testInfo.retry < testInfo.retries) {
            console.log(`Test case ${caseId} retry ${testInfo.retry + 1}/${testInfo.retries + 1}, skipping intermediate report`);
            return;
        }

        console.log(`TestRail reporting for case ${caseId}: status=${testInfo.status}, retry=${testInfo.retry}, retries=${testInfo.retries}`);
        console.log(`Reporting result for case ${caseId} with status: ${testInfo.status}`);
        
        try {
            if (testInfo.status === TestStatus.PASSED) {
                console.log(`Marking case ${caseId} as PASSED`);
                await addTestResult(runId, caseId, 1, 'Test passed successfully');
            } else if (testInfo.status === TestStatus.FAILED) {
                console.log(`Marking case ${caseId} as FAILED`);
                await handleTestFailure(page, runId, caseId, testInfo.error);
            } else if (testInfo.status === TestStatus.SKIPPED) {
                console.log(`Marking case ${caseId} as SKIPPED`);
                await addTestResult(runId, caseId, 4, 'Test was skipped');
            } else if (testInfo.status === TestStatus.TIMED_OUT) {
                console.log(`Marking case ${caseId} as FAILED (timeout)`);
                await addTestResult(runId, caseId, 5, `Test timed out after ${testInfo.timeout}ms`);
            } else {
                console.log(`Marking case ${caseId} as FAILED (unknown status: ${testInfo.status})`);
                await addTestResult(runId, caseId, 5, `Test failed with unknown status: ${testInfo.status}`);
            }
            
            reportedTestCases.add(testKey);
            saveReportedTestCases(reportedTestCases);
        } catch (reportingError) {
            console.error(`Error reporting result for case ${caseId}:`, reportingError.message);
            try {
                await addTestResult(runId, caseId, 5, `Error during reporting: ${reportingError.message}`);
                reportedTestCases.add(testKey);
            } catch (finalError) {
                console.error(`Final reporting attempt failed for case ${caseId}:`, finalError.message);
            }
        }
    });
}

export async function setupMultiTestReporting(test: any, caseIdMap: { [testTitle: string]: number }) {
    const runId = fs.readFileSync('testRunId.txt', 'utf-8').trim();
    
    test.afterEach(async ({ page }, testInfo) => {
        // Find the case ID for this test based on its title
        const caseId = caseIdMap[testInfo.title];
        
        if (!caseId) {
            console.log(`No case ID mapping found for test: ${testInfo.title}`);
            return;
        }
        
        const testKey = `${runId}_${caseId}`;
        
        if (reportedTestCases.has(testKey)) {
            console.log(`Test case ${caseId} already reported, skipping duplicate report`);
            return;
        }

        if (testInfo.retries !== undefined && testInfo.retry < testInfo.retries) {
            console.log(`Test case ${caseId} retry ${testInfo.retry + 1}/${testInfo.retries + 1}, skipping intermediate report`);
            return;
        }

        console.log(`TestRail reporting for case ${caseId}: status=${testInfo.status}, retry=${testInfo.retry}, retries=${testInfo.retries}`);
        console.log(`Reporting result for case ${caseId} with status: ${testInfo.status}`);
        
        try {
            if (testInfo.status === TestStatus.PASSED) {
                console.log(`Marking case ${caseId} as PASSED`);
                await addTestResult(runId, caseId, 1, 'Test passed successfully');
            } else if (testInfo.status === TestStatus.FAILED) {
                console.log(`Marking case ${caseId} as FAILED`);
                await handleTestFailure(page, runId, caseId, testInfo.error);
            } else if (testInfo.status === TestStatus.SKIPPED) {
                console.log(`Marking case ${caseId} as SKIPPED`);
                await addTestResult(runId, caseId, 4, 'Test was skipped');
            } else if (testInfo.status === TestStatus.TIMED_OUT) {
                console.log(`Marking case ${caseId} as FAILED (timeout)`);
                await addTestResult(runId, caseId, 5, `Test timed out after ${testInfo.timeout}ms`);
            } else {
                console.log(`Marking case ${caseId} as FAILED (unknown status: ${testInfo.status})`);
                await addTestResult(runId, caseId, 5, `Test failed with unknown status: ${testInfo.status}`);
            }
            
            reportedTestCases.add(testKey);
            saveReportedTestCases(reportedTestCases);
        } catch (reportingError) {
            console.error(`Error reporting result for case ${caseId}:`, reportingError.message);
            try {
                await addTestResult(runId, caseId, 5, `Error during reporting: ${reportingError.message}`);
                reportedTestCases.add(testKey);
            } catch (finalError) {
                console.error(`Final reporting attempt failed for case ${caseId}:`, finalError.message);
            }
        }
    });
}

export async function reportSkippedTests() {
    const runId = fs.readFileSync('testRunId.txt', 'utf-8').trim();
    
    try {
        const response = await axios.get(`${TESTRAIL_URL}/index.php?/api/v2/get_tests/${runId}`, { auth: AUTH });
        const tests = response.data.tests;
        
        const untestedTests = tests.filter((test) => !test.status_id || test.status_id === null);
        
        console.log(`Found ${untestedTests.length} untested tests, marking as skipped`);
        
        for (const test of untestedTests) {
            console.log(`Marking case ${test.case_id} as SKIPPED (was untested)`);
            await addTestResult(runId, test.case_id, 4, 'Test was skipped (not executed)');
        }
    } catch (error) {
        console.error('Error reporting skipped tests:', error.message);
    }
}



module.exports = { addTestResult, createTestRun, checkForTestFailures, authFileCheck, handleTestFailure, setupTestReporting, setupMultiTestReporting, reportSkippedTests };