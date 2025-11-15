import { chromium } from "@playwright/test";
import { TestDataManager } from "./src/utils/test-data-manager";
import { SharedTestUserManager } from "./src/utils/shared-test-user";

export default async function globalTeardown() {
  console.log("🧹 Starting test suite cleanup...");

  // Create a browser context for cleanup operations
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Clean up any remaining individual test data
    await TestDataManager.cleanup(page);

    // Clean up shared test user
    await SharedTestUserManager.deleteSharedTestUser(page);
  } finally {
    await browser.close();
  }

  console.log("✅ Global teardown completed successfully");
}
