// app/admin/layout.tsx

import React from 'react';
import AdminLayoutClient from '../../../components/admin-layout-client';
import { getTodayCheckInsCount, getTodayCheckOutsCount, getTotalPendingReservationsCount } from '../../../lib/actions/reservation-count';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const totalReservations = await getTotalPendingReservationsCount();
  const checkInsCount = await getTodayCheckInsCount();
  const checkOutsCount = await getTodayCheckOutsCount();

  return (
    <AdminLayoutClient
      totalReservationsBadge={totalReservations}
      checkInsBadge={checkInsCount}
      checkOutsBadge={checkOutsCount}
    >
      {children}
    </AdminLayoutClient>
  );
}