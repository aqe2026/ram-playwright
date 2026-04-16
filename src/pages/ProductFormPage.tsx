import { useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, getCategories } from '../data/products';

// ---------------------------------------------------------
// ProductFormPage — Add or Edit a product
// Demonstrates form handling, validation, and dynamic routing
// ---------------------------------------------------------

interface FormData {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  status: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const existingProduct = id ? getProductById(parseInt(id)) : null;
  const categories = getCategories();

  // Initialize form with existing data for edit, empty for new
  const [formData, setFormData] = useState<FormData>({
    name: existingProduct?.name || '',
    category: existingProduct?.category || '',
    price: existingProduct?.price?.toString() || '',
    stock: existingProduct?.stock?.toString() || '',
    description: existingProduct?.description || '',
    status: existingProduct?.status || 'In Stock',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validate form fields
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.stock) {
      newErrors.stock = 'Stock quantity is required';
    } else if (!Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative integer';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    return newErrors;
  };

  // Handle input changes
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // In a real app, this would save to a database
    setIsSubmitted(true);

    // Redirect after short delay to show success
    setTimeout(() => {
      navigate('/products');
    }, 1500);
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-scale-in">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-surface-800" data-testid="success-message">
          Product {isEditing ? 'Updated' : 'Created'} Successfully!
        </h2>
        <p className="text-surface-500 mt-2">Redirecting to products page...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-800" data-testid="form-title">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-surface-500 text-sm mt-1">
          {isEditing ? 'Update the product details below.' : 'Fill in the details to add a new product.'}
        </p>
      </div>

      {/* Product Form */}
      <form
        onSubmit={handleSubmit}
        className="card p-6 space-y-5"
        data-testid="product-form"
        noValidate
      >
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-surface-700 mb-1.5">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter product name"
            className={errors.name ? 'input-error' : 'input'}
            data-testid="input-name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1" data-testid="error-name">{errors.name}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-surface-700 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={errors.category ? 'input-error' : 'input'}
            data-testid="input-category"
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1" data-testid="error-category">{errors.category}</p>
          )}
        </div>

        {/* Price and Stock — Side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-surface-700 mb-1.5">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              placeholder="0.00"
              className={errors.price ? 'input-error' : 'input'}
              data-testid="input-price"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1" data-testid="error-price">{errors.price}</p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-surface-700 mb-1.5">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              placeholder="0"
              className={errors.stock ? 'input-error' : 'input'}
              data-testid="input-stock"
            />
            {errors.stock && (
              <p className="text-red-500 text-xs mt-1" data-testid="error-stock">{errors.stock}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-surface-700 mb-1.5">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="input"
            data-testid="input-status"
          >
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-surface-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter product description..."
            rows={4}
            className={errors.description ? 'input-error resize-none' : 'input resize-none'}
            data-testid="input-description"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1" data-testid="error-description">{errors.description}</p>
          )}
          <p className="text-xs text-surface-400 mt-1">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn-secondary"
            data-testid="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            data-testid="submit-button"
          >
            {isEditing ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
