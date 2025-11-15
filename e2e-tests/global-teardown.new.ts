import { chromium } from "@playwright/test";
import { TestDataManager } from "./src/utils/test-data-manager";

export default async function globalTeardown() {
  console.log("🧹 Starting test suite cleanup...");
  
  // Create a browser context for cleanup operations
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await TestDataManager.cleanup(page);
  } finally {
    await browser.close();
  }
  
  console.log("✅ Global teardown completed successfully");
}
