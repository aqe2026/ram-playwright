import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductFormPage — Page Object for Add/Edit Product Form
 * ========================================================
 * Handles form filling, validation, and submission.
 */

export class ProductFormPage extends BasePage {
  readonly formTitle: Locator;
  readonly productForm: Locator;
  readonly nameInput: Locator;
  readonly categoryInput: Locator;
  readonly priceInput: Locator;
  readonly stockInput: Locator;
  readonly descriptionInput: Locator;
  readonly statusInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly successMessage: Locator;

  // Error locators
  readonly errorName: Locator;
  readonly errorCategory: Locator;
  readonly errorPrice: Locator;
  readonly errorStock: Locator;
  readonly errorDescription: Locator;

  constructor(page: Page) {
    super(page);
    this.formTitle = page.getByTestId('form-title');
    this.productForm = page.getByTestId('product-form');
    this.nameInput = page.getByTestId('input-name');
    this.categoryInput = page.getByTestId('input-category');
    this.priceInput = page.getByTestId('input-price');
    this.stockInput = page.getByTestId('input-stock');
    this.descriptionInput = page.getByTestId('input-description');
    this.statusInput = page.getByTestId('input-status');
    this.submitButton = page.getByTestId('submit-button');
    this.cancelButton = page.getByTestId('cancel-button');
    this.successMessage = page.getByTestId('success-message');

    this.errorName = page.getByTestId('error-name');
    this.errorCategory = page.getByTestId('error-category');
    this.errorPrice = page.getByTestId('error-price');
    this.errorStock = page.getByTestId('error-stock');
    this.errorDescription = page.getByTestId('error-description');
  }

  async gotoNew() {
    await super.goto('/products/new');
    await expect(this.productForm).toBeVisible();
  }

  async gotoEdit(id: number) {
    await super.goto(`/products/edit/${id}`);
    await expect(this.productForm).toBeVisible();
  }

  /**
   * Fill the entire form with given data
   */
  async fillForm(data: {
    name?: string;
    category?: string;
    price?: string;
    stock?: string;
    description?: string;
    status?: string;
  }) {
    if (data.name !== undefined) await this.nameInput.fill(data.name);
    if (data.category) await this.categoryInput.selectOption(data.category);
    if (data.price !== undefined) await this.priceInput.fill(data.price);
    if (data.stock !== undefined) await this.stockInput.fill(data.stock);
    if (data.description !== undefined) await this.descriptionInput.fill(data.description);
    if (data.status) await this.statusInput.selectOption(data.status);
  }

  /**
   * Submit the form
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Cancel and go back
   */
  async cancel() {
    await this.cancelButton.click();
  }

  /**
   * Assert success message is shown
   */
  async assertSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 5000 });
  }

  /**
   * Assert specific validation error is shown
   */
  async assertFieldError(field: string, message: string) {
    const errorLocator = this.page.getByTestId(`error-${field}`);
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toContainText(message);
  }

  /**
   * Assert form title matches
   */
  async assertTitle(expected: string) {
    await expect(this.formTitle).toHaveText(expected);
  }
}
