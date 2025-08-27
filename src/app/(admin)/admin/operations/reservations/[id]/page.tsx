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
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { ReservationData, getReservationById } from '../../../../../../../lib/actions/reservations';
import { ReservationStatus } from '@prisma/client';
import { cancelReservation, confirmReservation } from '../../../../../../../lib/actions/reservation-management';

const ReservationDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const reservationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'confirm' | 'cancel' | 'update' | null;
  }>({
    open: false,
    action: null,
  });
  const [cancelReason, setCancelReason] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadReservation = async () => {
      try {
        const reservationData = await getReservationById(reservationId);
        if (reservationData) {
          setReservation(reservationData);
        } else {
          setSnackbar({
            open: true,
            message: 'Reservation not found',
            severity: 'error',
          });
          router.push('/admin/operations/reservations');
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Failed to load reservation.`,
          severity: 'error',
        });
        console.error('Error loading reservation:', error);
      } finally {
        setLoading(false);
      }
    };

    if (reservationId) {
      loadReservation();
    }
  }, [reservationId, router]);

  const handleConfirm = async () => {
    if (!reservation) return;

    setActionLoading(true);
    try {
      const result = await confirmReservation(reservation.id);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Reservation confirmed successfully',
          severity: 'success',
        });
        router.refresh(); // Re-fetch data from the server
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to confirm reservation',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `An unexpected error occurred while confirming reservation.`,
        severity: 'error',
      });
      console.error('Error confirming reservation:', error);
    } finally {
      setActionLoading(false);
      setActionDialog({ open: false, action: null });
    }
  };

  const handleCancel = async () => {
    if (!reservation) return;

    setActionLoading(true);
    try {
      const result = await cancelReservation(reservation.id, cancelReason);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Reservation cancelled successfully',
          severity: 'success',
        });
        router.refresh(); // Re-fetch data from the server
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to cancel reservation',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `An unexpected error occurred while cancelling reservation.`,
        severity: 'error',
      });
      console.error('Error cancelling reservation:', error);
    } finally {
      setActionLoading(false);
      setActionDialog({ open: false, action: null });
      setCancelReason('');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getStatusColor = (status: ReservationStatus) => {
    const colorMap: Record<ReservationStatus, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      'PENDING': 'warning',
      'PROVISIONAL': 'warning',
      'INQUIRY': 'info',
      'CONFIRMED': 'success',
      'CHECKED_IN': 'info',
      'CHECKED_OUT': 'primary',
      'CANCELLED': 'error',
      'NO_SHOW': 'error',
      'WALKED_IN': 'info',
    };
    return colorMap[status] || 'default';
  };

  const getPaymentStatusColor = (status: string) => {
    const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      'SUCCEEDED': 'success',
      'PAID': 'success',
      'PENDING': 'warning',
      'FAILED': 'error',
      'CANCELLED': 'error',
      'REFUNDED': 'secondary',
    };
    return colorMap[status] || 'default';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography>Loading reservation...</Typography>
        </Box>
      </Container>
    );
  }

  if (!reservation) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">Reservation not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => router.push('/admin/operations/reservations')}
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
            Reservation Details
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
          View and manage reservation information
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Reservation Overview */}
        <Card sx={{ borderRadius: 0, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#111827',
                    mb: 1,
                  }}
                >
                  {reservation.confirmationNumber}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={reservation.status}
                    color={getStatusColor(reservation.status)}
                    sx={{ textTransform: 'capitalize' }}
                  />
                  {reservation.paymentStatus === 'SUCCEEDED' && (
                    <Chip
                      icon={<PaymentIcon />}
                      label="Paid"
                      color="success"
                    />
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {reservation.status === 'PROVISIONAL' && (
                  <Button
                    startIcon={<CheckIcon />}
                    onClick={() => setActionDialog({ open: true, action: 'confirm' })}
                    sx={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      '&:hover': { backgroundColor: '#059669' },
                    }}
                  >
                    Confirm
                  </Button>
                )}
                {reservation.status !== 'CANCELLED' && reservation.status !== 'CHECKED_OUT' && (
                  <Button
                    startIcon={<CancelIcon />}
                    onClick={() => setActionDialog({ open: true, action: 'cancel' })}
                    sx={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      '&:hover': { backgroundColor: '#b91c1c' },
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#111827',
                mb: 2,
                fontSize: '1.5rem',
              }}
            >
              {formatCurrency(Number(reservation.totalAmount), reservation.currency)}
            </Typography>
          </CardContent>
        </Card>

        {/* Guest Information */}
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
              Guest Information
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar sx={{ width: 60, height: 60, backgroundColor: '#111827' }}>
                <PersonIcon sx={{ fontSize: 30 }} />
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: '#111827',
                    fontSize: '1.25rem',
                    mb: 0.5,
                  }}
                >
                  {reservation.guest.firstName} {reservation.guest.lastName}
                </Typography>
                <Typography sx={{ color: '#6b7280', mb: 0.5 }}>
                  {reservation.guest.email}
                </Typography>
                {reservation.guest.phone && (
                  <Typography sx={{ color: '#6b7280', mb: 0.5 }}>
                    {reservation.guest.phone}
                  </Typography>
                )}
                {reservation.guest.country && (
                  <Typography sx={{ color: '#6b7280' }}>
                    {reservation.guest.country}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Stay Details */}
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
              Stay Details
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              <Box sx={{ flex: 1 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalendarIcon sx={{ color: '#6b7280' }} />
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#111827' }}>
                        Check-in: {formatDate(reservation.checkInDate)}
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: '#111827' }}>
                        Check-out: {formatDate(reservation.checkOutDate)}
                      </Typography>
                      <Typography sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {reservation.nights} nights
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocationIcon sx={{ color: '#6b7280' }} />
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#111827' }}>
                        {reservation.businessUnit.displayName}
                      </Typography>
                      <Typography sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {reservation.businessUnit.city}, {reservation.businessUnit.country}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PersonIcon sx={{ color: '#6b7280' }} />
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#111827' }}>
                        {reservation.adults + reservation.children} guests
                      </Typography>
                      <Typography sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {reservation.adults} adults, {reservation.children} children
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827', mb: 2 }}>
                  Room Details
                </Typography>
                {reservation.rooms.map((room) => (
                  <Box key={room.id} sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: '#111827' }}>
                      Room {room.room?.roomNumber || 'Not Assigned'}
                    </Typography>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      {room.room?.roomType.name || 'Not Specified'}
                    </Typography>
                    <Typography sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      {formatCurrency(Number(room.baseRate), reservation.currency)}/night
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>
                      Total: {formatCurrency(Number(room.totalAmount), reservation.currency)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Payment Information */}
        {reservation.payments.length > 0 && (
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
                Payment History
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {reservation.payments.map((payment) => (
                  <Box key={payment.id} sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: '#111827' }}>
                          {formatCurrency(Number(payment.amount), payment.currency)}
                        </Typography>
                        <Typography sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          {payment.method || 'Unknown method'} • {formatDateTime(payment.createdAt)}
                        </Typography>
                      </Box>
                      <Chip
                        label={payment.status}
                        color={getPaymentStatusColor(payment.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Special Requests & Notes */}
        {(reservation.specialRequests || reservation.internalNotes) && (
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

              {reservation.specialRequests && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 1 }}>
                    Special Requests:
                  </Typography>
                  <Typography sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                    {reservation.specialRequests}
                  </Typography>
                </Box>
              )}

              {reservation.internalNotes && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 1 }}>
                    Internal Notes:
                  </Typography>
                  <Typography sx={{ color: '#6b7280' }}>
                    {reservation.internalNotes}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
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
              Reservation Metadata
            </Typography>

            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Created: {formatDateTime(reservation.createdAt)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Last Updated: {formatDateTime(reservation.updatedAt)}
              </Typography>
              {reservation.source && (
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  Source: {reservation.source}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Action Dialogs */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, action: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          {actionDialog.action === 'confirm' ? 'Confirm Reservation' : 'Cancel Reservation'}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to {actionDialog.action} this reservation?
          </Typography>

          {actionDialog.action === 'cancel' && (
            <TextField
              label="Cancellation Reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
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
          )}

          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
              {reservation.confirmationNumber}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              {reservation.guest.firstName} {reservation.guest.lastName}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setActionDialog({ open: false, action: null })}
            sx={{ color: '#6b7280' }}
          >
            Cancel
          </Button>
          <Button
            onClick={actionDialog.action === 'confirm' ? handleConfirm : handleCancel}
            variant="contained"
            disabled={actionLoading}
            sx={{
              backgroundColor: actionDialog.action === 'confirm' ? '#10b981' : '#dc2626',
              '&:hover': {
                backgroundColor: actionDialog.action === 'confirm' ? '#059669' : '#b91c1c'
              },
            }}
          >
            {actionLoading ?
              `${actionDialog.action === 'confirm' ? 'Confirming' : 'Cancelling'}...` :
              actionDialog.action === 'confirm' ? 'Confirm' : 'Cancel Reservation'
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

export default ReservationDetailPage;