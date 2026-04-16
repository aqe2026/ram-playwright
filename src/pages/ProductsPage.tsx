import { useState, useMemo } from 'react';
import productsData, { getCategories } from '../data/products';
import type { Product } from '../data/products';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';

// ---------------------------------------------------------
// ProductsPage — Product listing with search, filter, sort
// Includes delete confirmation modal
// ---------------------------------------------------------

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const categories = getCategories();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Handle product deletion
  const handleDelete = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) setDeleteTarget(product);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-800" data-testid="products-title">
            Products
          </h1>
          <p className="text-surface-500 text-sm mt-1">
            Manage your product inventory
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm text-surface-600 whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input w-44"
            data-testid="sort-select"
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          resultCount={filteredProducts.length}
        />
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          data-testid="product-grid"
        >
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in" data-testid="no-results">
          <span className="text-5xl block mb-4">🔍</span>
          <h3 className="text-lg font-semibold text-surface-700">No products found</h3>
          <p className="text-surface-500 mt-1">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
            className="btn-secondary mt-4"
            data-testid="clear-filters"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Product"
        confirmText="Delete"
        variant="danger"
      >
        <p className="text-surface-600" data-testid="delete-confirmation-text">
          Are you sure you want to delete{' '}
          <strong className="text-surface-800">{deleteTarget?.name}</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
