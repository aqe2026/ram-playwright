import LearnLayout from '../../components/LearnLayout';
import CodeBlock from '../../components/CodeBlock';
import LocatorPlayground from '../../components/learn/LocatorPlayground';
import Quiz from '../../components/learn/Quiz';
import type { Question } from '../../components/learn/Quiz';

// ---------------------------------------------------------
// SelectorsPage — How to find elements on the page
// ---------------------------------------------------------

const selectorQuestions: Question[] = [
  {
    id: 's1',
    question: 'Why is getByTestId() often preferred by QA Engineers over CSS selectors?',
    options: [
      'It is faster to execute',
      'It is more stable and won\'t break if the UI styles change',
      'It automatically finds all elements on the page',
      'It is the only locator that works in Chromium'
    ],
    correctAnswer: 1,
    explanation: 'Test IDs are decoupled from styling and structure. If a developer changes a class or moves an element, the test ID remains, keeping the test stable.'
  },
  {
    id: 's2',
    question: 'Which locator is considered the "gold standard" for accessibility-first testing?',
    options: [
      'page.locator(\'.btn\')',
      'page.getByText(\'Click me\')',
      'page.getByRole(\'button\')',
      'page.getByTestId(\'submit\')'
    ],
    correctAnswer: 2,
    explanation: 'getByRole() finds elements by their ARIA roles, which is exactly how screen readers perceive the page. If your test can\'t find a button by its role, an actual user with a screen reader likely can\'t either.'
  }
];

