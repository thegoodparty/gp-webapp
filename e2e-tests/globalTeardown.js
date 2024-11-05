const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'testRunId.txt');

module.exports = async () => {
    // Delete testRunId.txt if it exists
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted existing testRunId.txt file.');
    }

    // Create an empty testRunId.txt file for the next test run
    fs.writeFileSync(filePath, '', 'utf8'); 
    console.log('Created an empty testRunId.txt file for the next test run.');
};