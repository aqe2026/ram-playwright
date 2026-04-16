import { test, expect } from '@playwright/test';
import { loginAs } from '../utils/helpers';

/**
 * ============================================
 * 🟡 INTERMEDIATE: API Mocking with page.route()
 * ============================================
 * 
 * What you'll learn:
 * - How to intercept and mock API requests
 * - How to simulate different API responses
 * - Why API mocking is useful for testing
 * - How to test loading and error states
 * 
 * Note: Our app uses static data, but we demonstrate
 * the concept by intercepting any fetch/XHR requests
 * and simulating API behavior.
 */

test.describe('API Mocking with page.route()', () => {

  test('should intercept and mock a fetch request', async ({ page }) => {
    // Set up a route handler BEFORE navigating
    // This intercepts any request to /api/products
    await page.route('**/api/products', async (route) => {
      // Respond with custom mock data
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: 'Mocked Product', price: 9.99, category: 'Test' },
          { id: 2, name: 'Another Mock', price: 19.99, category: 'Test' },
        ]),
      });
    });

    await loginAs(page, 'admin');

    // The route is ready — any fetch to /api/products would return our mock data
    // In a real app with API calls, this would populate the UI with mock data
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('should mock a failed API response (500 error)', async ({ page }) => {
    // Simulate a server error
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await loginAs(page, 'admin');
    // In a real app, you'd test error handling UI here
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('should mock a slow API response', async ({ page }) => {
    // Simulate network delay
    await page.route('**/api/products', async (route) => {
      // Wait 3 seconds before responding
      await new Promise(resolve => setTimeout(resolve, 3000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await loginAs(page, 'admin');
    // In a real app, you'd test loading spinners here
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('should mock network failure', async ({ page }) => {
    // Simulate complete network failure
    await page.route('**/api/products', async (route) => {
      await route.abort('failed');
    });

    await loginAs(page, 'admin');
    // In a real app, you'd test offline/error states
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('should intercept and modify requests', async ({ page }) => {
    // You can also modify outgoing requests (add headers, change body, etc.)
    await page.route('**/api/**', async (route, request) => {
      // Log the intercepted request (for debugging)
      console.log(`Intercepted: ${request.method()} ${request.url()}`);

      // Add custom headers and continue
      await route.continue({
        headers: {
          ...request.headers(),
          'X-Custom-Header': 'test-value',
          'Authorization': 'Bearer mock-token-12345',
        },
      });
    });

    await loginAs(page, 'admin');
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });

  test('should verify request was made with correct data', async ({ page }) => {
    // Track API calls
    const apiCalls: string[] = [];

    await page.route('**/api/**', async (route, request) => {
      apiCalls.push(`${request.method()} ${request.url()}`);
      await route.continue();
    });

    await loginAs(page, 'admin');

    // You can verify that specific API calls were made
    // In a real app: expect(apiCalls).toContain('GET https://api.example.com/products');
    await expect(page.getByTestId('welcome-message')).toBeVisible();
  });
});
