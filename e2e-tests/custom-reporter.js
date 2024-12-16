const { Reporter } = require('@playwright/test/reporter');

class CustomReporter {
  onBegin(config, suite) {
    console.log(`Starting the test run with ${suite.allTests().length} tests`);
    this.hasFailures = false;
  }

  onTestEnd(test, result) {
    if (result.status === 'failed') {
      this.hasFailures = true;
      console.log(`Test failed: ${test.title}`);
    }
  }

  async onEnd() {
    if (this.hasFailures) {
      console.error('One or more tests failed.');
      throw new Error('Test suite failed due to test failures.');
    }
  }
}

module.exports = CustomReporter;