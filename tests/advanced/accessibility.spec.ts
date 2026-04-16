import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { loginAs } from '../utils/helpers';

/**
 * ============================================
 * 🔴 ADVANCED: Accessibility (a11y) Testing
 * ============================================
 * 
 * What you'll learn:
 * - How to run accessibility audits with axe-core
 * - How to check WCAG compliance
 * - How to test specific accessibility rules
 * - How to exclude known issues
 * 
 * axe-core checks for:
 * - Missing alt text on images
 * - Insufficient color contrast
 * - Missing form labels
 * - Keyboard navigation issues
 * - ARIA attribute violations
 */

test.describe('Accessibility Testing', () => {

  test('login page should have no accessibility violations', async ({ page }) => {
    await page.goto('/login');

    // Run axe-core accessibility scan
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa']) // Check WCAG 2.0 Level A and AA
      .analyze();

    // Log any violations found
    if (results.violations.length > 0) {
      console.log('Accessibility violations on Login page:');
      results.violations.forEach(violation => {
        console.log(`  ❌ ${violation.id}: ${violation.description}`);
        console.log(`     Impact: ${violation.impact}`);
        console.log(`     Nodes: ${violation.nodes.length}`);
      });
    }

    // Assert no critical violations
    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolations).toHaveLength(0);
  });

  test('dashboard should have no critical a11y issues', async ({ page }) => {
    await loginAs(page, 'admin');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalViolations.length > 0) {
      console.log('Critical a11y violations on Dashboard:');
      criticalViolations.forEach(v => {
        console.log(`  ❌ ${v.id}: ${v.help}`);
      });
    }

    expect(criticalViolations).toHaveLength(0);
  });

  test('products page should have no critical a11y issues', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    expect(criticalViolations).toHaveLength(0);
  });

  test('should check specific accessibility rules', async ({ page }) => {
    await page.goto('/login');

    // Check only specific rules
    const results = await new AxeBuilder({ page })
      .withRules(['label', 'color-contrast', 'heading-order'])
      .analyze();

    // Report on each rule
    results.violations.forEach(violation => {
      console.log(`Rule "${violation.id}": ${violation.nodes.length} violation(s)`);
    });

    // No violations for these specific rules
    expect(results.violations).toHaveLength(0);
  });

  test('should exclude specific elements from scan', async ({ page }) => {
    await loginAs(page, 'admin');

    // Exclude certain elements that might have known issues
    const results = await new AxeBuilder({ page })
      .exclude('[data-testid="nav-logo"]') // Exclude the logo
      .analyze();

    const criticalViolations = results.violations.filter(
      v => v.impact === 'critical'
    );

    expect(criticalViolations).toHaveLength(0);
  });

  test('forms should have associated labels', async ({ page }) => {
    await page.goto('/login');

    // Check that all inputs have labels
    const emailLabel = page.locator('label[for="email"]');
    const passwordLabel = page.locator('label[for="password"]');

    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
  });

  test('interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto('/login');

    // Tab through the form
    await page.keyboard.press('Tab'); // Focus email
    await page.keyboard.press('Tab'); // Focus password
    await page.keyboard.press('Tab'); // Focus login button

    // Type credentials using keyboard
    await page.getByTestId('email-input').focus();
    await page.keyboard.type('admin@demo.com');

    await page.getByTestId('password-input').focus();
    await page.keyboard.type('admin123');

    // Submit with Enter key
    await page.keyboard.press('Enter');
    await page.waitForURL('/dashboard');
  });

  test('modal should have proper ARIA attributes', async ({ page }) => {
    await loginAs(page, 'admin');
    await page.goto('/products');

    // Open modal
    await page.getByTestId('delete-product-1').click();

    // Check ARIA attributes
    const modal = page.getByTestId('modal-overlay');
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
  });
});
