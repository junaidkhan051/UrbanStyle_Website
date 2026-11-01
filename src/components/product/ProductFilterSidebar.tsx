import React from 'react';
import { ProductCategory, ProductFilterState } from '../../types/product';
import { formatCentsToUSD } from '../../utils/currency';
import { X, RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
  filters: ProductFilterState;
  onChange: (updates: Partial<ProductFilterState>) => void;
  onReset: () => void;
  availableSizes?: string[];
  availableColors?: string[];
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '40', '42', '44'];
const COMMON_COLORS = ['Onyx Black', 'Warm Ivory', 'Charcoal', 'Midnight Navy', 'Sand Dune', 'Crisp White', 'Chalk White', 'Camel'];

export const ProductFilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  availableSizes = COMMON_SIZES,
  availableColors = COMMON_COLORS,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const toggleSize = (size: string) => {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ sizes: next });
  };

  const toggleColor = (color: string) => {
    const next = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onChange({ colors: next });
  };

  const priceRanges = [
    { label: 'All Prices', min: undefined, max: undefined },
    { label: 'Under $50', min: 0, max: 5000 },
    { label: '$50 to $100', min: 5000, max: 10000 },
    { label: '$100 to $150', min: 10000, max: 15000 },
    { label: '$150 & Above', min: 15000, max: undefined },
  ];

  const handlePriceSelect = (min?: number, max?: number) => {
    onChange({ minPriceCents: min, maxPriceCents: max });
  };

  const isPriceSelected = (min?: number, max?: number) => {
    return filters.minPriceCents === min && filters.maxPriceCents === max;
  };

  const content = (
    <div className="space-y-8 text-xs">
      {/* Header and Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <h3 className="font-semibold uppercase tracking-wider text-neutral-900 text-sm">
          Filters
        </h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-neutral-500 hover:text-black transition-colors"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories if not fixed */}
      {!filters.category && (
        <div className="space-y-2">
          <span className="block font-semibold uppercase tracking-wider text-neutral-800">
            Category
          </span>
          <div className="space-y-1 text-neutral-600">
            {(['men', 'women', 'kids', 'accessories', 'footwear'] as ProductCategory[]).map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={filters.category === cat}
                  onChange={() => onChange({ category: filters.category === cat ? undefined : cat })}
                  className="rounded border-neutral-300 text-black focus:ring-black"
                />
                <span className="capitalize">{cat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-3">
        <span className="block font-semibold uppercase tracking-wider text-neutral-800">
          Price Range (USD)
        </span>
        <div className="space-y-1.5">
          {priceRanges.map((range) => {
            const active = isPriceSelected(range.min, range.max);
            return (
              <button
                key={range.label}
                type="button"
                onClick={() => handlePriceSelect(range.min, range.max)}
                className={`w-full text-left py-1.5 px-2.5 rounded transition-colors ${
                  active ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3">
        <span className="block font-semibold uppercase tracking-wider text-neutral-800">
          Size
        </span>
        <div className="flex flex-wrap gap-1.5">
          {availableSizes.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 text-xs font-mono font-medium border rounded transition-colors ${
                  active
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-3">
        <span className="block font-semibold uppercase tracking-wider text-neutral-800">
          Color
        </span>
        <div className="space-y-1.5">
          {availableColors.map((color) => {
            const active = filters.colors.includes(color);
            return (
              <label key={color} className="flex items-center gap-2 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleColor(color)}
                  className="rounded border-neutral-300 text-black focus:ring-black"
                />
                <span className="text-neutral-700">{color}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Stock Filter */}
      <div className="pt-2 border-t border-neutral-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ inStockOnly: e.target.checked })}
            className="rounded border-neutral-300 text-black focus:ring-black"
          />
          <span className="text-neutral-800 font-medium">In Demo Stock Only</span>
        </label>
      </div>
    </div>
  );

  if (isMobileDrawer) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="fixed inset-0 bg-black/50" onClick={onCloseMobileDrawer} />
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-xs bg-white p-6 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="font-serif font-bold text-base">Filter Catalog</span>
              <button onClick={onCloseMobileDrawer} className="p-1 text-neutral-400 hover:text-black">
                <X size={20} />
              </button>
            </div>
            {content}
            <div className="mt-8 pt-4 border-t border-neutral-100">
              <button
                onClick={onCloseMobileDrawer}
                className="w-full bg-[#111111] text-white py-3 font-semibold uppercase tracking-wider text-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <aside className="w-64 shrink-0 pr-6 hidden md:block">{content}</aside>;
};
