import { CartItem } from './cart';

export type OrderStatus = 'Processing' | 'Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  apartment?: string;
  city: string;
  stateOrRegion: string;
  postalCode: string;
}

export interface DemoOrder {
  id: string; // e.g. ORD-847291
  createdAt: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  discountCodeApplied?: string;
  status: OrderStatus;
  trackingNumber: string;
  estimatedDelivery: string;
  carrier: string;
  isDemo: true;
}
