import { create } from 'zustand';
import { Product, ProductFilterState } from '../types/product';
import { ProductService } from '../services/ProductService';

interface ProductStoreState {
  products: Product[];
  isLoading: boolean;
  searchModalOpen: boolean;
  quickViewProduct: Product | null;
  filters: ProductFilterState;

  // Actions
  loadProducts: () => Promise<void>;
  setSearchModalOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  updateFilters: (updates: Partial<ProductFilterState>) => void;
  resetFilters: () => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
}

const DEFAULT_FILTERS: ProductFilterState = {
  sizes: [],
  colors: [],
  inStockOnly: false,
  searchQuery: '',
  sortBy: 'newest',
};

export const useProductStore = create<ProductStoreState>((set, get) => ({
  products: [],
  isLoading: false,
  searchModalOpen: false,
  quickViewProduct: null,
  filters: DEFAULT_FILTERS,

  loadProducts: async () => {
    set({ isLoading: true });
    try {
      const items = await ProductService.getAllProducts();
      set({ products: items, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setSearchModalOpen: (open) => set({ searchModalOpen: open }),
  setQuickViewProduct: (product) => set({ quickViewProduct: product }),

  updateFilters: (updates) => {
    set((state) => ({
      filters: { ...state.filters, ...updates },
    }));
  },

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  addProduct: async (productData) => {
    const created = await ProductService.createProduct(productData);
    set((state) => ({ products: [created, ...state.products] }));
    return created;
  },

  updateProduct: async (id, updates) => {
    const updated = await ProductService.updateProduct(id, updates);
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? updated : p)),
    }));
    return updated;
  },

  deleteProduct: async (id) => {
    await ProductService.deleteProduct(id);
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
    return true;
  },
}));
