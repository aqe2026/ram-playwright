import LearnLayout from '../../components/LearnLayout';
import CodeBlock from '../../components/CodeBlock';
import Quiz from '../../components/learn/Quiz';
import type { Question } from '../../components/learn/Quiz';

// ---------------------------------------------------------
// GettingStartedPage — Setup and Installation
// ---------------------------------------------------------

const setupQuestions: Question[] = [
  {
    id: 'gs1',
    question: 'Which command installs Playwright and its browser binaries?',
    options: ['npm install playwright', 'npm init playwright@latest', 'npx playwright install', 'playwright setup'],
    correctAnswer: 1,
    explanation: 'npm init playwright@latest is the recommended way to start a new project. It sets up the config file, example tests, and installs necessary browser binaries.'
  },
  {
    id: 'gs2',
    question: 'How do you run Playwright tests in Interactive UI mode?',
    options: ['npx playwright test --gui', 'npx playwright test --ui', 'npx playwright test --open', 'npx playwright test --watch'],
    correctAnswer: 1,
    explanation: 'The --ui flag opens the powerful Playwright UI Mode, which lets you explore, run, and debug tests visually.'
  }
];

export default function GettingStartedPage() {
  return (
    <LearnLayout
      title="Getting Started"
      description="Set up your environment and run your first test"
      emoji="🚀"
    >
      {/* Introduction */}
      <section className="learn-section">
        <h2 className="learn-heading">What is Playwright?</h2>
        <div className="card p-6 mb-6">
          <p className="text-surface-600 leading-relaxed mb-6">
            <strong className="text-surface-800">Playwright</strong> is a modern end-to-end testing framework by Microsoft.
            It lets you write tests that automate a real browser — clicking buttons, typing text, navigating pages — 
            and verify your app works correctly.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '🌐', title: 'Cross-browser', desc: 'Chromium, Firefox, WebKit' },
              { icon: '⚡', title: 'Fast & Reliable', desc: 'Auto-wait, no flaky tests' },
              { icon: '📱', title: 'Mobile Testing', desc: 'Emulate devices & viewports' },
              { icon: '🔧', title: 'Great DX', desc: 'UI mode, codegen, trace viewer' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3 p-3 bg-surface-50 rounded-lg">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="font-medium text-surface-800 text-sm">{f.title}</p>
                  <p className="text-xs text-surface-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="learn-section">
        <h2 className="learn-heading">1. Installation</h2>
        <p className="text-surface-600 mb-4">
          Getting started with Playwright is a single command. It installs everything you need: browsers, configuration, and example tests.
        </p>
        <CodeBlock
          language="bash"
          title="Install Playwright"
          code="npm init playwright@latest"
        />
        <div className="card p-4 mt-3 bg-surface-50 text-xs text-surface-500 italic">
          Note: This app already has Playwright installed. You can jump straight to running tests!
        </div>
      </section>

      {/* Basic Commands */}
      <section className="learn-section">
        <h2 className="learn-heading">2. Essential CLI Commands</h2>
        <p className="text-surface-600 mb-4">You'll use these commands daily in your QA workflow:</p>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-bold text-surface-700 mb-2">Run all tests:</p>
            <CodeBlock language="bash" code="npx playwright test" />
          </div>
          <div>
            <p className="text-sm font-bold text-surface-700 mb-2">Open UI Mode (Interactive):</p>
            <CodeBlock language="bash" code="npx playwright test --ui" />
          </div>
          <div>
            <p className="text-sm font-bold text-surface-700 mb-2">Debug mode (Step-by-step):</p>
            <CodeBlock language="bash" code="npx playwright test --debug" />
          </div>
        </div>
      </section>

      {/* Structure */}
      <section className="learn-section">
        <h2 className="learn-heading">3. Project Structure</h2>
        <p className="text-surface-600 mb-4">A standard Playwright project looks like this:</p>
        <div className="card p-5 bg-surface-900 font-mono text-xs text-primary-400 space-y-1">
          <p>📁 playwright-project</p>
          <p>├── 📁 tests/ <span className="text-surface-500">— Your .spec.ts files live here</span></p>
          <p>├── 📁 tests-examples/ <span className="text-surface-500">— Basic examples</span></p>
          <p>├── 📄 playwright.config.ts <span className="text-surface-500">— Global settings</span></p>
          <p>├── 📄 package.json</p>
          <p>└── 📁 playwright-report/ <span className="text-surface-500">— Results after testing</span></p>
        </div>
      </section>

      {/* First Test */}
      <section className="learn-section">
        <h2 className="learn-heading">4. Your First Test</h2>
        <p className="text-surface-600 mb-4">A simple test usually navigates to a URL and checks the title.</p>
        <CodeBlock
          title="tests/example.spec.ts"
          code={`import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});`}
        />
      </section>

      {/* Quiz Section */}
      <section className="learn-section py-12 border-t border-surface-200">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-surface-800">Ready to start?</h2>
            <p className="text-surface-500 mt-2">Check your setup knowledge.</p>
          </div>
          <Quiz module="Getting Started" questions={setupQuestions} />
        </div>
      </section>

      {/* Next Up */}
      <section className="learn-section">
        <div className="card p-6 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <h3 className="text-lg font-bold text-surface-800 mb-2">🎉 You're ready!</h3>
          <p className="text-surface-600 mb-4">
            You've set up Playwright and understand the project structure. Next, learn how to
            find elements on the page — the most important skill in test automation.
          </p>
          <div className="flex gap-3">
            <span className="badge-green">✓ Setup complete</span>
            <span className="badge-blue">Next: Selectors</span>
          </div>
        </div>
      </section>
    </LearnLayout>
  );
}
