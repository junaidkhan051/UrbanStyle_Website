import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../../types/product';
import { formatCentsToUSD } from '../../utils/currency';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useProductStore } from '../../store/useProductStore';
import { useToastStore } from '../../store/useToastStore';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showCategory = true,
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const setQuickViewProduct = useProductStore((state) => state.setQuickViewProduct);
  const showToast = useToastStore((state) => state.showToast);

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.availableSizes[0] || 'M';
    const defaultColor = product.availableColors[0] || { name: 'Standard', hex: '#111111' };
    addItem(product, defaultSize, defaultColor, 1);
    showToast(`Added "${product.name}" to cart`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    showToast(
      added ? `Added "${product.name}" to wishlist` : `Removed "${product.name}" from wishlist`,
      'info'
    );
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <article className="group relative flex flex-col h-full bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-sm border border-neutral-100/80">
      {/* Product Image Slot (65-75% visual weight) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F2ED]">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <SafeImage
            src={product.images[0]}
            alt={product.name}
            category={product.category}
            fallbackTitle={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Clean Unboxed Status Kicker (Single subtle text marker) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {product.isBestSeller && (
            <span className="text-[10px] tracking-wider uppercase font-semibold text-neutral-900 bg-white/90 backdrop-blur-xs px-2 py-0.5">
              Best Seller
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="text-[10px] tracking-wider uppercase font-semibold text-neutral-900 bg-white/90 backdrop-blur-xs px-2 py-0.5">
              New Arrival
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isFavorited
              ? 'bg-red-500 text-white shadow-sm'
              : 'bg-white/80 text-neutral-700 hover:bg-white hover:text-black opacity-90 group-hover:opacity-100'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          title="Wishlist"
        >
          <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} strokeWidth={2} />
        </button>

        {/* Hover Action Bar: Quick View & Quick Add */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={handleQuickView}
            className="flex-1 bg-white/95 hover:bg-white text-neutral-900 text-xs font-semibold py-2.5 px-3 shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye size={14} />
            Quick View
          </button>
          <button
            onClick={handleQuickAdd}
            className="bg-[#111111] hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 px-3 shadow-md flex items-center justify-center transition-colors"
            title="Quick Add to Bag"
            aria-label="Quick add"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>

      {/* Content Slot */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Unboxed Metadata with Typographic Separator */}
          {showCategory && (
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 uppercase tracking-widest mb-1">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.subCategory.replace('-', ' ')}</span>
            </div>
          )}

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1 group-hover:text-neutral-700 transition-colors">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing Slot: Tabular Numerals USD with Optional Strikethrough */}
        <div className="flex items-baseline justify-between pt-2 border-t border-neutral-100">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-neutral-900 font-mono tabular-nums">
              {formatCentsToUSD(product.priceCents)}
            </span>
            {product.originalPriceCents && product.originalPriceCents > product.priceCents && (
              <span className="text-xs text-neutral-400 line-through font-mono tabular-nums">
                {formatCentsToUSD(product.originalPriceCents)}
              </span>
            )}
          </div>

          {/* Color preview dots */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.availableColors.slice(0, 3).map((c) => (
                <span
                  key={c.name}
                  className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {product.availableColors.length > 3 && (
                <span className="text-[10px] text-neutral-400 font-mono">
                  +{product.availableColors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
