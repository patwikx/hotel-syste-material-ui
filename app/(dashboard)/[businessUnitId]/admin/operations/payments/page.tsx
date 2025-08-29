import React from 'react';
import PaymentListPage from './components/payments-list-page';
import { getAllPayments } from '../../../../../lib/actions/payment-management';


const PaymentsPage: React.FC = async () => {
  const payments = await getAllPayments();

  return <PaymentListPage initialPayments={payments} />;
};

export default PaymentsPage;