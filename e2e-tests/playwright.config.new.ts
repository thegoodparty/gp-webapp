import { defineConfig, devices } from "@playwright/test";
import { getCurrentEnvironment } from "./src/config/environments";
import { TIMEOUTS, BROWSER_ARGS } from "./src/config/constants";

const config = getCurrentEnvironment();

export default defineConfig({
  testDir: "./tests",
  timeout: TIMEOUTS.DEFAULT,
  expect: { timeout: TIMEOUTS.EXPECT },
  
  // Improved parallelization
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 1,
  
  // Clean reporting without TestRail dependency
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/playwright-results.json" }],
  ],

  // Cross-browser testing
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit", 
      use: { ...devices["Desktop Safari"] },
    },
  ],

  use: {
    baseURL: config.baseURL,
    
    // Optimized timeouts
    actionTimeout: config.actionTimeout,
    navigationTimeout: config.navigationTimeout,
    
    // Essential browser settings
    headless: !process.env.HEADED_MODE,
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    
    // Minimal browser args (removed 30+ excessive flags)
    launchOptions: {
      args: BROWSER_ARGS,
    },
    
    // Trace only on CI failures (performance optimized)
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
});
