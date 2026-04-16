import { test, expect } from '@playwright/test';
import { loginAs } from '../utils/helpers';

/**
 * ============================================
 * 🟡 INTERMEDIATE: Modals, Dropdowns & Alerts
 * ============================================
 * 
 * What you'll learn:
 * - How to test modal open/close behavior
 * - How to interact with dropdown selects
 * - How to handle confirm/cancel actions in modals
 * - How to test keyboard interactions (Escape key)
 * - How to handle browser dialogs (alert, confirm, prompt)
 */

test.describe('Modal Interactions', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');
  });

  test('should open delete confirmation modal', async ({ page }) => {
    // Click delete on first product
    await page.getByTestId('delete-product-1').click();

    // Modal should appear
    await expect(page.getByTestId('modal-overlay')).toBeVisible();
    await expect(page.getByTestId('modal-content')).toBeVisible();
    await expect(page.getByTestId('modal-title')).toHaveText('Delete Product');
  });

  test('should display product name in delete modal', async ({ page }) => {
    await page.getByTestId('delete-product-1').click();

    // Modal body should mention the product
    const modalBody = page.getByTestId('delete-confirmation-text');
    await expect(modalBody).toBeVisible();
    await expect(modalBody).toContainText('Wireless Bluetooth Headphones');
  });

  test('should close modal with cancel button', async ({ page }) => {
    await page.getByTestId('delete-product-1').click();
    await expect(page.getByTestId('modal-overlay')).toBeVisible();

    // Click cancel
    await page.getByTestId('modal-cancel-button').click();

    // Modal should close
    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();

    // Product should still exist
    await expect(page.getByTestId('product-card-1')).toBeVisible();
  });

  test('should close modal with X button', async ({ page }) => {
    await page.getByTestId('delete-product-1').click();
    await expect(page.getByTestId('modal-overlay')).toBeVisible();

    // Click the X close button
    await page.getByTestId('modal-close-button').click();
    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();
  });

  test('should close modal with Escape key', async ({ page }) => {
    await page.getByTestId('delete-product-1').click();
    await expect(page.getByTestId('modal-overlay')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();
  });

  test('should close modal by clicking backdrop', async ({ page }) => {
    await page.getByTestId('delete-product-1').click();
    await expect(page.getByTestId('modal-overlay')).toBeVisible();

    // Click the backdrop (outside the modal content)
    await page.getByTestId('modal-backdrop').click();
    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();
  });

  test('should delete product when confirmed', async ({ page }) => {
    // Count products before
    const countBefore = await page.locator('[data-testid^="product-card-"]').count();

    // Delete first product
    await page.getByTestId('delete-product-1').click();
    await page.getByTestId('modal-confirm-button').click();

    // Modal should close
    await expect(page.getByTestId('modal-overlay')).not.toBeVisible();

    // Product count should decrease
    await page.waitForTimeout(300);
    const countAfter = await page.locator('[data-testid^="product-card-"]').count();
    expect(countAfter).toBe(countBefore - 1);

    // Deleted product should not be visible
    await expect(page.getByTestId('product-card-1')).not.toBeVisible();
  });
});

test.describe('Dropdown Interactions', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');
  });

  test('should filter by category using dropdown', async ({ page }) => {
    // Select "Electronics" category
    await page.getByTestId('category-filter').selectOption('Electronics');
    await page.waitForTimeout(300);

    // Verify all visible products are in Electronics category
    const cards = page.locator('[data-testid^="product-card-"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const category = cards.nth(i).getByTestId('product-category');
      await expect(category).toHaveText('Electronics');
    }
  });

  test('should sort products by price ascending', async ({ page }) => {
    await page.getByTestId('sort-select').selectOption('price-asc');
    await page.waitForTimeout(300);

    // Get all prices and verify they're sorted
    const prices = page.locator('[data-testid="product-price"]');
    const count = await prices.count();
    const priceValues: number[] = [];

    for (let i = 0; i < count; i++) {
      const text = await prices.nth(i).textContent();
      priceValues.push(parseFloat(text?.replace('$', '') || '0'));
    }

    // Verify ascending order
    for (let i = 1; i < priceValues.length; i++) {
      expect(priceValues[i]).toBeGreaterThanOrEqual(priceValues[i - 1]);
    }
  });

  test('should sort products by price descending', async ({ page }) => {
    await page.getByTestId('sort-select').selectOption('price-desc');
    await page.waitForTimeout(300);

    const prices = page.locator('[data-testid="product-price"]');
    const count = await prices.count();
    const priceValues: number[] = [];

    for (let i = 0; i < count; i++) {
      const text = await prices.nth(i).textContent();
      priceValues.push(parseFloat(text?.replace('$', '') || '0'));
    }

    // Verify descending order
    for (let i = 1; i < priceValues.length; i++) {
      expect(priceValues[i]).toBeLessThanOrEqual(priceValues[i - 1]);
    }
  });

  test('should reset category filter to show all', async ({ page }) => {
    // Filter by category
    await page.getByTestId('category-filter').selectOption('Electronics');
    await page.waitForTimeout(300);
    const filteredCount = await page.locator('[data-testid^="product-card-"]').count();

    // Reset to all categories
    await page.getByTestId('category-filter').selectOption('');
    await page.waitForTimeout(300);
    const allCount = await page.locator('[data-testid^="product-card-"]').count();

    expect(allCount).toBeGreaterThan(filteredCount);
  });

  test('should handle product form dropdowns', async ({ page }) => {
    await page.goto('/products/new');

    // Select category in the form dropdown
    await page.getByTestId('input-category').selectOption('Electronics');
    await expect(page.getByTestId('input-category')).toHaveValue('Electronics');

    // Select status
    await page.getByTestId('input-status').selectOption('Low Stock');
    await expect(page.getByTestId('input-status')).toHaveValue('Low Stock');
  });
});

test.describe('Browser Dialog Handling', () => {

  test('should handle browser alert dialog', async ({ page }) => {
    // Set up dialog handler BEFORE triggering it
    page.on('dialog', async (dialog) => {
      // Verify it's an alert
      expect(dialog.type()).toBe('alert');
      // Accept (dismiss) the dialog
      await dialog.accept();
    });

    // In our app we don't have native alerts, but this shows the pattern:
    // You can trigger one with page.evaluate():
    await loginAs(page, 'admin');
    await page.evaluate(() => alert('Test alert'));
    // The dialog handler above will automatically handle it
  });

  test('should handle browser confirm dialog', async ({ page }) => {
    await loginAs(page, 'admin');

    // Handle confirm dialog — click OK
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Are you sure?');
      await dialog.accept(); // Click "OK"
    });

    const result = await page.evaluate(() => confirm('Are you sure?'));
    expect(result).toBe(true);
  });

  test('should handle browser prompt dialog', async ({ page }) => {
    await loginAs(page, 'admin');

    // Handle prompt dialog — enter text
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept('My answer'); // Enter text and click OK
    });

    const result = await page.evaluate(() => prompt('Enter your name'));
    expect(result).toBe('My answer');
  });
});
