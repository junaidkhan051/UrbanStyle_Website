import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, RefreshCw, Truck } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { ProductCard } from '../components/common/ProductCard';
import { CAMPAIGN_IMAGES } from '../data/mockProducts';
import { SafeImage } from '../components/common/SafeImage';

export const HomePage: React.FC = () => {
  const products = useProductStore((state) => state.products);

  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div className="space-y-24 pb-20">
      {/* ==========================================
          SECTION 2: CINEMATIC HERO
          ========================================== */}
      <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden bg-neutral-900 text-white">
        {/* Background Image with Dark Scrim Overlay */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src={CAMPAIGN_IMAGES.hero}
            alt="UrbanStyle Modern Fashion Campaign"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
        </div>

        {/* Hero Editorial Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-20 flex flex-col items-center">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-300 mb-4 inline-block">
            Fall / Winter 2026 Collection
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-extrabold tracking-tight text-white mb-6 uppercase leading-[1.08] text-balance">
            STYLE BEYOND LIMITS
          </h1>

          <p className="text-sm sm:text-lg text-neutral-200 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover timeless essentials and contemporary fashion designed for every expression of style.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/collection/men"
              className="w-full sm:w-auto px-8 py-4 bg-white text-neutral-900 text-xs font-bold tracking-[0.15em] uppercase hover:bg-neutral-200 transition-all duration-200 shadow-xl"
            >
              SHOP MEN
            </Link>
            <Link
              to="/collection/women"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white text-white text-xs font-bold tracking-[0.15em] uppercase hover:bg-white hover:text-neutral-900 transition-all duration-200"
            >
              SHOP WOMEN
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 3: SHOP BY CATEGORY
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block mb-2">
              Curated Departments
            </span>
            <h2 className="text-3xl font-serif font-bold text-neutral-900">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-neutral-800 hover:text-black flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: 'Men', path: '/collection/men', image: CAMPAIGN_IMAGES.men, count: '18 Styles' },
            { name: 'Women', path: '/collection/women', image: CAMPAIGN_IMAGES.women, count: '18 Styles' },
            { name: 'Kids', path: '/collection/kids', image: CAMPAIGN_IMAGES.kids, count: '14 Styles' },
            { name: 'Accessories', path: '/shop?category=accessories', image: CAMPAIGN_IMAGES.footwearAccessories, count: '8 Styles' },
            { name: 'Footwear', path: '/shop?category=footwear', image: CAMPAIGN_IMAGES.sneakers, count: '6 Styles' },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="group relative overflow-hidden aspect-[3/4] bg-neutral-100 flex flex-col justify-end p-5 text-white shadow-sm"
            >
              <div className="absolute inset-0 z-0">
                <SafeImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              </div>
              <div className="relative z-10">
                <span className="text-[10px] tracking-widest uppercase text-neutral-300 font-mono block mb-1">
                  {cat.count}
                </span>
                <h3 className="font-serif text-xl font-bold tracking-wide group-hover:underline">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==========================================
          SECTION 4: NEW ARRIVALS
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block mb-2">
              Just Landed
            </span>
            <h2 className="text-3xl font-serif font-bold text-neutral-900">
              New Arrivals
            </h2>
          </div>
          <Link
            to="/new-arrivals"
            className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-neutral-800 hover:text-black flex items-center gap-1 group"
          >
            <span>Explore New In</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ==========================================
          SECTION 5: FEATURED COLLECTIONS (Editorial Banners)
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Banner 1: The Modern Tailoring Edit */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-neutral-900 text-white flex flex-col justify-end p-8 sm:p-12 group">
            <div className="absolute inset-0 z-0">
              <SafeImage
                src={CAMPAIGN_IMAGES.men}
                alt="Men's Tailoring Edit"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            </div>
            <div className="relative z-10 max-w-md">
              <span className="text-xs uppercase tracking-widest font-semibold text-neutral-300 mb-2 block">
                Editorial Showcase
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
                The Architectural Overcoat
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-6">
                Constructed from Italian double-faced wool with horn hardware and clean structured shoulders.
              </p>
              <Link
                to="/collection/men"
                className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-white border-b border-white pb-1 hover:text-neutral-300 hover:border-neutral-300 transition-colors"
              >
                <span>Discover Menswear</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Banner 2: Mulberry Silk Elegance */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-neutral-900 text-white flex flex-col justify-end p-8 sm:p-12 group">
            <div className="absolute inset-0 z-0">
              <SafeImage
                src={CAMPAIGN_IMAGES.women}
                alt="Women's Silk Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            </div>
            <div className="relative z-10 max-w-md">
              <span className="text-xs uppercase tracking-widest font-semibold text-neutral-300 mb-2 block">
                Capsule Series
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
                Mulberry Silk & Tailoring
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-6">
                Pure 22-Momme silk slip dresses paired with structured double-breasted blazers.
              </p>
              <Link
                to="/collection/women"
                className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-white border-b border-white pb-1 hover:text-neutral-300 hover:border-neutral-300 transition-colors"
              >
                <span>Discover Womenswear</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 6: BEST SELLERS
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-neutral-200">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block mb-2">
              Customer Favorites
            </span>
            <h2 className="text-3xl font-serif font-bold text-neutral-900">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/best-sellers"
            className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-wider text-neutral-800 hover:text-black flex items-center gap-1 group"
          >
            <span>View All Best Sellers</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ==========================================
          SECTION 7: SEASONAL COLLECTION (Monolith Banner)
          ========================================== */}
      <section className="bg-[#292929] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-mono">
                Seasonal Lookbook
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
                The Monolith Capsule: Heavyweight Textures & Raw Forms
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                Crafted for colder climates with 480 GSM French terry fleeces, 13.5 oz Japanese selvedge denim, and weatherproof technical storm trenches.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-block bg-white text-neutral-900 px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                >
                  Explore the Capsule
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-[16/10] overflow-hidden bg-neutral-800 shadow-2xl">
                <SafeImage
                  src={CAMPAIGN_IMAGES.footwearAccessories}
                  alt="Monolith Capsule Accessories and Footwear"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 8: BRAND STORY & VALUES
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block">
            The UrbanStyle Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 leading-snug">
            Engineered with Precision. Designed for Distinction.
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-light">
            We reject the transient cycles of disposable fast fashion. Every silhouette in our catalog is engineered through meticulous fabric sourcing, rigorous fit sampling, and unwavering respect for timeless craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 bg-white border border-neutral-100 rounded-sm space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
              <Sparkles size={20} />
            </div>
            <h3 className="font-serif font-bold text-base text-neutral-900">Pure Natural Fibers</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Certified GOTS organic cottons, long-staple Supima, 22-Momme Mulberry silks, and Grade-A Mongolian cashmere.
            </p>
          </div>

          <div className="p-8 bg-white border border-neutral-100 rounded-sm space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
              <Truck size={20} />
            </div>
            <h3 className="font-serif font-bold text-base text-neutral-900">Complimentary Shipping</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Enjoy simulated free standard shipping on all qualifying portfolio orders over $100.00 USD worldwide.
            </p>
          </div>

          <div className="p-8 bg-white border border-neutral-100 rounded-sm space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
              <RefreshCw size={20} />
            </div>
            <h3 className="font-serif font-bold text-base text-neutral-900">Effortless Returns</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Pre-printed demonstration return labels and generous 30-day trial periods on all unwashed garments.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
