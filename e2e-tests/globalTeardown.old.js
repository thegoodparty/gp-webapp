import * as fs from 'fs';
import path from 'path';
import "dotenv/config";
import { checkForTestFailures, reportSkippedTests } from './helpers/testrailHelper';
import { cleanupSession } from "./helpers/accountHelpers";


const filePath = path.join(__dirname, 'testRunId.txt');

module.exports = async () => {
    try {
        await cleanupSession();
        
        console.log('Reporting skipped tests...');
        await reportSkippedTests();
        
        console.log('Running checkForTestFailures...');
        await checkForTestFailures();

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Deleted existing testRunId.txt file.');
        }

        fs.writeFileSync(filePath, '', 'utf8');
        console.log('Created an empty testRunId.txt file for the next test run.');
    } catch (error) {
        console.error('Error during global teardown:', error.message);
        process.exit(1);
    }
};
