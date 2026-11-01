import { DemoOrder, ShippingAddress, OrderStatus } from '../types/order';
import { CartItem } from '../types/cart';
import { LOCAL_IMAGES } from '../assets/images';

export interface CreateOrderParams {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  discountCodeApplied?: string;
}

export interface IOrderService {
  createDemoOrder(params: CreateOrderParams): Promise<DemoOrder>;
  getOrderById(orderId: string): Promise<DemoOrder | null>;
  getAllOrders(): Promise<DemoOrder[]>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<DemoOrder>;
  cancelOrder(orderId: string): Promise<DemoOrder>;
}

const ORDERS_STORAGE_KEY = 'urbanstyle_demo_orders_v2';

// Initial pre-seeded demo order so customer has history out of the box
const INITIAL_DEMO_ORDERS: DemoOrder[] = [
  {
    id: 'ORD-928410',
    createdAt: '2026-10-25T14:30:00Z',
    items: [
      {
        id: 'men-01-M-Onyx Black',
        productId: 'men-01',
        product: {
          id: 'men-01',
          name: 'Heavyweight Supima Cotton T-Shirt',
          slug: 'heavyweight-supima-cotton-t-shirt',
          subtitle: '240 GSM organic combed cotton',
          description: '',
          details: [],
          materials: '100% Supima Cotton',
          careInstructions: '',
          category: 'men',
          subCategory: 't-shirts',
          priceCents: 2499,
          images: [LOCAL_IMAGES.tshirt],
          availableSizes: ['M'],
          availableColors: [{ name: 'Onyx Black', hex: '#111111' }],
          demoStockQuantity: 40,
          rating: 4.9,
          reviewCount: 120,
          sku: 'URB-MEN-TSH-001',
          createdAt: '2026-09-10',
        },
        selectedSize: 'M',
        selectedColor: { name: 'Onyx Black', hex: '#111111' },
        quantity: 2,
        unitPriceCents: 2499,
      },
      {
        id: 'men-09-42-Chalk White',
        productId: 'men-09',
        product: {
          id: 'men-09',
          name: 'UrbanStyle Low-Top Minimalist Sneakers',
          slug: 'urbanstyle-low-top-minimalist-sneakers',
          subtitle: 'Full-grain Italian calfskin',
          description: '',
          details: [],
          materials: 'Italian Calfskin',
          careInstructions: '',
          category: 'men',
          subCategory: 'sneakers',
          priceCents: 8999,
          images: [LOCAL_IMAGES.sneakers],
          availableSizes: ['42'],
          availableColors: [{ name: 'Chalk White', hex: '#FFFFFF' }],
          demoStockQuantity: 45,
          rating: 4.9,
          reviewCount: 220,
          sku: 'URB-MEN-SNK-009',
          createdAt: '2026-07-04',
        },
        selectedSize: '42',
        selectedColor: { name: 'Chalk White', hex: '#FFFFFF' },
        quantity: 1,
        unitPriceCents: 8999,
      },
    ],
    shippingAddress: {
      fullName: 'Alex Vance',
      email: 'alex.vance@example.com',
      phone: '+1 (555) 234-5678',
      country: 'United States',
      address: '742 Evergreen Terrace',
      city: 'Portland',
      stateOrRegion: 'OR',
      postalCode: '97201',
    },
    subtotalCents: 13997,
    shippingCents: 0,
    discountCents: 2099,
    totalCents: 11898,
    discountCodeApplied: 'URBAN15',
    status: 'Shipped',
    trackingNumber: 'URB-TRK-7749219',
    estimatedDelivery: 'November 4, 2026',
    carrier: 'DHL Express International',
    isDemo: true,
  },
];

class MockOrderService implements IOrderService {
  private getOrders(): DemoOrder[] {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    this.saveOrders(INITIAL_DEMO_ORDERS);
    return INITIAL_DEMO_ORDERS;
  }

  private saveOrders(orders: DemoOrder[]): void {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }

  async createDemoOrder(params: CreateOrderParams): Promise<DemoOrder> {
    const orders = this.getOrders();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const trackingSuffix = Math.floor(1000000 + Math.random() * 9000000);
    
    const newOrder: DemoOrder = {
      id: `ORD-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      items: params.items,
      shippingAddress: params.shippingAddress,
      subtotalCents: params.subtotalCents,
      shippingCents: params.shippingCents,
      discountCents: params.discountCents,
      totalCents: params.totalCents,
      discountCodeApplied: params.discountCodeApplied,
      status: 'Confirmed',
      trackingNumber: `URB-TRK-${trackingSuffix}`,
      estimatedDelivery: '3 to 5 business days',
      carrier: 'DHL Express Worldwide',
      isDemo: true,
    };

    const updated = [newOrder, ...orders];
    this.saveOrders(updated);
    return newOrder;
  }

  async getOrderById(orderId: string): Promise<DemoOrder | null> {
    const orders = this.getOrders();
    const cleanId = orderId.trim().toUpperCase();
    const found = orders.find((o) => o.id.toUpperCase() === cleanId || o.trackingNumber.toUpperCase() === cleanId);
    return found || null;
  }

  async getAllOrders(): Promise<DemoOrder[]> {
    return this.getOrders();
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<DemoOrder> {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) {
      throw new Error(`Order ${orderId} not found`);
    }
    orders[index].status = status;
    this.saveOrders(orders);
    return orders[index];
  }

  async cancelOrder(orderId: string): Promise<DemoOrder> {
    return this.updateOrderStatus(orderId, 'Cancelled');
  }
}

export const OrderService: IOrderService = new MockOrderService();
