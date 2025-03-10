import { createTestRun } from "./helpers/testrailHelper";
import { ensureSession, ensureAdminSession } from "./helpers/accountHelpers";
import * as fs from "fs";
import "dotenv/config";

module.exports = async () => {
  const testRunName = process.env.TEST_RUN_NAME || "Localized Test Run (Debugging)";
  let testCaseIds = [
    1, 4, 5, 7, 8, 12, 16, 17, 
    18, 19, 22, 
    24, 25, 26, 27, 29, 30, 31, 32, 33, 34, 35, 36, 37,
    41, 46, 47, 48, 49, 50, 75,
    55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 76, 77, 78, 79, 80, 81,
    71
  ];
  const testRunId = await createTestRun(testRunName, testCaseIds);
  fs.writeFileSync("testRunId.txt", testRunId.toString());
  console.log(`Test run created with ID: ${testRunId}`);
  await ensureSession();
  await ensureAdminSession();
};
