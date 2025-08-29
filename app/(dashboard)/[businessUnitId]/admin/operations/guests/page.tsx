import React from 'react';
import GuestListPage from './components/guest-list-page';
import { getAllGuests } from '../../../../../lib/actions/guest-management';


const GuestsPage: React.FC = async () => {
  const guests = await getAllGuests();

  return <GuestListPage initialGuests={guests} />;
};

export default GuestsPage;