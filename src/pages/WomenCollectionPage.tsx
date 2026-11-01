import React from 'react';
import { CatalogView } from '../components/product/CatalogView';
import { CAMPAIGN_IMAGES } from '../data/mockProducts';

export const WomenCollectionPage: React.FC = () => {
  return (
    <CatalogView
      title="Women's Collection"
      subtitle="Mulberry silk slip dresses, double-breasted blazers, wide-leg denim, and sculpted leather accessories."
      bannerImage={CAMPAIGN_IMAGES.women}
      fixedCategory="women"
    />
  );
};
