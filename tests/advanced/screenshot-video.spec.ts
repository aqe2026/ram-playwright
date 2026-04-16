import { test, expect } from '@playwright/test';
import { loginAs } from '../utils/helpers';

/**
 * ============================================
 * 🔴 ADVANCED: Screenshot & Video Capture
 * ============================================
 * 
 * What you'll learn:
 * - How to take screenshots programmatically
 * - Full page vs element screenshots
 * - Video recording configuration
 * - Trace viewer setup and usage
 * - How to use these for debugging
 */

test.describe('Screenshot Capture', () => {

  test('take a full page screenshot', async ({ page }) => {
    await loginAs(page, 'admin');

    // Full page screenshot
    await page.screenshot({
      path: 'playwright/screenshots/dashboard-full.png',
      fullPage: true,
    });

    // Verify the page rendered correctly
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('take viewport-only screenshot', async ({ page }) => {
    await loginAs(page, 'admin');

    // Only captures the visible viewport (not scrolled content)
    await page.screenshot({
      path: 'playwright/screenshots/dashboard-viewport.png',
      fullPage: false,
    });
  });

  test('take element screenshot', async ({ page }) => {
    await loginAs(page, 'admin');

    // Screenshot of a specific element
    const statsGrid = page.getByTestId('stats-grid');
    await statsGrid.screenshot({
      path: 'playwright/screenshots/stats-grid.png',
    });

    // Screenshot of the inventory card
    const inventoryCard = page.getByTestId('inventory-value-card');
    await inventoryCard.screenshot({
      path: 'playwright/screenshots/inventory-card.png',
    });
  });

  test('screenshot on different pages', async ({ page }) => {
    // Login page screenshot
    await page.goto('/login');
    await page.screenshot({
      path: 'playwright/screenshots/login-page.png',
      fullPage: true,
    });

    // Login and take dashboard screenshot
    await loginAs(page, 'admin');
    await page.screenshot({
      path: 'playwright/screenshots/dashboard-page.png',
      fullPage: true,
    });

    // Products page screenshot
    await page.goto('/products');
    await expect(page.getByTestId('products-title')).toBeVisible();
    await page.screenshot({
      path: 'playwright/screenshots/products-page.png',
      fullPage: true,
    });

    // Product form screenshot
    await page.goto('/products/new');
    await expect(page.getByTestId('form-title')).toBeVisible();
    await page.screenshot({
      path: 'playwright/screenshots/product-form.png',
      fullPage: true,
    });
  });

  test('screenshot with custom clip region', async ({ page }) => {
    await loginAs(page, 'admin');

    // Screenshot of a specific region (x, y, width, height)
    await page.screenshot({
      path: 'playwright/screenshots/navbar-clip.png',
      clip: { x: 0, y: 0, width: 1280, height: 64 },
    });
  });
});

test.describe('Trace Viewer', () => {

  test('trace demonstrates actions for debugging', async ({ page, context }) => {
    // Traces are configured in playwright.config.ts
    // They capture: screenshots, DOM snapshots, network logs, console logs
    
    // Start tracing manually (beyond config)
    await context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });

    // Perform actions (these will be captured in the trace)
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@demo.com');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');
    await page.goto('/products');

    // Stop tracing and save
    await context.tracing.stop({
      path: 'playwright/traces/trace-demo.zip',
    });

    // To view: npx playwright show-trace playwright/traces/trace-demo.zip
  });
});

test.describe('Video Recording', () => {

  test('video is captured based on config', async ({ page }) => {
    /**
     * Video recording is configured in playwright.config.ts:
     *   video: 'on-first-retry'  — records video only on retry
     *   video: 'on'              — always records
     *   video: 'retain-on-failure' — keeps video only for failures
     * 
     * Videos are saved in the test results directory
     */
    await loginAs(page, 'admin');
    await page.goto('/products');
    await expect(page.getByTestId('products-title')).toBeVisible();

    // Navigate around to create an interesting video
    await page.getByTestId('search-input').fill('Wireless');
    await page.waitForTimeout(500);
    await page.getByTestId('search-input').clear();
    await page.waitForTimeout(500);
    await page.getByTestId('category-filter').selectOption('Electronics');
    await page.waitForTimeout(500);

    // The video path is available in test results
    const video = page.video();
    if (video) {
      console.log('Video will be saved at:', await video.path());
    }
  });
});
