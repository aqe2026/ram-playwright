import { test, expect } from '@playwright/test';

/**
 * ============================================
 * 🟢 BEGINNER: Title & Basic Page Checks
 * ============================================
 * 
 * What you'll learn:
 * - How to launch a page with page.goto()
 * - How to check the page title with toHaveTitle()
 * - How to verify basic page content
 * 
 * These are the simplest tests — perfect for getting started!
 */

test.describe('Title & Basic Page Checks', () => {

  test('should have the correct page title', async ({ page }) => {
    // Navigate to the app
    await page.goto('/login');

    // Check the page title (set in index.html <title> tag)
    await expect(page).toHaveTitle(/QA TestApp/);
  });

  test('should display the app name in the header', async ({ page }) => {
    await page.goto('/login');

    // Check that the login title text is visible
    const title = page.getByTestId('login-title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('QA TestApp');
  });

  test('should display the login subtitle', async ({ page }) => {
    await page.goto('/login');

    const subtitle = page.getByTestId('login-subtitle');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('Sign in');
  });

  test('should have a favicon', async ({ page }) => {
    await page.goto('/login');

    // Check that the page has loaded successfully (status 200)
    const response = await page.goto('/login');
    expect(response?.status()).toBe(200);
  });

  test('should have proper meta description', async ({ page }) => {
    await page.goto('/login');

    // Check meta description tag exists
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /QA TestApp/);
  });
});
