# 🧪 Playwright QA Learning Project

A **production-like mini application** with a comprehensive **Playwright test suite** that covers real-world testing scenarios — from beginner to advanced level.

> Built with **React + Vite + TypeScript + Tailwind CSS + Playwright**

---

## 📸 What's Inside

### The Application
A **Product Management Dashboard** with:
- 🔐 Login Page (form validation, demo credentials)
- 📊 Dashboard (stats, charts, quick actions)
- 📦 Products Page (search, filter, sort, delete with modal)
- ➕ Add/Edit Product Form (validation, category/status dropdowns)
- 🧭 Navigation (React Router, protected routes)

### The Test Suite
**17 test files** organized by difficulty:

| Level | Tests | Topics |
|-------|-------|--------|
| 🟢 Beginner | 4 files | Titles, UI checks, forms, navigation |
| 🟡 Intermediate | 5 files | POM, API mocking, assertions, modals, utilities |
| 🔴 Advanced | 8 files | Parallel, cross-browser, retries, screenshots, performance, auth, a11y, visual regression |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- npm (comes with Node.js)

### Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd playright-ram

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Start the dev server
npm run dev
```

### Running Tests

```bash
# Run ALL tests (all browsers)
npx playwright test

# Run tests on a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests by level
npx playwright test tests/beginner/
npx playwright test tests/intermediate/
npx playwright test tests/advanced/

# Run a single test file
npx playwright test tests/beginner/title-check.spec.ts

# Run tests in headed mode (see the browser)
npx playwright test --headed

# Run tests in UI mode (interactive)
npx playwright test --ui

# Run tests in debug mode (step through)
npx playwright test --debug

# Update visual regression baselines
npx playwright test --update-snapshots
```

### View Reports

```bash
# Open HTML test report
npx playwright show-report

