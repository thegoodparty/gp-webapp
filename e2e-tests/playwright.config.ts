import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

export default defineConfig({
  testDir: './tests',
  // Removed globalSetup/globalTeardown in favor of setup/cleanup projects
  timeout: 60000, // Increased from 30s to 60s for account creation
  expect: {
    timeout: 15000, // Increased from 10s to 15s
    toHaveScreenshot: {
      maxDiffPixels: 75,
      animations: 'disabled',
      scale: 'css',
    },
  },

  // Improved parallelization with better stability
  fullyParallel: true,
  workers: process.env.CI ? 4 : 2, // Use 4 workers in CI for faster execution
  retries: process.env.CI ? 3 : 2, // Increased retries for flaky tests

  // Clean reporting without TestRail dependency
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // Setup project for authentication + main testing project
  projects: [
    // Stable tests project - all tests EXCEPT @experimental (blocking PR checks)
    {
      name: 'stable',
      use: devices['Desktop Chrome'],
      grep: /^(?!.*@experimental).*$/, // Negative lookahead: exclude @experimental
    },
    // Experimental tests project - only @experimental tagged tests (non-blocking PR checks)
    {
      name: 'experimental',
      use: devices['Desktop Chrome'],
      grep: /@experimental/,
    },
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4000',

    // Increased timeouts for better reliability
    actionTimeout: 15000, // Increased from 10s
    navigationTimeout: 45000, // Increased from 30s

    // Essential browser settings
    headless: true,
    ignoreHTTPSErrors: true,

    // Browser args optimized for stability
    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor', // Helps with stability
        '--disable-background-timer-throttling', // Prevents timeouts
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ],
    },

    // Better debugging and error tracking
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
})
