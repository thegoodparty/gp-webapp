import { createTestRun } from "./helpers/testrailHelper";
import { ensureSession, ensureAdminSession } from "./helpers/accountHelpers";
import * as fs from "fs";
import "dotenv/config";

module.exports = async () => {
  const testRunName = process.env.TEST_RUN_NAME || "Localized Test Run (Debugging)";
  let testCaseIds = [
    // Core resource pages
    1, 2, 4, 5, 7, 8, 12, 16, 17,
    // Core functionality
    18, 19, 22, 33, 34, 35,
    // Admin pages
    24, 25, 26, 27, 29, 30, 31, 32, 53, 54, 73, 74,
    // App pages
    36, 40, 41, 42, 43, 46, 47, 48, 49, 50, 75, 90, 91, 95,
    // API and other
    71, 86, 87, 88, 89, 92, 93, 94, 96, 97
  ];
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const testRunId = await createTestRun(testRunName, testCaseIds, baseUrl);
  fs.writeFileSync("testRunId.txt", testRunId.toString());
  console.log(`Test run created with ID: ${testRunId}`);

  try {
    console.log('Creating test user session...');
    await ensureSession();
    console.log('Test user session created successfully');
    console.log('Creating admin session...');
    await ensureAdminSession();
    console.log('Admin session created successfully');
  } catch (error) {
    console.error('Error during session setup:', error);
    throw error;
  }
};
