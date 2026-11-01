import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { formatCentsToUSD } from '../../utils/currency';
import { Product } from '../../types/product';
import { SafeImage } from './SafeImage';

export const SearchModal: React.FC = () => {
  const { searchModalOpen, setSearchModalOpen, products } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
      setResults([]);
    }
  }, [searchModalOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    const q = searchTerm.toLowerCase();
    const matches = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q)
    );
    setResults(matches.slice(0, 8));
  }, [searchTerm, products]);

  if (!searchModalOpen) return null;

  const handleSelectProduct = (id: string) => {
    setSearchModalOpen(false);
    navigate(`/product/${id}`);
  };

  const handleSearchAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setSearchModalOpen(false);
    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setSearchModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative mx-auto max-w-2xl bg-white shadow-2xl rounded-sm overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <form onSubmit={handleSearchAll} className="flex items-center px-4 py-3 border-b border-neutral-200 bg-[#FBFBFA]">
          <Search size={20} className="text-neutral-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products by name, category, or fabric (e.g., Supima, Silk, Cashmere, Denim)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-neutral-400 hover:text-neutral-600 p-1 mr-2"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setSearchModalOpen(false)}
            className="text-xs uppercase tracking-wider text-neutral-500 hover:text-black font-semibold ml-2"
          >
            Esc
          </button>
        </form>

        {/* Results or Quick Links */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {searchTerm.trim() === '' ? (
            <div className="py-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Supima Cotton', 'Mulberry Silk Dress', 'Selvedge Denim', 'Cashmere Hoodie', 'Italian Sneakers', 'Trench Coat'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchTerm(term)}
                    className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                Browse Collections
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => { setSearchModalOpen(false); navigate('/collection/men'); }}
                  className="p-3 text-left bg-neutral-50 hover:bg-neutral-100 rounded border border-neutral-100"
                >
                  <strong className="block text-neutral-900 font-serif">Men</strong>
                  <span className="text-[11px] text-neutral-500">Tailoring & Casual</span>
                </button>
                <button
                  onClick={() => { setSearchModalOpen(false); navigate('/collection/women'); }}
                  className="p-3 text-left bg-neutral-50 hover:bg-neutral-100 rounded border border-neutral-100"
                >
                  <strong className="block text-neutral-900 font-serif">Women</strong>
                  <span className="text-[11px] text-neutral-500">Dresses & Silks</span>
                </button>
                <button
                  onClick={() => { setSearchModalOpen(false); navigate('/collection/kids'); }}
                  className="p-3 text-left bg-neutral-50 hover:bg-neutral-100 rounded border border-neutral-100"
                >
                  <strong className="block text-neutral-900 font-serif">Kids</strong>
                  <span className="text-[11px] text-neutral-500">Organic Wear</span>
                </button>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-100">
                <span>Matching Items ({results.length})</span>
                <button
                  type="button"
                  onClick={handleSearchAll}
                  className="text-black font-semibold hover:underline flex items-center gap-1"
                >
                  <span>View all in Shop</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              <div className="divide-y divide-neutral-100">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="flex items-center gap-3 py-2.5 px-2 hover:bg-neutral-50 cursor-pointer rounded transition-colors group"
                  >
                    <div className="w-12 h-14 bg-neutral-100 rounded overflow-hidden shrink-0">
                      <SafeImage
                        src={product.images[0]}
                        alt={product.name}
                        category={product.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400 uppercase tracking-widest">
                        <span>{product.category}</span>
                        <span>·</span>
                        <span>{product.subCategory}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-neutral-900 truncate group-hover:text-neutral-700">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500 truncate">{product.subtitle}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-neutral-900 tabular-nums">
                        {formatCentsToUSD(product.priceCents)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <p className="text-sm font-medium text-neutral-800 mb-1">No products found for "{searchTerm}"</p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Try searching for broader keywords like "hoodie", "jeans", "cotton", or check your spelling.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
