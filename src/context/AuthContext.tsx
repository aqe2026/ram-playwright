import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ---------------------------------------------------------
// AuthContext — Simple authentication state management
// Uses localStorage to persist login across page refreshes
// ---------------------------------------------------------

interface User {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials for testing
const DEMO_USERS = [
  { email: 'admin@demo.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { email: 'user@demo.com', password: 'user123', name: 'Test User', role: 'user' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function — simulates async API call
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate network delay for realistic testing
    await new Promise(resolve => setTimeout(resolve, 500));

    const found = DEMO_USERS.find(
      u => u.email === email && u.password === password
    );

    if (found) {
      const userData: User = { email: found.email, name: found.name, role: found.role };
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
