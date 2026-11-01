import React from 'react';
import { CatalogView } from '../components/product/CatalogView';
import { CAMPAIGN_IMAGES } from '../data/mockProducts';

export const MenCollectionPage: React.FC = () => {
  return (
    <CatalogView
      title="Men's Wardrobe"
      subtitle="Heavyweight Supima cotton tees, tailored overcoats, Japanese selvedge denim, and minimalist Italian calfskin sneakers."
      bannerImage={CAMPAIGN_IMAGES.men}
      fixedCategory="men"
    />
  );
};
