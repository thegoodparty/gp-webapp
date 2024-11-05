const axios = require('axios');
require('dotenv').config();

const TESTRAIL_URL = process.env.TESTRAIL_URL;
const AUTH = {
    username: process.env.TESTRAIL_USERNAME,
    password: process.env.TESTRAIL_API_KEY,
};

// Helper to post results to TestRail
async function addTestResult(runId, caseId, statusId, comment = '') {
    try {
        const response = await axios.post(
            `${TESTRAIL_URL}/index.php?/api/v2/add_result_for_case/${runId}/${caseId}`,
            { status_id: statusId, comment: comment },
            { auth: AUTH }
        );
        console.log(`Successfully updated TestRail case ID ${caseId} with status ${statusId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to update TestRail case ID ${caseId}:`, error.message);
        throw error;
    }
}

// Helper to create a new test run
async function createTestRun(name, caseIds) {
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

module.exports = { addTestResult, createTestRun };
