import { Link } from 'react-router-dom';
import type { Product } from '../data/products';

// ---------------------------------------------------------
// ProductCard — Displays individual product information
// Shows name, category, price, stock status, and actions
// ---------------------------------------------------------

interface ProductCardProps {
  product: Product;
  onDelete?: (id: number) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  // Map status to badge variant
  const statusBadge = {
    'In Stock': 'badge-green',
    'Low Stock': 'badge-yellow',
    'Out of Stock': 'badge-red',
  }[product.status];

  // Generate star rating display
  const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

  return (
    <div className="card p-5 flex flex-col h-full animate-fade-in" data-testid={`product-card-${product.id}`}>
      {/* Product Image (emoji placeholder) */}
      <div className="text-4xl mb-3" data-testid="product-image">
        {product.image}
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-surface-800 text-sm leading-tight" data-testid="product-name">
            {product.name}
          </h3>
          <span className={statusBadge} data-testid="product-status">
            {product.status}
          </span>
        </div>

        <p className="text-xs text-surface-500 mb-2" data-testid="product-category">
          {product.category}
        </p>

        <p className="text-xs text-surface-600 mb-3 line-clamp-2" data-testid="product-description">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3" data-testid="product-rating">
          <span className="text-amber-400 text-sm">{stars}</span>
          <span className="text-xs text-surface-500">({product.rating})</span>
        </div>
      </div>

      {/* Price and Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-100">
        <span className="text-lg font-bold text-primary-600" data-testid="product-price">
          ${product.price.toFixed(2)}
        </span>

        <div className="flex gap-2">
          <Link
            to={`/products/edit/${product.id}`}
            className="btn-ghost text-xs px-2.5 py-1.5"
            data-testid={`edit-product-${product.id}`}
          >
            ✏️ Edit
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="btn-ghost text-xs px-2.5 py-1.5 text-red-600 hover:bg-red-50"
              data-testid={`delete-product-${product.id}`}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
