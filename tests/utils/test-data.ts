/**
 * Test Data Management
 * ====================
 * Centralized test data used across all test files.
 * This makes tests maintainable — change data in one place.
 * 
 * Best Practice: Never hardcode test data in individual tests.
 */

// Valid login credentials (must match AuthContext demo users)
export const validCredentials = {
  admin: {
    email: 'admin@demo.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  user: {
    email: 'user@demo.com',
    password: 'user123',
    name: 'Test User',
    role: 'user',
  },
};

// Invalid credentials for negative testing
export const invalidCredentials = {
  wrongEmail: {
    email: 'wrong@test.com',
    password: 'password123',
  },
  wrongPassword: {
    email: 'admin@demo.com',
    password: 'wrongpass',
  },
  invalidEmail: {
    email: 'not-an-email',
    password: 'password123',
  },
  emptyFields: {
    email: '',
    password: '',
  },
  shortPassword: {
    email: 'admin@demo.com',
    password: '123',
  },
};

// Product data for form testing
export const testProduct = {
  valid: {
    name: 'Test Product Alpha',
    category: 'Electronics',
    price: '99.99',
    stock: '50',
    description: 'This is a test product created by automated tests for validation purposes.',
    status: 'In Stock',
  },
  invalid: {
    emptyName: '',
    shortName: 'AB',
    negativePrice: '-10',
    invalidStock: '-5',
    shortDescription: 'Too short',
  },
};

// Search terms for filtering tests
export const searchTerms = {
  existing: 'Wireless',           // Should match products
  partial: 'head',                // Partial match
  noResults: 'xyznonexistent',    // Should return no results
  category: 'Electronics',        // Category name
};

// URLs used in navigation tests
export const appUrls = {
  login: '/login',
  dashboard: '/dashboard',
  products: '/products',
  addProduct: '/products/new',
  editProduct: (id: number) => `/products/edit/${id}`,
};
