export interface DemoUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  avatarUrl?: string;
  joinedDate: string;
  preferredCurrency: 'USD';
  savedAddresses?: Array<{
    id: string;
    label: string;
    isDefault: boolean;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
}

export interface AuthState {
  user: DemoUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
