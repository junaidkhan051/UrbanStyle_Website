import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Lock, CheckCircle2, ArrowRight, 
  ShoppingBag, Truck, AlertCircle, Copy, Check 
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { OrderService } from '../services/OrderService';
import { formatCentsToUSD } from '../utils/currency';
import { DemoOrder, ShippingAddress } from '../types/order';
import { SafeImage } from '../components/common/SafeImage';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart, appliedDiscount, getTotals } = useCartStore();
  const { user } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: user?.fullName || 'Elena Rostova',
    email: user?.email || 'customer@urbanstyle.com',
    phone: user?.phone || '+1 (555) 789-0123',
    country: 'United States',
    address: '450 Lexington Ave, Suite 1200',
    apartment: '',
    city: 'New York',
    stateOrRegion: 'NY',
    postalCode: '10017',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<DemoOrder | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  const totals = getTotals();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSimulatedOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      showToast('Your bag is empty', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate order processing via OrderService
      const order = await OrderService.createDemoOrder({
        items: [...items],
        shippingAddress: formData,
        subtotalCents: totals.subtotalCents,
        shippingCents: totals.shippingCents,
        discountCents: totals.discountCents,
        totalCents: totals.totalCents,
        discountCodeApplied: appliedDiscount?.code,
      });

      setCreatedOrder(order);
      clearCart();
      showToast('Demo order created successfully.', 'success');
    } catch {
      showToast('Simulation failed, please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTracking = () => {
    if (!createdOrder) return;
    navigator.clipboard.writeText(createdOrder.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  // SUCCESS / CONFIRMATION VIEW
  if (createdOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <div className="bg-white border border-neutral-200 p-8 sm:p-12 shadow-sm rounded-sm text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
            <CheckCircle2 size={36} />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded">
            Demo Order Simulated
          </span>

          <h1 className="text-3xl font-serif font-bold text-neutral-900 mt-4 mb-2">
            Demo order created successfully.
          </h1>

          <p className="text-sm text-neutral-600 max-w-lg mx-auto mb-8">
            Thank you for exploring the UrbanStyle e-commerce demonstration. Your simulated order has been generated and saved to local storage. No payment was charged.
          </p>

          {/* Order Details Card */}
          <div className="bg-[#FBFBFA] border border-neutral-200 p-6 rounded-sm text-left max-w-xl mx-auto mb-8 text-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-neutral-500">Order Number:</span>
              <strong className="font-mono text-sm text-neutral-900">{createdOrder.id}</strong>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-neutral-500">Demo Tracking Number:</span>
              <div className="flex items-center gap-2">
                <strong className="font-mono text-neutral-900">{createdOrder.trackingNumber}</strong>
                <button
                  onClick={handleCopyTracking}
                  className="p-1 hover:text-black text-neutral-500"
                  title="Copy tracking"
                >
                  {copiedTracking ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-neutral-500">Carrier:</span>
              <span className="text-neutral-800">{createdOrder.carrier}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-neutral-500">Estimated Delivery:</span>
              <span className="text-neutral-800">{createdOrder.estimatedDelivery}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-neutral-500">Shipping Address:</span>
              <span className="text-neutral-800 text-right">
                {createdOrder.shippingAddress.address}, {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.stateOrRegion} {createdOrder.shippingAddress.postalCode}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1 text-sm font-bold text-neutral-900">
              <span>Simulated Total:</span>
              <span className="font-mono tabular-nums">{formatCentsToUSD(createdOrder.totalCents)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/order-tracking?tracking=${encodeURIComponent(createdOrder.trackingNumber)}`}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              Track This Order →
            </Link>

            <Link
              to="/orders"
              className="w-full sm:w-auto px-6 py-3.5 border border-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-50 transition-colors"
            >
              View Order History
            </Link>

            <Link
              to="/shop"
              className="w-full sm:w-auto px-6 py-3.5 text-neutral-600 text-xs font-semibold hover:text-black transition-colors"
            >
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY BAG CHECKOUT PREVENTION
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-neutral-900 text-white text-xs font-semibold px-6 py-3 uppercase tracking-wider"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // STANDARD CHECKOUT FORM
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Title */}
      <div className="pb-6 border-b border-neutral-200 mb-8">
        <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block mb-1">
          Simulated Store Checkout
        </span>
        <h1 className="text-3xl font-serif font-bold text-neutral-900">
          Demo Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Customer & Shipping Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSimulatedOrderSubmit} className="space-y-8">
            {/* Step 1: Customer Contact Information */}
            <div className="bg-white border border-neutral-200 p-6 rounded-sm space-y-4">
              <h2 className="font-serif text-base font-bold text-neutral-900 flex items-center justify-between">
                <span>1. Customer Information</span>
                <span className="text-[11px] font-mono text-neutral-400 font-normal">Contact info</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">Phone Number (for courier SMS) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white border border-neutral-200 p-6 rounded-sm space-y-4">
              <h2 className="font-serif text-base font-bold text-neutral-900 flex items-center justify-between">
                <span>2. Delivery Address</span>
                <span className="text-[11px] font-mono text-neutral-400 font-normal">Global delivery</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">Country / Territory *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                    placeholder="123 Fashion Blvd"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">State/Region *</label>
                    <input
                      type="text"
                      name="stateOrRegion"
                      required
                      value={formData.stateOrRegion}
                      onChange={handleInputChange}
                      className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Postal Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full border border-neutral-200 p-2.5 rounded bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Explicit Payment Disclosure & Simulated Trigger */}
            <div className="bg-white border border-neutral-200 p-6 rounded-sm space-y-4">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-neutral-800" />
                <h2 className="font-serif text-base font-bold text-neutral-900">
                  3. Payment Method
                </h2>
              </div>

              {/* Required Prompt Requirement Box */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                  <AlertCircle size={16} />
                  <span>Demo Checkout - No Real Payment Will Be Processed</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  This portfolio demonstration does not collect card credentials or charge credit cards. Live payments, Stripe, and Spring Boot payment webhooks will be integrated in future phases.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-700 flex items-center justify-between">
                <span className="font-medium">Selected Method: Simulated Instant Approval</span>
                <span className="font-mono text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Demo Mode Active
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#111111] hover:bg-neutral-800 text-white py-4 px-6 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Demo Order...</span>
                ) : (
                  <>
                    <span>Place Demo Order ({formatCentsToUSD(totals.totalCents)})</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-neutral-400">
                Clicking above will generate a simulated order number and persist it to localStorage.
              </p>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary Preview */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm space-y-6 sticky top-28">
            <h2 className="font-serif text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100 flex justify-between items-center">
              <span>Items in Order ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
              <Link to="/cart" className="text-xs text-neutral-500 hover:text-black underline font-normal">
                Edit Bag
              </Link>
            </h2>

            {/* Item list */}
            <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 pr-1 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 text-xs">
                  <div className="w-14 h-18 bg-neutral-100 shrink-0 overflow-hidden rounded-xs">
                    <SafeImage src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-neutral-900 truncate">{item.product.name}</h4>
                    <p className="text-neutral-500 text-[11px] mt-0.5">
                      Size: {item.selectedSize} · {item.selectedColor.name}
                    </p>
                    <p className="text-neutral-500 text-[11px]">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-mono font-bold text-neutral-900 tabular-nums">
                    {formatCentsToUSD(item.unitPriceCents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-neutral-200 space-y-2 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-neutral-900">
                  {formatCentsToUSD(totals.subtotalCents)}
                </span>
              </div>

              {totals.discountCents > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({appliedDiscount?.code})</span>
                  <span className="font-mono tabular-nums">
                    -{formatCentsToUSD(totals.discountCents)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono tabular-nums text-neutral-900">
                  {totals.shippingCents === 0 ? 'Complimentary' : formatCentsToUSD(totals.shippingCents)}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-neutral-200 text-base font-bold text-neutral-900">
                <span>Total</span>
                <span className="font-mono text-xl tabular-nums">
                  {formatCentsToUSD(totals.totalCents)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
