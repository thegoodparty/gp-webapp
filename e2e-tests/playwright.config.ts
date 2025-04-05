import { defineConfig } from "@playwright/test";
import 'dotenv/config';

console.log('BASE_URL from env:', process.env.BASE_URL);

export default defineConfig({
  globalSetup: require.resolve("./globalSetup.js"),
  globalTeardown: require.resolve("./globalTeardown.js"),
  timeout: 60000,
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/playwright-results.json" }],
  ],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:4000/", // Fallback to default URL if not provided
    storageState: undefined,
    contextOptions: { viewport: null },
    trace: "on-first-retry",
    launchOptions: {
      slowMo: process.env.CI ? 100 : 0,
    },
  }
});
