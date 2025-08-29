// app/(dashboard)/[businessUnitId]/layout.tsx

import React from 'react';
import { redirect } from 'next/navigation';

import AdminLayoutClient from '../../components/admin-layout-client';
import { getTodayCheckInsCount, getTodayCheckOutsCount, getTotalPendingReservationsCount } from '../../lib/actions/reservation-count';
import { auth } from '../../auth';
import { BusinessUnitItem } from '../../types/business-unit-types';
import { prisma } from '../../lib/prisma';

export const metadata = {
  title: "Dolores Hotels - Admin Dashboard",
  description: "Hotel Management & CMS for Dolores Hotels",
};

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { businessUnitId: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const { businessUnitId } = params;
  
  // The crucial permission check to prevent a redirect loop.
  const isAuthorizedForUnit = session.user.assignments.some(
    (assignment) => assignment.businessUnitId === businessUnitId
  );

  // If the user is not authorized for the requested unit, redirect them to their first assigned unit.
  if (!isAuthorizedForUnit) {
    const defaultUnitId = session.user.assignments[0]?.businessUnitId;
    // Redirect only if a default unit exists, otherwise go to a "select unit" page.
    if (defaultUnitId) {
      redirect(`/${defaultUnitId}/admin`);
    } else {
      redirect("/select-unit");
    }
  }

  const isAdmin = session.user.assignments.some(
    (assignment) => assignment.role.name === 'SUPER_ADMIN'
  );

  // Fetch business units based on admin status
  let businessUnits: BusinessUnitItem[] = [];
  if (isAdmin) {
    businessUnits = await prisma.businessUnit.findMany({
      orderBy: { displayName: "asc" },
      select: {
        id: true,
        name: true,
        displayName: true,
      },
    }).then(units => units.map(u => ({ id: u.id, name: u.displayName })));
  } else {
    businessUnits = session.user.assignments.map((assignment) => ({
      id: assignment.businessUnit.id,
      name: assignment.businessUnit.name,
    }));
  }

  // Fetch badge counts
  const totalReservations = await getTotalPendingReservationsCount();
  const checkInsCount = await getTodayCheckInsCount();
  const checkOutsCount = await getTodayCheckOutsCount();

  return (
    <AdminLayoutClient
      totalReservationsBadge={totalReservations}
      checkInsBadge={checkInsCount}
      checkOutsBadge={checkOutsCount}
      businessUnitId={businessUnitId}
      businessUnits={businessUnits}
      isAdmin={isAdmin}
      userRole={session.user.assignments.find(a => a.businessUnitId === businessUnitId)?.role.name || 'USER'}
    >
      {children}
    </AdminLayoutClient>
  );
}