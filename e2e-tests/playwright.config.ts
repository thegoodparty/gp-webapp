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
  retries: 1,
  workers: 2,
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
      acceptDownloads: true,
      extraHTTPHeaders: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
      },
    },
    trace: "on-first-retry",
    launchOptions: {
      slowMo: process.env.CI ? 100 : 25,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
      ],
    },
  },
  expect: {
    timeout: 10000,
  },
});
