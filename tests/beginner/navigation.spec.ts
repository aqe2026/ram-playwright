import { test, expect } from '@playwright/test';
import { loginAs } from '../utils/helpers';

/**
 * ============================================
 * 🟢 BEGINNER: Navigation Testing
 * ============================================
 * 
 * What you'll learn:
 * - How to test page navigation with links
 * - How to verify URL changes with toHaveURL()
 * - How to test protected routes (redirect to login)
 * - How to use the browser back/forward buttons
 */

test.describe('Navigation Testing', () => {

  test('should redirect to login when not authenticated', async ({ page }) => {
    // Try to access dashboard directly without logging in
    await page.goto('/dashboard');

    // Should be redirected to login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect to login for products page', async ({ page }) => {
    await page.goto('/products');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate to dashboard after login', async ({ page }) => {
    await loginAs(page, 'admin');

    // Verify we're on the dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('should navigate between pages using navbar links', async ({ page }) => {
    await loginAs(page, 'admin');

    // Click on "Products" nav link
    await page.getByTestId('nav-link-products').click();
    await expect(page).toHaveURL(/\/products/);
    await expect(page.getByTestId('products-title')).toBeVisible();

    // Click on "Dashboard" nav link
    await page.getByTestId('nav-link-dashboard').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('welcome-message')).toBeVisible();

    // Click on "Add Product" nav link
    await page.getByTestId('nav-link-add-product').click();
    await expect(page).toHaveURL(/\/products\/new/);
    await expect(page.getByTestId('form-title')).toBeVisible();
  });

  test('should navigate using quick action links on dashboard', async ({ page }) => {
    await loginAs(page, 'admin');

    // Click "View Products" quick action
    await page.getByTestId('action-view-products').click();
    await expect(page).toHaveURL(/\/products/);
  });

  test('should navigate back with browser back button', async ({ page }) => {
    await loginAs(page, 'admin');

    // Go to products page
    await page.getByTestId('nav-link-products').click();
    await expect(page).toHaveURL(/\/products/);

    // Click back button
    await page.goBack();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should redirect to login after logout', async ({ page }) => {
    await loginAs(page, 'admin');

    // Click logout
    await page.getByTestId('logout-button').click();

    // Should be back at login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate to edit product page', async ({ page }) => {
    await loginAs(page, 'admin');

    // Go to products
    await page.goto('/products');
    await expect(page.getByTestId('products-title')).toBeVisible();

    // Click edit on first product
    await page.getByTestId('edit-product-1').click();
    await expect(page).toHaveURL(/\/products\/edit\/1/);
    await expect(page.getByTestId('form-title')).toHaveText('Edit Product');
  });

  test('should handle unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page');

    // Should redirect to login (default route)
    await expect(page).toHaveURL(/\/login/);
  });
});
