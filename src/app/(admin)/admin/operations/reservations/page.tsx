import React from 'react';
import ReservationListPage from './components/reservation-list-page';
import { getAllReservations } from '../../../../../../lib/actions/reservations';

const ReservationsPage: React.FC = async () => {
  const reservations = await getAllReservations();

  return <ReservationListPage initialReservations={reservations} />;
};

export default ReservationsPage;