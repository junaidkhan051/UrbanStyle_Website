import { Product, ProductCategory, ProductFilterState } from '../types/product';
import { ALL_PRODUCTS } from '../data/mockProducts';

export interface IProductService {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductsByCategory(category: ProductCategory): Promise<Product[]>;
  getNewArrivals(limit?: number): Promise<Product[]>;
  getBestSellers(limit?: number): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  filterProducts(filters: ProductFilterState): Promise<Product[]>;
  // Admin methods (simulated in demo mode)
  createProduct(product: Omit<Product, 'id'>): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
}

const LOCAL_STORAGE_KEY = 'urbanstyle_products_catalog_v3';

class MockProductService implements IProductService {
  private getStoredProducts(): Product[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    // initialize from ALL_PRODUCTS
    this.saveProducts(ALL_PRODUCTS);
    return ALL_PRODUCTS;
  }

  private saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }

  async getAllProducts(): Promise<Product[]> {
    return [...this.getStoredProducts()];
  }

  async getProductById(id: string): Promise<Product | null> {
    const products = this.getStoredProducts();
    const found = products.find((p) => p.id === id);
    return found || null;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = this.getStoredProducts();
    const found = products.find((p) => p.slug === slug || p.id === slug);
    return found || null;
  }

  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    const products = this.getStoredProducts();
    return products.filter((p) => p.category === category);
  }

  async getNewArrivals(limit: number = 8): Promise<Product[]> {
    const products = this.getStoredProducts();
    return products.filter((p) => p.isNewArrival).slice(0, limit);
  }

  async getBestSellers(limit: number = 8): Promise<Product[]> {
    const products = this.getStoredProducts();
    return products.filter((p) => p.isBestSeller).slice(0, limit);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const term = query.toLowerCase().trim();
    if (!term) return [];
    const products = this.getStoredProducts();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.subCategory.toLowerCase().includes(term) ||
        p.materials.toLowerCase().includes(term)
    );
  }

  async filterProducts(filters: ProductFilterState): Promise<Product[]> {
    let result = this.getStoredProducts();

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.subCategory && filters.subCategory !== 'all') {
      result = result.filter((p) => p.subCategory === filters.subCategory);
    }

    if (filters.minPriceCents !== undefined) {
      result = result.filter((p) => p.priceCents >= filters.minPriceCents!);
    }

    if (filters.maxPriceCents !== undefined) {
      result = result.filter((p) => p.priceCents <= filters.maxPriceCents!);
    }

    if (filters.sizes && filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.availableSizes.some((s) => filters.sizes.includes(s))
      );
    }

    if (filters.colors && filters.colors.length > 0) {
      result = result.filter((p) =>
        p.availableColors.some((c) => filters.colors.includes(c.name))
      );
    }

    if (filters.inStockOnly) {
      result = result.filter((p) => p.demoStockQuantity > 0);
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case 'price-desc':
        result.sort((a, b) => b.priceCents - a.priceCents);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
      default:
        result.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
        break;
    }

    return result;
  }

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const products = this.getStoredProducts();
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    const updated = [newProduct, ...products];
    this.saveProducts(updated);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const products = this.getStoredProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product ${id} not found`);
    }
    const updatedProduct = { ...products[index], ...updates };
    products[index] = updatedProduct;
    this.saveProducts(products);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const products = this.getStoredProducts();
    const filtered = products.filter((p) => p.id !== id);
    this.saveProducts(filtered);
    return true;
  }
}

export const ProductService: IProductService = new MockProductService();