# View trace file (after a test failure)
npx playwright show-trace test-results/<trace-file>.zip
```

---

## 📂 Project Structure

```
playright-ram/
├── src/                          # React Application
│   ├── components/
│   │   ├── Modal.tsx             # Reusable modal/popup
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── ProductCard.tsx       # Product display card
│   │   ├── ProtectedRoute.tsx    # Auth guard
│   │   └── SearchBar.tsx         # Search + filter
│   ├── context/
│   │   └── AuthContext.tsx       # Authentication state
│   ├── data/
│   │   └── products.ts          # Static product data
│   ├── pages/
│   │   ├── LoginPage.tsx         # Login form
│   │   ├── DashboardPage.tsx     # Dashboard overview
│   │   ├── ProductsPage.tsx      # Product listing
│   │   └── ProductFormPage.tsx   # Add/Edit form
│   ├── App.tsx                   # Router setup
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Tailwind styles
│
├── tests/                        # Playwright Tests
│   ├── setup/
│   │   └── auth.setup.ts         # Auth state setup
│   ├── pages/                    # Page Object Model
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── DashboardPage.ts
│   │   ├── ProductsPage.ts
│   │   └── ProductFormPage.ts
│   ├── utils/
│   │   ├── test-data.ts          # Centralized test data
│   │   └── helpers.ts            # Reusable utilities
│   ├── beginner/
│   │   ├── title-check.spec.ts   # Page title verification
│   │   ├── ui-elements.spec.ts   # UI element checks
│   │   ├── form-input.spec.ts    # Form interaction
│   │   └── navigation.spec.ts    # Page navigation
│   ├── intermediate/
│   │   ├── pom-demo.spec.ts      # Page Object Model
│   │   ├── api-mocking.spec.ts   # API route mocking
│   │   ├── assertions.spec.ts    # Advanced assertions
│   │   ├── modal-dropdown.spec.ts # UI components
│   │   └── reusable-utils.spec.ts # Shared utilities
│   └── advanced/
│       ├── parallel.spec.ts      # Parallel execution
│       ├── cross-browser.spec.ts # Multi-browser tests
│       ├── retry-flaky.spec.ts   # Retry handling
│       ├── screenshot-video.spec.ts # Visual capture
│       ├── performance.spec.ts   # Perf checks
│       ├── auth-session.spec.ts  # Session handling
│       ├── accessibility.spec.ts # A11y testing
│       └── visual-regression.spec.ts # Screenshot comparison
│
├── playwright.config.ts          # Playwright configuration
├── tailwind.config.js            # Tailwind CSS config
├── .github/workflows/
│   └── playwright.yml            # CI/CD pipeline
└── README.md                     # This file
```

---

## 🧪 Test Explanations

### 🟢 Beginner Level

#### `title-check.spec.ts`
**Purpose:** Verify the page loads correctly and has the right title.
- `page.goto()` — Navigate to a URL
- `expect(page).toHaveTitle()` — Check the HTML `<title>` tag

#### `ui-elements.spec.ts`
**Purpose:** Check that UI elements are present and have correct attributes.
- `getByTestId()` — Find elements using `data-testid` attribute
- `getByRole()` — Find elements by their ARIA role
- `toBeVisible()` — Assert element is visible on screen
- `toHaveAttribute()` — Check element attributes

#### `form-input.spec.ts`
**Purpose:** Test form interactions — typing, clicking, validation.
- `fill()` — Type text into an input field
- `click()` — Click a button or element
- `toHaveValue()` — Check input value
- Form validation and error message testing

#### `navigation.spec.ts`
**Purpose:** Test app navigation and routing.
- URL verification with `toHaveURL()`
- Protected route redirection testing
- Browser back/forward navigation
- Link click navigation

### 🟡 Intermediate Level

#### `pom-demo.spec.ts`
**Purpose:** Same tests as beginner, but using the Page Object Model.
- Page classes encapsulate locators and actions
- Tests read like plain English
- Much easier to maintain

#### `api-mocking.spec.ts`
**Purpose:** Intercept and mock API calls.
- `page.route()` — Intercept network requests
- Mock success, error, and slow responses
- Useful for testing without a real backend

#### `assertions.spec.ts`
**Purpose:** Advanced assertion techniques.
- `toHaveCount()` — Count matching elements
- `toContainText()` — Partial text matching
- Soft assertions — non-blocking checks
- Negative assertions with `.not`

#### `modal-dropdown.spec.ts`
**Purpose:** Test interactive UI components.
- Modal open/close (button, backdrop, Escape key)
- Dropdown selection and filtering
- Browser dialog handling (alert, confirm, prompt)

#### `reusable-utils.spec.ts`
**Purpose:** Demonstrate DRY testing with shared utilities.
- Helper functions for common actions
- Centralized test data management
- `beforeEach` / `afterEach` hooks

### 🔴 Advanced Level

#### `parallel.spec.ts`
**Purpose:** Parallel and serial test execution.
- `test.describe.parallel()` — Run tests simultaneously
- `test.describe.serial()` — Run tests in sequence

#### `cross-browser.spec.ts`
**Purpose:** Test across multiple browsers.
- Browser-specific `test.skip()` annotations
- Feature detection patterns
- Browser name detection with `browserName`

#### `retry-flaky.spec.ts`
**Purpose:** Handle unreliable tests.
- `test.slow()` — Extended timeout for slow tests
- `test.fixme()` — Mark known broken tests
- Custom timeouts and annotations

#### `screenshot-video.spec.ts`
**Purpose:** Capture visual evidence.
- Full page, viewport, and element screenshots
- Trace recording for debugging
- Video configuration

#### `performance.spec.ts`
**Purpose:** Basic performance checks.
- Navigation Timing API metrics
- Page load time assertions
- Console error monitoring
- Resource counting

#### `auth-session.spec.ts`
**Purpose:** Authentication state management.
- `storageState` save and restore
- Session persistence across reloads
- localStorage verification

#### `accessibility.spec.ts`
**Purpose:** WCAG compliance testing.
- axe-core integration
- ARIA attribute verification
- Keyboard navigation testing
- Form label associations

#### `visual-regression.spec.ts`
**Purpose:** Catch unintended visual changes.
- `toHaveScreenshot()` — Compare with baseline images
- Pixel difference thresholds
- Element-level snapshots

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@demo.com` | `admin123` |
| User | `user@demo.com` | `user123` |

---

## ⚡ Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npx playwright test                        # Run all tests
npx playwright test --headed               # See browser while testing
npx playwright test --ui                   # Interactive UI mode
npx playwright test --debug                # Step-through debugger
npx playwright test --grep "login"         # Run tests matching pattern
npx playwright test --workers=1            # Run sequentially
npx playwright show-report                 # Open HTML report
npx playwright codegen http://localhost:5173  # Code generator tool
npx playwright test --update-snapshots     # Update visual baselines
```

---

## 📊 CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that:
1. Runs on push/PR to main
2. Tests across Chromium, Firefox, and WebKit
3. Uploads HTML reports as artifacts
4. Uploads traces and screenshots on failure

---

## 📚 Learning Path

1. **Start with Beginner tests** → Understand basic Playwright commands
2. **Move to Intermediate** → Learn patterns (POM, mocking, helpers)
3. **Tackle Advanced** → Master real-world testing scenarios
4. **Read the comments** → Every file has detailed inline explanations
5. **Modify and experiment** → Change the app and see tests fail/pass

---

## 🏆 Use This Project For

- ✅ Learning Playwright from scratch
- ✅ Interview preparation (QA/SDET roles)
- ✅ QA automation starter kit
- ✅ Understanding testing best practices
- ✅ Portfolio project

---

Built with ❤️ for learning Playwright testing
