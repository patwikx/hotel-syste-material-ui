'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Stack,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  Hotel as HotelIcon,
  Undo as RefundIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { PaymentStatus, PaymentMethod } from '@prisma/client';
import { PaymentData, refundPayment, updatePaymentStatus } from '../../../../../../lib/actions/payment-management';


interface PaymentListPageProps {
  initialPayments: PaymentData[];
}

const PaymentListPage: React.FC<PaymentListPageProps> = ({ initialPayments }) => {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentData[]>(initialPayments);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    payment: PaymentData | null;
    action: 'status' | 'refund' | null;
  }>({
    open: false,
    payment: null,
    action: null,
  });
  const [newStatus, setNewStatus] = useState<PaymentStatus>('PENDING');
  const [refundReason, setRefundReason] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdateStatus = async () => {
    if (!actionDialog.payment) return;

    setLoading(actionDialog.payment.id);
    try {
      const result = await updatePaymentStatus(actionDialog.payment.id, newStatus);
      if (result.success) {
        setPayments(prev => prev.map(p => 
          p.id === actionDialog.payment!.id ? { ...p, status: newStatus } : p
        ));
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to update payment status',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while updating payment status',
        severity: 'error',
      });
    } finally {
      setLoading(null);
      setActionDialog({ open: false, payment: null, action: null });
      setNewStatus('PENDING');
    }
  };

  const handleRefund = async () => {
    if (!actionDialog.payment) return;

    setLoading(actionDialog.payment.id);
    try {
      const result = await refundPayment(actionDialog.payment.id, refundReason);
      if (result.success) {
        setPayments(prev => prev.map(p => 
          p.id === actionDialog.payment!.id ? { ...p, status: 'REFUNDED' as PaymentStatus } : p
        ));
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to refund payment',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while processing refund',
        severity: 'error',
      });
    } finally {
      setLoading(null);
      setActionDialog({ open: false, payment: null, action: null });
      setRefundReason('');
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not processed';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(Number(amount));
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    const colorMap: Record<PaymentStatus, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      'PENDING': 'warning',
      'PROCESSING': 'info',
      'SUCCEEDED': 'success',
      'FAILED': 'error',
      'CANCELLED': 'error',
      'REFUNDED': 'secondary',
      'PARTIAL': 'info',
      'PAID': 'success',
    };
    return colorMap[status] || 'default';
  };

  const getPaymentMethodColor = (method: PaymentMethod) => {
    const colorMap: Record<PaymentMethod, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      'CREDIT_CARD': 'primary',
      'DEBIT_CARD': 'primary',
      'BANK_TRANSFER': 'info',
      'CASH': 'success',
      'CHECK': 'secondary',
      'GCASH': 'warning',
      'PAYMAYA': 'info',
      'GRABPAY': 'success',
      'ONLINE_BANKING': 'primary',
      'OTHER': 'secondary',
    };
    return colorMap[method] || 'default';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: '#111827',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            mb: 2,
          }}
        >
          Payments Management
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#6b7280',
            fontSize: '1.1rem',
            maxWidth: '600px',
          }}
        >
          Monitor and manage payment transactions across all properties and reservations.
        </Typography>
      </Box>

      {/* Payment Cards */}
      {payments.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <PaymentIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
              No payments found
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              Payment transactions will appear here when guests make payments
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {payments.map((payment) => (
            <Card
              key={payment.id}
              sx={{
                borderRadius: 0,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#111827',
                          fontSize: '1.5rem',
                        }}
                      >
                        {formatCurrency(payment.amount, payment.currency)}
                      </Typography>
                      <Chip
                        label={payment.status}
                        color={getPaymentStatusColor(payment.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                      <Chip
                        label={payment.method.replace('_', ' ')}
                        color={getPaymentMethodColor(payment.method)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>

                    {payment.transactionId && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6b7280',
                          mb: 1,
                          fontFamily: 'monospace',
                        }}
                      >
                        Transaction ID: {payment.transactionId}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Reservation Information */}
                {payment.reservation && (
                  <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <ReceiptIcon sx={{ color: '#6b7280' }} />
                      <Typography sx={{ fontWeight: 600, color: '#111827' }}>
                        Reservation: {payment.reservation.confirmationNumber}
                      </Typography>
                    </Box>
                    
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {payment.reservation.guest.firstName} {payment.reservation.guest.lastName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          ({payment.reservation.guest.email})
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HotelIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {payment.reservation.businessUnit.displayName}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}

                {/* Line Items */}
                {payment.lineItems.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 2 }}>
                      Payment Breakdown:
                    </Typography>
                    {payment.lineItems.map((item) => (
                      <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {item.description} (x{item.quantity})
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#111827', fontWeight: 600 }}>
                          {formatCurrency(item.totalAmount, payment.currency)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Payment Description */}
                {payment.description && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 1 }}>
                      Description:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {payment.description}
                    </Typography>
                  </Box>
                )}

                {/* Metadata */}
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                    Created: {formatDate(payment.createdAt)}
                  </Typography>
                  {payment.processedAt && (
                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                      Processed: {formatDate(payment.processedAt)}
                    </Typography>
                  )}
                  {payment.paymentIntentId && (
                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                      Intent: {payment.paymentIntentId}
                    </Typography>
                  )}
                </Stack>

                <CardActions sx={{ p: 0, pt: 2, justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                      Last updated: {formatDate(payment.updatedAt)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {payment.status !== 'REFUNDED' && payment.status === 'SUCCEEDED' && (
                      <Button
                        size="small"
                        startIcon={<RefundIcon />}
                        onClick={() => {
                          setActionDialog({ open: true, payment, action: 'refund' });
                        }}
                        disabled={loading === payment.id}
                        sx={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          '&:hover': { backgroundColor: '#b91c1c' },
                        }}
                      >
                        Refund
                      </Button>
                    )}
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setNewStatus(payment.status);
                        setActionDialog({ open: true, payment, action: 'status' });
                      }}
                      disabled={loading === payment.id}
                      sx={{
                        backgroundColor: '#111827',
                        color: 'white',
                        '&:hover': { backgroundColor: '#1f2937' },
                      }}
                    >
                      Update Status
                    </Button>
                    <IconButton
                      onClick={() => router.push(`/admin/operations/payments/${payment.id}`)}
                      sx={{ color: '#6b7280' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Action Dialogs */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, payment: null, action: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          {actionDialog.action === 'status' ? 'Update Payment Status' : 'Refund Payment'}
        </DialogTitle>
        <DialogContent>
          {actionDialog.action === 'status' ? (
            <Box sx={{ pt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as PaymentStatus)}
                  label="Payment Status"
                  sx={{ borderRadius: 0 }}
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="PROCESSING">Processing</MenuItem>
                  <MenuItem value="SUCCEEDED">Succeeded</MenuItem>
                  <MenuItem value="FAILED">Failed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                  <MenuItem value="REFUNDED">Refunded</MenuItem>
                  <MenuItem value="PARTIAL">Partial</MenuItem>
                  <MenuItem value="PAID">Paid</MenuItem>
                </Select>
              </FormControl>
            </Box>
          ) : (
            <Box sx={{ pt: 2 }}>
              <Typography sx={{ mb: 2 }}>
                Are you sure you want to refund this payment?
              </Typography>
              <TextField
                label="Refund Reason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                multiline
                rows={3}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                  },
                }}
              />
            </Box>
          )}

          {actionDialog.payment && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                {formatCurrency(actionDialog.payment.amount, actionDialog.payment.currency)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {actionDialog.payment.reservation?.confirmationNumber || 'No reservation'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {actionDialog.payment.method.replace('_', ' ')} • {formatDate(actionDialog.payment.createdAt)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setActionDialog({ open: false, payment: null, action: null })}
            sx={{ color: '#6b7280' }}
          >
            Cancel
          </Button>
          <Button
            onClick={actionDialog.action === 'status' ? handleUpdateStatus : handleRefund}
            variant="contained"
            disabled={loading === actionDialog.payment?.id}
            sx={{
              backgroundColor: actionDialog.action === 'refund' ? '#dc2626' : '#111827',
              '&:hover': {
                backgroundColor: actionDialog.action === 'refund' ? '#b91c1c' : '#1f2937'
              },
            }}
          >
            {loading === actionDialog.payment?.id ?
              `${actionDialog.action === 'status' ? 'Updating' : 'Processing'}...` :
              actionDialog.action === 'status' ? 'Update Status' : 'Process Refund'
            }
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PaymentListPage;