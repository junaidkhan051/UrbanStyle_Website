import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShippingReturnsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block mb-1">
          Policy Overview
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-3">
          Shipping & Returns
        </h1>
        <p className="text-xs text-neutral-500">
          Transparent delivery timelines, customs clearance protocol, and our 30-day trial policy.
        </p>
      </div>

      <div className="space-y-10 text-xs text-neutral-600 leading-relaxed">
        {/* Shipping Overview */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 font-bold font-serif text-lg">
            <Truck size={20} />
            <h2>Worldwide Shipping Rates & Times</h2>
          </div>
          <p>
            All UrbanStyle orders are packed in eco-friendly FSC-certified recycled paper boxes and dispatched from our primary automated distribution centers.
          </p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left border-collapse font-mono text-[11px]">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400">
                  <th className="py-2">Destination</th>
                  <th className="py-2">Service</th>
                  <th className="py-2">Estimated Window</th>
                  <th className="py-2">Cost (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 tabular-nums">
                <tr><td className="py-2 font-semibold">United States</td><td>DHL Express Ground</td><td>2 - 4 Business Days</td><td>$12.00 (Free on $100+)</td></tr>
                <tr><td className="py-2 font-semibold">United Kingdom & EU</td><td>DHL Priority Europe</td><td>3 - 5 Business Days</td><td>$12.00 (Free on $100+)</td></tr>
                <tr><td className="py-2 font-semibold">Canada</td><td>Express Transit</td><td>3 - 5 Business Days</td><td>$12.00 (Free on $100+)</td></tr>
                <tr><td className="py-2 font-semibold">Asia-Pacific & Rest of World</td><td>DHL Express International</td><td>4 - 7 Business Days</td><td>$12.00 (Free on $100+)</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 30-Day Returns */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 font-bold font-serif text-lg">
            <RotateCcw size={20} />
            <h2>30-Day Complimentary Return Policy</h2>
          </div>
          <p>
            We want you to be completely confident in every cut and silhouette. If any garment does not meet your expectations, you may return it within 30 days of simulated delivery.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-700">
            <li>Garments must be unworn, unwashed, and in original condition with security tags attached.</li>
            <li>Footwear must be tried on carpeted surfaces to prevent sole scuffing.</li>
            <li>Customized tailoring orders or intimate foundation tops are final demo sale.</li>
          </ul>
        </div>

        {/* Tracking Your Package */}
        <div className="bg-[#F8F7F4] border border-neutral-200 p-6 rounded-sm space-y-3">
          <h3 className="font-serif font-bold text-base text-neutral-900">
            Need to Track an Active Shipment?
          </h3>
          <p className="text-neutral-500">
            Use our interactive tracking tool to follow simulated dispatch milestones from warehouse pickup to final doorstep handoff.
          </p>
          <Link
            to="/order-tracking"
            className="inline-block bg-neutral-900 text-white px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
          >
            Track Demo Package →
          </Link>
        </div>
      </div>
    </div>
  );
};