export default function SelectorsPage() {
  return (
    <LearnLayout
      title="Selectors & Locators"
      description="Master finding elements — the foundation of every test"
      emoji="🎯"
    >
      {/* Intro */}
      <section className="learn-section">
        <h2 className="learn-heading">What are Locators?</h2>
        <div className="card p-6 mb-4">
          <p className="text-surface-600 leading-relaxed">
            Before you can click a button or check text, you need to <strong className="text-surface-800">find it on the page</strong>.
            Playwright uses <strong className="text-surface-800">locators</strong> — smart selectors that automatically wait for elements
            to appear and become actionable. Think of them as "pointers" to elements on the screen.
          </p>
        </div>

        <div className="card p-5 border-l-4 border-l-amber-500 bg-amber-50/50 mb-6 font-medium">
          <p className="text-sm text-surface-700">
            <strong>⚡ User-to-Expert Tip:</strong> Playwright locators auto-wait and auto-retry. You don't need manual
            <code className="learn-inline-code">sleep()</code> or <code className="learn-inline-code">waitFor()</code> in 99% of cases!
          </p>
        </div>
      </section>

      {/* Interactive Playground */}
      <section className="learn-section">
        <h2 className="learn-heading">🕹️ Hands-on: Interactive Inspector</h2>
        <p className="text-surface-600 mb-6">
          Hover over the elements in the sandbox below to see the recommended Playwright code to target them.
        </p>
        <LocatorPlayground />
      </section>

      {/* Priority Guide */}
      <section className="learn-section">
        <h2 className="learn-heading">🏆 Which Locator to Use? (Priority Order)</h2>
        <div className="space-y-3 mb-6">
          {[
            { rank: '1st', method: 'getByRole()', why: 'Best for accessibility. Finds by ARIA role.', badge: 'badge-green', label: 'Recommended' },
            { rank: '2nd', method: 'getByTestId()', why: 'Best for QA. Stable, won\'t break with UI changes.', badge: 'badge-green', label: 'Recommended' },
            { rank: '3rd', method: 'getByText()', why: 'Good for buttons/links with known text.', badge: 'badge-yellow', label: 'Good' },
            { rank: '4th', method: 'getByLabel()', why: 'Perfect for form inputs with labels.', badge: 'badge-yellow', label: 'Good' },
            { rank: '5th', method: 'getByPlaceholder()', why: 'When input has placeholder text.', badge: 'badge-yellow', label: 'Good' },
            { rank: '6th', method: 'locator() / CSS', why: 'Fallback. More fragile, avoid if possible.', badge: 'badge-red', label: 'Avoid' },
          ].map(item => (
            <div key={item.method} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center text-sm font-bold text-surface-600 shrink-0">
                {item.rank}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <code className="font-mono font-bold text-primary-600 text-sm">{item.method}</code>
                  <span className={item.badge}>{item.label}</span>
                </div>
                <p className="text-sm text-surface-500">{item.why}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* getByTestId */}
      <section className="learn-section">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="learn-heading mb-0 border-0">1. getByTestId() — Your Best Friend</h2>
          <span className="badge-green uppercase tracking-tighter text-[10px] font-bold">Expert Choice</span>
        </div>
        <p className="text-surface-600 mb-4">
          Finds elements by their <code className="learn-inline-code">data-testid</code> attribute.
          This is the most reliable locator because test IDs don't change when the UI is redesigned.
        </p>
        <CodeBlock
          title="Using getByTestId"
          code={`// In the React component (LoginPage.tsx):
// <button data-testid="login-button">Sign In</button>

// In your test:
const loginButton = page.getByTestId('login-button');
await expect(loginButton).toBeVisible();
await loginButton.click();`}
        />
        
        <div className="card p-4 mt-6 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <h4 className="text-xs font-bold text-emerald-800 uppercase mb-2 flex items-center gap-2">
            🧠 Expert Insight: The 1-second Rule
          </h4>
          <p className="text-xs text-emerald-700 leading-relaxed">
            If you spend more than 1 minute trying to write a complex CSS or XPath selector, stop!
            Go to the source code and add a <code className="bg-emerald-100 px-1 rounded">data-testid</code>.
            It saves hours of debugging later.
          </p>
        </div>
      </section>

      {/* getByRole */}
      <section className="learn-section">
        <h2 className="learn-heading">2. getByRole() — Accessibility-First</h2>
        <p className="text-surface-600 mb-4">
          Finds elements by their ARIA role. This is what screen readers use, so it also tests accessibility!
        </p>
        <CodeBlock
          title="Using getByRole"
          code={`// Find a button by its accessible name
const signInBtn = page.getByRole('button', { name: 'Sign In' });

// Find a heading
const title = page.getByRole('heading', { name: 'QA TestApp' });

// Find a textbox (input)
const searchBox = page.getByRole('textbox', { name: 'Search products' });`}
        />
      </section>

      {/* Fallbacks */}
      <section className="learn-section">
        <h2 className="learn-heading">3. Traditional fallbacks</h2>
        <p className="text-surface-600 mb-4">
          When high-priority locators aren't available, use these:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4">
            <h4 className="font-bold text-sm mb-2 text-surface-700">getByText()</h4>
            <p className="text-xs text-surface-500 mb-3">Find by visible label or message.</p>
            <code className="text-[10px] bg-surface-100 p-1 rounded font-mono block">page.getByText('Success!')</code>
          </div>
          <div className="card p-4">
            <h4 className="font-bold text-sm mb-2 text-surface-700">getByPlaceholder()</h4>
            <p className="text-xs text-surface-500 mb-3">Perfect for search or email inputs.</p>
            <code className="text-[10px] bg-surface-100 p-1 rounded font-mono block">page.getByPlaceholder('Search...')</code>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="learn-section py-12 border-t border-surface-200">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-surface-800">Knowledge Check</h2>
            <p className="text-surface-500 mt-2">Test your selector expertise before moving forward.</p>
          </div>
          <Quiz module="Selectors & Locators" questions={selectorQuestions} />
        </div>
      </section>

      {/* Try It */}
      <section className="learn-section">
        <div className="card p-6 bg-surface-900 border-0 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl">🧪</div>
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">Practice Challenge: "The Stability Test"</h3>
            <p className="text-surface-400 text-sm mb-6">
              Open <code className="text-primary-300">tests/beginner/ui-elements.spec.ts</code>. 
              Try to change a <code className="text-surface-300">getByText</code> locator to a <code className="text-surface-300">getByTestId</code> and run the test.
            </p>
            <CodeBlock
              language="bash"
              showLineNumbers={false}
              code="npx playwright test tests/beginner/ui-elements.spec.ts --ui"
            />
          </div>
        </div>
      </section>
    </LearnLayout>
  );
}

