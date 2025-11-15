import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  // Removed globalSetup/globalTeardown in favor of setup/cleanup projects
  timeout: 60000, // Increased from 30s to 60s for account creation
  expect: { timeout: 15000 }, // Increased from 10s to 15s
  
  // Improved parallelization with better stability
  fullyParallel: true,
  workers: process.env.CI ? 1 : 2, // Reduced workers to prevent resource contention
  retries: process.env.CI ? 3 : 2, // Increased retries for flaky tests
  
  // Clean reporting without TestRail dependency
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report" }],
  ],

  // Setup project for authentication + main testing project
  projects: [
    // Setup project - runs first to create authenticated state
    { 
      name: 'setup', 
      testMatch: /.*\.setup\.ts/,
      teardown: 'cleanup'
    },
    
    // Cleanup project - runs after all tests to clean up auth user
    {
      name: 'cleanup',
      testMatch: /.*\.cleanup\.ts/
    },

    // Main testing project - uses authenticated state
    {
      name: "chromium",
      use: { 
        ...devices["Desktop Chrome"],
        // Use prepared auth state for all tests
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'], // Run setup before this project
    },
  ],

  use: {
    baseURL: "http://localhost:4000",
    
    // Increased timeouts for better reliability
    actionTimeout: 15000, // Increased from 10s
    navigationTimeout: 45000, // Increased from 30s
    
    // Essential browser settings
    headless: true,
    ignoreHTTPSErrors: true,
    
    // Browser args optimized for stability
    launchOptions: {
      args: [
        "--no-sandbox", 
        "--disable-dev-shm-usage", 
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor", // Helps with stability
        "--disable-background-timer-throttling", // Prevents timeouts
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding"
      ],
    },
    
    // Better debugging and error tracking
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
});
