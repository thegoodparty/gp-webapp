import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  globalSetup: require.resolve("./globalSetup.js"),
  globalTeardown: require.resolve("./globalTeardown.js"),

  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/playwright-results.json" }],
  ],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:4000/", // Fallback to default URL if not provided
    trace: "on-first-retry",
  },
  projects: [
  {
    name: "chromium",
    use: { ...devices["Desktop Chrome"], baseURL: process.env.BASE_URL },
  },
  {
    name: "firefox",
    use: { ...devices["Desktop Firefox"], baseURL: process.env.BASE_URL },
  },
  {
    name: "webkit",
    use: { ...devices["Desktop Safari"], baseURL: process.env.BASE_URL },
  },
  // The following projects should only be run explicitly with the --project flag
  {
    name: "Local",
    use: {
      baseURL: "http://localhost:3000",
      ...devices["Desktop Chrome"],
    },
  },
  {
    name: "QA",
    use: {
      baseURL: "https://qa.goodparty.org",
      ...devices["Desktop Chrome"],
    },
  },
  ],
});
