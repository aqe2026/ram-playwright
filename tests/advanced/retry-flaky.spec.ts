import { test, expect } from '@playwright/test';
import { loginAs } from '../utils/helpers';

/**
 * ============================================
 * 🔴 ADVANCED: Test Retries & Flaky Test Handling
 * ============================================
 * 
 * What you'll learn:
 * - How to retry failing tests
 * - How to mark tests as "slow"
 * - How to handle flaky tests
 * - How to use test.fixme() for known issues
 * - Retry configuration in playwright.config.ts
 * 
 * Flaky tests: Tests that sometimes pass and sometimes fail
 * without any code changes. Common causes:
 * - Network delays
 * - Animation timing
 * - Race conditions
 */

test.describe('Retry & Flaky Test Handling', () => {

  // This test will retry up to 2 times if it fails
  test('test with retries', async ({ page }) => {
    // Configure retries for this specific test
    test.info().config;

    await loginAs(page, 'admin');
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  // Mark a test as "slow" — gives it 3x the default timeout
  test('slow test — loading many products', async ({ page }) => {
    test.slow(); // Triple the timeout

    await loginAs(page, 'admin');
    await page.goto('/products');

    // Verify all products load
    const cards = page.locator('[data-testid^="product-card-"]');
    await expect(cards).toHaveCount(15);
  });

  // test.fixme() marks a test as "known broken" — it will be skipped
  test.fixme('known broken test — will be fixed later', async ({ page }) => {
    // This test is skipped but tracked in the report
    // Use this for known issues that you'll fix later
    await page.goto('/this-does-not-exist');
    await expect(page.locator('#impossible')).toBeVisible();
  });

  // test.skip() skips a test entirely
  test.skip('conditionally skipped test', async ({ page }) => {
    // Skipped tests appear in the report as "skipped"
    await page.goto('/login');
  });

  // Handling timing-sensitive operations
  test('handling animation timing', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');

    // Open modal
    await page.getByTestId('delete-product-1').click();

    // Wait for animation to complete before asserting
    await expect(page.getByTestId('modal-content')).toBeVisible();

    // Close modal
    await page.keyboard.press('Escape');

    // Wait for close animation
    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();
  });

  // Using custom timeouts for specific assertions
  test('custom timeout for assertions', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('admin@demo.com');
    await page.getByTestId('password-input').fill('admin123');
    await page.getByTestId('login-button').click();

    // Custom timeout: wait up to 10 seconds for navigation
    await expect(page.getByTestId('welcome-message')).toBeVisible({ timeout: 10000 });
  });

  // Demonstrating test.info() for runtime info
  test('test info and annotations', async ({ page }) => {
    // Add custom annotations to the test
    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/example/repo/issues/123',
    });

    await loginAs(page, 'admin');
    
    // Access test info
    const testTitle = test.info().title;
    console.log(`Running test: ${testTitle}`);
    console.log(`Retry count: ${test.info().retry}`);

    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });
});
