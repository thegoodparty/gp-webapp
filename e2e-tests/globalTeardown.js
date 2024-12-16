import * as fs from 'fs';
import path from 'path';
import { checkForTestFailures } from './helpers/testrailHelper';

const filePath = path.join(__dirname, 'testRunId.txt');

module.exports = async () => {
    try {
        // Check for test failures
        console.log('Running checkForTestFailures...');
        await checkForTestFailures();

        // Delete testRunId.txt if it exists
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Deleted existing testRunId.txt file.');
        }

        // Create an empty testRunId.txt file for the next test run
        fs.writeFileSync(filePath, '', 'utf8');
        console.log('Created an empty testRunId.txt file for the next test run.');
    } catch (error) {
        console.error('Error during global teardown:', error.message);
        process.exit(1);
    }
};
