import React from 'react';
import { ShieldCheck, Lock, Eye, Database } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block mb-1">
          Legal & Privacy
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-3">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Last Updated: November 2026 · Portfolio Technical Showcase
        </p>
      </div>

      <div className="bg-white border border-neutral-200 p-8 sm:p-10 rounded-sm space-y-8 text-xs text-neutral-600 leading-relaxed shadow-xs">
        {/* Section 1: Demonstration Disclosure */}
        <section className="space-y-3 pb-6 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-900 font-serif font-bold text-base">
            <ShieldCheck size={18} />
            <h2>1. Portfolio Demonstration Scope</h2>
          </div>
          <p>
            <strong>UrbanStyle</strong> is an international fashion e-commerce demonstration designed and built to showcase high-level frontend software architecture, UI/UX design, and future Spring Boot REST API integration readiness.
          </p>
          <p>
            All products, prices, promo codes, cart states, simulated order records, and user sessions are generated for portfolio evaluation. No commercial transactions are completed, and no monetary funds are processed.
          </p>
        </section>

        {/* Section 2: Data Storage Practices */}
        <section className="space-y-3 pb-6 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-900 font-serif font-bold text-base">
            <Database size={18} />
            <h2>2. Local Browser Storage Usage</h2>
          </div>
          <p>
            This application stores demonstration state exclusively within your local browser storage (<code>localStorage</code>):
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Shopping Bag:</strong> Retains chosen items, variant sizes, and colors across reloads.</li>
            <li><strong>Wishlist:</strong> Stores product IDs saved for later viewing.</li>
            <li><strong>Demo Orders:</strong> Stores simulated order receipts generated during the checkout walk-through.</li>
            <li><strong>Demo Role:</strong> Stores active customer or admin viewing state.</li>
          </ul>
          <p>
            You can clear all stored data at any time simply by clearing your browser storage or using the "Empty Bag" and "Clear Wishlist" controls.
          </p>
        </section>

        {/* Section 3: Future Spring Boot & Spring Security Architecture */}
        <section className="space-y-3 pb-6 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-900 font-serif font-bold text-base">
            <Lock size={18} />
            <h2>3. Planned Enterprise Security Standard</h2>
          </div>
          <p>
            When migrated to full production with a Java Spring Boot backend and PostgreSQL database, the system will enforce:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>End-to-end TLS 1.3 encryption on all REST API communication.</li>
            <li>Spring Security Stateless JWT authentication with Argon2id password hashing.</li>
            <li>PCI-DSS Level 1 compliant tokenized payment processing via Stripe Elements (zero raw card data stored).</li>
            <li>GDPR & CCPA compliance with right-to-be-forgotten endpoints and automated data export tools.</li>
          </ul>
        </section>

        {/* Section 4: Contact */}
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-base text-neutral-900">
            4. Inquiries
          </h2>
          <p>
            For inquiries regarding the design, codebase, or software engineering methodology behind UrbanStyle, contact our engineering team via the Contact page.
          </p>
        </section>
      </div>
    </div>
  );
};
