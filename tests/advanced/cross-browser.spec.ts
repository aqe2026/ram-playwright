import { test, expect } from '@playwright/test';
import { loginAs } from '../utils/helpers';

/**
 * ============================================
 * 🔴 ADVANCED: Cross-Browser Testing
 * ============================================
 * 
 * What you'll learn:
 * - How to run tests on specific browsers
 * - How to skip tests on certain browsers
 * - How to write browser-specific logic
 * - How browser projects are configured in playwright.config.ts
 * 
 * Cross-browser testing ensures your app works on:
 * - Chromium (Google Chrome, Microsoft Edge)
 * - Firefox
 * - WebKit (Safari)
 */

test.describe('Cross-Browser Tests', () => {

  test('should work on all browsers — Login flow', async ({ page, browserName }) => {
    // This test runs on ALL configured browsers (Chromium, Firefox, WebKit)
    console.log(`Running on: ${browserName}`);

    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@demo.com');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');

    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('should render product grid on all browsers', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');

    // Product grid should render correctly on all browsers
    const productCards = page.locator('[data-testid^="product-card-"]');
    await expect(productCards.first()).toBeVisible();
    const count = await productCards.count();
    expect(count).toBe(15);
  });

  // Skip this test on Firefox (example of browser-specific skip)
  test('should handle modal animations', async ({ page, browserName }) => {
    test.skip(browserName === 'firefox', 'Modal animation test skipped on Firefox');

    await loginAs(page, 'admin');
    await page.goto('/products');

    await page.getByTestId('delete-product-1').click();
    await expect(page.getByTestId('modal-overlay')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();
  });

  // Run this test ONLY on Chromium
  test('chromium-only features', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'This test only runs on Chromium');

    await loginAs(page, 'admin');
    
    // Chromium-specific: Check performance timing
    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
        loadComplete: nav.loadEventEnd - nav.startTime,
      };
    });

    console.log(`DOM Content Loaded: ${timing.domContentLoaded}ms`);
    console.log(`Full Load: ${timing.loadComplete}ms`);
  });

  // Run this test ONLY on WebKit (Safari)
  test('webkit-specific test', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'This test only runs on WebKit');

    await loginAs(page, 'admin');
    
    // WebKit might handle certain CSS differently
    const navbar = page.getByTestId('navbar');
    await expect(navbar).toBeVisible();
  });

  test('should handle form submission across browsers', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products/new');

    // Fill form
    await page.getByTestId('input-name').fill('Cross-Browser Product');
    await page.getByTestId('input-category').selectOption('Electronics');
    await page.getByTestId('input-price').fill('49.99');
    await page.getByTestId('input-stock').fill('100');
    await page.getByTestId('input-description').fill('Product tested across all major browsers');
    await page.getByTestId('submit-button').click();

    await expect(page.getByTestId('success-message')).toBeVisible();
  });
});
