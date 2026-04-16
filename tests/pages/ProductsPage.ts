import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductsPage — Page Object for the Product Listing
 * ====================================================
 * Handles search, filter, sort, and product card interactions.
 */

export class ProductsPage extends BasePage {
  readonly title: Locator;
  readonly searchBar: Locator;
  readonly searchInput: Locator;
  readonly searchClear: Locator;
  readonly categoryFilter: Locator;
  readonly sortSelect: Locator;
  readonly productGrid: Locator;
  readonly resultCount: Locator;
  readonly noResults: Locator;
  readonly clearFilters: Locator;

  // Modal locators
  readonly modalOverlay: Locator;
  readonly modalContent: Locator;
  readonly modalTitle: Locator;
  readonly modalConfirmButton: Locator;
  readonly modalCancelButton: Locator;
  readonly modalCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('products-title');
    this.searchBar = page.getByTestId('search-bar');
    this.searchInput = page.getByTestId('search-input');
    this.searchClear = page.getByTestId('search-clear');
    this.categoryFilter = page.getByTestId('category-filter');
    this.sortSelect = page.getByTestId('sort-select');
    this.productGrid = page.getByTestId('product-grid');
    this.resultCount = page.getByTestId('result-count');
    this.noResults = page.getByTestId('no-results');
    this.clearFilters = page.getByTestId('clear-filters');

    this.modalOverlay = page.getByTestId('modal-overlay');
    this.modalContent = page.getByTestId('modal-content');
    this.modalTitle = page.getByTestId('modal-title');
    this.modalConfirmButton = page.getByTestId('modal-confirm-button');
    this.modalCancelButton = page.getByTestId('modal-cancel-button');
    this.modalCloseButton = page.getByTestId('modal-close-button');
  }

  async goto() {
    await super.goto('/products');
    await expect(this.title).toBeVisible();
  }

  /**
   * Search for products
   */
  async search(term: string) {
    await this.searchInput.clear();
    await this.searchInput.fill(term);
    await this.page.waitForTimeout(300); // Wait for React re-render
  }

  /**
   * Clear the search input
   */
  async clearSearch() {
    await this.searchClear.click();
  }

  /**
   * Filter by category
   */
  async selectCategory(category: string) {
    await this.categoryFilter.selectOption(category);
  }

  /**
   * Sort products
   */
  async sortBy(value: string) {
    await this.sortSelect.selectOption(value);
  }

  /**
   * Get the count of visible product cards
   */
  async getProductCount(): Promise<number> {
    const grid = this.page.getByTestId('product-grid');
    const isVisible = await grid.isVisible().catch(() => false);
    if (!isVisible) return 0;
    return grid.locator('[data-testid^="product-card-"]').count();
  }

  /**
   * Get the result count text
   */
  async getResultCountText(): Promise<string> {
    return (await this.resultCount.textContent()) || '';
  }

  /**
   * Click delete on a specific product
   */
  async deleteProduct(productId: number) {
    await this.page.getByTestId(`delete-product-${productId}`).click();
  }

  /**
   * Click edit on a specific product
   */
  async editProduct(productId: number) {
    await this.page.getByTestId(`edit-product-${productId}`).click();
  }

  /**
   * Confirm deletion in the modal
   */
  async confirmDelete() {
    await expect(this.modalOverlay).toBeVisible();
    await this.modalConfirmButton.click();
  }

  /**
   * Cancel deletion in the modal
   */
  async cancelDelete() {
    await this.modalCancelButton.click();
  }

  /**
   * Assert product grid is visible with products
   */
  async assertProductsVisible() {
    await expect(this.productGrid).toBeVisible();
    const count = await this.getProductCount();
    expect(count).toBeGreaterThan(0);
  }
}
