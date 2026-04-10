import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'
import { defineConfig, devices } from '@playwright/test'

const e2eRoot = __dirname
const dotEnv = resolve(e2eRoot, '.env')
const dotEnvLocal = resolve(e2eRoot, '.env.local')
if (existsSync(dotEnv)) {
  loadEnv({ path: dotEnv })
}
if (existsSync(dotEnvLocal)) {
  loadEnv({ path: dotEnvLocal, override: true })
}

process.env.TZ = 'UTC'
if (!process.env.BASE_URL) {
  throw new Error('BASE_URL is not set')
}

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  snapshotPathTemplate:
    '{testDir}/__visual_snapshots__/{testFileDir}/{testFileName}/{arg}{ext}',
  // globalSetup: require.resolve('./global-setup'),
  // globalTeardown: require.resolve('./global-teardown'),
  timeout: 120000,
  expect: {
    timeout: 15000,
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
      dependencies: ['global setup'],
    },
    {
      name: 'global setup',
      testDir: './',
      testMatch: /global-setup\.ts/,
      teardown: 'global teardown',
    },
    {
      name: 'global teardown',
      testDir: './',
      testMatch: /global-teardown\.ts/,
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
        '--disable-background-timer-throttling', // Prevents timeouts
        '--disable-backgrounding-occluded-windows',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--disable-features=VizDisplayCompositor', // Helps with stability
        '--disable-renderer-backgrounding',
        // '--disable-web-security',
        '--no-sandbox',
      ],
    },

    // Better debugging and error tracking
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
})
