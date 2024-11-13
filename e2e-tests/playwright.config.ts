import { defineConfig, devices } from '@playwright/test';
export default defineConfig({

  globalSetup: require.resolve('./globalSetup.js'),
  globalTeardown: require.resolve('./globalTeardown.js'),

  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4000/', // Fallback to default URL if not provided
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL, 
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'],
        baseURL: process.env.BASE_URL, 
      },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'],
        baseURL: process.env.BASE_URL, 
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ]
});
