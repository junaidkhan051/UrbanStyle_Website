import { Product, ProductVariantColor } from './product';

export interface CartItem {
  id: string; // Unique combination of product id + size + color
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: ProductVariantColor;
  quantity: number;
  unitPriceCents: number;
}

export interface DiscountCode {
  code: string;
  discountPercent: number; // e.g. 15 for 15% off
  description: string;
}

export interface CartCalculation {
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  appliedDiscountCode?: DiscountCode;
}
