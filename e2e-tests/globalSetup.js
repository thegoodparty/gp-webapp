import { createTestRun } from "./helpers/testrailHelper";
import * as fs from "fs";
import "dotenv/config";

module.exports = async () => {
  const testRunName = process.env.TEST_RUN_NAME || "Playwright Test Run";  
  // Test cases to run on any environment
  let testCaseIds = [1, 2, 4, 5, 7, 8, 12, 16, 17, 22, 23];

  // Test cases to run if pushing to the qa branch
  if (
    (process.env.BASE_URL && process.env.BASE_URL.includes("https://qa.goodparty.org")) ||
    process.env.PLAYWRIGHT_PROJECT_NAME === "QA"
  ) {
    testCaseIds = [1, 2, 4, 5, 7, 8, 12, 16, 17, 19, 22, 23];
  }

  const testRunId = await createTestRun(testRunName, testCaseIds);
  fs.writeFileSync("testRunId.txt", testRunId.toString());
  console.log(`Test run created with ID: ${testRunId}, running tests against ${process.env.BASE_URL}`);
};
