import { test, expect } from '@playwright/test';
import { loginAs } from '../utils/helpers';

/**
 * ============================================
 * 🔴 ADVANCED: Performance & Load Checks
 * ============================================
 * 
 * What you'll learn:
 * - How to measure page load times
 * - How to check Navigation Timing API
 * - How to verify resource loading
 * - Basic performance benchmarks in tests
 * 
 * Note: Playwright is NOT a load testing tool,
 * but you can check basic performance metrics.
 */

test.describe('Performance Checks', () => {

  test('measure page load time', async ({ page }) => {
    await loginAs(page, 'admin');

    // Measure time to navigate to products page
    const startTime = Date.now();
    await page.goto('/products');
    await expect(page.getByTestId('products-title')).toBeVisible();
    const loadTime = Date.now() - startTime;

    console.log(`Products page load time: ${loadTime}ms`);

    // Assert the page loads within a reasonable time (3 seconds)
    expect(loadTime).toBeLessThan(3000);
  });

  test('check navigation timing API', async ({ page }) => {
    await loginAs(page, 'admin');

    // Get Navigation Timing metrics
    const timing = await page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (entries.length === 0) return null;
      const nav = entries[0];
      return {
        // DNS lookup time
        dnsLookup: nav.domainLookupEnd - nav.domainLookupStart,
        // TCP connection time
        tcpConnect: nav.connectEnd - nav.connectStart,
        // Time to first byte
        ttfb: nav.responseStart - nav.requestStart,
        // DOM content loaded
        domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
        // Full page load
        pageLoad: nav.loadEventEnd - nav.startTime,
        // DOM interactive
        domInteractive: nav.domInteractive - nav.startTime,
      };
    });

    if (timing) {
      console.log('Performance Metrics:');
      console.log(`  DNS Lookup: ${timing.dnsLookup.toFixed(2)}ms`);
      console.log(`  TCP Connect: ${timing.tcpConnect.toFixed(2)}ms`);
      console.log(`  TTFB: ${timing.ttfb.toFixed(2)}ms`);
      console.log(`  DOM Content Loaded: ${timing.domContentLoaded.toFixed(2)}ms`);
      console.log(`  DOM Interactive: ${timing.domInteractive.toFixed(2)}ms`);
      console.log(`  Full Page Load: ${timing.pageLoad.toFixed(2)}ms`);

      // Assert reasonable performance
      expect(timing.domContentLoaded).toBeLessThan(5000);
    }
  });

  test('check resource loading count', async ({ page }) => {
    await loginAs(page, 'admin');

    // Count loaded resources
    const resourceCount = await page.evaluate(() => {
      return performance.getEntriesByType('resource').length;
    });

    console.log(`Total resources loaded: ${resourceCount}`);

    // Should not load too many resources (keep bundle small)
    expect(resourceCount).toBeLessThan(50);
  });

  test('measure render time for product grid', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');

    // Measure how quickly the product grid renders
    const renderTime = await page.evaluate(() => {
      const start = performance.now();
      // Force a synchronous layout
      document.querySelector('[data-testid="product-grid"]')?.getBoundingClientRect();
      return performance.now() - start;
    });

    console.log(`Product grid render time: ${renderTime.toFixed(2)}ms`);
    expect(renderTime).toBeLessThan(100); // Should be very fast
  });

  test('check for console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await loginAs(page, 'admin');
    await page.goto('/products');
    await page.goto('/products/new');

    // There should be no console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('check for no JavaScript errors', async ({ page }) => {
    const pageErrors: string[] = [];

    // Listen for uncaught exceptions
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    await loginAs(page, 'admin');
    await page.goto('/dashboard');
    await page.goto('/products');
    await page.goto('/products/new');

    // No uncaught errors should occur
    expect(pageErrors).toHaveLength(0);
  });

  test('measure search response time', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');

    // Measure search responsiveness
    const startTime = Date.now();
    await page.getByTestId('search-input').fill('Wireless');
    await page.waitForTimeout(300); // Wait for debounce
    await expect(page.locator('[data-testid^="product-card-"]').first()).toBeVisible();
    const searchTime = Date.now() - startTime;

    console.log(`Search response time: ${searchTime}ms`);
    expect(searchTime).toBeLessThan(2000); // Should respond within 2 seconds
  });
});
