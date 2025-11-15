import { getCurrentEnvironment } from "./src/config/environments";

export default async function globalSetup() {
  console.log("🚀 Starting test suite setup...");

  // Validate environment configuration
  const config = getCurrentEnvironment();
  console.log(`📍 Environment: ${process.env.NODE_ENV || "local"}`);
  console.log(`🌐 Base URL: ${config.baseURL}`);

  // Validate required environment variables for admin tests
  if (!process.env.TEST_USER_ADMIN || !process.env.TEST_USER_ADMIN_PASSWORD) {
    console.warn(
      "⚠️  Admin credentials not found - admin tests will be skipped"
    );
  }

  // Create test results directory
  const fs = await import("fs");
  const path = await import("path");

  const resultsDir = path.resolve(__dirname, "test-results");
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const screenshotsDir = path.resolve(__dirname, "screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Create shared test user for app tests (optional - if this fails, app tests will be skipped)
  try {
    console.log("👤 Creating shared test user for app functionality tests...");

    const { SharedTestUserManager } = await import(
      "./src/utils/shared-test-user"
    );
    const { SimpleAccountHelper } = await import(
      "./src/helpers/account-simple.helper"
    );
    const { chromium } = await import("@playwright/test");

    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      const sharedUser = await SharedTestUserManager.createSharedTestUser();

      // Actually create the account through registration + onboarding
      await SimpleAccountHelper.createAccountAndGetToDashboard(page);

      console.log("✅ Shared test user created and ready for app tests");
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.warn("⚠️ Failed to create shared test user:", error.message);
    console.warn("App tests will be skipped");
  }

  console.log("✅ Global setup completed successfully");
}
