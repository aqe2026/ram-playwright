import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// ---------------------------------------------------------
// LearnLayout — Shared layout for all learning pages
// Sidebar navigation with progress tracking
// ---------------------------------------------------------

interface LearnLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  emoji: string;
}

const topics = [
  { path: '/learn', label: 'Learning Hub', emoji: '🏠', short: 'Hub' },
  { path: '/learn/getting-started', label: 'Getting Started', emoji: '🚀', short: 'Setup' },
  { path: '/learn/selectors', label: 'Selectors & Locators', emoji: '🎯', short: 'Selectors' },
  { path: '/learn/actions', label: 'Actions & Interactions', emoji: '🖱️', short: 'Actions' },
  { path: '/learn/assertions', label: 'Assertions', emoji: '✅', short: 'Assertions' },
  { path: '/learn/interview', label: 'Interview Prep', emoji: '💼', short: 'Interview' },
];

export default function LearnLayout({ children, title, description, emoji }: LearnLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visited, setVisited] = useState<string[]>([]);

  // Track visited pages
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('learn_visited') || '[]');
    if (!stored.includes(location.pathname)) {
      stored.push(location.pathname);
      localStorage.setItem('learn_visited', JSON.stringify(stored));
    }
    setVisited(stored);
  }, [location.pathname]);

  const currentIdx = topics.findIndex(t => t.path === location.pathname);
  const prevTopic = currentIdx > 0 ? topics[currentIdx - 1] : null;
  const nextTopic = currentIdx < topics.length - 1 ? topics[currentIdx + 1] : null;
  const progress = Math.round((visited.filter(v => v !== '/learn').length / (topics.length - 1)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-6">
        {/* Sidebar — Desktop */}
        <aside className="hidden lg:block w-64 shrink-0" data-testid="learn-sidebar">
          <div className="sticky top-20">
            {/* Progress */}
            <div className="card p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-surface-600">Progress</span>
                <span className="text-xs font-bold text-primary-600">{progress}%</span>
              </div>
              <div className="w-full bg-surface-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Topic Links */}
            <nav className="card p-2">
              {topics.map(topic => {
                const isActive = location.pathname === topic.path;
                const isVisited = visited.includes(topic.path);
                return (
                  <Link
                    key={topic.path}
                    to={topic.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-0.5
                      ${isActive
                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                        : 'text-surface-600 hover:bg-surface-50 hover:text-surface-800'
                      }`}
                    data-testid={`learn-nav-${topic.short.toLowerCase()}`}
                  >
                    <span className="text-lg">{topic.emoji}</span>
                    <span className="flex-1">{topic.label}</span>
                    {isVisited && !isActive && (
                      <span className="text-emerald-500 text-xs">✓</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-40 btn-primary rounded-full w-14 h-14 shadow-lg flex items-center justify-center text-xl"
          data-testid="learn-mobile-toggle"
          aria-label="Toggle navigation"
        >
          📚
        </button>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50" data-testid="learn-mobile-sidebar">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl p-4 animate-slide-right overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-surface-800">📚 Topics</h3>
                <button onClick={() => setSidebarOpen(false)} className="text-surface-400 hover:text-surface-600 p-1">✕</button>
              </div>
              <nav>
                {topics.map(topic => {
                  const isActive = location.pathname === topic.path;
                  return (
                    <Link
                      key={topic.path}
                      to={topic.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all mb-1
                        ${isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-surface-600 hover:bg-surface-50'
                        }`}
                    >
                      <span className="text-lg">{topic.emoji}</span>
                      <span>{topic.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-2 text-sm text-surface-500 mb-3">
              <Link to="/learn" className="hover:text-primary-600 transition-colors">Learn</Link>
              {location.pathname !== '/learn' && (
                <>
                  <span>›</span>
                  <span className="text-surface-700">{title}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{emoji}</span>
              <div>
                <h1 className="text-2xl font-bold text-surface-800">{title}</h1>
                <p className="text-surface-500 mt-1">{description}</p>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="animate-slide-up">
            {children}
          </div>

          {/* Previous / Next Navigation */}
          {(prevTopic || nextTopic) && location.pathname !== '/learn' && (
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-surface-200">
              {prevTopic ? (
                <Link to={prevTopic.path} className="learn-nav-btn group" data-testid="learn-prev">
                  <span className="text-xs text-surface-400 group-hover:text-primary-500">← Previous</span>
                  <span className="font-medium text-surface-700 group-hover:text-primary-600">
                    {prevTopic.emoji} {prevTopic.label}
                  </span>
                </Link>
              ) : <div />}
              {nextTopic ? (
                <Link to={nextTopic.path} className="learn-nav-btn text-right group" data-testid="learn-next">
                  <span className="text-xs text-surface-400 group-hover:text-primary-500">Next →</span>
                  <span className="font-medium text-surface-700 group-hover:text-primary-600">
                    {nextTopic.emoji} {nextTopic.label}
                  </span>
                </Link>
              ) : <div />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
