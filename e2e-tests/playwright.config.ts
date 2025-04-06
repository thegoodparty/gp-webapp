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
  workers: 3,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/playwright-results.json" }],
  ],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:4000/",
    storageState: undefined,
    contextOptions: {
      viewport: null,
      ignoreHTTPSErrors: true,
    },
    trace: "on-first-retry",
    launchOptions: {
      slowMo: process.env.CI ? 100 : 0,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  }
});
