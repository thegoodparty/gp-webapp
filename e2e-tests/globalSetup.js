import { createTestRun } from "./helpers/testrailHelper";
import { ensureSession, ensureAdminSession } from "./helpers/accountHelpers";
import * as fs from "fs";
import "dotenv/config";

module.exports = async () => {
  const testRunName = process.env.TEST_RUN_NAME || "Localized Test Run (Debugging)";
  let testCaseIds = [
    1, 4, 5, 7, 8, 12, 16, 17,
    18, 19, 22,
    24, 25, 26, 27, 29, 30, 31, 32, 33,
    41, 48, 49, 50,
    55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 76, 77, 78, 79, 80, 81,
    71, 86, 87, 88, 89
  ];
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const testRunId = await createTestRun(testRunName, testCaseIds, baseUrl);
  fs.writeFileSync("testRunId.txt", testRunId.toString());
  console.log(`Test run created with ID: ${testRunId}`);

  try {
    console.log('Creating admin session...');
    await ensureAdminSession();
    console.log('Admin session created successfully');
    console.log('Creating test user session...');
    await ensureSession();
    console.log('Test user session created successfully');
  } catch (error) {
    console.error('Error during session setup:', error);
    throw error;
  }
};
