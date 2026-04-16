import { test, expect } from '@playwright/test';
import { loginAs, searchProducts, filterByCategory, fillProductForm } from '../utils/helpers';
import { testProduct, searchTerms } from '../utils/test-data';

/**
 * ============================================
 * 🟡 INTERMEDIATE: Reusable Test Utilities
 * ============================================
 * 
 * What you'll learn:
 * - How to use shared helper functions across tests
 * - How to use centralized test data
 * - Why DRY (Don't Repeat Yourself) matters in testing
 * - How to create custom test fixtures
 * 
 * These tests use the helpers from /tests/utils/
 */

test.describe('Using Helper Functions', () => {

  test('should login using the loginAs helper', async ({ page }) => {
    // Instead of manually filling the form every time,
    // use the helper function
    await loginAs(page, 'admin');

    // Verify login was successful
    await expect(page.getByTestId('welcome-message')).toContainText('Admin User');
  });

  test('should login as different user types', async ({ page }) => {
    // Login as regular user
    await loginAs(page, 'user');
    await expect(page.getByTestId('welcome-message')).toContainText('Test User');
  });

  test('should search products using helper', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');

    // Use the search helper
    await searchProducts(page, searchTerms.existing);

    // Should find matching products
    const count = await page.locator('[data-testid^="product-card-"]').count();
    expect(count).toBeGreaterThan(0);
  });

  test('should search with no results using helper', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');

    await searchProducts(page, searchTerms.noResults);

    // Should show no results message
    await expect(page.getByTestId('no-results')).toBeVisible();
  });

  test('should filter by category using helper', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');

    await filterByCategory(page, searchTerms.category);

    const count = await page.locator('[data-testid^="product-card-"]').count();
    expect(count).toBeGreaterThan(0);
  });

  test('should fill product form using helper', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products/new');

    // Use the form filling helper
    await fillProductForm(page, testProduct.valid);

    // Verify fields are filled
    await expect(page.getByTestId('input-name')).toHaveValue(testProduct.valid.name);
    await expect(page.getByTestId('input-price')).toHaveValue(testProduct.valid.price);
  });
});

test.describe('Using Test Data Constants', () => {

  test('should use valid credentials from test-data', async ({ page }) => {
    await page.goto('/login');

    // Use centralized test data instead of hardcoded values
    await page.getByTestId('email-input').fill('admin@demo.com');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');

    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('should use test product data from constants', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products/new');

    // Fill with test data constants
    await fillProductForm(page, testProduct.valid);
    await page.getByTestId('submit-button').click();

    // Should show success
    await expect(page.getByTestId('success-message')).toBeVisible();
  });
});

test.describe('Test Hooks — beforeEach / afterEach', () => {

  // This runs BEFORE each test in this describe block
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin');
    console.log('✅ Logged in successfully');
  });

  // This runs AFTER each test in this describe block
  test.afterEach(async ({ page }) => {
    // Clean up: take a screenshot for debugging
    const testInfo = test.info();
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `playwright/screenshots/failure-${testInfo.title}.png`,
      });
    }
  });

  test('should be on dashboard (login was done in beforeEach)', async ({ page }) => {
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('should access products (login was done in beforeEach)', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByTestId('products-title')).toBeVisible();
  });
});
