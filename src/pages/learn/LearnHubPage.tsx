import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LearnLayout from '../../components/LearnLayout';

// ---------------------------------------------------------
// LearnHubPage — Learning portal landing page
// Shows all topics with progress tracking & expert track
// ---------------------------------------------------------

const topics = [
  {
    path: '/learn/getting-started',
    title: 'Getting Started',
    emoji: '🚀',
    description: 'Install Playwright, understand the project structure, and run your first test.',
    difficulty: 'Beginner',
    time: '10 min',
    color: 'from-emerald-500 to-teal-600',
    concepts: ['Installation', 'CLI Commands', 'Project Structure', 'First Test'],
  },
  {
    path: '/learn/selectors',
    title: 'Selectors & Locators',
    emoji: '🎯',
    description: 'Master finding elements on the page — the foundation of every Playwright test.',
    difficulty: 'Beginner',
    time: '15 min',
    color: 'from-blue-500 to-indigo-600',
    concepts: ['getByTestId', 'getByRole', 'getByText', 'CSS Selectors', 'Best Practices'],
    hasInteractive: true
  },
  {
    path: '/learn/actions',
    title: 'Actions & Interactions',
    emoji: '🖱️',
    description: 'Click buttons, fill forms, navigate pages, and handle dialogs like a pro.',
    difficulty: 'Beginner',
    time: '15 min',
    color: 'from-violet-500 to-purple-600',
    concepts: ['click()', 'fill()', 'Navigation', 'Waiting', 'Keyboard & Mouse'],
    hasInteractive: true
  },
  {
    path: '/learn/assertions',
    title: 'Assertions',
    emoji: '✅',
    description: 'Verify that your app behaves correctly with powerful assertion methods.',
    difficulty: 'Intermediate',
    time: '15 min',
    color: 'from-amber-500 to-orange-600',
    concepts: ['toBeVisible', 'toHaveText', 'toHaveURL', 'Soft Assertions', 'Auto-retry'],
    hasInteractive: true
  },
  {
    path: '/learn/interview',
    title: 'Interview Prep',
    emoji: '💼',
    description: '30+ curated QA/SDET interview questions with detailed answers.',
    difficulty: 'All Levels',
    time: '30 min',
    color: 'from-rose-500 to-pink-600',
    concepts: ['Playwright Basics', 'Locators', 'POM Pattern', 'CI/CD', 'Best Practices'],
  },
];

export default function LearnHubPage() {
  const [visited, setVisited] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const storedVisited = JSON.parse(localStorage.getItem('learn_visited') || '[]');
    const storedScores = JSON.parse(localStorage.getItem('quiz_scores') || '{}');
    setVisited(storedVisited);
    setQuizScores(storedScores);
  }, []);

  const completedCount = visited.filter(v => v !== '/learn').length;
  const totalTopics = topics.length;
  const progress = Math.round((completedCount / totalTopics) * 100);
  const totalQuizzes = topics.filter(t => t.hasInteractive).length;
  const quizzesDone = Object.keys(quizScores).length;

  return (
    <LearnLayout
      title="Playwright Expert Training"
      description="Interactive path from beginner to testing expert"
      emoji="🎓"
    >
      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="card p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white border-0 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-2 -bottom-2 text-6xl opacity-10 group-hover:scale-110 transition-transform">📚</div>
          <p className="text-primary-100 text-xs font-bold uppercase tracking-widest mb-1">Learning Track</p>
          <p className="text-4xl font-black mt-1">{progress}%</p>
          <p className="text-primary-200 text-xs mt-2">{completedCount} of {totalTopics} modules explored</p>
        </div>
        
        <div className="card p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-2 -bottom-2 text-6xl opacity-10 group-hover:scale-110 transition-transform">🏆</div>
          <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Interactive Labs</p>
          <p className="text-4xl font-black mt-1">{quizzesDone}</p>
          <p className="text-emerald-200 text-xs mt-2">{totalQuizzes - quizzesDone} certifications remaining</p>
        </div>

        <div className="card p-6 bg-white border-primary-200 shadow-xl relative overflow-hidden group">
          <p className="text-primary-600 text-xs font-bold uppercase tracking-widest mb-1">Current Rank</p>
          <p className="text-2xl font-black mt-2 text-surface-800">
            {progress === 100 && quizzesDone === totalQuizzes ? '⭐ QA Architect' :
             progress > 70 ? '🎖️ Senior SDET' :
             progress > 30 ? '🏅 QA Automation' : '🐣 Testing Novice'}
          </p>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} className={`w-2 h-2 rounded-full ${progress >= i * 20 ? 'bg-primary-500' : 'bg-surface-200'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Path */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-surface-800 flex items-center gap-2 mb-6">
          <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-sm">🛤️</span>
          Your Interactive Learning Path
        </h2>

        <div className="space-y-6">
          {topics.map((topic) => {
            const isVisited = visited.includes(topic.path);
            
            return (
              <Link
                key={topic.path}
                to={topic.path}
                className="block group"
              >
                <div className={`card overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 border-l-8 ${
                  isVisited ? 'border-l-emerald-500' : 'border-l-surface-300'
                }`}>
                  <div className="flex flex-col sm:flex-row p-6 items-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 sm:mb-0 sm:mr-6 bg-gradient-to-br ${topic.color} shadow-lg`}>
                      {topic.emoji}
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-surface-800 group-hover:text-primary-600 transition-colors">
                          {topic.title}
                        </h3>
                        {topic.hasInteractive && (
                          <span className="badge-blue text-[10px] hidden sm:inline-block">Includes Lab</span>
                        )}
                        {isVisited && (
                          <span className="badge-green text-[10px] hidden sm:inline-block">✓ Completed</span>
                        )}
                      </div>
                      <p className="text-sm text-surface-500 line-clamp-2 mb-4">{topic.description}</p>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {topic.concepts.slice(0, 3).map(c => (
                          <span key={c} className="px-2 py-0.5 bg-surface-100 text-surface-500 rounded text-[10px] font-medium uppercase tracking-wider">
                            {c}
                          </span>
                        ))}
                        {topic.concepts.length > 3 && (
                          <span className="px-2 py-0.5 bg-surface-50 text-surface-400 rounded text-[10px]">+{topic.concepts.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-0 sm:ml-6 text-right shrink-0">
                      <span className={`badge px-4 py-1.5 rounded-xl ${
                        topic.difficulty === 'Beginner' ? 'badge-green' :
                        topic.difficulty === 'Intermediate' ? 'badge-yellow' : 'badge-blue'
                      }`}>
                        {topic.difficulty}
                      </span>
                      <p className="text-[10px] font-bold text-surface-400 mt-2 uppercase tracking-widest">{topic.time}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Why Interactivity? Expert Quote */}
      <div className="card p-8 bg-surface-900 border-0 shadow-2xl overflow-hidden relative mt-16">
        <div className="absolute -left-10 -bottom-10 text-[200px] opacity-[0.03] text-white">"</div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-2xl font-bold text-white mb-4 italic leading-tight">
            "Testing isn't just about code; it's about a mindset. Experts don't just find bugs; they prevent them."
          </h3>
          <p className="text-primary-400 font-bold uppercase tracking-widest text-xs">SDET Mastery Guide</p>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="flex gap-3">
              <span className="text-2xl">🧠</span>
              <p className="text-xs text-surface-400 leading-relaxed">
                <strong>Mindset:</strong> Learn to think like a user while debugging like a developer.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">⚡</span>
              <p className="text-xs text-surface-400 leading-relaxed">
                <strong>Stability:</strong> Use modern Playwright patterns to eliminate flaky tests forever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LearnLayout>
  );
}

