const { createTestRun } = require('./testrailHelper');
const fs = require('fs');
require('dotenv').config();

module.exports = async () => {
    const testRunId = await createTestRun('Playwright Test Run', [1,2,4,5,7,8]);
    fs.writeFileSync('testRunId.txt', testRunId.toString());
    console.log(`Test run created with ID: ${testRunId}`);
};
