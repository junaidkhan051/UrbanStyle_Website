import { ProductCategory } from '../types/product';
import { CAMPAIGN_IMAGES } from './mockProducts';

export interface CategoryMetadata {
  id: ProductCategory;
  name: string;
  tagline: string;
  description: string;
  bannerImage: string;
  subcategories: { id: string; name: string }[];
}

export const CATEGORIES_DATA: Record<ProductCategory, CategoryMetadata> = {
  men: {
    id: 'men',
    name: 'Men',
    tagline: 'Modern Tailoring & Elevated Essentials',
    description: 'Precision-cut coats, Supima cotton tees, Japanese selvedge denim, and minimalist footwear engineered for confident international living.',
    bannerImage: CAMPAIGN_IMAGES.men,
    subcategories: [
      { id: 'all', name: 'All Men' },
      { id: 't-shirts', name: 'T-Shirts' },
      { id: 'polo-shirts', name: 'Polo Shirts' },
      { id: 'casual-shirts', name: 'Casual Shirts' },
      { id: 'formal-shirts', name: 'Formal Shirts' },
      { id: 'hoodies', name: 'Hoodies' },
      { id: 'jackets', name: 'Jackets' },
      { id: 'jeans', name: 'Jeans' },
      { id: 'trousers', name: 'Trousers' },
      { id: 'sneakers', name: 'Sneakers' },
      { id: 'accessories', name: 'Accessories' },
    ],
  },
  women: {
    id: 'women',
    name: 'Women',
    tagline: 'Fluid Silhouettes & Refined Modernism',
    description: 'Pure Mulberry silk slip dresses, double-breasted blazers, wide-leg denim, and handcrafted Italian leather bags.',
    bannerImage: CAMPAIGN_IMAGES.women,
    subcategories: [
      { id: 'all', name: 'All Women' },
      { id: 'dresses', name: 'Dresses' },
      { id: 'tops', name: 'Tops' },
      { id: 'blouses', name: 'Blouses' },
      { id: 'jeans', name: 'Jeans' },
      { id: 'jackets', name: 'Jackets' },
      { id: 'hoodies', name: 'Hoodies' },
      { id: 'skirts', name: 'Skirts' },
      { id: 'handbags', name: 'Handbags' },
      { id: 'accessories', name: 'Accessories' },
    ],
  },
  kids: {
    id: 'kids',
    name: 'Kids',
    tagline: 'Playful Freedom & Certified Organic Comfort',
    description: 'Ultra-soft organic cotton hoodies, flex-waist denim, matching waffle lounge sets, and all-weather playground gear.',
    bannerImage: CAMPAIGN_IMAGES.kids,
    subcategories: [
      { id: 'all', name: 'All Kids' },
      { id: 't-shirts', name: 'T-Shirts' },
      { id: 'hoodies', name: 'Hoodies' },
      { id: 'jeans', name: 'Jeans' },
      { id: 'dresses', name: 'Dresses' },
      { id: 'jackets', name: 'Jackets' },
      { id: 'sneakers', name: 'Shoes' },
      { id: 'matching-sets', name: 'Matching Sets' },
    ],
  },
  accessories: {
    id: 'accessories',
    name: 'Accessories',
    tagline: 'Fine Details & Handcrafted Accents',
    description: 'Mazzucchelli acetate eyewear, English bridle leather belts, 18k gold vermeil jewelry, and Italian pebble leather goods.',
    bannerImage: CAMPAIGN_IMAGES.footwearAccessories,
    subcategories: [
      { id: 'all', name: 'All Accessories' },
      { id: 'handbags', name: 'Bags & Totes' },
      { id: 'accessories', name: 'Belts & Small Leather Goods' },
    ],
  },
  footwear: {
    id: 'footwear',
    name: 'Footwear',
    tagline: 'Architectural Form & Italian Craftsmanship',
    description: 'Margom cupsole sneakers, Goodyear-welted Chelsea boots, and artisanal summer slides constructed from the finest European leathers.',
    bannerImage: CAMPAIGN_IMAGES.sneakers,
    subcategories: [
      { id: 'all', name: 'All Footwear' },
      { id: 'sneakers', name: 'Sneakers' },
    ],
  },
};
