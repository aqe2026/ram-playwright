import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import products from '../data/products';

// ---------------------------------------------------------
// DashboardPage — Overview with summary cards and stats
// Shows welcome message and key metrics
// ---------------------------------------------------------

export default function DashboardPage() {
  const { user } = useAuth();

  // Calculate stats from product data
  const totalProducts = products.length;
  const inStock = products.filter(p => p.status === 'In Stock').length;
  const lowStock = products.filter(p => p.status === 'Low Stock').length;
  const outOfStock = products.filter(p => p.status === 'Out of Stock').length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const avgRating = (products.reduce((sum, p) => sum + p.rating, 0) / totalProducts).toFixed(1);
  const categories = [...new Set(products.map(p => p.category))].length;

  // Summary cards data
  const stats = [
    { label: 'Total Products', value: totalProducts, icon: '📦', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'In Stock', value: inStock, icon: '✅', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'Low Stock', value: lowStock, icon: '⚠️', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Out of Stock', value: outOfStock, icon: '❌', color: 'bg-red-50 text-red-700 border-red-200' },
    { label: 'Categories', value: categories, icon: '🏷️', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { label: 'Avg Rating', value: avgRating, icon: '⭐', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-surface-800" data-testid="welcome-message">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-surface-500 mt-1" data-testid="dashboard-subtitle">
          Here's an overview of your product inventory.
        </p>
      </div>

      {/* Stats Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        data-testid="stats-grid"
      >
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className={`card p-5 border ${stat.color} animate-slide-up`}
            style={{ animationDelay: `${idx * 50}ms` }}
            data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s/g, '-')}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-75 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Value */}
      <div className="card p-6 mb-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white border-0 animate-slide-up" data-testid="inventory-value-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-200">Total Inventory Value</p>
            <p className="text-3xl font-bold mt-1" data-testid="total-value">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <span className="text-5xl opacity-30">💰</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8" data-testid="quick-actions">
        <h2 className="text-lg font-semibold text-surface-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/products"
            className="card p-5 flex items-center gap-4 hover:border-primary-300 transition-colors group"
            data-testid="action-view-products"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">📋</span>
            <div>
              <p className="font-medium text-surface-800">View Products</p>
              <p className="text-xs text-surface-500">Browse all inventory items</p>
            </div>
          </Link>

          <Link
            to="/products/new"
            className="card p-5 flex items-center gap-4 hover:border-primary-300 transition-colors group"
            data-testid="action-add-product"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">➕</span>
            <div>
              <p className="font-medium text-surface-800">Add Product</p>
              <p className="text-xs text-surface-500">Add a new item to inventory</p>
            </div>
          </Link>

          <Link
            to="/products"
            className="card p-5 flex items-center gap-4 hover:border-primary-300 transition-colors group"
            data-testid="action-manage-stock"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">📊</span>
            <div>
              <p className="font-medium text-surface-800">Manage Stock</p>
              <p className="text-xs text-surface-500">Update stock levels</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div data-testid="recent-products">
        <h2 className="text-lg font-semibold text-surface-800 mb-4">Recent Products</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-50 text-surface-600">
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Category</th>
                <th className="text-right px-5 py-3 font-medium">Price</th>
                <th className="text-center px-5 py-3 font-medium hidden sm:table-cell">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {products.slice(0, 5).map(product => (
                <tr key={product.id} className="hover:bg-surface-50 transition-colors" data-testid={`recent-row-${product.id}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span>{product.image}</span>
                      <span className="font-medium text-surface-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-surface-500 hidden sm:table-cell">{product.category}</td>
                  <td className="px-5 py-3 text-right font-medium text-surface-800">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-center hidden sm:table-cell">
                    <span className={
                      product.status === 'In Stock' ? 'badge-green' :
                      product.status === 'Low Stock' ? 'badge-yellow' : 'badge-red'
                    }>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
