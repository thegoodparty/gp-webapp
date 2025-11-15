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

  // Note: Each test will create its own properly configured account
  // This ensures all accounts have complete onboarding and full functionality
  console.log(
    "ℹ️ Tests will create individual accounts with proper onboarding"
  );

  console.log("✅ Global setup completed successfully");
}
