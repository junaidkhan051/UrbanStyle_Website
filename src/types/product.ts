export type ProductCategory = 'men' | 'women' | 'kids' | 'accessories' | 'footwear';

export type ProductSubCategory = 
  | 't-shirts'
  | 'polo-shirts'
  | 'casual-shirts'
  | 'formal-shirts'
  | 'hoodies'
  | 'jackets'
  | 'jeans'
  | 'trousers'
  | 'sneakers'
  | 'dresses'
  | 'tops'
  | 'blouses'
  | 'skirts'
  | 'handbags'
  | 'matching-sets'
  | 'belts'
  | 'sunglasses'
  | 'accessories';

export interface ProductVariantColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  details: string[];
  materials: string;
  careInstructions: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  priceCents: number; // Integer cents, e.g. 2499 = $24.99
  originalPriceCents?: number; // Optional strike-through discount demo
  images: string[];
  availableSizes: string[];
  availableColors: ProductVariantColor[];
  demoStockQuantity: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  seasonalCollection?: string;
  rating: number; // Demonstration rating
  reviewCount: number; // Demonstration review count
  sku: string;
  createdAt: string;
}

export interface ProductFilterState {
  category?: ProductCategory;
  subCategory?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  sizes: string[];
  colors: string[];
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'name-asc' | 'popular';
}
