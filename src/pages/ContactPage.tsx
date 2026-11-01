import React, { useState } from 'react';
import { Mail, Phone, Clock, MessageSquare, Check, ShieldAlert } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

export const ContactPage: React.FC = () => {
  const showToast = useToastStore((state) => state.showToast);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Style Inquiry',
    orderNumber: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Demo inquiry dispatched successfully');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block mb-1">
          Client Concierge
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-3">
          Contact Us
        </h1>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Our global client styling concierge is available to assist with sizing consultations, delivery status, and custom wardrobe curation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Left Column: Contact Channels */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white border border-neutral-200 p-6 rounded-sm space-y-6 text-xs">
            <h2 className="font-serif text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100">
              Concierge Channels
            </h2>

            <div className="flex items-start gap-3">
              <Mail size={18} className="text-neutral-900 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900">Email Inquiries</strong>
                <span className="text-neutral-500 text-[11px]">concierge@urbanstyle.demo</span>
                <p className="text-[11px] text-neutral-400 mt-0.5">Response within 24 business hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={18} className="text-neutral-900 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900">Telephone Line</strong>
                <span className="text-neutral-500 text-[11px] font-mono">+1 (800) 555-URBAN</span>
                <p className="text-[11px] text-neutral-400 mt-0.5">Mon - Fri: 9:00 AM – 7:00 PM EST</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={18} className="text-neutral-900 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-neutral-900">Atelier Consultations</strong>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Virtual private styling sessions available via appointment.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#F8F7F4] border border-neutral-200 rounded-sm text-xs text-neutral-600 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
              <ShieldAlert size={14} />
              <span>Portfolio Demonstration Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-500">
              This storefront is an interactive technical showcase demonstrating modern React + TypeScript e-commerce capabilities. Real customer support tickets are simulated.
            </p>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="md:col-span-7">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h3 className="font-serif text-xl font-bold text-neutral-900">
                  Inquiry Dispatched
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Thank you for testing our client communication form. Your simulated inquiry has been logged.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'General Style Inquiry', orderNumber: '', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider rounded"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h2 className="font-serif text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100 flex items-center gap-2">
                  <MessageSquare size={16} />
                  <span>Send a Direct Message</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Elena Rostova"
                      className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="elena@example.com"
                      className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Topic</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                    >
                      <option>General Style Inquiry</option>
                      <option>Sizing & Fit Advice</option>
                      <option>Order Tracking & Delivery</option>
                      <option>Technical Portfolio Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Demo Order # (Optional)</label>
                    <input
                      type="text"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="e.g. ORD-928410"
                      className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] uppercase font-mono focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How may our concierge team assist you today?"
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#111111] hover:bg-neutral-800 text-white py-3.5 px-4 text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
