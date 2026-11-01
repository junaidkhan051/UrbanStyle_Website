import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useToastStore } from '../../store/useToastStore';
import { formatCentsToUSD } from '../../utils/currency';
import { SafeImage } from './SafeImage';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const showToast = useToastStore((state) => state.showToast);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize(quickViewProduct.availableSizes[0] || 'M');
      setSelectedColorIndex(0);
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isFavorited = isInWishlist(quickViewProduct.id);
  const currentColor = quickViewProduct.availableColors[selectedColorIndex] || {
    name: 'Standard',
    hex: '#111111',
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast('Please select a size', 'error');
      return;
    }
    addItem(quickViewProduct, selectedSize, currentColor, quantity);
    showToast(`Added ${quantity} × ${quickViewProduct.name} to cart`);
    setQuickViewProduct(null);
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist(quickViewProduct);
    showToast(
      added ? `Saved to wishlist` : `Removed from wishlist`,
      'info'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-4xl shadow-2xl rounded-sm overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white text-neutral-800 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Column */}
          <div className="bg-[#F8F7F4] flex flex-col justify-between p-6">
            <div className="aspect-[3/4] w-full overflow-hidden bg-white mb-3">
              <SafeImage
                src={quickViewProduct.images[activeImageIndex] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                category={quickViewProduct.category}
                fallbackTitle={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail switcher if multiple images exist */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2">
                {quickViewProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-14 h-16 border overflow-hidden ${
                      activeImageIndex === i ? 'border-neutral-900' : 'border-neutral-200 opacity-70'
                    }`}
                  >
                    <SafeImage src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 uppercase tracking-widest mb-1.5">
                <span>{quickViewProduct.category}</span>
                <span>/</span>
                <span>{quickViewProduct.subCategory}</span>
              </div>

              {/* Title & Price */}
              <h2 className="text-xl md:text-2xl font-serif font-bold text-neutral-900 mb-1">
                {quickViewProduct.name}
              </h2>
              <p className="text-xs text-neutral-500 mb-3">{quickViewProduct.subtitle}</p>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-mono font-bold text-neutral-900 tabular-nums">
                  {formatCentsToUSD(quickViewProduct.priceCents)}
                </span>
                {quickViewProduct.originalPriceCents && (
                  <span className="text-sm text-neutral-400 line-through font-mono tabular-nums">
                    {formatCentsToUSD(quickViewProduct.originalPriceCents)}
                  </span>
                )}
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  In Demo Stock ({quickViewProduct.demoStockQuantity} available)
                </span>
              </div>

              <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-6">
                {quickViewProduct.description}
              </p>

              {/* Color Selector */}
              {quickViewProduct.availableColors && quickViewProduct.availableColors.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2">
                    Color: <span className="font-normal normal-case text-neutral-900">{currentColor.name}</span>
                  </label>
                  <div className="flex gap-2">
                    {quickViewProduct.availableColors.map((color, idx) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColorIndex(idx)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedColorIndex === idx ? 'border-neutral-900 scale-110' : 'border-neutral-200'
                        }`}
                        title={color.name}
                      >
                        <span
                          className="w-5 h-5 rounded-full inline-block"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {quickViewProduct.availableSizes && quickViewProduct.availableSizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                      Select Size
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                          selectedSize === size
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Quantity
                </span>
                <div className="flex items-center border border-neutral-200 rounded text-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 font-mono font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(quickViewProduct.demoStockQuantity, quantity + 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-semibold py-3 px-4 uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Bag</span>
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`p-3 border transition-colors ${
                    isFavorited
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                  }`}
                  aria-label="Save to Wishlist"
                  title="Wishlist"
                >
                  <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                </button>
              </div>

              <Link
                to={`/product/${quickViewProduct.id}`}
                onClick={() => setQuickViewProduct(null)}
                className="w-full text-center py-2 text-xs text-neutral-600 hover:text-black hover:underline flex items-center justify-center gap-1"
              >
                <span>View Full Product Details & Sizing Guide</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
