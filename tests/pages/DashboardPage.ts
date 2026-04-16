import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage — Page Object for the Dashboard
 * ================================================
 * Encapsulates all locators and actions for the dashboard.
 */

export class DashboardPage extends BasePage {
  readonly welcomeMessage: Locator;
  readonly subtitle: Locator;
  readonly statsGrid: Locator;
  readonly inventoryValueCard: Locator;
  readonly totalValue: Locator;
  readonly quickActions: Locator;
  readonly recentProducts: Locator;
  readonly viewProductsAction: Locator;
  readonly addProductAction: Locator;
  readonly logoutButton: Locator;
  readonly userInfo: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.getByTestId('welcome-message');
    this.subtitle = page.getByTestId('dashboard-subtitle');
    this.statsGrid = page.getByTestId('stats-grid');
    this.inventoryValueCard = page.getByTestId('inventory-value-card');
    this.totalValue = page.getByTestId('total-value');
    this.quickActions = page.getByTestId('quick-actions');
    this.recentProducts = page.getByTestId('recent-products');
    this.viewProductsAction = page.getByTestId('action-view-products');
    this.addProductAction = page.getByTestId('action-add-product');
    this.logoutButton = page.getByTestId('logout-button');
    this.userInfo = page.getByTestId('user-info');
  }

  async goto() {
    await super.goto('/dashboard');
    await expect(this.welcomeMessage).toBeVisible();
  }

  /**
   * Get the welcome message text
   */
  async getWelcomeText(): Promise<string> {
    return (await this.welcomeMessage.textContent()) || '';
  }

  /**
   * Get the count of stat cards
   */
  async getStatCardCount(): Promise<number> {
    return this.statsGrid.locator('[data-testid^="stat-card-"]').count();
  }

  /**
   * Get a specific stat card by label
   */
  getStatCard(label: string): Locator {
    return this.page.getByTestId(`stat-card-${label}`);
  }

  /**
   * Navigate to products via quick actions
   */
  async goToProducts() {
    await this.viewProductsAction.click();
  }

  /**
   * Navigate to add product via quick actions
   */
  async goToAddProduct() {
    await this.addProductAction.click();
  }

  /**
   * Logout from the dashboard
   */
  async logout() {
    await this.logoutButton.click();
  }

  /**
   * Assert all major dashboard sections are visible
   */
  async assertFullyLoaded() {
    await expect(this.welcomeMessage).toBeVisible();
    await expect(this.statsGrid).toBeVisible();
    await expect(this.inventoryValueCard).toBeVisible();
    await expect(this.quickActions).toBeVisible();
    await expect(this.recentProducts).toBeVisible();
  }
}
