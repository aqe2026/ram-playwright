import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — Page Object for the Login Page
 * ============================================
 * Encapsulates all locators and actions for the login form.
 * 
 * Usage in tests:
 *   const loginPage = new LoginPage(page);
 *   await loginPage.goto();
 *   await loginPage.login('admin@demo.com', 'admin123');
 */

export class LoginPage extends BasePage {
  // Locators — defined once, used everywhere
  readonly title: Locator;
  readonly subtitle: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly demoCredentials: Locator;
  readonly fillAdminButton: Locator;
  readonly fillUserButton: Locator;
  readonly loginForm: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('login-title');
    this.subtitle = page.getByTestId('login-subtitle');
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error-message');
    this.demoCredentials = page.getByTestId('demo-credentials');
    this.fillAdminButton = page.getByTestId('fill-admin');
    this.fillUserButton = page.getByTestId('fill-user');
    this.loginForm = page.getByTestId('login-form');
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await super.goto('/login');
    await expect(this.loginForm).toBeVisible();
  }

  /**
   * Perform login with given credentials
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Login using the "Use" button for admin demo credentials
   */
  async useAdminCredentials() {
    await this.fillAdminButton.click();
    await this.loginButton.click();
  }

  /**
   * Login using the "Use" button for user demo credentials
   */
  async useUserCredentials() {
    await this.fillUserButton.click();
    await this.loginButton.click();
  }

  /**
   * Assert error message is shown with specific text
   */
  async assertError(text: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(text);
  }

  /**
   * Assert no error message is shown
   */
  async assertNoError() {
    await expect(this.errorMessage).not.toBeVisible();
  }

  /**
   * Assert login form elements are visible
   */
  async assertFormVisible() {
    await expect(this.title).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
}
