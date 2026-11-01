import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, DiscountCode } from '../types/cart';
import { Product, ProductVariantColor } from '../types/product';
import { calculateTotals } from '../utils/currency';
import { DEMO_DISCOUNT_CODES } from '../services/CartService';

interface CartState {
  items: CartItem[];
  appliedDiscount: DiscountCode | null;
  isCartDrawerOpen: boolean;
  
  // Actions
  addItem: (product: Product, size: string, color: ProductVariantColor, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeDiscountCode: () => void;
  clearCart: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;

  // Computed getters
  getItemCount: () => number;
  getSubtotalCents: () => number;
  getTotals: () => {
    subtotalCents: number;
    discountCents: number;
    shippingCents: number;
    totalCents: number;
    freeShippingQualified: boolean;
    centsAwayFromFreeShipping: number;
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedDiscount: null,
      isCartDrawerOpen: false,

      addItem: (product, size, color, quantity = 1) => {
        const itemId = `${product.id}-${size}-${color.name}`;
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.id === itemId);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const newQty = Math.min(
            product.demoStockQuantity || 99,
            updatedItems[existingIndex].quantity + quantity
          );
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: newQty,
          };
          set({ items: updatedItems, isCartDrawerOpen: true });
        } else {
          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            product,
            selectedSize: size,
            selectedColor: color,
            quantity: Math.min(product.demoStockQuantity || 99, quantity),
            unitPriceCents: product.priceCents,
          };
          set({ items: [newItem, ...currentItems], isCartDrawerOpen: true });
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        const updated = get().items.map((i) => {
          if (i.id === itemId) {
            const max = i.product.demoStockQuantity || 99;
            return { ...i, quantity: Math.min(max, quantity) };
          }
          return i;
        });
        set({ items: updated });
      },

      applyDiscountCode: (code: string) => {
        const clean = code.trim().toUpperCase();
        const found = DEMO_DISCOUNT_CODES.find((d) => d.code === clean);
        if (found) {
          set({ appliedDiscount: found });
          return { success: true, message: `Discount code ${found.code} applied (${found.discountPercent}% off)` };
        }
        return { success: false, message: 'Invalid discount code. Try URBAN15 or STYLE20' };
      },

      removeDiscountCode: () => set({ appliedDiscount: null }),

      clearCart: () => set({ items: [], appliedDiscount: null }),

      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),
      toggleCartDrawer: () => set({ isCartDrawerOpen: !get().isCartDrawerOpen }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotalCents: () => {
        return get().items.reduce(
          (sum, item) => sum + item.unitPriceCents * item.quantity,
          0
        );
      },

      getTotals: () => {
        const subtotalCents = get().getSubtotalCents();
        const discountPercent = get().appliedDiscount ? get().appliedDiscount!.discountPercent : 0;
        return calculateTotals(subtotalCents, discountPercent);
      },
    }),
    {
      name: 'urbanstyle_cart_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, appliedDiscount: state.appliedDiscount }),
    }
  )
);
