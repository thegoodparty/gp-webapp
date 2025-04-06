import 'dotenv/config';
import axios from 'axios';
import * as fs from 'fs';
import * as TestRail from '@dlenroc/testrail';
import { Readable } from 'stream';
const TESTRAIL_URL = process.env.TESTRAIL_URL;
const AUTH = {
    username: process.env.TESTRAIL_USERNAME,
    password: process.env.TESTRAIL_API_KEY,
};

const testResultStatuses = [];

// Helper to post results to TestRail
export async function addTestResult(runId: string, caseId: number, statusId: number, comment: string, screenshotPath?: string) {
    const api = new TestRail({
        host: process.env.TESTRAIL_URL || 'https://goodparty.testrail.io',
        username: process.env.TESTRAIL_USERNAME,
        password: process.env.TESTRAIL_PASSWORD,
    });

    try {
        // First get the test ID for this case in this run
        const tests = await api.getTests(parseInt(runId));
        const test = tests.find(t => t.case_id === caseId);
        if (!test) {
            throw new Error(`Could not find test for case ${caseId} in run ${runId}`);
        }

        // Add the test result
        const result = await api.addResult(test.id, {
            status_id: statusId,
            comment: comment
        });

        // If there's a screenshot, attach it to the result
        if (screenshotPath && fs.existsSync(screenshotPath)) {
            const fileStream = fs.createReadStream(screenshotPath);
            const attachment = {
                name: `screenshot-${Date.now()}.png`,
                value: fileStream
            };
            await api.addAttachmentToResult(result.id, attachment);
        }
    } catch (error) {
        console.error('Error adding test result to TestRail:', error);
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

        console.log('All tests passed successfully.');
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

module.exports = { addTestResult, createTestRun, checkForTestFailures, authFileCheck };