import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ---------------------------------------------------------
// LoginPage — Email/password form with validation
// Demo credentials shown for easy testing
// ---------------------------------------------------------

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  // Form validation
  const validate = (): string | null => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email';
    if (!password.trim()) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Try the demo credentials below.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🧪</div>
          <h1 className="text-3xl font-bold text-surface-800" data-testid="login-title">
            QA TestApp
          </h1>
          <p className="text-surface-500 mt-2" data-testid="login-subtitle">
            Sign in to your testing dashboard
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="card p-8 space-y-5"
          data-testid="login-form"
          noValidate
        >
          {/* Error Message */}
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fade-in"
              data-testid="error-message"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="admin@demo.com"
              className={error && !email ? 'input-error' : 'input'}
              data-testid="email-input"
              autoComplete="email"
              autoFocus
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-surface-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••"
              className={error && !password ? 'input-error' : 'input'}
              data-testid="password-input"
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-3"
            data-testid="login-button"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 card p-5" data-testid="demo-credentials">
          <h3 className="text-sm font-semibold text-surface-700 mb-3">
            🔑 Demo Credentials
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-surface-50 rounded-lg">
              <div>
                <span className="font-medium text-surface-700">Admin:</span>
                <span className="text-surface-500 ml-1">admin@demo.com / admin123</span>
              </div>
              <button
                onClick={() => { setEmail('admin@demo.com'); setPassword('admin123'); setError(''); }}
                className="text-primary-600 hover:text-primary-700 font-medium"
                data-testid="fill-admin"
              >
                Use
              </button>
            </div>
            <div className="flex justify-between items-center p-2 bg-surface-50 rounded-lg">
              <div>
                <span className="font-medium text-surface-700">User:</span>
                <span className="text-surface-500 ml-1">user@demo.com / user123</span>
              </div>
              <button
                onClick={() => { setEmail('user@demo.com'); setPassword('user123'); setError(''); }}
                className="text-primary-600 hover:text-primary-700 font-medium"
                data-testid="fill-user"
              >
                Use
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
