import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, ProductCategory, ProductFilterState } from '../../types/product';
import { useProductStore } from '../../store/useProductStore';
import { ProductCard } from '../common/ProductCard';
import { ProductFilterSidebar } from './ProductFilterSidebar';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { SafeImage } from '../common/SafeImage';

interface CatalogViewProps {
  title: string;
  subtitle?: string;
  bannerImage?: string;
  fixedCategory?: ProductCategory;
  initialSubCategory?: string;
  isNewArrivalsOnly?: boolean;
  isBestSellersOnly?: boolean;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  title,
  subtitle,
  bannerImage,
  fixedCategory,
  initialSubCategory,
  isNewArrivalsOnly = false,
  isBestSellersOnly = false,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const products = useProductStore((state) => state.products);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Local filter state initialized with URL params
  const [filters, setFilters] = useState<ProductFilterState>({
    category: fixedCategory || (searchParams.get('category') as ProductCategory) || undefined,
    subCategory: initialSubCategory || searchParams.get('subCategory') || undefined,
    minPriceCents: searchParams.get('min') ? parseInt(searchParams.get('min')!) : undefined,
    maxPriceCents: searchParams.get('max') ? parseInt(searchParams.get('max')!) : undefined,
    sizes: searchParams.getAll('size'),
    colors: searchParams.getAll('color'),
    inStockOnly: searchParams.get('inStock') === 'true',
    searchQuery: searchParams.get('search') || '',
    sortBy: (searchParams.get('sort') as ProductFilterState['sortBy']) || 'newest',
  });

  // Keep search params in sync if changed outside
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== filters.searchQuery) {
      setFilters((prev) => ({ ...prev, searchQuery: q }));
    }
  }, [searchParams]);

  const handleFilterChange = (updates: Partial<ProductFilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };
      return next;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      category: fixedCategory,
      subCategory: undefined,
      minPriceCents: undefined,
      maxPriceCents: undefined,
      sizes: [],
      colors: [],
      inStockOnly: false,
      searchQuery: '',
      sortBy: 'newest',
    });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (fixedCategory) {
      result = result.filter((p) => p.category === fixedCategory);
    } else if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    if (isNewArrivalsOnly) {
      result = result.filter((p) => p.isNewArrival);
    }

    if (isBestSellersOnly) {
      result = result.filter((p) => p.isBestSeller);
    }

    if (filters.subCategory && filters.subCategory !== 'all') {
      result = result.filter((p) => p.subCategory === filters.subCategory);
    }

    if (filters.minPriceCents !== undefined) {
      result = result.filter((p) => p.priceCents >= filters.minPriceCents!);
    }

    if (filters.maxPriceCents !== undefined) {
      result = result.filter((p) => p.priceCents <= filters.maxPriceCents!);
    }

    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.availableSizes.some((s) => filters.sizes.includes(s))
      );
    }

    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.availableColors.some((c) => filters.colors.includes(c.name))
      );
    }

    if (filters.inStockOnly) {
      result = result.filter((p) => p.demoStockQuantity > 0);
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.materials.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case 'price-desc':
        result.sort((a, b) => b.priceCents - a.priceCents);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
      default:
        result.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
        break;
    }

    return result;
  }, [products, fixedCategory, isNewArrivalsOnly, isBestSellersOnly, filters]);

  const activeFilterCount =
    (filters.category && !fixedCategory ? 1 : 0) +
    (filters.subCategory ? 1 : 0) +
    (filters.minPriceCents !== undefined || filters.maxPriceCents !== undefined ? 1 : 0) +
    filters.sizes.length +
    filters.colors.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="pb-24">
      {/* Banner / Header */}
      {bannerImage ? (
        <div className="relative h-64 md:h-80 bg-neutral-900 text-white flex items-center justify-center overflow-hidden mb-12">
          <div className="absolute inset-0 z-0">
            <SafeImage
              src={bannerImage}
              alt={title}
              className="w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 text-center max-w-2xl px-4">
            <h1 className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight mb-3">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm md:text-base text-neutral-200 font-light max-w-xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 border-b border-neutral-200 mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-2">
            {title}
          </h1>
          {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        </div>
      )}

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar: Filter toggle on mobile, Results Count, Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-neutral-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 px-3 py-2 border border-neutral-200 rounded text-xs font-semibold uppercase tracking-wider text-neutral-800"
            >
              <SlidersHorizontal size={14} />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            <span className="text-xs text-neutral-500 font-mono">
              Showing <strong>{filteredProducts.length}</strong> styles
            </span>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 hidden sm:inline">Sort By:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleFilterChange({ sortBy: e.target.value as ProductFilterState['sortBy'] })
              }
              className="border border-neutral-200 bg-white px-3 py-2 rounded text-xs font-medium text-neutral-800 focus:outline-none focus:border-neutral-900"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="popular">Best Sellers / Reviews</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Product Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 text-xs">
            <span className="text-neutral-400 mr-1">Active filters:</span>
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 rounded text-neutral-800">
                Search: "{filters.searchQuery}"
                <button onClick={() => handleFilterChange({ searchQuery: '' })}>
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.subCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 rounded text-neutral-800">
                {filters.subCategory}
                <button onClick={() => handleFilterChange({ subCategory: undefined })}>
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.sizes.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 rounded text-neutral-800">
                Size {s}
                <button
                  onClick={() =>
                    handleFilterChange({ sizes: filters.sizes.filter((x) => x !== s) })
                  }
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {filters.colors.map((c) => (
              <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-100 rounded text-neutral-800">
                {c}
                <button
                  onClick={() =>
                    handleFilterChange({ colors: filters.colors.filter((x) => x !== c) })
                  }
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <button
              onClick={handleResetFilters}
              className="text-xs text-neutral-500 hover:text-black underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Catalog Body: Sidebar + Grid */}
        <div className="flex gap-8">
          <ProductFilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            isMobileDrawer={false}
          />

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <ProductFilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setMobileFilterOpen(false)}
            />
          )}

          {/* Product Grid / Empty State */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-neutral-200 rounded p-8">
                <p className="font-serif text-lg font-bold text-neutral-800 mb-2">
                  No styles match your criteria
                </p>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
                  Try broadening your price range, clearing selected sizes or colors, or search for another term.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-neutral-900 text-white text-xs font-semibold px-6 py-2.5 uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
