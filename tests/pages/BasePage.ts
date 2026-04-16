import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage — Page Object Model (POM) Base Class
 * ==============================================
 * All page objects extend this class.
 * 
 * What is POM?
 * - A design pattern that creates a class for each page in your app
 * - Each class contains locators and methods for that page
 * - Tests use page objects instead of directly interacting with locators
 * - Makes tests more readable, maintainable, and reusable
 * 
 * Benefits:
 * - If the UI changes, you only update the page object (not every test)
 * - Test code reads like plain English
 * - Reduces code duplication
 */

export class BasePage {
  // The Playwright Page instance
  readonly page: Page;

  // Common locators available on all pages
  readonly navbar: Locator;
  readonly appContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = page.getByTestId('navbar');
    this.appContainer = page.getByTestId('app-container');
  }

  /**
   * Navigate to a specific URL path
   * Uses baseURL from playwright.config.ts
   */
  async goto(path: string) {
    await this.page.goto(path);
  }

  /**
   * Get the current page URL
   */
  async currentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Wait for page to be ready
   */
  async waitForReady() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Check if navbar is visible
   */
  async isNavbarVisible(): Promise<boolean> {
    return this.navbar.isVisible();
  }

  /**
   * Click a navigation link by its test ID
   */
  async clickNavLink(linkTestId: string) {
    await this.page.getByTestId(linkTestId).click();
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async screenshot(name: string) {
    await this.page.screenshot({
      path: `playwright/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  /**
   * Assert current URL matches expected path
   */
  async assertUrl(expectedPath: string) {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }
}
