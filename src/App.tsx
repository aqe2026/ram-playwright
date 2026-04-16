import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ProductFormPage from './pages/ProductFormPage';

// Learn Pages
import LearnHubPage from './pages/learn/LearnHubPage';
import GettingStartedPage from './pages/learn/GettingStartedPage';
import SelectorsPage from './pages/learn/SelectorsPage';
import ActionsPage from './pages/learn/ActionsPage';
import AssertionsPage from './pages/learn/AssertionsPage';
import InterviewPage from './pages/learn/InterviewPage';

// ---------------------------------------------------------
// App — Main application with routing
// Uses React Router v6 for navigation
// Protected routes require authentication
// ---------------------------------------------------------

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-surface-50" data-testid="app-container">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Learn Routes (public - no auth required) */}
              <Route path="/learn" element={<LearnHubPage />} />
              <Route path="/learn/getting-started" element={<GettingStartedPage />} />
              <Route path="/learn/selectors" element={<SelectorsPage />} />
              <Route path="/learn/actions" element={<ActionsPage />} />
              <Route path="/learn/assertions" element={<AssertionsPage />} />
              <Route path="/learn/interview" element={<InterviewPage />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute><ProductsPage /></ProtectedRoute>
              } />
              <Route path="/products/new" element={
                <ProtectedRoute><ProductFormPage /></ProtectedRoute>
              } />
              <Route path="/products/edit/:id" element={
                <ProtectedRoute><ProductFormPage /></ProtectedRoute>
              } />

              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
