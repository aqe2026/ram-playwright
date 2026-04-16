import LearnLayout from '../../components/LearnLayout';
import CodeBlock from '../../components/CodeBlock';
import Quiz from '../../components/learn/Quiz';
import type { Question } from '../../components/learn/Quiz';

// ---------------------------------------------------------
// AssertionsPage — Verifying app behavior
// ---------------------------------------------------------

const assertionQuestions: Question[] = [
  {
    id: 'as1',
    question: 'What is the default timeout for Playwright auto-retrying assertions?',
    options: ['1 second', '2 seconds', '5 seconds', '30 seconds'],
    correctAnswer: 2,
    explanation: 'By default, Playwright will retry an assertion like expect(el).toBeVisible() for 5 seconds before failing. This can be configured globally or per-assertion.'
  },
  {
    id: 'as2',
    question: 'When should you use a "soft assertion" (expect.soft)?',
    options: [
      'When testing critical login flows',
      'When you want the test to continue even if child checks fail (e.g., checking multiple dashboard stats)',
      'When the element is hidden',
      'Soft assertions are never recommended'
    ],
    correctAnswer: 1,
    explanation: 'Soft assertions are perfect for non-critical checks where you want to gather all failures in a single run rather than stopping at the first small discrepancy.'
  }
];

export default function AssertionsPage() {
  return (
    <LearnLayout
      title="Assertions"
      description="Verify your app behaves correctly with powerful assertions"
      emoji="✅"
    >
      {/* Intro */}
      <section className="learn-section">
        <h2 className="learn-heading">How Assertions Work</h2>
        <div className="card p-6 mb-6">
          <p className="text-surface-600 leading-relaxed mb-4">
            Assertions are the <strong className="text-surface-800">checks</strong> in your tests — they verify
            that the app is in the expected state. Playwright assertions <strong className="text-surface-800">auto-retry</strong>  
            until the condition is met (default 5 seconds), making tests more reliable.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="badge-green">✓ Auto-retrying</span>
            <span className="badge-blue">✓ Clear error messages</span>
            <span className="badge-yellow">✓ Configurable timeout</span>
          </div>
        </div>
      </section>

      {/* Visibility */}
      <section className="learn-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="learn-heading mb-0 border-0">1. Connectivity & Visibility</h2>
          <span className="badge-blue">Essential</span>
        </div>
        <p className="text-surface-600 mb-4">Check whether elements are visible or hidden on the page.</p>
        <CodeBlock
          title="Visibility checks"
          code={`// Element is visible on screen
await expect(page.getByTestId('login-form')).toBeVisible();

// Element is disabled
await expect(page.getByTestId('submit-btn')).toBeDisabled();`}
        />
        
        <div className="card p-4 mt-4 bg-emerald-50/50 border-l-4 border-l-emerald-500">
          <h4 className="text-xs font-bold text-emerald-800 uppercase mb-1">🧠 Expert Insight: The .not Modifier</h4>
          <p className="text-xs text-emerald-700">
            Almost every assertion can be negated using <code className="bg-emerald-100 px-1 rounded">.not</code>. For example: <code className="bg-emerald-100 px-1 rounded">expect(el).not.toBeVisible()</code>. Use this to verify loading spinners disappear!
          </p>
        </div>
      </section>

      {/* Text */}
      <section className="learn-section">
        <h2 className="learn-heading">2. Text & Value Content</h2>
        <p className="text-surface-600 mb-4">Verify text content of elements using exact or partial matches.</p>
        <CodeBlock
          title="Text checks"
          code={`// Exact text match
await expect(page.getByTestId('title')).toHaveText('QA TestApp');

// Partial text match (better for dynamic content)
await expect(page.getByTestId('msg')).toContainText('Welcome');`}
        />
      </section>

      {/* URL & Title */}
      <section className="learn-section">
        <h2 className="learn-heading">3. URL & Title</h2>
        <CodeBlock
          title="Page-level assertions"
          code={`// Check current URL
await expect(page).toHaveURL('/dashboard');

// Check page title
await expect(page).toHaveTitle(/QA TestApp/);`}
        />
      </section>

      {/* Input Values */}
      <section className="learn-section">
        <h2 className="learn-heading">4. Form Inputs</h2>
        <CodeBlock
          title="Value assertions"
          code={`// Check input has value
await expect(page.getByTestId('email-input')).toHaveValue('admin@demo.com');

// Check checkbox state
await expect(page.getByRole('checkbox')).toBeChecked();`}
        />
      </section>

      {/* Attributes & Count */}
      <section className="learn-section">
        <h2 className="learn-heading">5. Attributes & Count</h2>
        <CodeBlock
          title="Additional checks"
          code={`// Check attribute
await expect(page.getByTestId('img')).toHaveAttribute('src', '/logo.png');

// Check element count
await expect(page.locator('.product-card')).toHaveCount(10);`}
        />
      </section>

      {/* Soft Assertions */}
      <section className="learn-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="learn-heading mb-0 border-0">6. Soft Assertions</h2>
          <span className="badge-yellow">Advanced</span>
        </div>
        <p className="text-surface-600 mb-4">
          Normal assertions <strong>stop the test</strong> on failure. Soft assertions <strong>collect all failures</strong> and report them at the end.
        </p>
        <CodeBlock
          title="Soft assertions"
          code={`// Won't stop the test if this fails
await expect.soft(page.getByTestId('stat-1')).toHaveText('100');
await expect.soft(page.getByTestId('stat-2')).toHaveText('200');`}
        />
      </section>

      {/* Quiz Section */}
      <section className="learn-section py-12 border-t border-surface-200">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-surface-800">Knowledge Check</h2>
            <p className="text-surface-500 mt-2">Master the "Check" phase of your automation.</p>
          </div>
          <Quiz module="Assertions" questions={assertionQuestions} />
        </div>
      </section>

      {/* Practice */}
      <section className="learn-section">
        <div className="card p-6 bg-surface-900 border-0 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl">✅</div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">Expert Challenge: "The Flakiness Fix"</h3>
            <p className="text-surface-400 text-sm mb-6">
              Write a test for a slow-loading element. Use <code className="text-primary-300">expect(el).toBeVisible({'{ timeout: 10000 }'})</code> to make it stable.
            </p>
            <CodeBlock
              language="bash"
              showLineNumbers={false}
              code="npx playwright test tests/intermediate/assertions.spec.ts --headed"
            />
          </div>
        </div>
      </section>
    </LearnLayout>
  );
}
