import { test, expect } from '@playwright/test';
import { loginAs } from '../utils/helpers';

/**
 * ============================================
 * 🟡 INTERMEDIATE: Advanced Assertions
 * ============================================
 * 
 * What you'll learn:
 * - toBeVisible() — element exists and is visible
 * - toHaveText() — exact text match
 * - toContainText() — partial text match
 * - toHaveCount() — number of matching elements
 * - toHaveAttribute() — element attribute checks
 * - toHaveCSS() — CSS property checks
 * - toBeEnabled() / toBeDisabled()
 * - Soft assertions (non-failing)
 */

test.describe('Advanced Assertions', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin');
  });

  test('toBeVisible — check element visibility', async ({ page }) => {
    // Dashboard elements should be visible
    await expect(page.getByTestId('welcome-message')).toBeVisible();
    await expect(page.getByTestId('stats-grid')).toBeVisible();
    await expect(page.getByTestId('navbar')).toBeVisible();
  });

  test('toHaveText — exact text match', async ({ page }) => {
    // Check exact text content
    await expect(page.getByTestId('products-title')).not.toBeVisible();
    
    // Navigate to products
    await page.goto('/products');
    await expect(page.getByTestId('products-title')).toHaveText('Products');
  });

  test('toContainText — partial text match', async ({ page }) => {
    // Welcome message contains the user's name
    await expect(page.getByTestId('welcome-message')).toContainText('Admin User');
    
    // Also contains "Welcome"
    await expect(page.getByTestId('welcome-message')).toContainText('Welcome');
  });

  test('toHaveCount — count matching elements', async ({ page }) => {
    await page.goto('/products');

    // Count product cards (we have 15 products by default)
    const productCards = page.locator('[data-testid^="product-card-"]');
    await expect(productCards).toHaveCount(15);
  });

  test('toHaveAttribute — check element attributes', async ({ page }) => {
    await page.goto('/login');

    // Check input attributes
    await expect(page.getByTestId('email-input')).toHaveAttribute('type', 'email');
    await expect(page.getByTestId('password-input')).toHaveAttribute('type', 'password');
    await expect(page.getByTestId('email-input')).toHaveAttribute('placeholder', 'admin@demo.com');
  });

  test('toBeEnabled / toBeDisabled — button state', async ({ page }) => {
    await page.goto('/login');

    // Login button should be enabled
    await expect(page.getByTestId('login-button')).toBeEnabled();
  });

  test('toHaveURL — URL assertions', async ({ page }) => {
    // Check current URL
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate and check again
    await page.goto('/products');
    await expect(page).toHaveURL(/\/products/);
  });

  test('toHaveValue — input value assertions', async ({ page }) => {
    // Logout first to access login page
    await page.getByTestId('logout-button').click();
    await page.goto('/login');

    // Fill and verify value
    await page.getByTestId('email-input').fill('test@example.com');
    await expect(page.getByTestId('email-input')).toHaveValue('test@example.com');
  });

  test('not modifier — negative assertions', async ({ page }) => {
    // Error message should NOT be visible on dashboard
    await expect(page.getByTestId('error-message')).not.toBeVisible();

    // Login form should NOT be visible on dashboard
    await expect(page.getByTestId('login-form')).not.toBeVisible();
  });

  test('soft assertions — non-blocking checks', async ({ page }) => {
    // Soft assertions don't stop the test on failure
    // Useful for checking multiple things at once
    await expect.soft(page.getByTestId('welcome-message')).toBeVisible();
    await expect.soft(page.getByTestId('stats-grid')).toBeVisible();
    await expect.soft(page.getByTestId('inventory-value-card')).toBeVisible();
    await expect.soft(page.getByTestId('quick-actions')).toBeVisible();
    await expect.soft(page.getByTestId('recent-products')).toBeVisible();
  });

  test('count products in different categories', async ({ page }) => {
    await page.goto('/products');

    // Filter by Electronics
    await page.getByTestId('category-filter').selectOption('Electronics');
    await page.waitForTimeout(300);

    // Count Electronics products
    const resultText = await page.getByTestId('result-count').textContent();
    expect(resultText).toContain('product');

    // Should be a subset of total
    const electronicsCount = await page.locator('[data-testid^="product-card-"]').count();
    expect(electronicsCount).toBeGreaterThan(0);
    expect(electronicsCount).toBeLessThan(15);
  });
});
