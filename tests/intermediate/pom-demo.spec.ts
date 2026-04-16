import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ProductFormPage } from '../pages/ProductFormPage';
import { validCredentials, testProduct } from '../utils/test-data';

/**
 * ============================================
 * 🟡 INTERMEDIATE: Page Object Model (POM) Demo
 * ============================================
 * 
 * What you'll learn:
 * - How to use Page Object Model pattern in tests
 * - Why POM makes tests more readable and maintainable
 * - How page objects encapsulate locators and actions
 * 
 * Compare these tests with the beginner tests — notice how
 * much cleaner the code is when using page objects!
 */

test.describe('Page Object Model — Login Flow', () => {

  test('should login successfully using POM', async ({ page }) => {
    // Create page objects
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Navigate to login (encapsulated in the page object)
    await loginPage.goto();

    // Verify form is visible (using page object method)
    await loginPage.assertFormVisible();

    // Login using page object method
    await loginPage.login(
      validCredentials.admin.email,
      validCredentials.admin.password
    );

    // Verify dashboard loaded
    await dashboardPage.assertFullyLoaded();
  });

  test('should show validation error using POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Try logging in with invalid credentials
    await loginPage.login('wrong@test.com', 'wrongpassword');

    // Assert error using page object
    await loginPage.assertError('Invalid');
  });

  test('should use admin quick-fill button via POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Use the admin credentials button
    await loginPage.useAdminCredentials();

    // Should navigate to dashboard
    await page.waitForURL('/dashboard');
  });
});

test.describe('Page Object Model — Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    // Login before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      validCredentials.admin.email,
      validCredentials.admin.password
    );
    await page.waitForURL('/dashboard');
  });

  test('should display welcome message with user name', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const welcomeText = await dashboardPage.getWelcomeText();

    expect(welcomeText).toContain(validCredentials.admin.name);
  });

  test('should show all stat cards', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const count = await dashboardPage.getStatCardCount();

    expect(count).toBe(6); // We have 6 stat cards
  });

  test('should navigate to products from dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goToProducts();

    await expect(page).toHaveURL(/\/products/);
  });
});

test.describe('Page Object Model — Products', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      validCredentials.admin.email,
      validCredentials.admin.password
    );
    await page.waitForURL('/dashboard');
  });

  test('should search products using POM', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    // Search for a product
    await productsPage.search('Wireless');

    // Should show filtered results
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(15); // Less than total
  });

  test('should fill product form using POM', async ({ page }) => {
    const formPage = new ProductFormPage(page);
    await formPage.gotoNew();

    // Fill form using page object
    await formPage.fillForm(testProduct.valid);
    await formPage.submit();

    // Assert success
    await formPage.assertSuccess();
  });
});
