import React from 'react';
import { CatalogView } from '../components/product/CatalogView';

export const NewArrivalsPage: React.FC = () => {
  return (
    <CatalogView
      title="New Arrivals"
      subtitle="The latest arrivals to the UrbanStyle catalog. Limited run releases and fresh seasonal essentials."
      isNewArrivalsOnly={true}
    />
  );
};
