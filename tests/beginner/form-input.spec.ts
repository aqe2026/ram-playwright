import { test, expect } from '@playwright/test';

/**
 * ============================================
 * 🟢 BEGINNER: Form Input & Submission
 * ============================================
 * 
 * What you'll learn:
 * - How to type into input fields with fill()
 * - How to click buttons with click()
 * - How to test form validation
 * - How to verify error messages
 * - How to test successful form submission
 */

test.describe('Login Form — Input & Submission', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should type into email field', async ({ page }) => {
    const emailInput = page.getByTestId('email-input');

    // Type a value into the input
    await emailInput.fill('test@example.com');

    // Verify the value was entered
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should type into password field', async ({ page }) => {
    const passwordInput = page.getByTestId('password-input');

    await passwordInput.fill('mypassword');
    await expect(passwordInput).toHaveValue('mypassword');
  });

  test('should show error for empty form submission', async ({ page }) => {
    // Click login without filling anything
    await page.getByTestId('login-button').click();

    // Error message should appear
    const errorMsg = page.getByTestId('error-message');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('required');
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.getByTestId('email-input').fill('not-an-email');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();

    const errorMsg = page.getByTestId('error-message');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('valid email');
  });

  test('should show error for short password', async ({ page }) => {
    await page.getByTestId('email-input').fill('admin@demo.com');
    await page.getByTestId('password-input').fill('123');
    await page.getByTestId('login-button').click();

    const errorMsg = page.getByTestId('error-message');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('at least 6 characters');
  });

  test('should show error for wrong credentials', async ({ page }) => {
    await page.getByTestId('email-input').fill('wrong@test.com');
    await page.getByTestId('password-input').fill('wrongpassword');
    await page.getByTestId('login-button').click();

    const errorMsg = page.getByTestId('error-message');
    await expect(errorMsg).toBeVisible({ timeout: 5000 });
    await expect(errorMsg).toContainText('Invalid');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Fill in valid admin credentials
    await page.getByTestId('email-input').fill('admin@demo.com');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();

    // Should navigate to dashboard
    await page.waitForURL('/dashboard');
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('should fill credentials using "Use" button', async ({ page }) => {
    // Click the "Use" button next to admin credentials
    await page.getByTestId('fill-admin').click();

    // Verify fields are filled
    await expect(page.getByTestId('email-input')).toHaveValue('admin@demo.com');
    await expect(page.getByTestId('password-input')).toHaveValue('admin123');
  });

  test('should clear error when user types', async ({ page }) => {
    // Trigger an error
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('error-message')).toBeVisible();

    // Start typing — error should clear
    await page.getByTestId('email-input').fill('a');
    await expect(page.getByTestId('error-message')).not.toBeVisible();
  });
});
