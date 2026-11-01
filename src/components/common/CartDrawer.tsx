import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Truck } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { formatCentsToUSD } from '../../utils/currency';
import { SafeImage } from './SafeImage';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    removeItem,
    updateQuantity,
    appliedDiscount,
    applyDiscountCode,
    removeDiscountCode,
    getTotals,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isCartDrawerOpen) return null;

  const totals = getTotals();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyDiscountCode(promoInput);
    setPromoMessage({ text: res.message, success: res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCartDrawer}
      />

      {/* Slide-over panel */}
      <aside className="absolute inset-y-0 right-0 max-w-full flex pl-10" aria-label="Shopping bag">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-neutral-900" />
              <h2 className="text-base font-serif font-bold tracking-wide uppercase text-neutral-900">
                Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-2 text-neutral-400 hover:text-neutral-800 transition-colors rounded-full"
              aria-label="Close cart drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Notice */}
          <div className="bg-[#F8F7F4] px-6 py-3 border-b border-neutral-100 text-xs">
            {totals.freeShippingQualified ? (
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <Truck size={16} />
                <span>Complimentary Worldwide Standard Shipping unlocked!</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-neutral-600 mb-1">
                  <span>Add {formatCentsToUSD(totals.centsAwayFromFreeShipping)} for Free Shipping</span>
                  <span className="font-mono">{Math.round((totals.subtotalCents / 10000) * 100)}%</span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-neutral-900 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (totals.subtotalCents / 10000) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-neutral-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-neutral-500">
                <ShoppingBag size={48} strokeWidth={1} className="text-neutral-300 mb-4" />
                <p className="font-serif text-lg text-neutral-800 mb-1">Your bag is empty</p>
                <p className="text-xs text-neutral-500 max-w-xs mb-6">
                  Discover contemporary essentials from our latest seasonal collections.
                </p>
                <Link
                  to="/shop"
                  onClick={closeCartDrawer}
                  className="bg-[#111111] text-white text-xs font-semibold px-6 py-3 uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-26 shrink-0 bg-neutral-100 overflow-hidden rounded-xs">
                    <SafeImage
                      src={item.product.images[0]}
                      alt={item.product.name}
                      category={item.product.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-neutral-900 leading-snug">
                          <Link
                            to={`/product/${item.productId}`}
                            onClick={closeCartDrawer}
                            className="hover:underline"
                          >
                            {item.product.name}
                          </Link>
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Variant Badges */}
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                        <span>Size: <strong className="text-neutral-700">{item.selectedSize}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full inline-block border border-neutral-300"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <strong className="text-neutral-700">{item.selectedColor.name}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Unit Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-neutral-200 rounded text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-mono font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-neutral-900 tabular-nums">
                          {formatCentsToUSD(item.unitPriceCents * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Calculations */}
          {items.length > 0 && (
            <div className="p-6 bg-[#FBFBFA] border-t border-neutral-200 space-y-4">
              {/* Promo code input */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. URBAN15)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 bg-white rounded focus:outline-none focus:border-neutral-900 uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded uppercase tracking-wider transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {appliedDiscount && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded">
                    <span className="flex items-center gap-1">
                      <Check size={12} />
                      Code <strong>{appliedDiscount.code}</strong> applied ({appliedDiscount.discountPercent}% off)
                    </span>
                    <button
                      type="button"
                      onClick={removeDiscountCode}
                      className="text-xs text-neutral-500 hover:text-neutral-900 underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoMessage && !appliedDiscount && (
                  <p className={`text-xs ${promoMessage.success ? 'text-emerald-600' : 'text-amber-700'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Subtotals breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-neutral-900">
                    {formatCentsToUSD(totals.subtotalCents)}
                  </span>
                </div>

                {totals.discountCents > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">
                      -{formatCentsToUSD(totals.discountCents)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono tabular-nums text-neutral-900">
                    {totals.shippingCents === 0 ? 'Free' : formatCentsToUSD(totals.shippingCents)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Grand Total</span>
                  <span className="font-mono tabular-nums text-base">
                    {formatCentsToUSD(totals.totalCents)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/cart"
                  onClick={closeCartDrawer}
                  className="w-full text-center py-3 border border-neutral-300 text-xs font-semibold uppercase tracking-wider text-neutral-800 hover:bg-neutral-100 transition-colors"
                >
                  View Full Cart
                </Link>

                <Link
                  to="/checkout"
                  onClick={closeCartDrawer}
                  className="w-full text-center py-3 bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <p className="text-[10px] text-center text-neutral-400">
                Demo transaction only · No real payments processed
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
