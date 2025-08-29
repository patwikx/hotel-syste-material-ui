import React from 'react';
import { getAllRestaurants } from '../../../../../lib/actions/resto-management';
import RestaurantListPage from './components/restaurants-list-page';


const RestaurantsPage: React.FC = async () => {
  const restaurants = await getAllRestaurants();

  return <RestaurantListPage initialRestaurants={restaurants} />;
};

export default RestaurantsPage;