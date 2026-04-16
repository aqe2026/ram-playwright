import { test as setup, expect } from '@playwright/test';
import path from 'path';

/**
 * Authentication Setup
 * ====================
 * This setup file runs BEFORE all other tests.
 * It performs login and saves the authentication state (cookies, localStorage)
 * so that other tests can reuse it without logging in again.
 * 
 * Key concept: `storageState` allows you to save and restore browser state.
 */

// Path to store the authenticated state
const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Step 1: Navigate to the login page
  await page.goto('/login');

  // Step 2: Fill in demo credentials
  await page.getByTestId('email-input').fill('admin@demo.com');
  await page.getByTestId('password-input').fill('admin123');

  // Step 3: Click the login button
  await page.getByTestId('login-button').click();

  // Step 4: Wait for navigation to dashboard (confirms login success)
  await page.waitForURL('/dashboard');
  await expect(page.getByTestId('welcome-message')).toBeVisible();

  // Step 5: Save the authenticated state to a file
  // Other tests will load this state to skip the login step
  await page.context().storageState({ path: authFile });
});
