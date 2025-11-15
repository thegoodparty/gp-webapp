import { chromium } from "@playwright/test";
import { TestDataManager } from "./src/utils/test-data-manager";
import { SharedTestUserManager } from "./src/utils/shared-test-user.js";

export default async function globalTeardown() {
  console.log("🧹 Starting test suite cleanup...");

  // Create a browser context for cleanup operations with proper baseURL
  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL: process.env.BASE_URL || "http://localhost:4000",
  });
  const page = await context.newPage();

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
