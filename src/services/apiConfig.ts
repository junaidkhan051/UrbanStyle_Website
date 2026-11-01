/**
 * Spring Boot REST API Configuration
 * 
 * In production / integration mode, requests route to the Java Spring Boot backend:
 * e.g., http://localhost:8080/api or https://api.urbanstyle.com/api
 * In demonstration portfolio mode, MockService adapters provide instant, client-safe simulation.
 */

export interface ApiConfig {
  baseUrl: string;
  useMockAdapter: boolean;
  timeoutMs: number;
  endpoints: {
    products: string;
    categories: string;
    cart: string;
    orders: string;
    auth: {
      login: string;
      register: string;
      logout: string;
      me: string;
    };
    customer: string;
  };
}

export const API_CONFIG: ApiConfig = {
  // Configurable base URL for future Spring Boot service
  baseUrl: import.meta.env.VITE_SPRING_BOOT_API_URL || 'http://localhost:8080/api',
  useMockAdapter: true, // Portfolio demo mode
  timeoutMs: 5000,
  endpoints: {
    products: '/products',
    categories: '/categories',
    cart: '/cart',
    orders: '/orders',
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      me: '/auth/me',
    },
    customer: '/customer',
  },
};
