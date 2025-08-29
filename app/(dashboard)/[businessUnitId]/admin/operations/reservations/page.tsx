import React from 'react';

import { getAllReservations } from '../../../../../lib/actions/reservations';
import ReservationListPage from './components/reservation-list-page';

const ReservationsPage: React.FC = async () => {
  const reservations = await getAllReservations();

  return <ReservationListPage initialReservations={reservations} />;
};

export default ReservationsPage;