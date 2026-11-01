import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FaqItem {
  q: string;
  a: string;
  category: 'Orders' | 'Sizing' | 'Shipping' | 'Technical';
}

const FAQS: FaqItem[] = [
  {
    category: 'Orders',
    q: 'How does the simulated checkout work?',
    a: 'UrbanStyle is an international e-commerce portfolio application. When you proceed through checkout, the system validates customer shipping parameters, applies promotional discounts in integer cents, and persists a simulated order (e.g. ORD-847291) directly in browser localStorage. No actual payment card is charged.',
  },
  {
    category: 'Orders',
    q: 'Are promo codes functional in this demo?',
    a: 'Yes! You can apply active demo promo codes such as "URBAN15" for 15% off, "STYLE20" for 20% off, or "VIP10" for 10% off. The cart state recalculates subtotals, discounts, and free delivery thresholds dynamically.',
  },
  {
    category: 'Sizing',
    q: 'How do UrbanStyle garments fit?',
    a: 'Our silhouettes are divided between Structured Tailoring (sharp shoulders, fitted waist, true to size) and Relaxed Architectural (dropped shoulders, boxy drape, contemporary streetwear cut). You can view full metric and imperial measurements in our interactive International Sizing Guide.',
  },
  {
    category: 'Sizing',
    q: 'What size standard is used for footwear?',
    a: 'All footwear is handcrafted on traditional European shoe lasts (EU 39–45). A conversion matrix to US Men, US Women, and UK sizing is available directly on every shoe product details page.',
  },
  {
    category: 'Shipping',
    q: 'What is the complimentary shipping threshold?',
    a: 'All qualifying demonstration orders totaling $100.00 USD or higher automatically unlock complimentary worldwide standard shipping. Orders under $100.00 USD incur a flat simulated shipping fee of $12.00 USD.',
  },
  {
    category: 'Shipping',
    q: 'How can I track my demonstration package?',
    a: 'After completing checkout, you receive a generated tracking number (e.g. URB-TRK-7749219). You can paste this number into the "Track Order" page to inspect the simulated multi-stage milestone carrier timeline.',
  },
  {
    category: 'Technical',
    q: 'How is this application prepared for Java Spring Boot backend integration?',
    a: 'The frontend architecture strictly decouples UI components from data adapters via typed service interfaces (ProductService, CartService, OrderService, AuthService, CustomerService). The centralized API_CONFIG object enables swapping mock adapters for real Spring Boot REST endpoints (e.g. GET /api/products, POST /api/orders) without altering component logic.',
  },
  {
    category: 'Technical',
    q: 'Why are prices stored as integer cents?',
    a: 'In professional e-commerce engineering, monetary values are stored as integer cents (e.g. $24.99 is stored as 2499) to completely prevent JavaScript floating-point rounding inaccuracies (such as 0.1 + 0.2 = 0.30000000000000004).',
  },
];

export const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const categories = ['All', 'Orders', 'Sizing', 'Shipping', 'Technical'];

  const filteredFaqs = activeCategory === 'All'
    ? FAQS
    : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block mb-1">
          Client Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-neutral-500">
          Everything you need to know about our collections, sizing standards, simulated ordering, and software architecture.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 text-xs font-semibold uppercase tracking-wider">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setExpandedIndex(null);
            }}
            className={`px-4 py-2 rounded transition-colors ${
              activeCategory === cat
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = expandedIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-neutral-200 rounded-sm overflow-hidden transition-colors"
            >
              <button
                onClick={() => setExpandedIndex(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
              >
                <span className="text-sm font-semibold text-neutral-900 font-serif">
                  {faq.q}
                </span>
                <span className="text-neutral-400 shrink-0">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 animate-in fade-in duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center text-xs text-neutral-500 p-6 bg-[#F8F7F4] border border-neutral-200 rounded-sm">
        <p className="mb-2">Have a question not addressed here?</p>
        <Link to="/contact" className="font-semibold text-neutral-900 underline">
          Reach out to our Client Concierge →
        </Link>
      </div>
    </div>
  );
};
