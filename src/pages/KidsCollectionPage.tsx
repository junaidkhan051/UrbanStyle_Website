import React from 'react';
import { CatalogView } from '../components/product/CatalogView';
import { CAMPAIGN_IMAGES } from '../data/mockProducts';

export const KidsCollectionPage: React.FC = () => {
  return (
    <CatalogView
      title="Kids Collection"
      subtitle="Certified GOTS organic cotton tees, cozy loopback fleece hoodies, flex-waist denim, and playground-ready footwear."
      bannerImage={CAMPAIGN_IMAGES.kids}
      fixedCategory="kids"
    />
  );
};
