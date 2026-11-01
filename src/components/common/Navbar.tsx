import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useProductStore } from '../../store/useProductStore';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = useCartStore((state) => state.getItemCount());
  const toggleCart = useCartStore((state) => state.toggleCartDrawer);
  const wishlistCount = useWishlistStore((state) => state.getCount());
  const { user, isAdmin } = useAuthStore();
  const setSearchModalOpen = useProductStore((state) => state.setSearchModalOpen);

  const navLinks = [
    { label: 'Shop All', to: '/shop' },
    { label: 'Men', to: '/collection/men' },
    { label: 'Women', to: '/collection/women' },
    { label: 'Kids', to: '/collection/kids' },
    { label: 'New Arrivals', to: '/new-arrivals' },
    { label: 'Best Sellers', to: '/best-sellers' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/95 backdrop-blur-md border-b border-neutral-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-800 hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link
              to="/"
              className="font-serif text-2xl sm:text-3xl font-extrabold tracking-[0.2em] text-[#111111] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 uppercase"
            >
              URBANSTYLE
            </Link>
          </div>

          {/* Zone 2: Navigation Links (Clean single-line text links) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase text-neutral-700">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors py-1 hover:text-black relative whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-black'
                      : 'text-neutral-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Utility & Shopping Affordances */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-1.5 text-neutral-700 hover:text-black transition-colors focus:outline-none"
              aria-label="Search catalog"
              title="Search catalog"
            >
              <Search size={20} strokeWidth={1.75} />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="p-1.5 text-neutral-700 hover:text-black transition-colors relative focus:outline-none"
              aria-label={`Wishlist (${wishlistCount} items)`}
              title="Wishlist"
            >
              <Heart size={20} strokeWidth={1.75} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={toggleCart}
              className="p-1.5 text-neutral-700 hover:text-black transition-colors relative focus:outline-none"
              aria-label={`Shopping Cart (${cartCount} items)`}
              title="Shopping Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / Admin Link */}
            <div className="hidden sm:flex items-center pl-2 border-l border-neutral-200">
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-xs font-medium bg-neutral-900 text-white px-3 py-1.5 rounded hover:bg-black transition-colors"
                  title="Admin Dashboard"
                >
                  <ShieldCheck size={14} />
                  <span>Admin</span>
                </Link>
              ) : (
                <Link
                  to={user ? "/profile" : "/login"}
                  className="flex items-center gap-1 text-neutral-700 hover:text-black transition-colors p-1"
                  aria-label={user ? "My Profile" : "Login or Signup"}
                  title={user ? `Signed in as ${user.fullName}` : "Account"}
                >
                  <User size={20} strokeWidth={1.75} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-[#FBFBFA] px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-800">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-neutral-100 rounded hover:bg-neutral-200 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
            <Link
              to={user ? "/profile" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 font-medium text-neutral-800 hover:text-black"
            >
              <User size={16} />
              {user ? `Account (${user.fullName})` : 'Sign In / Register'}
            </Link>

            <Link
              to="/order-tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="text-neutral-500 hover:text-black"
            >
              Track Order
            </Link>

            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-amber-700 font-medium"
            >
              Admin Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
