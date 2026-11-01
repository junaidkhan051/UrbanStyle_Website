import { CartItem, DiscountCode, CartCalculation } from '../types/cart';
import { calculateTotals } from '../utils/currency';

export interface ICartService {
  getAvailableDiscounts(): Promise<DiscountCode[]>;
  validateDiscountCode(code: string): Promise<DiscountCode | null>;
  calculateCart(items: CartItem[], appliedDiscountCode?: DiscountCode): Promise<CartCalculation>;
}

export const DEMO_DISCOUNT_CODES: DiscountCode[] = [
  { code: 'URBAN15', discountPercent: 15, description: '15% off demo welcome code' },
  { code: 'STYLE20', discountPercent: 20, description: '20% off seasonal capsule' },
  { code: 'VIP10', discountPercent: 10, description: '10% off VIP customer perk' },
];

class MockCartService implements ICartService {
  async getAvailableDiscounts(): Promise<DiscountCode[]> {
    return DEMO_DISCOUNT_CODES;
  }

  async validateDiscountCode(code: string): Promise<DiscountCode | null> {
    const clean = code.trim().toUpperCase();
    const found = DEMO_DISCOUNT_CODES.find((d) => d.code === clean);
    return found || null;
  }

  async calculateCart(items: CartItem[], appliedDiscountCode?: DiscountCode): Promise<CartCalculation> {
    const subtotalCents = items.reduce(
      (sum, item) => sum + item.unitPriceCents * item.quantity,
      0
    );
    const discountPercent = appliedDiscountCode ? appliedDiscountCode.discountPercent : 0;
    const totals = calculateTotals(subtotalCents, discountPercent);

    return {
      subtotalCents: totals.subtotalCents,
      shippingCents: totals.shippingCents,
      discountCents: totals.discountCents,
      totalCents: totals.totalCents,
      appliedDiscountCode,
    };
  }
}

export const CartService: ICartService = new MockCartService();
