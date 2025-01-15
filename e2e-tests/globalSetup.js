import { createTestRun } from "./helpers/testrailHelper";
import * as fs from "fs";
import "dotenv/config";

module.exports = async () => {
  const testRunName = process.env.TEST_RUN_NAME || "Playwright Test Run";
  let testCaseIds = [
    1, 2, 4, 5, 7, 8, 12, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 29, 33, 34, 35, 36, 37,
    38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 53, 54
  ];
  const testRunId = await createTestRun(testRunName, testCaseIds);
  fs.writeFileSync("testRunId.txt", testRunId.toString());
  console.log(`Test run created with ID: ${testRunId}`);
};
