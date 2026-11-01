import { DemoUser } from '../types/auth';
import { DEMO_PRESET_USERS } from './AuthService';

export interface CustomerPreference {
  newsletterSubscribed: boolean;
  smsNotifications: boolean;
  preferredCategory: 'men' | 'women' | 'kids' | 'all';
  sizingFitPreference: 'regular' | 'oversized' | 'slim';
}

export interface ICustomerService {
  getCustomerProfile(id: string): Promise<DemoUser | null>;
  getCustomerPreferences(id: string): Promise<CustomerPreference>;
  updatePreferences(id: string, prefs: Partial<CustomerPreference>): Promise<CustomerPreference>;
  getAllCustomers(): Promise<DemoUser[]>;
}

const PREFERENCES_STORAGE_KEY = 'urbanstyle_customer_preferences';

class MockCustomerService implements ICustomerService {
  async getCustomerProfile(id: string): Promise<DemoUser | null> {
    if (id === 'user-admin-01') return DEMO_PRESET_USERS.admin;
    return DEMO_PRESET_USERS.customer;
  }

  async getCustomerPreferences(): Promise<CustomerPreference> {
    try {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return {
      newsletterSubscribed: true,
      smsNotifications: false,
      preferredCategory: 'all',
      sizingFitPreference: 'oversized',
    };
  }

  async updatePreferences(_id: string, prefs: Partial<CustomerPreference>): Promise<CustomerPreference> {
    const current = await this.getCustomerPreferences();
    const updated = { ...current, ...prefs };
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  }

  async getAllCustomers(): Promise<DemoUser[]> {
    return [
      DEMO_PRESET_USERS.customer,
      {
        id: 'user-cust-02',
        fullName: 'Julian Thorne',
        email: 'julian.thorne@example.com',
        phone: '+1 (555) 345-6789',
        role: 'customer',
        joinedDate: 'February 2026',
        preferredCurrency: 'USD',
      },
      {
        id: 'user-cust-03',
        fullName: 'Sophia Chen',
        email: 'sophia.chen@example.com',
        phone: '+1 (555) 678-9012',
        role: 'customer',
        joinedDate: 'April 2026',
        preferredCurrency: 'USD',
      },
      {
        id: 'user-cust-04',
        fullName: 'Lucas Meyer',
        email: 'lucas.m@example.com',
        phone: '+1 (555) 890-1234',
        role: 'customer',
        joinedDate: 'May 2026',
        preferredCurrency: 'USD',
      },
      DEMO_PRESET_USERS.admin,
    ];
  }
}

export const CustomerService: ICustomerService = new MockCustomerService();
