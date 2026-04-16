import { test, expect } from '@playwright/test';

/**
 * ============================================
 * 🟢 BEGINNER: Basic UI Element Checks
 * ============================================
 * 
 * What you'll learn:
 * - How to find elements using getByTestId()
 * - How to find elements using getByRole()
 * - How to check visibility with toBeVisible()
 * - How to check text content with toHaveText()
 * - How to check element attributes
 * 
 * These tests verify that UI elements are present and correct.
 */

test.describe('UI Element Checks — Login Page', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
  });

  test('should display the login form', async ({ page }) => {
    // Check the form is visible using data-testid
    const loginForm = page.getByTestId('login-form');
    await expect(loginForm).toBeVisible();
  });

  test('should display email and password inputs', async ({ page }) => {
    // Find elements by their test IDs
    const emailInput = page.getByTestId('email-input');
    const passwordInput = page.getByTestId('password-input');

    // Both should be visible
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Check input types
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should display the login button', async ({ page }) => {
    // Find button using getByTestId
    const loginButton = page.getByTestId('login-button');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveText('Sign In');
    await expect(loginButton).toBeEnabled();
  });

  test('should display demo credentials section', async ({ page }) => {
    const demoSection = page.getByTestId('demo-credentials');
    await expect(demoSection).toBeVisible();

    // Check that both "Use" buttons exist
    await expect(page.getByTestId('fill-admin')).toBeVisible();
    await expect(page.getByTestId('fill-user')).toBeVisible();
  });

  test('should have placeholder text in inputs', async ({ page }) => {
    const emailInput = page.getByTestId('email-input');
    await expect(emailInput).toHaveAttribute('placeholder', 'admin@demo.com');
  });

  test('should display the navigation bar', async ({ page }) => {
    const navbar = page.getByTestId('navbar');
    await expect(navbar).toBeVisible();
  });

  test('should display the logo in navbar', async ({ page }) => {
    const logo = page.getByTestId('nav-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toContainText('QA TestApp');
  });

  test('should find elements using getByRole', async ({ page }) => {
    // Find the login button by its role
    const button = page.getByRole('button', { name: 'Sign In' });
    await expect(button).toBeVisible();

    // Find inputs by their labels
    const emailInput = page.getByLabel('Email Address');
    await expect(emailInput).toBeVisible();
  });
});
