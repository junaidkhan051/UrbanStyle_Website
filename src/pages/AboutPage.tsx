import React from 'react';
import { CAMPAIGN_IMAGES } from '../data/mockProducts';
import { SafeImage } from '../components/common/SafeImage';
import { Sparkles, Layers, Globe, Shield } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-20 pb-24">
      {/* Hero Header */}
      <div className="relative min-h-[50vh] bg-neutral-900 text-white flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SafeImage
            src={CAMPAIGN_IMAGES.hero}
            alt="About UrbanStyle"
            className="w-full h-full object-cover filter brightness-70"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center max-w-3xl px-4 py-16">
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-300 font-medium block mb-3">
            Our Heritage & Vision
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold uppercase tracking-tight mb-4">
            Define Your Style.
          </h1>
          <p className="text-sm md:text-base text-neutral-200 font-light max-w-xl mx-auto leading-relaxed">
            UrbanStyle was founded on a singular conviction: modern luxury lies in architectural simplicity, exceptional natural fibers, and uncompromising international standards.
          </p>
        </div>
      </div>

      {/* Philosophy Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block">
              Chapter 01 · The Antithesis of Fast Fashion
            </span>
            <h2 className="text-3xl font-serif font-bold text-neutral-900 leading-snug">
              Built to Endure Across Seasons, Transcending Fleeting Trends
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              We reject the planned obsolescence of mass fashion. Every garment in our collection is developed through iterative prototyping, ensuring structural drape, seam durability, and timeless proportion.
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              From our 480 GSM organic cotton looped fleece hoodies to French flax linen shirts and Italian vegetable-tanned leather accessories, our materials are selected for how gracefully they age with the wearer.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] bg-neutral-100 overflow-hidden rounded-sm shadow-md">
              <SafeImage
                src={CAMPAIGN_IMAGES.men}
                alt="UrbanStyle Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Grid */}
      <section className="bg-[#F8F7F4] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block mb-2">
              Foundational Pillars
            </span>
            <h2 className="text-3xl font-serif font-bold text-neutral-900">
              The UrbanStyle Standard
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            <div className="bg-white p-6 rounded-sm border border-neutral-200 space-y-3">
              <Sparkles size={20} className="text-neutral-900" />
              <h3 className="font-serif font-bold text-sm text-neutral-900">Sourced Fiber Integrity</h3>
              <p className="text-neutral-500 leading-relaxed">
                Certified GOTS organic cottons, long-staple Supima combed jersey, and pure Grade-6A Mulberry silk.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-neutral-200 space-y-3">
              <Layers size={20} className="text-neutral-900" />
              <h3 className="font-serif font-bold text-sm text-neutral-900">Architectural Tailoring</h3>
              <p className="text-neutral-500 leading-relaxed">
                Precise shoulder drops, balanced armhole geometry, and ergonomic darts designed for natural human movement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-neutral-200 space-y-3">
              <Globe size={20} className="text-neutral-900" />
              <h3 className="font-serif font-bold text-sm text-neutral-900">Global Perspective</h3>
              <p className="text-neutral-500 leading-relaxed">
                Universal sizing scales, worldwide express dispatch, and transparent multi-currency valuation centered in USD.
              </p>
            </div>

            <div className="bg-white p-6 rounded-sm border border-neutral-200 space-y-3">
              <Shield size={20} className="text-neutral-900" />
              <h3 className="font-serif font-bold text-sm text-neutral-900">Enterprise Engineering</h3>
              <p className="text-neutral-500 leading-relaxed">
                Architected with decoupled frontend layers prepared for seamless integration with Spring Boot & PostgreSQL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Craftsmanship Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="aspect-[4/3] bg-neutral-100 overflow-hidden rounded-sm shadow-md">
              <SafeImage
                src={CAMPAIGN_IMAGES.women}
                alt="Womenswear Atelier"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold block">
              Chapter 02 · Atelier Discipline
            </span>
            <h2 className="text-3xl font-serif font-bold text-neutral-900 leading-snug">
              Every Seam Has Intent. Every Cut Has Purpose.
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-light">
              From our London studio to partner artisan workshops in Civitanova Marche and Porto, our garment technologists oversee each step of manufacturing.
            </p>
            <div className="pt-2 text-xs text-neutral-500 font-mono space-y-1">
              <p>• Zero synthetic harmful dyes (OEKO-TEX Standard 100)</p>
              <p>• Hand-finished beveled leather edges</p>
              <p>• Reusable recycled cotton dust bags on all footwear</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
