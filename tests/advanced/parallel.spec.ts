import { test, expect } from '@playwright/test';
import { loginAs } from '../utils/helpers';

/**
 * ============================================
 * 🔴 ADVANCED: Parallel Test Execution
 * ============================================
 * 
 * What you'll learn:
 * - How to run tests in parallel within a describe block
 * - When to use parallel vs serial execution
 * - How to avoid test interdependencies
 * 
 * By default, Playwright runs test FILES in parallel.
 * test.describe.parallel() also runs tests WITHIN a file in parallel.
 * test.describe.serial() runs them one after another.
 */

// These tests run in PARALLEL (each gets its own browser context)
test.describe.parallel('Parallel Execution Demo', () => {

  test('parallel test 1 — Dashboard check', async ({ page }) => {
    await loginAs(page, 'admin');
    await expect(page.getByTestId('welcome-message')).toBeVisible();
    // Simulate some work
    await page.waitForTimeout(500);
  });

  test('parallel test 2 — Products check', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');
    await expect(page.getByTestId('products-title')).toBeVisible();
    await page.waitForTimeout(500);
  });

  test('parallel test 3 — Form check', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products/new');
    await expect(page.getByTestId('form-title')).toBeVisible();
    await page.waitForTimeout(500);
  });

  test('parallel test 4 — Login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByTestId('login-form')).toBeVisible();
    await page.waitForTimeout(500);
  });
});

// These tests run SERIALLY (if one fails, the rest are skipped)
test.describe.serial('Serial Execution Demo', () => {

  test('serial step 1 — Login', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@demo.com');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');
  });

  test('serial step 2 — Navigate to products', async ({ page }) => {
    // Note: In serial mode, each test still gets a fresh page
    // This is different from having shared state
    await loginAs(page, 'admin');
    await page.goto('/products');
    await expect(page.getByTestId('products-title')).toBeVisible();
  });

  test('serial step 3 — Search for a product', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');
    await page.getByTestId('search-input').fill('Wireless');
    await page.waitForTimeout(300);
    const count = await page.locator('[data-testid^="product-card-"]').count();
    expect(count).toBeGreaterThan(0);
  });
});
