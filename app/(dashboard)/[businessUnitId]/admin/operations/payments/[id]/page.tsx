'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  IconButton,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Hotel as HotelIcon,
  Undo as RefundIcon,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { PaymentStatus } from '@prisma/client';
import { getPaymentById, PaymentData, refundPayment } from '../../../../../../lib/actions/payment-management';

const PaymentDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const paymentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [refundDialog, setRefundDialog] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadPayment = async () => {
      try {
        const paymentData = await getPaymentById(paymentId);
        if (paymentData) {
          setPayment(paymentData);
        } else {
          setSnackbar({
            open: true,
            message: 'Payment not found',
            severity: 'error',
          });
          router.push('/admin/operations/payments');
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to load payment details',
          severity: 'error',
        });
        console.error('Error loading payment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      loadPayment();
    }
  }, [paymentId, router]);

  const handleRefund = async () => {
    if (!payment) return;

    setActionLoading(true);
    try {
      const result = await refundPayment(payment.id, refundReason);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Payment refunded successfully',
          severity: 'success',
        });
        router.refresh();
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
        message: 'An unexpected error occurred while processing refund',
        severity: 'error',
      });
      console.error('Error refunding payment:', error);
    } finally {
      setActionLoading(false);
      setRefundDialog(false);
      setRefundReason('');
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not processed';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
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

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography>Loading payment details...</Typography>
        </Box>
      </Container>
    );
  }

  if (!payment) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">Payment not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => router.push('/admin/operations/payments')}
            sx={{ mr: 2, color: '#6b7280' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: '#111827',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            Payment Details
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: '#6b7280',
            fontSize: '1.1rem',
            ml: 6,
          }}
        >
          View and manage payment transaction details
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Payment Overview */}
        <Card sx={{ borderRadius: 0, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#111827',
                    mb: 1,
                  }}
                >
                  {formatCurrency(payment.amount, payment.currency)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={payment.status}
                    color={getPaymentStatusColor(payment.status)}
                    sx={{ textTransform: 'capitalize' }}
                  />
                  <Chip
                    icon={<PaymentIcon />}
                    label={payment.method.replace('_', ' ')}
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {payment.status === 'SUCCEEDED' && payment.status !== 'REFUNDED' && (
                  <Button
                    startIcon={<RefundIcon />}
                    onClick={() => setRefundDialog(true)}
                    sx={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      '&:hover': { backgroundColor: '#b91c1c' },
                    }}
                  >
                    Refund
                  </Button>
                )}
              </Box>
            </Box>

            {payment.transactionId && (
              <Typography
                sx={{
                  color: '#6b7280',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  mb: 1,
                }}
              >
                Transaction ID: {payment.transactionId}
              </Typography>
            )}

            {payment.paymentIntentId && (
              <Typography
                sx={{
                  color: '#6b7280',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}
              >
                Payment Intent: {payment.paymentIntentId}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Reservation Information */}
        {payment.reservation && (
          <Card sx={{ borderRadius: 0, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#111827',
                  mb: 3,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Reservation Information
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <ReceiptIcon sx={{ fontSize: 40, color: '#6b7280' }} />
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: '#111827',
                      fontSize: '1.25rem',
                      mb: 0.5,
                    }}
                  >
                    {payment.reservation.confirmationNumber}
                  </Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    Reservation Reference
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PersonIcon sx={{ color: '#6b7280' }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#111827' }}>
                      {payment.reservation.guest.firstName} {payment.reservation.guest.lastName}
                    </Typography>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      {payment.reservation.guest.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <HotelIcon sx={{ color: '#6b7280' }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#111827' }}>
                      {payment.reservation.businessUnit.displayName}
                    </Typography>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      Property
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Payment Breakdown */}
        {payment.lineItems.length > 0 && (
          <Card sx={{ borderRadius: 0, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#111827',
                  mb: 3,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Payment Breakdown
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {payment.lineItems.map((item, index) => (
                  <Box key={item.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600, color: '#111827', mb: 0.5 }}>
                          {item.description}
                        </Typography>
                        <Typography sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          Quantity: {item.quantity} × {formatCurrency(item.unitPrice, payment.currency)}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '1.1rem' }}>
                        {formatCurrency(item.totalAmount, payment.currency)}
                      </Typography>
                    </Box>
                    {index < payment.lineItems.length - 1 && <Divider />}
                  </Box>
                ))}
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '1.25rem' }}>
                    Total Amount
                  </Typography>
                  <Typography sx={{ fontWeight: 900, color: '#111827', fontSize: '1.5rem' }}>
                    {formatCurrency(payment.amount, payment.currency)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Payment Details */}
        <Card sx={{ borderRadius: 0, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#111827',
                mb: 3,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Payment Details
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 0.5 }}>
                  Payment Method:
                </Typography>
                <Typography sx={{ color: '#6b7280' }}>
                  {payment.method.replace('_', ' ')}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 0.5 }}>
                  Status:
                </Typography>
                <Chip
                  label={payment.status}
                  color={getPaymentStatusColor(payment.status)}
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>

              {payment.description && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 0.5 }}>
                    Description:
                  </Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    {payment.description}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 0.5 }}>
                  Created:
                </Typography>
                <Typography sx={{ color: '#6b7280' }}>
                  {formatDate(payment.createdAt)}
                </Typography>
              </Box>

              {payment.processedAt && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 0.5 }}>
                    Processed:
                  </Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    {formatDate(payment.processedAt)}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 0.5 }}>
                  Last Updated:
                </Typography>
                <Typography sx={{ color: '#6b7280' }}>
                  {formatDate(payment.updatedAt)}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Metadata */}
        {payment.metadata && Object.keys(payment.metadata).length > 0 && (
          <Card sx={{ borderRadius: 0, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#111827',
                  mb: 3,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Additional Information
              </Typography>

              <Box sx={{ backgroundColor: '#f8f9fa', p: 3, borderRadius: 1 }}>
                <pre style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                  {JSON.stringify(payment.metadata, null, 2)}
                </pre>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Refund Dialog */}
      <Dialog
        open={refundDialog}
        onClose={() => setRefundDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          Refund Payment
        </DialogTitle>
        <DialogContent>
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
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 0,
              },
            }}
          />

          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
              {formatCurrency(payment.amount, payment.currency)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              {payment.reservation?.confirmationNumber || 'No reservation'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setRefundDialog(false)}
            sx={{ color: '#6b7280' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRefund}
            variant="contained"
            disabled={actionLoading}
            sx={{
              backgroundColor: '#dc2626',
              '&:hover': { backgroundColor: '#b91c1c' },
            }}
          >
            {actionLoading ? 'Processing...' : 'Process Refund'}
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

export default PaymentDetailPage;