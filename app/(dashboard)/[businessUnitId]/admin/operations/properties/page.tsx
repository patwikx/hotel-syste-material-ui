import React from 'react';
import { getAllBusinessUnits } from '../../../../../lib/actions/business-management';
import BusinessUnitListPage from './components/property-list-page';


const PropertiesPage: React.FC = async () => {
  const businessUnits = await getAllBusinessUnits();

  return <BusinessUnitListPage initialBusinessUnits={businessUnits} />;
};

export default PropertiesPage;