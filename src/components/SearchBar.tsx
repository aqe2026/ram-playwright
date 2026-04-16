// ---------------------------------------------------------
// SearchBar — Search input with category filter dropdown
// Used on the Products page for filtering
// ---------------------------------------------------------

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  resultCount: number;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  resultCount,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center" data-testid="search-bar">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-300">🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="input pl-10"
          data-testid="search-input"
          aria-label="Search products"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
            data-testid="search-clear"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="input w-full sm:w-48"
        data-testid="category-filter"
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Result count */}
      <span className="text-sm text-surface-500 whitespace-nowrap" data-testid="result-count">
        {resultCount} product{resultCount !== 1 ? 's' : ''} found
      </span>
    </div>
  );
}
