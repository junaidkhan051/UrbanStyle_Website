import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Truck, Tag, Check, RotateCcw } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatCentsToUSD } from '../utils/currency';
import { SafeImage } from '../components/common/SafeImage';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    appliedDiscount,
    applyDiscountCode,
    removeDiscountCode,
    getTotals,
  } = useCartStore();

  const [promoCode, setPromoCode] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ text: string; success: boolean } | null>(null);

  const totals = getTotals();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const res = applyDiscountCode(promoCode);
    setPromoFeedback({ text: res.message, success: res.success });
    if (res.success) setPromoCode('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-6">
          <ShoppingBag size={28} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-neutral-500 max-w-md mx-auto mb-8">
          Explore our collection of contemporary essentials, luxury footwear, and seasonal garments.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-[#111111] text-white text-xs font-bold px-8 py-4 uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-lg"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-neutral-200 mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block mb-1">
            Review Bag
          </span>
          <h1 className="text-3xl font-serif font-bold text-neutral-900">
            Shopping Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-neutral-500 hover:text-red-600 self-start sm:self-auto transition-colors"
        >
          Empty Bag
        </button>
      </div>

      {/* Free Shipping Alert Bar */}
      <div className="bg-[#F8F7F4] border border-neutral-200 p-4 rounded-sm mb-8">
        <div className="flex items-center justify-between text-xs font-medium text-neutral-800 mb-2">
          <span className="flex items-center gap-1.5">
            <Truck size={16} />
            {totals.freeShippingQualified
              ? 'Complimentary Worldwide Standard Shipping Unlocked!'
              : `Add ${formatCentsToUSD(totals.centsAwayFromFreeShipping)} more to qualify for Free Shipping`}
          </span>
          <span className="font-mono">{Math.round((totals.subtotalCents / 10000) * 100)}%</span>
        </div>
        <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-neutral-900 h-full transition-all duration-300"
            style={{ width: `${Math.min(100, (totals.subtotalCents / 10000) * 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Items Table */}
        <div className="lg:col-span-8">
          <div className="divide-y divide-neutral-200">
            {items.map((item) => (
              <div key={item.id} className="py-6 first:pt-0 flex flex-col sm:flex-row gap-6">
                {/* Thumbnail */}
                <div className="w-24 h-32 sm:w-28 sm:h-36 bg-neutral-100 shrink-0 overflow-hidden rounded-xs border border-neutral-100">
                  <SafeImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    category={item.product.category}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[10px] text-neutral-400 uppercase tracking-widest mb-0.5">
                          {item.product.category} · {item.product.subCategory}
                        </div>
                        <h3 className="text-base font-semibold text-neutral-900 hover:underline">
                          <Link to={`/product/${item.productId}`}>{item.product.name}</Link>
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">{item.product.subtitle}</p>
                      </div>

                      <span className="text-base font-mono font-bold text-neutral-900 tabular-nums">
                        {formatCentsToUSD(item.unitPriceCents * item.quantity)}
                      </span>
                    </div>

                    {/* Variant specs */}
                    <div className="flex items-center gap-4 text-xs text-neutral-600 mt-3">
                      <span>Size: <strong className="text-neutral-900">{item.selectedSize}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1.5">
                        Color:
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-neutral-300"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <strong className="text-neutral-900">{item.selectedColor.name}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Remove controls */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100">
                    <div className="flex items-center border border-neutral-200 rounded text-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 font-mono font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-neutral-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <Link
              to="/shop"
              className="text-xs uppercase tracking-wider font-semibold text-neutral-700 hover:text-black flex items-center gap-1"
            >
              <span>← Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm space-y-6">
            <h2 className="font-serif text-lg font-bold text-neutral-900 pb-4 border-b border-neutral-100">
              Order Summary
            </h2>

            {/* Promo code form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. URBAN15, STYLE20"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 border border-neutral-200 px-3 py-2 text-xs uppercase bg-[#FBFBFA] focus:outline-none focus:border-neutral-900"
                />
                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-black text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Apply
                </button>
              </div>

              {appliedDiscount && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 p-2 rounded">
                  <span className="flex items-center gap-1">
                    <Check size={12} />
                    <strong>{appliedDiscount.code}</strong> ({appliedDiscount.discountPercent}% off applied)
                  </span>
                  <button
                    type="button"
                    onClick={removeDiscountCode}
                    className="text-xs underline text-neutral-500 hover:text-black"
                  >
                    Remove
                  </button>
                </div>
              )}

              {promoFeedback && !appliedDiscount && (
                <p className={`text-xs ${promoFeedback.success ? 'text-emerald-600' : 'text-amber-700'}`}>
                  {promoFeedback.text}
                </p>
              )}
            </form>

            {/* Breakdown */}
            <div className="space-y-3 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-neutral-900">
                  {formatCentsToUSD(totals.subtotalCents)}
                </span>
              </div>

              {totals.discountCents > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({appliedDiscount?.discountPercent}%)</span>
                  <span className="font-mono tabular-nums">
                    -{formatCentsToUSD(totals.discountCents)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Standard Shipping</span>
                <span className="font-mono tabular-nums text-neutral-900">
                  {totals.shippingCents === 0 ? 'Complimentary' : formatCentsToUSD(totals.shippingCents)}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-neutral-200 text-base font-bold text-neutral-900">
                <span>Total</span>
                <span className="text-xl font-mono tabular-nums">
                  {formatCentsToUSD(totals.totalCents)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#111111] hover:bg-neutral-800 text-white py-4 px-6 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="text-[11px] text-neutral-400 space-y-1 text-center">
              <p>Demo Store · Simulated Ordering Process</p>
              <p>All prices in USD ($)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
