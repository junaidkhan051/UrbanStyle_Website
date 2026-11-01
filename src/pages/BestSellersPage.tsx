import React from 'react';
import { CatalogView } from '../components/product/CatalogView';

export const BestSellersPage: React.FC = () => {
  return (
    <CatalogView
      title="Best Sellers"
      subtitle="Our most celebrated silhouettes, tested and loved across our global community."
      isBestSellersOnly={true}
    />
  );
};
