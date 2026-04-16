import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration
 * ========================
 * This file configures how Playwright runs your tests.
 * 
 * Key concepts for beginners:
 * - `baseURL`: The root URL of your app (so you can use relative paths in tests)
 * - `projects`: Different browser configurations to test against
 * - `webServer`: Automatically starts your dev server before running tests
 * - `retries`: How many times to retry a failed test
 * - `trace`: Records a trace of test execution for debugging
 */

export default defineConfig({
  // ── Test Directory ──────────────────────────────────────
  testDir: './tests',

  // ── Parallel Execution ──────────────────────────────────
  // Run tests in files in parallel (speeds up test suite)
  fullyParallel: true,

  // ── CI-specific Settings ────────────────────────────────
  // Fail the build on CI if test.only() is accidentally left in code
  forbidOnly: !!process.env.CI,

  // ── Retries ─────────────────────────────────────────────
  // Retry failed tests (helps with flaky tests)
  // 0 retries locally, 2 retries in CI
  retries: process.env.CI ? 2 : 0,

  // ── Workers ─────────────────────────────────────────────
  // Number of parallel test workers
  // Use fewer in CI to avoid resource contention
  workers: process.env.CI ? 1 : undefined,

  // ── Reporter ────────────────────────────────────────────
  // HTML reporter generates a beautiful test report
  reporter: [
    ['html', { open: 'never' }],
    ['list'],  // Also show list output in terminal
  ],

  // ── Global Settings ─────────────────────────────────────
  use: {
    // Base URL for all tests (allows relative navigation)
    baseURL: 'http://localhost:5173',

    // Capture trace on first retry (for debugging failures)
    trace: 'on-first-retry',

    // Take screenshot on failure
    screenshot: 'only-on-failure',

    // Record video on first retry
    video: 'on-first-retry',

    // Default timeout for actions (click, fill, etc.)
    actionTimeout: 10000,

    // Default navigation timeout
    navigationTimeout: 30000,
  },

  // ── Browser Projects ────────────────────────────────────
  // Each project runs all tests in a specific browser
  projects: [
    // Setup project — runs authentication before other tests
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Chromium (Google Chrome)
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },

    // Firefox
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
      dependencies: ['setup'],
    },

    // WebKit (Safari)
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
      dependencies: ['setup'],
    },

    // Mobile Chrome (responsive testing)
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
      dependencies: ['setup'],
    },
  ],

  // ── Web Server ──────────────────────────────────────────
  // Automatically start the Vite dev server before running tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes to start
  },
});
