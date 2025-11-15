import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  globalTeardown: require.resolve("./globalTeardown.js"),
  timeout: 30000,
  expect: { timeout: 10000 },
  
  // Improved parallelization
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 1,
  
  // Clean reporting without TestRail dependency
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report" }],
  ],

  // Single project for now
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  use: {
    baseURL: "http://localhost:4000",
    
    // Optimized timeouts
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    // Essential browser settings
    headless: true,
    ignoreHTTPSErrors: true,
    
    // Minimal browser args (removed 30+ excessive flags)
    launchOptions: {
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-web-security"],
    },
    
    // Trace only on failures
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
});
