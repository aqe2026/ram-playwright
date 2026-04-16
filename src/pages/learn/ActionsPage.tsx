import LearnLayout from '../../components/LearnLayout';
import CodeBlock from '../../components/CodeBlock';
import ActionSimulator from '../../components/learn/ActionSimulator';
import Quiz from '../../components/learn/Quiz';
import type { Question } from '../../components/learn/Quiz';

// ---------------------------------------------------------
// ActionsPage — Clicking, typing, navigating, waiting
// ---------------------------------------------------------

const actionQuestions: Question[] = [
  {
    id: 'a1',
    question: 'What happens if you call .click() on an element that is currently obscured by a loading spinner?',
    options: [
      'The test fails immediately with an "Element not found" error',
      'Playwright automatically waits for the spinner to disappear before clicking',
      'The click is performed on the spinner instead',
      'The browser crashes'
    ],
    correctAnswer: 1,
    explanation: 'This is called "Actionability". Playwright checks if the element is visible, stable, and not obscured before performing the action. It will wait up to the timeout (default 30s) for the element to become clickable.'
  },
  {
    id: 'a2',
    question: 'When should you use pressSequentially() instead of fill()?',
    options: [
      'Always, because it is more realistic',
      'When you need to clear the input before typing',
      'When the UI has real-time listeners (like autocomplete) that trigger on every keydown/keyup event',
      'When typing passwords'
    ],
    correctAnswer: 2,
    explanation: 'fill() sets the entire value at once (fast). pressSequentially() types character by character, which is necessary for testing search-as-you-type features or fields with complex validation logic.'
  }
];

export default function ActionsPage() {
  return (
    <LearnLayout
      title="Actions & Interactions"
      description="Click, type, navigate, and interact with your app"
      emoji="🖱️"
    >
      {/* Intro */}
      <section className="learn-section">
        <h2 className="learn-heading">How Actions Work</h2>
        <div className="card p-6 mb-6">
          <p className="text-surface-600 leading-relaxed">
            After finding an element with a locator, you perform <strong className="text-surface-800">actions</strong> on it —
            clicking, typing, selecting, etc. Playwright actions are <strong className="text-surface-800">auto-waiting</strong>:
            they wait for the element to be visible, enabled, and stable before acting.
          </p>
        </div>
      </section>

      {/* Interactive Simulator */}
      <section className="learn-section">
        <h2 className="learn-heading">🕹️ Hands-on: Live Action Recorder</h2>
        <p className="text-surface-600 mb-6 font-medium">
          Interact with the form below. Notice how the "Code Recorder" on the right generates the exact Playwright commands in real-time!
        </p>
        <ActionSimulator />
      </section>

      {/* Click */}
      <section className="learn-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="learn-heading mb-0 border-0">1. click() — The Basic Action</h2>
          <span className="badge-blue">Most Common</span>
        </div>
        <p className="text-surface-600 mb-4">The most common action. Clicks a button, link, or any element.</p>
        <CodeBlock
          title="Click examples"
          code={`// Click a button
await page.getByTestId('login-button').click();

// Double-click
await page.getByTestId('product-name').dblclick();

// Right-click
await page.getByTestId('card').click({ button: 'right' });`}
        />
        
        <div className="card p-4 mt-4 bg-blue-50/50 border-l-4 border-l-blue-400">
          <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">🧠 Expert Insight: Actionability</h4>
          <p className="text-xs text-blue-700">
            Playwright performs "Actionability" checks: it ensures the button is <strong>Attached, Visible, Stable, Enabled,</strong> and <strong>Receiving Events</strong> before it actually clicks.
          </p>
        </div>
      </section>

      {/* Fill & Type */}
      <section className="learn-section">
        <h2 className="learn-heading">2. fill() vs. pressSequentially()</h2>
        <p className="text-surface-600 mb-4">
          <code className="learn-inline-code">fill()</code> is the fastest way to set values. It clears the field and sets the text instantly.
        </p>
        <CodeBlock
          title="Typing into forms"
          code={`// Use fill() for 90% of cases
await page.getByTestId('email-input').fill('admin@demo.com');

// Use pressSequentially() for search boxes or real-time validation
await page.getByTestId('search').pressSequentially('headphones', { delay: 50 });`}
        />
      </section>

      {/* Select Options */}
      <section className="learn-section">
        <h2 className="learn-heading">3. selectOption() — Dropdowns</h2>
        <CodeBlock
          title="Dropdown selection"
          code={`// Select by visible text
await page.getByTestId('category-select').selectOption('Electronics');

// Select by value
await page.getByTestId('sort-select').selectOption('price-asc');`}
        />
      </section>

      {/* Navigation */}
      <section className="learn-section">
        <h2 className="learn-heading">4. Navigation & Smart Waiting</h2>
        <p className="text-surface-600 mb-4">
          Expert testers never use <code className="learn-inline-code">waitForTimeout()</code>. Use these instead:
        </p>
        <div className="space-y-3 mb-6">
          <div className="card p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
            <div>
              <p className="font-bold text-sm text-surface-800">waitForURL()</p>
              <p className="text-xs text-surface-500">Wait for the page to redirect after an action.</p>
            </div>
            <code className="text-xs bg-surface-100 p-1 rounded font-mono">await page.waitForURL('/home')</code>
          </div>
          <div className="card p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
            <div>
              <p className="font-bold text-sm text-surface-800">waitForResponse()</p>
              <p className="text-xs text-surface-500">Wait for a specific API call to finish.</p>
            </div>
            <code className="text-xs bg-surface-100 p-1 rounded font-mono">page.waitForResponse('**/api/**')</code>
          </div>
        </div>
      </section>

      {/* Keyboard */}
      <section className="learn-section">
        <h2 className="learn-heading">5. Keyboard Shortcuts</h2>
        <p className="text-surface-600 mb-4">Simulate real user keyboard input.</p>
        <CodeBlock
          title="Keyboard actions"
          code={`// Press Enter
await page.keyboard.press('Enter');

// Combinations
await page.keyboard.press('Control+A');
await page.keyboard.press('Backspace');`}
        />
      </section>

      {/* Quiz Section */}
      <section className="learn-section py-12 border-t border-surface-200">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-surface-800">Knowledge Check</h2>
            <p className="text-surface-500 mt-2">Ready to handle complex interactions? Test yourself.</p>
          </div>
          <Quiz module="Actions & Interactions" questions={actionQuestions} />
        </div>
      </section>

      {/* Practice */}
      <section className="learn-section">
        <div className="card p-6 bg-surface-900 border-0 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl">🖱️</div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">Practice Task: "The Multi-Step Form"</h3>
            <p className="text-surface-400 text-sm mb-6">
              Go to the <strong>Add Product</strong> page in this app. Try to write a test that fills the form, selects a category, and clicks "Create".
            </p>
            <CodeBlock
              language="bash"
              showLineNumbers={false}
              code="npx playwright test tests/beginner/form-input.spec.ts --headed"
            />
          </div>
        </div>
      </section>
    </LearnLayout>
  );
}
