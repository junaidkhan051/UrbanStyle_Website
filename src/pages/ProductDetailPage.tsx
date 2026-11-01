import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, ShoppingBag, Ruler, Truck, RotateCcw, 
  ShieldCheck, Share2, Star, Check, ArrowRight 
} from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useToastStore } from '../store/useToastStore';
import { formatCentsToUSD } from '../utils/currency';
import { SafeImage } from '../components/common/SafeImage';
import { SizeGuideModal } from '../components/common/SizeGuideModal';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const showToast = useToastStore((state) => state.showToast);

  const product = products.find((p) => p.id === id || p.slug === id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'shipping'>('details');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (product) {
      setSelectedSize(product.availableSizes[0] || 'M');
      setSelectedColorIndex(0);
      setSelectedImageIndex(0);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2">Style Not Found</h2>
        <p className="text-sm text-neutral-500 mb-6">
          The item you are searching for might have rotated out of the demonstration catalog.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-neutral-900 text-white text-xs font-semibold px-6 py-3 uppercase tracking-wider"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const currentColor = product.availableColors[selectedColorIndex] || {
    name: 'Standard',
    hex: '#111111',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast('Please choose a size', 'error');
      return;
    }
    addItem(product, selectedSize, currentColor, quantity);
    showToast(`Added ${quantity} × ${product.name} to your shopping bag`);
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist(product);
    showToast(
      added ? `Added "${product.name}" to wishlist` : `Removed from wishlist`,
      'info'
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard');
    }
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-neutral-500">
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2">
          <Link to="/" className="hover:text-black">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/collection/${product.category}`} className="capitalize hover:text-black">
            {product.category}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-neutral-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Image Gallery & Zoom */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnail navigation */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-2 shrink-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border transition-all ${
                      selectedImageIndex === idx
                        ? 'border-neutral-900 ring-1 ring-neutral-900'
                        : 'border-neutral-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <SafeImage src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Zoomable Image Viewport */}
            <div
              className="relative flex-1 aspect-[3/4] overflow-hidden bg-[#F8F7F4] cursor-crosshair group rounded-xs border border-neutral-100"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <SafeImage
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                category={product.category}
                fallbackTitle={product.name}
                className={`w-full h-full object-cover transition-transform duration-200 ${
                  isZoomed ? 'scale-150 origin-center' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                    : undefined
                }
              />

              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[10px] text-neutral-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Hover to inspect details
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs text-neutral-500 uppercase tracking-widest mb-2">
                <span>{product.category} · {product.subCategory}</span>
                <span className="font-mono text-neutral-400">SKU: {product.sku}</span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 leading-tight mb-1">
                {product.name}
              </h1>
              <p className="text-xs text-neutral-500 mb-4">{product.subtitle}</p>

              {/* Rating demonstration */}
              <div className="flex items-center gap-2 mb-6 text-xs text-neutral-600">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <span className="font-mono tabular-nums font-semibold text-neutral-800">
                  {product.rating}
                </span>
                <span className="text-neutral-400">({product.reviewCount} verified reviews)</span>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 pb-6 border-b border-neutral-100">
                <span className="text-3xl font-mono font-bold text-neutral-900 tabular-nums">
                  {formatCentsToUSD(product.priceCents)}
                </span>
                {product.originalPriceCents && product.originalPriceCents > product.priceCents && (
                  <span className="text-base text-neutral-400 line-through font-mono tabular-nums">
                    {formatCentsToUSD(product.originalPriceCents)}
                  </span>
                )}
                <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded font-medium">
                  In Demo Stock ({product.demoStockQuantity} available)
                </span>
              </div>

              {/* Color Selection */}
              {product.availableColors && product.availableColors.length > 0 && (
                <div className="py-4 border-b border-neutral-100 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold uppercase tracking-wider text-neutral-800">
                      Color
                    </span>
                    <span className="text-neutral-600">{currentColor.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {product.availableColors.map((color, idx) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColorIndex(idx)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedColorIndex === idx
                            ? 'border-neutral-900 scale-110 shadow-sm'
                            : 'border-neutral-200 hover:border-neutral-400'
                        }`}
                        title={color.name}
                      >
                        <span
                          className="w-6 h-6 rounded-full inline-block"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection & Sizing Guide */}
              {product.availableSizes && product.availableSizes.length > 0 && (
                <div className="py-4 border-b border-neutral-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-wider text-neutral-800">
                      Select Size
                    </span>
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="text-neutral-600 hover:text-black underline flex items-center gap-1"
                    >
                      <Ruler size={13} />
                      <span>Size Guide</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-12 py-2 px-3 text-xs font-mono font-medium border rounded transition-colors ${
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

              {/* Quantity Stepper */}
              <div className="py-4 border-b border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
                  Quantity
                </span>
                <div className="flex items-center border border-neutral-200 rounded text-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-mono font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.demoStockQuantity, quantity + 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart & Wishlist Actions */}
              <div className="pt-6 space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold py-4 px-6 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <ShoppingBag size={18} />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    onClick={handleToggleWishlist}
                    className={`p-4 border transition-colors ${
                      isFavorited
                        ? 'border-red-500 text-red-500 bg-red-50'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:text-black'
                    }`}
                    title="Save to Wishlist"
                    aria-label="Wishlist toggle"
                  >
                    <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-4 border border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:text-black transition-colors"
                    title="Share style"
                    aria-label="Share"
                  >
                    <Share2 size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Truck size={14} className="text-neutral-700 shrink-0" />
                    <span>Free shipping on $100+</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw size={14} className="text-neutral-700 shrink-0" />
                    <span>30-Day demo returns</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion / Tabbed Specs */}
            <div className="pt-8 border-t border-neutral-200">
              <div className="flex border-b border-neutral-200 text-xs font-semibold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-2 px-4 border-b-2 transition-colors ${
                    activeTab === 'details' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`py-2 px-4 border-b-2 transition-colors ${
                    activeTab === 'materials' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Materials & Care
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`py-2 px-4 border-b-2 transition-colors ${
                    activeTab === 'shipping' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Shipping & Origin
                </button>
              </div>

              <div className="py-4 text-xs text-neutral-600 leading-relaxed min-h-[100px]">
                {activeTab === 'details' && (
                  <div className="space-y-3">
                    <p>{product.description}</p>
                    <ul className="list-disc pl-5 space-y-1 text-neutral-700">
                      {product.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'materials' && (
                  <div className="space-y-3">
                    <p><strong>Composition:</strong> {product.materials}</p>
                    <p><strong>Care Instructions:</strong> {product.careInstructions}</p>
                    <p className="text-neutral-400">
                      Sourced through certified sustainable European and North American mills.
                    </p>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p><strong>Worldwide Delivery:</strong> 3-5 business days via simulated DHL Express.</p>
                    <p><strong>Free Standard Shipping:</strong> Automatically applied at checkout on orders totaling $100.00 USD or higher.</p>
                    <p><strong>Returns:</strong> Complimentary 30-day simulated return portal access.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-serif font-bold text-neutral-900">
                Complete the Look
              </h2>
              <Link
                to={`/collection/${product.category}`}
                className="text-xs uppercase tracking-wider font-semibold text-neutral-700 hover:text-black flex items-center gap-1"
              >
                <span>View More in {product.category}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sizing Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        defaultTab={product.category === 'kids' ? 'kids' : product.category === 'women' ? 'women' : product.category === 'footwear' ? 'footwear' : 'men'}
      />
    </div>
  );
};
