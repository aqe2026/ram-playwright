import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * ============================================
 * 🔴 ADVANCED: Authentication & Session Handling
 * ============================================
 * 
 * What you'll learn:
 * - How to save and reuse authentication state
 * - How storageState works (cookies + localStorage)
 * - How to test session persistence across page reloads
 * - How to test session expiry / logout
 * 
 * This works with the auth.setup.ts file which
 * saves auth state before these tests run.
 */

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

test.describe('Authentication & Session', () => {

  test('should persist login across page navigation', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@demo.com');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');

    // Navigate to different pages — should stay logged in
    await page.goto('/products');
    await expect(page.getByTestId('products-title')).toBeVisible();
    await expect(page.getByTestId('logout-button')).toBeVisible();

    await page.goto('/products/new');
    await expect(page.getByTestId('form-title')).toBeVisible();
    await expect(page.getByTestId('logout-button')).toBeVisible();

    // Go back to dashboard
    await page.goto('/dashboard');
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('should persist login after page reload', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@demo.com');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');

    // Reload the page
    await page.reload();

    // Should still be logged in
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('should clear session on logout', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@demo.com');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');

    // Logout
    await page.getByTestId('logout-button').click();
    await expect(page).toHaveURL(/\/login/);

    // Try to access protected page
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);

    // Verify localStorage is cleared
    const authData = await page.evaluate(() => localStorage.getItem('auth_user'));
    expect(authData).toBeNull();
  });

  test('should store auth data in localStorage', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@demo.com');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');

    // Check localStorage has auth data
    const authData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('auth_user') || 'null');
    });

    expect(authData).not.toBeNull();
    expect(authData.email).toBe('admin@demo.com');
    expect(authData.name).toBe('Admin User');
    expect(authData.role).toBe('admin');
  });

  test('should save and reuse storage state', async ({ page, context }) => {
    // Login
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@demo.com');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');

    // Save the current state
    await context.storageState({ path: authFile });

    // Verify the state was saved (in a real test, other tests would load this file)
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('should show different content for different roles', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@demo.com');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');

    // Check admin-specific content
    await expect(page.getByTestId('welcome-message')).toContainText('Admin User');

    // Logout and login as regular user
    await page.getByTestId('logout-button').click();
    await page.getByTestId('email-input').fill('user@demo.com');
    await page.getByTestId('password-input').fill('user123');
    await page.getByTestId('login-button').click();
    await page.waitForURL('/dashboard');

    // Check user-specific content
    await expect(page.getByTestId('welcome-message')).toContainText('Test User');
  });
});
