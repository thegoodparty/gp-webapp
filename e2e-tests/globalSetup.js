import { createTestRun } from "./helpers/testrailHelper";
import * as fs from "fs";
import "dotenv/config";

module.exports = async () => {
  const testRunName = process.env.TEST_RUN_NAME || "Playwright Test Run";
  let testCaseIds = [1, 2, 4, 5, 7, 8, 12, 16, 17, 18, 19, 20, 21, 22, 23, 33, 34, 35];
  const testRunId = await createTestRun(testRunName, testCaseIds);
  fs.writeFileSync("testRunId.txt", testRunId.toString());
  console.log(`Test run created with ID: ${testRunId}`);
};
