// Static product data used throughout the application
// This serves as our "database" for the demo app

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  rating: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const products: Product[] = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: 79.99,
    stock: 145,
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    image: "🎧",
    rating: 4.5,
    status: "In Stock"
  },
  {
    id: 2,
    name: "Organic Green Tea",
    category: "Food & Beverage",
    price: 12.99,
    stock: 300,
    description: "100% organic Japanese green tea leaves, hand-picked and naturally processed.",
    image: "🍵",
    rating: 4.8,
    status: "In Stock"
  },
  {
    id: 3,
    name: "Running Shoes Pro",
    category: "Sports",
    price: 129.99,
    stock: 8,
    description: "Lightweight running shoes with advanced cushioning technology.",
    image: "👟",
    rating: 4.3,
    status: "Low Stock"
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 149.99,
    stock: 62,
    description: "RGB mechanical keyboard with Cherry MX switches and aluminum frame.",
    image: "⌨️",
    rating: 4.7,
    status: "In Stock"
  },
  {
    id: 5,
    name: "Yoga Mat Premium",
    category: "Sports",
    price: 39.99,
    stock: 0,
    description: "Extra thick, non-slip yoga mat with carrying strap included.",
    image: "🧘",
    rating: 4.1,
    status: "Out of Stock"
  },
  {
    id: 6,
    name: "Stainless Steel Water Bottle",
    category: "Home & Kitchen",
    price: 24.99,
    stock: 200,
    description: "Double-wall vacuum insulated, keeps drinks hot or cold for 24 hours.",
    image: "🧴",
    rating: 4.6,
    status: "In Stock"
  },
  {
    id: 7,
    name: "Smart Watch Series X",
    category: "Electronics",
    price: 299.99,
    stock: 5,
    description: "Advanced fitness tracking, heart rate monitor, GPS, and 5-day battery.",
    image: "⌚",
    rating: 4.4,
    status: "Low Stock"
  },
  {
    id: 8,
    name: "Aromatherapy Candle Set",
    category: "Home & Kitchen",
    price: 34.99,
    stock: 88,
    description: "Set of 6 hand-poured soy candles with essential oils and natural fragrances.",
    image: "🕯️",
    rating: 4.2,
    status: "In Stock"
  },
  {
    id: 9,
    name: "Protein Powder Vanilla",
    category: "Food & Beverage",
    price: 49.99,
    stock: 120,
    description: "Premium whey protein isolate, 25g protein per serving, great taste.",
    image: "🥤",
    rating: 4.0,
    status: "In Stock"
  },
  {
    id: 10,
    name: "Desk Lamp LED",
    category: "Home & Kitchen",
    price: 59.99,
    stock: 3,
    description: "Adjustable LED desk lamp with touch controls and USB charging port.",
    image: "💡",
    rating: 4.3,
    status: "Low Stock"
  },
  {
    id: 11,
    name: "Backpack Travel Pro",
    category: "Sports",
    price: 89.99,
    stock: 45,
    description: "Water-resistant travel backpack with laptop compartment and USB port.",
    image: "🎒",
    rating: 4.6,
    status: "In Stock"
  },
  {
    id: 12,
    name: "Wireless Mouse Ergonomic",
    category: "Electronics",
    price: 44.99,
    stock: 0,
    description: "Ergonomic vertical mouse with adjustable DPI and silent clicks.",
    image: "🖱️",
    rating: 4.1,
    status: "Out of Stock"
  },
  {
    id: 13,
    name: "Coffee Bean Colombian",
    category: "Food & Beverage",
    price: 18.99,
    stock: 250,
    description: "Single-origin Colombian coffee beans, medium roast, smooth and rich.",
    image: "☕",
    rating: 4.9,
    status: "In Stock"
  },
  {
    id: 14,
    name: "Resistance Bands Set",
    category: "Sports",
    price: 29.99,
    stock: 180,
    description: "Set of 5 resistance bands with different levels, includes door anchor.",
    image: "💪",
    rating: 4.4,
    status: "In Stock"
  },
  {
    id: 15,
    name: "Plant Pot Ceramic Set",
    category: "Home & Kitchen",
    price: 42.99,
    stock: 67,
    description: "Set of 3 minimalist ceramic plant pots with drainage holes and saucers.",
    image: "🪴",
    rating: 4.5,
    status: "In Stock"
  }
];

export default products;

// Helper: Get all unique categories
export const getCategories = (): string[] => {
  return [...new Set(products.map(p => p.category))];
};

// Helper: Get product by ID
export const getProductById = (id: number): Product | undefined => {
  return products.find(p => p.id === id);
};
