import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DemoUser } from '../types/auth';
import { DEMO_PRESET_USERS, AuthService, LoginCredentials, RegisterCredentials } from '../services/AuthService';

interface AuthStore {
  user: DemoUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<DemoUser>;
  register: (credentials: RegisterCredentials) => Promise<DemoUser>;
  logout: () => Promise<void>;
  switchDemoRole: (role: 'customer' | 'admin') => void;
  updateProfile: (updates: Partial<DemoUser>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: DEMO_PRESET_USERS.customer,
      isAuthenticated: true,
      isAdmin: false,

      login: async (credentials) => {
        const user = await AuthService.login(credentials);
        set({
          user,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        });
        return user;
      },

      register: async (credentials) => {
        const user = await AuthService.register(credentials);
        set({
          user,
          isAuthenticated: true,
          isAdmin: false,
        });
        return user;
      },

      logout: async () => {
        await AuthService.logout();
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      switchDemoRole: (role: 'customer' | 'admin') => {
        const selected = role === 'admin' ? DEMO_PRESET_USERS.admin : DEMO_PRESET_USERS.customer;
        set({
          user: selected,
          isAuthenticated: true,
          isAdmin: role === 'admin',
        });
      },

      updateProfile: async (updates) => {
        const current = get().user;
        if (!current) return;
        const updated = await AuthService.updateProfile(updates);
        set({ user: updated });
      },
    }),
    {
      name: 'urbanstyle_auth_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
