import 'dotenv/config';
import axios from 'axios';
import * as fs from 'fs';

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
export async function createTestRun(name, caseIds) {
    try {
        const response = await axios.post(
            `${TESTRAIL_URL}/index.php?/api/v2/add_run/${process.env.TESTRAIL_PROJECT_ID}`,
            { name, include_all: false, case_ids: caseIds },
            { auth: AUTH }
        );
        console.log(`Test run created with ID: ${response.data.id}`);
        return response.data.id;
    } catch (error) {
        console.error('Error creating TestRail test run:', error.message);
        throw error;
    }
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

        console.log('All tests passed successfully.');
    } catch (error) {
        console.error('Error while checking TestRail results:', error.message);
        process.exit(1); // Exit with non-zero code if there’s an error
    }
}

export async function authFileCheck(test) {
    test.use({
        storageState: 'auth.json',
    });
}

module.exports = { addTestResult, createTestRun, checkForTestFailures, authFileCheck };