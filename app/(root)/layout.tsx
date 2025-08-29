// app/(root)/(routes)/layout.tsx

import { redirect } from 'next/navigation';
import { auth } from '../../auth';
import { BusinessUnitModal } from '../../components/modals/business-unit-modal';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/sign-in');
  }

  const assignments = session.user.assignments;

  if (assignments && assignments.length > 0) {
    const firstBusinessUnitId = assignments[0].businessUnitId;
    // This is the correct initial redirect to the user's first dashboard.
    redirect(`/${firstBusinessUnitId}/admin`); 
  }

  return (
    <>
      <BusinessUnitModal />
      {children}
    </>
  );
}