import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

// ---------------------------------------------------------
// Navbar — Top navigation bar with auth-aware links
// Shows user info and logout when authenticated
// ---------------------------------------------------------

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation links (only shown when authenticated)
  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/products', label: 'Products', icon: '📦' },
    { to: '/products/new', label: 'Add Product', icon: '➕' },
  ];

  // Public links (always visible)
  const publicLinks = [
    { to: '/learn', label: 'Learn', icon: '📚' },
  ];

  // Helper to check if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-surface-200 sticky top-0 z-50" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="flex items-center gap-2 text-lg font-bold text-primary-600 hover:text-primary-700 transition-colors"
              data-testid="nav-logo"
            >
              <span className="text-2xl">🧪</span>
              <span>QA TestApp</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1" data-testid="nav-links">
            {isAuthenticated && navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(link.to)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-800'
                  }`}
                data-testid={`nav-link-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                <span className="mr-1.5">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            {/* Learn link — always visible */}
            {publicLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${location.pathname.startsWith(link.to)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-600 hover:bg-surface-100 hover:text-surface-800'
                  }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                <span className="mr-1.5">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu / Auth */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-surface-600" data-testid="user-info">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user.name}</span>
                  <span className="badge-blue">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-ghost text-red-600 hover:bg-red-50 hover:text-red-700"
                  data-testid="logout-button"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-primary" data-testid="login-link">
                  Login
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden btn-ghost p-2"
              data-testid="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-surface-200 animate-slide-down" data-testid="mobile-menu">
            {isAuthenticated && navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium mb-1
                  ${isActive(link.to)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-600 hover:bg-surface-100'
                  }`}
                data-testid={`mobile-nav-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            {publicLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium mb-1
                  ${location.pathname.startsWith(link.to)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-600 hover:bg-surface-100'
                  }`}
                data-testid={`mobile-nav-${link.label.toLowerCase()}`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
