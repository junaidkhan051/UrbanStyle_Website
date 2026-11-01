import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    setEmailInput('');
  };

  return (
    <footer className="bg-[#111111] text-[#F7F5F0] pt-16 pb-12 border-t border-neutral-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand Story & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-neutral-800">
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="font-serif text-2xl tracking-[0.2em] font-extrabold uppercase text-white block">
              URBANSTYLE
            </Link>
            <p className="text-sm text-neutral-400 font-serif italic">
              "Define Your Style."
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              Contemporary international fashion engineered with architectural restraint, premium natural materials, and timeless modern silhouettes for global living.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-neutral-500 font-mono">
              <span>EST. 2026</span>
              <span aria-hidden="true">·</span>
              <span>USD CURRENCY ONLY</span>
              <span aria-hidden="true">·</span>
              <span>PORTFOLIO DEMO</span>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="lg:col-span-7 lg:pl-12 flex flex-col justify-center">
            <div className="max-w-md">
              <span className="text-xs uppercase tracking-widest font-semibold text-neutral-300 block mb-2">
                Join the Journal
              </span>
              <p className="text-xs text-neutral-400 mb-4">
                Receive simulated editorial previews, seasonal collection announcements, and private portfolio lookbooks.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 p-3 bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded">
                  <Check size={16} className="text-emerald-400 shrink-0" />
                  <span>Thank you for subscribing to our portfolio journal preview.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 rounded-none"
                  />
                  <button
                    type="submit"
                    className="bg-white hover:bg-neutral-200 text-neutral-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1"
                  >
                    <span>Subscribe</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Middle Navigation Grid: All 22 Site Pages Linked */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-neutral-800 text-xs">
          {/* Col 1: Collections */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-neutral-200 mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All Products</Link></li>
              <li><Link to="/collection/men" className="hover:text-white transition-colors">Men's Wardrobe</Link></li>
              <li><Link to="/collection/women" className="hover:text-white transition-colors">Women's Collection</Link></li>
              <li><Link to="/collection/kids" className="hover:text-white transition-colors">Kids Organic Essentials</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/best-sellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          {/* Col 2: Customer Care */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-neutral-200 mb-4">
              Customer Services
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li><Link to="/order-tracking" className="hover:text-white transition-colors">Track Demo Order</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Our Team</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Col 3: Brand & Architecture */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-neutral-200 mb-4">
              Brand & Engineering
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About UrbanStyle</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Customer Profile</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Order History</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Account Login</Link></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform & Admin */}
          <div>
            <h4 className="font-semibold uppercase tracking-wider text-neutral-200 mb-4">
              Demonstration Controls
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li>
                <Link to="/admin" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                  Admin Dashboard →
                </Link>
              </li>
              <li>
                <Link to="/admin?tab=products" className="hover:text-white transition-colors">
                  Product Catalog Management
                </Link>
              </li>
              <li>
                <Link to="/admin?tab=orders" className="hover:text-white transition-colors">
                  Demo Order Processing
                </Link></li>
              <li>
                <Link to="/admin?tab=inventory" className="hover:text-white transition-colors">
                  Inventory Stock Controls
                </Link>
              </li>
              <li>
                <Link to="/admin?tab=analytics" className="hover:text-white transition-colors">
                  Revenue Analytics
                </Link>
              </li>
              <li>
                <span className="text-[11px] text-neutral-500 block pt-1">
                  Spring Boot REST Ready
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-neutral-400 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              <strong>Portfolio demonstration.</strong> Products, pricing, inventory, and orders are simulated. Built with React, TypeScript, and Tailwind CSS.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>© 2026 URBANSTYLE. All rights reserved.</span>
            <Link to="/privacy-policy" className="hover:text-neutral-300">Privacy</Link>
            <Link to="/shipping-returns" className="hover:text-neutral-300">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
