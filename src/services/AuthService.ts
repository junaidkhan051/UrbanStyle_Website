import { DemoUser } from '../types/auth';

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: 'customer' | 'admin';
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
}

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<DemoUser>;
  register(credentials: RegisterCredentials): Promise<DemoUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<DemoUser | null>;
  updateProfile(updates: Partial<DemoUser>): Promise<DemoUser>;
}

const AUTH_STORAGE_KEY = 'urbanstyle_demo_auth_user';

export const DEMO_PRESET_USERS = {
  customer: {
    id: 'user-cust-01',
    fullName: 'Elena Rostova',
    email: 'customer@urbanstyle.com',
    phone: '+1 (555) 789-0123',
    role: 'customer' as const,
    joinedDate: 'March 2026',
    preferredCurrency: 'USD' as const,
    savedAddresses: [
      {
        id: 'addr-1',
        label: 'Home (Default)',
        isDefault: true,
        street: '450 Lexington Ave, Apt 14B',
        city: 'New York',
        state: 'NY',
        postalCode: '10017',
        country: 'United States',
      },
    ],
  },
  admin: {
    id: 'user-admin-01',
    fullName: 'Marcus Vance',
    email: 'admin@urbanstyle.com',
    phone: '+1 (555) 456-7890',
    role: 'admin' as const,
    joinedDate: 'January 2026',
    preferredCurrency: 'USD' as const,
  },
};

class MockAuthService implements IAuthService {
  async getCurrentUser(): Promise<DemoUser | null> {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return DEMO_PRESET_USERS.customer; // default active demo user
  }

  async login(credentials: LoginCredentials): Promise<DemoUser> {
    // Simulated authentication adapter
    const role = credentials.role || (credentials.email.includes('admin') ? 'admin' : 'customer');
    const user: DemoUser = {
      id: `usr-${Date.now()}`,
      fullName: credentials.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Demo User',
      email: credentials.email,
      role: role,
      joinedDate: 'November 2026',
      preferredCurrency: 'USD',
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
    return user;
  }

  async register(credentials: RegisterCredentials): Promise<DemoUser> {
    const user: DemoUser = {
      id: `usr-${Date.now()}`,
      fullName: credentials.fullName,
      email: credentials.email,
      phone: credentials.phone,
      role: 'customer',
      joinedDate: 'November 2026',
      preferredCurrency: 'USD',
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
    return user;
  }

  async logout(): Promise<void> {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  async updateProfile(updates: Partial<DemoUser>): Promise<DemoUser> {
    const current = await this.getCurrentUser();
    if (!current) throw new Error('Not authenticated');
    const updated = { ...current, ...updates };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return updated;
  }
}

export const AuthService: IAuthService = new MockAuthService();
