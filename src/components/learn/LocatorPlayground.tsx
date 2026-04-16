import { useState } from 'react';
import CodeBlock from '../CodeBlock';

// ---------------------------------------------------------
// LocatorPlayground — Interactive element inspector
// Helps users understand how to target UI elements
// ---------------------------------------------------------

interface PlaygroundElement {
  id: string;
  role: string;
  name: string;
  testId: string;
  text: string;
  placeholder?: string;
  html: string;
}

const DEMO_ELEMENTS: PlaygroundElement[] = [
  {
    id: 'login-btn',
    role: 'button',
    name: 'Sign In',
    testId: 'login-button',
    text: 'Sign In',
    html: '<button data-testid="login-button" class="btn-primary">Sign In</button>',
  },
  {
    id: 'email-input',
    role: 'textbox',
    name: 'Email Address',
    testId: 'email-input',
    text: '',
    placeholder: 'admin@demo.com',
    html: '<div class="mb-4">\n  <label for="email">Email Address</label>\n  <input id="email" data-testid="email-input" placeholder="admin@demo.com" />\n</div>',
  },
  {
    id: 'nav-home',
    role: 'link',
    name: 'Dashboard',
    testId: 'nav-link-dashboard',
    text: '📊 Dashboard',
    html: '<a href="/dashboard" data-testid="nav-link-dashboard">📊 Dashboard</a>',
  },
  {
    id: 'status-badge',
    role: 'status',
    name: 'In Stock',
    testId: 'status-badge',
    text: 'In Stock',
    html: '<span data-testid="status-badge" class="badge-green">In Stock</span>',
  },
];

export default function LocatorPlayground() {
  const [hovered, setHovered] = useState<PlaygroundElement | null>(null);

  const getPlaywrightCode = (el: PlaygroundElement) => {
    return [
      `// Recommended (by Role):`,
      `page.getByRole('${el.role}', { name: '${el.name}' });`,
      ``,
      `// Best for QA (by TestId):`,
      `page.getByTestId('${el.testId}');`,
      ``,
      `// By Visible Text:`,
      `page.getByText('${el.text || el.name}');`,
    ].join('\n');
  };

  return (
    <div className="card overflow-hidden border-2 border-primary-100" data-testid="locator-playground">
      <div className="bg-primary-50 p-4 border-b border-primary-100 flex items-center justify-between">
        <h4 className="font-bold text-primary-800 text-sm flex items-center gap-2">
          🎯 Interactive Locator Playground
        </h4>
        <span className="badge-blue">Live Inspector Mode</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Interactive Area */}
        <div className="p-8 bg-surface-50 border-r border-surface-200 min-h-[300px] flex flex-col justify-center gap-6">
          <p className="text-xs font-semibold text-surface-400 uppercase mb-4">
            Step 1: Hover over an element below
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onMouseEnter={() => setHovered(DEMO_ELEMENTS[0])}
                className="btn-primary"
                data-testid="playground-btn"
              >
                Sign In
              </button>
              
              <span
                onMouseEnter={() => setHovered(DEMO_ELEMENTS[3])}
                className="badge-green cursor-default"
                data-testid="playground-badge"
              >
                In Stock
              </span>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                onMouseEnter={() => setHovered(DEMO_ELEMENTS[2])}
                className="text-primary-600 hover:text-primary-700 font-medium underline-offset-4 hover:underline"
              >
                📊 Dashboard
              </a>
            </div>

            <div
              className="max-w-xs"
              onMouseEnter={() => setHovered(DEMO_ELEMENTS[1])}
            >
              <label className="block text-xs font-medium text-surface-600 mb-1">Email Address</label>
              <input
                disabled
                placeholder="admin@demo.com"
                className="input cursor-default"
              />
            </div>
          </div>

          {!hovered && (
            <div className="mt-8 p-4 bg-white/50 border border-dashed border-surface-300 rounded-lg text-center">
              <p className="text-sm text-surface-400 italic">
                Hover to see the code...
              </p>
            </div>
          )}
        </div>

        {/* Right: Code Console */}
        <div className="p-6 bg-surface-900 flex flex-col gap-4">
          <p className="text-xs font-semibold text-surface-500 uppercase">
            Step 2: See Playwright code
          </p>

          {hovered ? (
            <div className="animate-fade-in flex flex-col h-full">
              <div className="mb-4">
                <p className="text-xs text-primary-400 mb-1 font-mono">HTML Source:</p>
                <div className="bg-surface-800 p-2 rounded text-[10px] text-surface-400 font-mono whitespace-pre overflow-x-auto">
                  {hovered.html}
                </div>
              </div>

              <div className="flex-1">
                <p className="text-xs text-emerald-400 mb-2 font-mono">Playwright Code:</p>
                <CodeBlock
                  language="typescript"
                  showLineNumbers={false}
                  code={getPlaywrightCode(hovered)}
                />
              </div>

              <div className="mt-4 p-3 bg-primary-900/40 rounded border border-primary-800/50">
                <p className="text-[10px] text-primary-200 leading-relaxed italic">
                  <strong>⭐ Expert Tip:</strong> Prefer <code className="text-primary-300">getByRole</code> for accessibility or <code className="text-primary-300">getByTestId</code> for long-term stability.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <span className="text-3xl mb-3 opacity-20">🖱️</span>
              <p className="text-surface-600 text-sm">
                Move your mouse over the UI<br />
                on the left to inspect elements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
