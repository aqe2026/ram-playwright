import { test, expect } from '@playwright/test';
import { loginAs } from '../utils/helpers';

/**
 * ============================================
 * 🔴 ADVANCED: Visual Regression Testing
 * ============================================
 * 
 * What you'll learn:
 * - How to use toHaveScreenshot() for visual comparisons
 * - How to set pixel difference thresholds
 * - How to update baseline screenshots
 * - When to use visual regression tests
 * 
 * Visual regression tests compare the current screenshot
 * with a previously saved "baseline" screenshot.
 * If they differ by more than the threshold, the test fails.
 * 
 * First run: Creates baseline screenshots (tests will pass)
 * Subsequent runs: Compares against baselines
 * 
 * To update baselines: npx playwright test --update-snapshots
 */

test.describe('Visual Regression Tests', () => {

  test('login page visual snapshot', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Compare the full page with the baseline
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      // Allow 1% pixel difference (for anti-aliasing, font rendering)
      maxDiffPixelRatio: 0.01,
    });
  });

  test('dashboard visual snapshot', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.waitForLoadState('networkidle');

    // Wait for animations to finish
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('dashboard-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test('products page visual snapshot', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('products-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test('product form visual snapshot', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products/new');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('product-form.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test('navbar component snapshot', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.waitForTimeout(300);

    // Snapshot of just the navbar element
    const navbar = page.getByTestId('navbar');
    await expect(navbar).toHaveScreenshot('navbar-component.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('modal visual snapshot', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');

    // Open the delete modal
    await page.getByTestId('delete-product-1').click();
    await expect(page.getByTestId('modal-overlay')).toBeVisible();
    await page.waitForTimeout(300); // Wait for animation

    // Snapshot of the modal
    const modal = page.getByTestId('modal-content');
    await expect(modal).toHaveScreenshot('delete-modal.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('search results visual snapshot', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');

    // Search for something
    await page.getByTestId('search-input').fill('Wireless');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('search-results.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02, // Slightly higher threshold for dynamic content
    });
  });
});
