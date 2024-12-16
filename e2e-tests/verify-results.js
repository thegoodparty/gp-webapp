const fs = require('fs');

const results = JSON.parse(fs.readFileSync('./test-results/playwright-results.json', 'utf-8'));
const failedTests = results.suites.reduce((count, suite) => {
  return count + suite.specs.filter(spec => spec.tests.some(test => test.status === 'failed')).length;
}, 0);

if (failedTests > 0) {
  console.error(`${failedTests} tests failed.`);
  process.exit(1); // Fail the CI pipeline
} else {
  console.log('All tests passed!');
}