import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { formatCentsToUSD } from '../utils/currency';
import { SafeImage } from '../components/common/SafeImage';

export const WishlistPage: React.FC = () => {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.showToast);

  const handleMoveToCart = (product: any) => {
    const size = product.availableSizes[0] || 'M';
    const color = product.availableColors[0] || { name: 'Standard', hex: '#111111' };
    addItem(product, size, color, 1);
    removeItem(product.id);
    showToast(`Moved "${product.name}" to shopping bag`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-neutral-200 mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block mb-1">
            Personal Wardrobe
          </span>
          <h1 className="text-3xl font-serif font-bold text-neutral-900">
            Saved Wishlist ({items.length})
          </h1>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs text-neutral-500 hover:text-red-600 transition-colors self-start sm:self-auto"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-100 rounded-sm p-8">
          <Heart size={48} strokeWidth={1} className="text-neutral-300 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-bold text-neutral-800 mb-2">Your wishlist is empty</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
            Tap the heart icon on any product card or details view to save styles you love for later.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-[#111111] text-white text-xs font-semibold px-8 py-3.5 uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Explore the Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col bg-white border border-neutral-100 rounded-sm overflow-hidden"
            >
              <div className="aspect-[3/4] bg-neutral-100 overflow-hidden relative">
                <Link to={`/product/${product.id}`}>
                  <SafeImage
                    src={product.images[0]}
                    alt={product.name}
                    category={product.category}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-neutral-600 hover:text-red-600 rounded-full shadow-sm transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">
                    {product.category} · {product.subCategory}
                  </div>
                  <h3 className="text-xs font-semibold text-neutral-900 group-hover:underline">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  <div className="mt-2 text-sm font-mono font-bold text-neutral-900 tabular-nums">
                    {formatCentsToUSD(product.priceCents)}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full bg-[#111111] hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 px-3 uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag size={14} />
                    <span>Move to Bag</span>
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className="w-full text-center block text-[11px] text-neutral-500 hover:text-black py-1"
                  >
                    Select Specific Variant →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
