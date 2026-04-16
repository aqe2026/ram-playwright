import { useState, useRef, useEffect } from 'react';
import CodeBlock from '../CodeBlock';

// ---------------------------------------------------------
// ActionSimulator — Live interaction recorder
// Generates Playwright code as the user clicks/types
// ---------------------------------------------------------

export default function ActionSimulator() {
  const [logs, setLogs] = useState<string[]>([]);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'Admin' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console to bottom
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (code: string) => {
    setLogs(prev => [...prev.slice(-10), code]);
  };

  const handleInput = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    addLog(`await page.getByTestId('${name}-input').fill('${value}');`);
  };

  const handleSelect = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
    addLog(`await page.getByTestId('role-select').selectOption('${value}');`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLog(`await page.getByTestId('login-button').click();`);
    addLog(`await page.waitForURL('/dashboard');`);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setLogs([]);
      setFormData({ email: '', password: '', role: 'Admin' });
    }, 3000);
  };

  const handleToggle = (name: string, state: boolean) => {
    addLog(`await page.getByTestId('${name}-toggle').${state ? 'check' : 'uncheck'}();`);
  };

  return (
    <div className="card overflow-hidden border-2 border-primary-100" data-testid="action-simulator">
      <div className="bg-primary-50 p-4 border-b border-primary-100 flex items-center justify-between">
        <h4 className="font-bold text-primary-800 text-sm flex items-center gap-2">
          🖱️ Live Action Simulator
        </h4>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold text-red-600 uppercase">Recording Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Interactive Demo UI */}
        <div className="p-8 bg-surface-50 border-r border-surface-200">
          <p className="text-xs font-semibold text-surface-400 uppercase mb-6">
            Step 1: Interact with this form
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
              <div>
                <label className="block text-xs font-medium text-surface-700 mb-1">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="admin@demo.com"
                  value={formData.email}
                  onChange={(e) => handleInput('email', e.target.value)}
                  data-testid="email-input"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-700 mb-1">Role</label>
                <select
                  className="input"
                  value={formData.role}
                  onChange={(e) => handleSelect(e.target.value)}
                  data-testid="role-select"
                >
                  <option value="Admin">Admin</option>
                  <option value="Store Manager">Store Manager</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="remember"
                  onChange={(e) => handleToggle('remember', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded border-surface-300 focus:ring-primary-500"
                />
                <label htmlFor="remember" className="text-xs text-surface-600">Remember me</label>
              </div>
              <button
                type="submit"
                className="btn-primary w-full shadow-md hover:shadow-lg transition-transform active:scale-95"
              >
                Sign In
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 animate-scale-in">
              <span className="text-5xl mb-4">🚀</span>
              <h4 className="text-xl font-bold text-emerald-600">Login Successful!</h4>
              <p className="text-sm text-surface-500 mt-2">Redirecting to dashboard...</p>
            </div>
          )}
        </div>

        {/* Right: Code Recorder */}
        <div className="p-6 bg-surface-900 flex flex-col h-full min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-surface-500 uppercase">
              Step 2: See Code Generator
            </p>
            {logs.length > 0 && (
              <button
                onClick={() => setLogs([])}
                className="text-[10px] text-surface-600 hover:text-surface-400 font-bold uppercase tracking-widest"
              >
                Clear
              </button>
            )}
          </div>

          <div
            ref={consoleRef}
            className="flex-1 bg-surface-950/50 rounded-xl border border-surface-800 p-4 font-mono text-[11px] overflow-y-auto"
          >
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                <span className="text-2xl mb-2 italic">Waiting for input...</span>
                <p className="text-[10px] text-surface-600 leading-relaxed italic">
                  Every interaction on the left will generate<br />
                  real Playwright code here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex gap-2 group border-b border-surface-800/10 pb-1">
                    <span className="text-surface-700 select-none">{idx + 1}</span>
                    <span className="text-emerald-400 leading-relaxed break-all font-mono">
                      {log.split('.').map((part, i) => (
                        <span key={i}>
                          {i > 0 && <span className="text-surface-600">.</span>}
                          {part.includes('(') ? (
                            <>
                              <span className="text-primary-400">{part.split('(')[0]}</span>
                              <span className="text-surface-400">(</span>
                              <span className="text-amber-300">{part.split('(')[1].split(')')[0]}</span>
                              <span className="text-surface-400">)</span>
                            </>
                          ) : part}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-surface-800/40 rounded border border-surface-700/50">
            <p className="text-[10px] text-surface-400 leading-relaxed italic">
              <strong>💡 Expert Insight:</strong> Notice how Playwright actions like <code className="text-emerald-300">fill()</code> and <code className="text-emerald-300">click()</code> are asynchronous? They always return a <code className="text-blue-300">Promise</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
