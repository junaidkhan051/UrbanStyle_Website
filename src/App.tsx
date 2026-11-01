import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DemoBanner } from './components/common/DemoBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { SearchModal } from './components/common/SearchModal';
import { ToastContainer } from './components/common/ToastContainer';
import { useProductStore } from './store/useProductStore';

// Page imports
import { HomePage } from './pages/HomePage';
import { ShopAllPage } from './pages/ShopAllPage';
import { MenCollectionPage } from './pages/MenCollectionPage';
import { WomenCollectionPage } from './pages/WomenCollectionPage';
import { KidsCollectionPage } from './pages/KidsCollectionPage';
import { NewArrivalsPage } from './pages/NewArrivalsPage';
import { BestSellersPage } from './pages/BestSellersPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { CustomerProfilePage } from './pages/CustomerProfilePage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { ShippingReturnsPage } from './pages/ShippingReturnsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

/**
 * Scroll to top helper on route transition
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const loadProducts = useProductStore((state) => state.loadProducts);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#111111]">
        {/* Top Demo Disclaimer & Role Switcher */}
        <DemoBanner />

        {/* Global Navigation Bar */}
        <Navbar />

        {/* Dynamic Route Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopAllPage />} />
            <Route path="/collection/men" element={<MenCollectionPage />} />
            <Route path="/collection/women" element={<WomenCollectionPage />} />
            <Route path="/collection/kids" element={<KidsCollectionPage />} />
            <Route path="/new-arrivals" element={<NewArrivalsPage />} />
            <Route path="/best-sellers" element={<BestSellersPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<CustomerProfilePage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/order-tracking" element={<OrderTrackingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            {/* Fallback route */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>

        {/* Global Editorial Footer */}
        <Footer />

        {/* Global Modals & Drawers */}
        <CartDrawer />
        <QuickViewModal />
        <SearchModal />
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}
