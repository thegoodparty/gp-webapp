import { createTestRun } from "./testrailHelper";
import * as fs from "fs";
import "dotenv/config";

module.exports = async () => {
  const testRunName = process.env.TEST_RUN_NAME || "Playwright Test Run";
  const testRunId = await createTestRun(
    "Playwright Test Run",
    [1, 2, 4, 5, 7, 8, 12, 16, 17]
  );
  fs.writeFileSync("testRunId.txt", testRunId.toString());
  console.log(`Test run created with ID: ${testRunId}`);
};
