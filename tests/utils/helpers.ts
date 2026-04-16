import { Page, expect } from '@playwright/test';
import { validCredentials } from './test-data';

/**
 * Reusable Test Helpers
 * =====================
 * Shared utility functions to reduce code duplication across tests.
 * 
 * Key concepts:
 * - Helper functions abstract common actions
 * - Makes tests more readable and maintainable
 * - Single source of truth for common workflows
 */

/**
 * Login helper — performs the full login flow
 * Use this when you need to login within a test (without storageState)
 */
export async function loginAs(
  page: Page,
  userType: 'admin' | 'user' = 'admin'
) {
  const creds = validCredentials[userType];
  await page.goto('/login');
  await page.getByTestId('email-input').fill(creds.email);
  await page.getByTestId('password-input').fill(creds.password);
  await page.getByTestId('login-button').click();
  await page.waitForURL('/dashboard');
  await expect(page.getByTestId('welcome-message')).toBeVisible();
}

/**
 * Wait for page to fully load
 * Useful when navigating between pages
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Get all visible product cards on the page
 */
export async function getProductCards(page: Page) {
  return page.locator('[data-testid^="product-card-"]');
}

/**
 * Search for a product on the products page
 */
export async function searchProducts(page: Page, term: string) {
  const searchInput = page.getByTestId('search-input');
  await searchInput.clear();
  await searchInput.fill(term);
  // Wait for the UI to update (React re-render)
  await page.waitForTimeout(300);
}

/**
 * Select a category from the filter dropdown
 */
export async function filterByCategory(page: Page, category: string) {
  await page.getByTestId('category-filter').selectOption(category);
  await page.waitForTimeout(300);
}

/**
 * Fill out the product form
 */
export async function fillProductForm(
  page: Page,
  data: {
    name?: string;
    category?: string;
    price?: string;
    stock?: string;
    description?: string;
    status?: string;
  }
) {
  if (data.name !== undefined) {
    await page.getByTestId('input-name').fill(data.name);
  }
  if (data.category !== undefined) {
    await page.getByTestId('input-category').selectOption(data.category);
  }
  if (data.price !== undefined) {
    await page.getByTestId('input-price').fill(data.price);
  }
  if (data.stock !== undefined) {
    await page.getByTestId('input-stock').fill(data.stock);
  }
  if (data.description !== undefined) {
    await page.getByTestId('input-description').fill(data.description);
  }
  if (data.status !== undefined) {
    await page.getByTestId('input-status').selectOption(data.status);
  }
}

/**
 * Take a named screenshot (useful for debugging)
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `playwright/screenshots/${name}.png`,
    fullPage: true,
  });
}

/**
 * Assert that a toast/notification message appears
 * (Can be extended if you add toast notifications to the app)
 */
export async function assertErrorMessage(page: Page, expectedText: string) {
  const errorMsg = page.getByTestId('error-message');
  await expect(errorMsg).toBeVisible();
  await expect(errorMsg).toContainText(expectedText);
}

/**
 * Clear localStorage (useful for resetting auth state)
 */
export async function clearAuth(page: Page) {
  await page.evaluate(() => localStorage.clear());
}
