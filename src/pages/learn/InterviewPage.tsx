import LearnLayout from '../../components/LearnLayout';
import { useState } from 'react';

// ---------------------------------------------------------
// InterviewPage — QA/SDET interview questions & answers
// ---------------------------------------------------------

interface QA {
  q: string;
  a: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

const questions: QA[] = [
  // --- Playwright Basics ---
  {
    category: 'Playwright Basics',
    difficulty: 'Easy',
    q: 'What is Playwright and how is it different from Selenium?',
    a: `Playwright is a modern end-to-end testing framework by Microsoft. Key differences from Selenium:
• Auto-waiting: Playwright automatically waits for elements, Selenium requires explicit waits
• Cross-browser: Built-in support for Chromium, Firefox, WebKit (Safari)
• Speed: Playwright uses browser DevTools Protocol, which is faster than Selenium's WebDriver
• Single API: One API works across all browsers, no separate drivers needed
• Built-in features: Screenshots, video recording, network interception, tracing — all built in
• TypeScript-first: First-class TypeScript support`,
  },
  {
    category: 'Playwright Basics',
    difficulty: 'Easy',
    q: 'What are the main components of a Playwright test?',
    a: `Every Playwright test has these components:
1. import { test, expect } from '@playwright/test' — Import test runner and assertions
2. test('description', async ({ page }) => { }) — Test function with browser page fixture
3. page.goto('/url') — Navigate to a page
4. page.getByTestId('id') / page.getByRole() — Find elements (locators)
5. .click() / .fill() — Perform actions
6. expect(element).toBeVisible() — Assert (verify) the result`,
  },
  {
    category: 'Playwright Basics',
    difficulty: 'Easy',
    q: 'What browsers does Playwright support?',
    a: `Playwright supports three browser engines:
• Chromium — Powers Google Chrome and Edge
• Firefox — Mozilla Firefox
• WebKit — Powers Safari on macOS and iOS

You configure them in playwright.config.ts under 'projects'. Tests run across all three by default.`,
  },
  {
    category: 'Playwright Basics',
    difficulty: 'Medium',
    q: 'What is auto-waiting in Playwright? How does it prevent flaky tests?',
    a: `Auto-waiting means Playwright automatically waits for elements to be ready before performing actions. Before each action, it checks:
• Element is attached to the DOM
• Element is visible
• Element is stable (not animating)
• Element is enabled (not disabled)
• Element is not obscured by other elements

This eliminates the need for manual sleep() or waitFor() calls, which are the #1 cause of flaky tests in Selenium.`,
  },
  {
    category: 'Playwright Basics',
    difficulty: 'Medium',
    q: 'Explain the difference between page.goto() and page.waitForURL().',
    a: `• page.goto('/login') — Navigates the browser to a URL and waits for the page to load
• page.waitForURL('/dashboard') — Waits for the URL to change (doesn't navigate)

Use goto() when YOU initiate navigation. Use waitForURL() when the APP navigates (e.g., after clicking a login button that redirects to dashboard).

Example:
  await page.goto('/login');           // Navigate to login
  await page.fill('#email', 'admin@demo.com');
  await page.click('#submit');
  await page.waitForURL('/dashboard'); // Wait for redirect`,
  },

  // --- Locators ---
  {
    category: 'Locators',
    difficulty: 'Easy',
    q: 'What is the recommended priority order for locators?',
    a: `The recommended priority (from best to worst):
1. getByRole() — Best for accessibility, finds by ARIA role
2. getByTestId() — Best for QA, stable data-testid attributes
3. getByText() — Good for buttons/links with known text
4. getByLabel() — Perfect for form inputs with labels
5. getByPlaceholder() — Input placeholder text
6. locator('css') — Last resort CSS selectors (fragile)

The Playwright team recommends getByRole() as the primary locator because it's both accessible and user-facing.`,
  },
  {
    category: 'Locators',
    difficulty: 'Easy',
    q: 'What is the difference between getByTestId() and getByRole()?',
    a: `• getByTestId('login-btn') — Finds by data-testid attribute. Developer must add it to HTML. Very stable.
• getByRole('button', { name: 'Login' }) — Finds by ARIA role and accessible name. Already in the HTML.

getByTestId: Best when you control the HTML and want tests that never break.
getByRole: Best for accessibility testing — if the role-based locator works, your app is accessible.`,
  },
  {
    category: 'Locators',
    difficulty: 'Medium',
    q: 'How do you chain locators in Playwright?',
    a: `You can narrow down locators by chaining them:

const modal = page.getByTestId('delete-modal');
const confirmBtn = modal.getByRole('button', { name: 'Delete' });
await confirmBtn.click();

You can also use .filter():
const row = page.getByRole('row').filter({ hasText: 'Headphones' });
await row.getByRole('button', { name: 'Edit' }).click();

And .nth() for index-based selection:
const firstCard = page.getByTestId('product-card').nth(0);`,
  },

  // --- Actions ---
  {
    category: 'Actions',
    difficulty: 'Easy',
    q: 'What is the difference between fill() and type() in Playwright?',
    a: `• fill('text') — Clears the input first, then sets the value instantly. Best for most form inputs.
• pressSequentially('text') — Types character by character with key events. Use when you need to trigger keypress handlers (autocomplete, live search).

Note: type() was deprecated in favor of pressSequentially() in newer versions.

Example:
  await input.fill('admin@demo.com');     // Fast, replaces content
  await input.pressSequentially('search', { delay: 100 }); // Simulates real typing`,
  },
  {
    category: 'Actions',
    difficulty: 'Medium',
    q: 'How do you handle browser dialogs (alert, confirm, prompt)?',
    a: `Register a handler BEFORE triggering the dialog:

// Alert
page.on('dialog', dialog => dialog.accept());
await page.click('#trigger-alert');

// Confirm — accept or dismiss
page.on('dialog', dialog => dialog.dismiss()); // clicks Cancel
page.on('dialog', dialog => dialog.accept());  // clicks OK

// Prompt — provide input
page.on('dialog', dialog => dialog.accept('My answer'));

// Verify dialog message
page.on('dialog', dialog => {
  expect(dialog.message()).toBe('Are you sure?');
  dialog.accept();
});

IMPORTANT: Set up the handler BEFORE the action that triggers the dialog.`,
  },

  // --- Assertions ---
  {
    category: 'Assertions',
    difficulty: 'Easy',
    q: 'What are auto-retrying assertions? Give examples.',
    a: `Auto-retrying assertions keep checking until the condition is true (up to 5s by default):

✅ Auto-retrying (recommended):
  await expect(element).toBeVisible();
  await expect(element).toHaveText('Hello');
  await expect(page).toHaveURL('/dashboard');

❌ Non-retrying (instant check):
  expect(await element.textContent()).toBe('Hello');
  expect(await element.isVisible()).toBeTruthy();

Always prefer auto-retrying assertions — they handle async UI updates automatically.`,
  },
  {
    category: 'Assertions',
    difficulty: 'Medium',
    q: 'What are soft assertions? When would you use them?',
    a: `Regular assertions stop the test immediately on failure. Soft assertions collect all failures and report them at the end:

// Regular — stops at first failure
await expect(title).toHaveText('Products');  // fails → test stops here

// Soft — continues after failure
await expect.soft(title).toHaveText('Products');   // fails but continues
await expect.soft(count).toContainText('15');      // also checked
await expect.soft(sort).toHaveValue('name');       // also checked

Use soft assertions when:
• Validating a dashboard with many metrics
• Checking multiple independent conditions
• You want a complete failure report, not just the first error`,
  },

  // --- Page Object Model ---
  {
    category: 'Page Object Model',
    difficulty: 'Medium',
    q: 'What is the Page Object Model (POM)? Why use it?',
    a: `POM is a design pattern where each page of your app has a corresponding class that encapsulates:
• Locators (how to find elements)
• Actions (what you can do on the page)
• Assertions (how to verify the state)

Benefits:
1. DRY: Write locators once, use everywhere
2. Maintainable: If the UI changes, update one file, not 50 tests
3. Readable: Tests read like plain English
4. Reusable: Share page objects across test suites

Example:
class LoginPage {
  constructor(private page: Page) {}
  emailInput = this.page.getByTestId('email-input');
  
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.page.getByTestId('password-input').fill(password);
    await this.page.getByTestId('login-button').click();
  }
}`,
  },
  {
    category: 'Page Object Model',
    difficulty: 'Hard',
    q: 'How would you structure POM for a large application?',
    a: `For large apps, use a hierarchical POM structure:

1. BasePage — Common actions (navigate, waitForLoad, screenshot)
2. Individual Pages — LoginPage, DashboardPage, ProductsPage
3. Components — Navbar, Modal, SearchBar (reusable across pages)
4. Test Data — Centralized constants and test fixtures

Structure:
tests/
  pages/
    BasePage.ts        ← Shared helpers
    LoginPage.ts       ← Page-specific
    ProductsPage.ts    ← Page-specific
  utils/
    test-data.ts       ← Test constants
    helpers.ts         ← Utility functions

Key principle: Each page class should mirror what a USER can do on that page.`,
  },

  // --- API & Network ---
  {
    category: 'API & Network',
    difficulty: 'Medium',
    q: 'How do you mock API calls in Playwright?',
    a: `Use page.route() to intercept and mock network requests:

// Mock a successful API response
await page.route('**/api/products', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Mock Product' }]),
  });
});

// Mock an error response
await page.route('**/api/products', route => {
  route.fulfill({ status: 500, body: 'Server Error' });
});

// Mock a slow response
await page.route('**/api/products', route => {
  setTimeout(() => route.fulfill({ status: 200, body: '[]' }), 3000);
});

This is powerful for testing error states, loading states, and edge cases without a real backend.`,
  },
  {
    category: 'API & Network',
    difficulty: 'Hard',
    q: 'How do you intercept and modify network responses?',
    a: `You can intercept, modify, and then continue requests:

// Modify the response body
await page.route('**/api/products', async route => {
  const response = await route.fetch(); // Get real response
  const json = await response.json();
  json.push({ id: 999, name: 'Injected Product' }); // Modify
  await route.fulfill({ body: JSON.stringify(json) }); // Return modified
});

// Block specific resources (e.g., analytics)
await page.route('**/*.{png,jpg}', route => route.abort());

// Wait for a specific API call
const response = await page.waitForResponse('**/api/products');
const data = await response.json();`,
  },

  // --- Advanced ---
  {
    category: 'Advanced',
    difficulty: 'Medium',
    q: 'How do you handle authentication in Playwright tests?',
    a: `Use storageState to save and reuse auth:

1. Create a setup file that logs in and saves state:
   test('login', async ({ page }) => {
     await page.goto('/login');
     await page.fill('#email', 'admin@demo.com');
     await page.fill('#password', 'admin123');
     await page.click('#submit');
     await page.context().storageState({ path: 'auth.json' });
   });

2. Reuse in other tests via playwright.config.ts:
   projects: [
     { name: 'setup', testMatch: /auth.setup.ts/ },
     { name: 'tests', dependencies: ['setup'],
       use: { storageState: 'auth.json' } },
   ]

This way, you log in ONCE and all tests reuse the session.`,
  },
  {
    category: 'Advanced',
    difficulty: 'Medium',
    q: 'What is visual regression testing?',
    a: `Visual regression testing compares screenshots to detect unintended UI changes:

// Take a screenshot and compare with baseline
await expect(page).toHaveScreenshot('homepage.png');

// Element-level screenshot
await expect(page.getByTestId('navbar')).toHaveScreenshot('navbar.png');

// With tolerance (allow small differences)
await expect(page).toHaveScreenshot('page.png', { maxDiffPixels: 100 });

First run creates baseline images. Subsequent runs compare against them.
Update baselines: npx playwright test --update-snapshots`,
  },
  {
    category: 'Advanced',
    difficulty: 'Hard',
    q: 'How do you run tests in parallel? What about test isolation?',
    a: `Playwright runs tests in parallel BY DEFAULT:

// Control parallelism in config
export default defineConfig({
  workers: 4,    // 4 parallel workers
  fullyParallel: true, // All tests in a file run in parallel
});

// Run sequential tests (when they share state)
test.describe.serial('ordered tests', () => {
  test('step 1', async ({ page }) => { ... });
  test('step 2', async ({ page }) => { ... });
});

Test isolation: Each test gets a FRESH browser context (clean cookies, storage, etc).
This means tests never interfere with each other.

Tip: Use --workers=1 to debug test ordering issues.`,
  },
  {
    category: 'Advanced',
    difficulty: 'Hard',
    q: 'How do you handle flaky tests?',
    a: `Strategies to handle flaky tests:

1. Retries (quick fix):
   export default defineConfig({ retries: 2 }); // Retry failed tests twice

2. Smart waiting (root cause fix):
   // ❌ Bad: fixed delay
   await page.waitForTimeout(3000);
   // ✅ Good: wait for specific condition
   await expect(element).toBeVisible({ timeout: 10000 });

3. Annotations:
   test.slow();    // Triple the timeout for slow tests
   test.fixme();   // Skip known broken tests
   test.skip();    // Skip tests conditionally

4. Trace viewer (debugging):
   use: { trace: 'on-first-retry' }
   // Then: npx playwright show-trace trace.zip

5. Run with --repeat-each=5 to find flaky tests.`,
  },

  // --- CI/CD ---
  {
    category: 'CI/CD',
    difficulty: 'Medium',
    q: 'How do you set up Playwright in CI/CD?',
    a: `For GitHub Actions, create .github/workflows/playwright.yml:

name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 18 }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

Key tips:
• Use --with-deps to install system dependencies
• Upload reports/traces as artifacts on failure
• Run in Docker for consistent environments`,
  },
  {
    category: 'CI/CD',
    difficulty: 'Medium',
    q: 'What is the Playwright Test Reporter? What formats are available?',
    a: `Playwright generates test reports in multiple formats:

Built-in reporters:
• html — Interactive HTML report (default, best for humans)
• list — Simple console output
• dot — Minimal dots (. for pass, F for fail)
• json — Machine-readable JSON
• junit — JUnit XML (for CI systems)

Configure in playwright.config.ts:
reporter: [
  ['html', { open: 'never' }],
  ['junit', { outputFile: 'results.xml' }],
],

View HTML report: npx playwright show-report
Traces: npx playwright show-trace test-results/trace.zip`,
  },

  // --- Best Practices ---
  {
    category: 'Best Practices',
    difficulty: 'Easy',
    q: 'What are the top 5 Playwright best practices?',
    a: `1. Use web-first locators (getByRole, getByTestId) — not CSS selectors
2. Use auto-retrying assertions — await expect(el).toBeVisible()
3. Never use fixed delays — no waitForTimeout() or sleep()
4. Use Page Object Model — for maintainability
5. Run tests in CI — catch regressions early

Bonus tips:
• Use test.describe() to group related tests
• Use beforeEach/afterEach for setup/cleanup
• Use test data factories instead of hardcoded values
• Keep tests independent — each test should work alone`,
  },
  {
    category: 'Best Practices',
    difficulty: 'Medium',
    q: 'How do you debug a failing Playwright test?',
    a: `Step-by-step debugging approach:

1. Run in headed mode: npx playwright test --headed
   → Watch the browser, see what's happening

2. Run in debug mode: npx playwright test --debug
   → Step through each action, inspect DOM

3. Use UI mode: npx playwright test --ui
   → Time-travel through test execution

4. Use trace viewer:
   → Configure: use: { trace: 'on-first-retry' }
   → View: npx playwright show-trace trace.zip
   → See screenshots, network, console, at every step

5. Add console.log:
   page.on('console', msg => console.log(msg.text()));

6. Take screenshots on failure:
   use: { screenshot: 'only-on-failure' }`,
  },
];

// Group questions by category
const categories = [...new Set(questions.map(q => q.category))];

export default function InterviewPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showDifficulty, setShowDifficulty] = useState<string>('all');

  const filtered = questions.filter(q => {
    if (activeCategory !== 'all' && q.category !== activeCategory) return false;
    if (showDifficulty !== 'all' && q.difficulty !== showDifficulty) return false;
    return true;
  });

  return (
    <LearnLayout
      title="Interview Prep"
      description="30+ QA/SDET interview questions with detailed answers"
      emoji="💼"
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{questions.length}</p>
          <p className="text-xs text-surface-500">Questions</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{categories.length}</p>
          <p className="text-xs text-surface-500">Categories</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">3</p>
          <p className="text-xs text-surface-500">Difficulty Levels</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6" data-testid="interview-filters">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs font-medium text-surface-600 mb-1 block">Category</label>
            <select
              value={activeCategory}
              onChange={(e) => { setActiveCategory(e.target.value); setOpenIdx(null); }}
              className="input"
              data-testid="category-select"
            >
              <option value="all">All Categories ({questions.length})</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({questions.filter(q => q.category === cat).length})
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-48">
            <label className="text-xs font-medium text-surface-600 mb-1 block">Difficulty</label>
            <select
              value={showDifficulty}
              onChange={(e) => { setShowDifficulty(e.target.value); setOpenIdx(null); }}
              className="input"
              data-testid="difficulty-select"
            >
              <option value="all">All Levels</option>
              <option value="Easy">🟢 Easy</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Hard">🔴 Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card p-5 mb-6 border-l-4 border-l-primary-500 bg-primary-50/50">
        <h3 className="font-semibold text-surface-800 mb-2">💡 Interview Tips</h3>
        <ul className="text-sm text-surface-600 space-y-1.5">
          <li>• Always give <strong>real examples</strong> from your projects when answering</li>
          <li>• Mention <strong>trade-offs</strong> — no tool is perfect for everything</li>
          <li>• If you don't know, say <em>"I'm not sure, but I would approach it by..."</em></li>
          <li>• Practice by <strong>running the actual tests</strong> in this project</li>
        </ul>
      </div>

      {/* Q&A Cards */}
      <div className="space-y-3" data-testid="qa-list">
        {filtered.map((qa, idx) => {
          const globalIdx = questions.indexOf(qa);
          const isOpen = openIdx === globalIdx;
          return (
            <div
              key={globalIdx}
              className={`card overflow-hidden transition-all duration-300 ${isOpen ? 'ring-2 ring-primary-300 shadow-md' : ''}`}
              data-testid={`qa-card-${globalIdx}`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : globalIdx)}
                className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-surface-50 transition-colors"
                data-testid={`qa-toggle-${globalIdx}`}
              >
                <span className="text-lg mt-0.5 shrink-0 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(90deg)' : '' }}>
                  ▸
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`badge ${
                      qa.difficulty === 'Easy' ? 'badge-green' :
                      qa.difficulty === 'Medium' ? 'badge-yellow' : 'badge-red'
                    }`}>
                      {qa.difficulty}
                    </span>
                    <span className="px-2 py-0.5 bg-surface-100 text-surface-500 rounded text-xs">
                      {qa.category}
                    </span>
                  </div>
                  <p className="font-medium text-surface-800 text-sm leading-relaxed">
                    Q{idx + 1}: {qa.q}
                  </p>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 animate-fade-in" data-testid={`qa-answer-${globalIdx}`}>
                  <div className="ml-8 pl-4 border-l-2 border-primary-200">
                    <pre className="whitespace-pre-wrap text-sm text-surface-600 leading-relaxed font-sans">
                      {qa.a}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl block mb-3">🔍</span>
          <p className="text-surface-500">No questions match your filters.</p>
          <button
            onClick={() => { setActiveCategory('all'); setShowDifficulty('all'); }}
            className="btn-secondary mt-3"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="mt-8 card p-6 bg-gradient-to-r from-primary-50 to-rose-50 border-primary-200">
        <h3 className="text-lg font-bold text-surface-800 mb-2">🏆 You're Interview Ready!</h3>
        <p className="text-surface-600 text-sm">
          Review these questions, practice running the tests in this project, and build your own tests
          to solidify your understanding. Good luck with your QA/SDET interview!
        </p>
      </div>
    </LearnLayout>
  );
}
