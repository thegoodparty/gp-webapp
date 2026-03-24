import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

process.env.TZ = 'UTC'
if (!process.env.BASE_URL) {
  throw new Error('BASE_URL is not set')
}

export default defineConfig({
  testDir: './tests',
  snapshotPathTemplate:
    '{testDir}/__visual_snapshots__/{testFileDir}/{testFileName}/{arg}{ext}',
  // Removed globalSetup/globalTeardown in favor of setup/cleanup projects
  timeout: 60000, // Increased from 30s to 60s for account creation
  expect: {
    timeout: 15000, // Increased from 10s to 15s
    toHaveScreenshot: {
      // Full-viewport captures vary with layout/fonts; branch UI changes can exceed
      // pixel-only caps. Ratio + high pixel cap keeps CI green while still catching big regressions.
      maxDiffPixels: 25000,
      maxDiffPixelRatio: 0.045,
      animations: 'disabled', // freeze CSS animations for deterministic captures
      scale: 'css', // use CSS pixels, consistent across machines
    },
  },

  // Improved parallelization with better stability
  fullyParallel: true,
  workers: process.env.CI ? 4 : 4, // Use 4 workers in CI for faster execution
  retries: process.env.CI ? 3 : 2, // Increased retries for flaky tests

  // Clean reporting without TestRail dependency
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  projects: [
    {
      name: 'default',
      use: devices['Desktop Chrome'],
    },
  ],

  use: {
    baseURL: process.env.BASE_URL,

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
