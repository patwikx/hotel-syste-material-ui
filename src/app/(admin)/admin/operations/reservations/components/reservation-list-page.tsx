'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
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
  Avatar,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  BookOnline as ReservationIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ReservationData } from '../../../../../../../lib/actions/reservations';
import { ReservationStatus, PaymentStatus } from '@prisma/client';
import { cancelReservation, confirmReservation } from '../../../../../../../lib/actions/reservation-management';

interface ReservationListPageProps {
  initialReservations: ReservationData[];
}

const ReservationListPage: React.FC<ReservationListPageProps> = ({ initialReservations }) => {
  const router = useRouter();
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    reservation: ReservationData | null;
    action: 'confirm' | 'cancel' | null;
  }>({
    open: false,
    reservation: null,
    action: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!actionDialog.reservation) return;

    setLoadingId(actionDialog.reservation.id);
    try {
      const result = await confirmReservation(actionDialog.reservation.id);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Reservation confirmed successfully',
          severity: 'success',
        });
        router.refresh();
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
        message: 'An unexpected error occurred while confirming reservation.',
        severity: 'error',
      });
    } finally {
      setLoadingId(null);
      setActionDialog({ open: false, reservation: null, action: null });
    }
  };

  const handleCancel = async () => {
    if (!actionDialog.reservation) return;

    setLoadingId(actionDialog.reservation.id);
    try {
      const result = await cancelReservation(actionDialog.reservation.id, 'Cancelled by admin');
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Reservation cancelled successfully',
          severity: 'success',
        });
        router.refresh();
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
        message: 'An unexpected error occurred while cancelling reservation.',
        severity: 'error',
      });
    } finally {
      setLoadingId(null);
      setActionDialog({ open: false, reservation: null, action: null });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(Number(amount));
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      [ReservationStatus.PENDING]: 'warning',
      [ReservationStatus.CONFIRMED]: 'success',
      [ReservationStatus.CHECKED_IN]: 'info',
      [ReservationStatus.CHECKED_OUT]: 'primary',
      [ReservationStatus.CANCELLED]: 'error',
      [ReservationStatus.NO_SHOW]: 'error',
    };
    return colorMap[status] || 'default';
  };

  const getPaymentStatusColor = (status: string) => {
    const colorMap: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
      [PaymentStatus.SUCCEEDED]: 'success',
      [PaymentStatus.PAID]: 'success',
      [PaymentStatus.PENDING]: 'warning',
      [PaymentStatus.PARTIAL]: 'info',
      [PaymentStatus.FAILED]: 'error',
    };
    return colorMap[status] || 'default';
  };

  const reservations = initialReservations || [];

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
          Reservations Management
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#6b7280',
            fontSize: '1.1rem',
            maxWidth: '600px',
          }}
        >
          Manage guest reservations, check-ins, check-outs, and booking status across all properties.
        </Typography>
      </Box>

      {/* Reservation Cards */}
      {reservations.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <ReservationIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
              No reservations found
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              Reservations will appear here when guests make bookings
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {reservations.map((reservation) => (
            <Card
              key={reservation.id}
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
                          fontSize: '1.25rem',
                        }}
                      >
                        {reservation.confirmationNumber}
                      </Typography>
                      <Chip
                        label={reservation.status}
                        color={getStatusColor(reservation.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                      <Chip
                        icon={<PaymentIcon />}
                        label={reservation.paymentStatus}
                        color={getPaymentStatusColor(reservation.paymentStatus)}
                        size="small"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Guest Information */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ backgroundColor: '#111827' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: '#111827',
                        fontSize: '1rem',
                      }}
                    >
                      {reservation.guest.firstName} {reservation.guest.lastName}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#6b7280',
                        fontSize: '0.875rem',
                      }}
                    >
                      {reservation.guest.email}
                      {reservation.guest.phone && ` • ${reservation.guest.phone}`}
                      {reservation.guest.country && ` • ${reservation.guest.country}`}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Reservation Details */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 3 }}>
                  {/* Dates & Property */}
                  <Box sx={{ flex: 1 }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                          ({reservation.nights} nights)
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {reservation.businessUnit.displayName}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {reservation.adults + reservation.children} guests ({reservation.adults} adults, {reservation.children} children)
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Rooms */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 1 }}>
                      Rooms:
                    </Typography>
                    {reservation.rooms.map((room) => (
                      <Box key={room.id} sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {room.room?.roomNumber ? `Room ${room.room.roomNumber} - ` : ''} {room.room?.roomType.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          {formatCurrency(room.baseRate, reservation.currency)}/night
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Payment Info */}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 1 }}>
                      Payment:
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#111827', fontWeight: 700, mb: 1 }}>
                      {formatCurrency(reservation.totalAmount, reservation.currency)}
                    </Typography>
                    {reservation.payments.length > 0 && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          Last payment: {formatDate(reservation.payments[0].createdAt)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Special Requests */}
                {reservation.specialRequests && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 1 }}>
                      Special Requests:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                      {reservation.specialRequests}
                    </Typography>
                  </Box>
                )}

                <CardActions sx={{ p: 0, justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                      Created: {formatDate(reservation.createdAt)}
                    </Typography>
                    {reservation.source && (
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        • Source: {reservation.source}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {reservation.status === ReservationStatus.PENDING && (
                      <Button
                        size="small"
                        startIcon={<CheckIcon />}
                        onClick={() => setActionDialog({ open: true, reservation, action: 'confirm' })}
                        disabled={loadingId === reservation.id}
                        sx={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          '&:hover': { backgroundColor: '#059669' },
                        }}
                      >
                        Confirm
                      </Button>
                    )}
                    {reservation.status !== ReservationStatus.CANCELLED && (
                      <Button
                        size="small"
                        startIcon={<CancelIcon />}
                        onClick={() => setActionDialog({ open: true, reservation, action: 'cancel' })}
                        disabled={loadingId === reservation.id}
                        sx={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          '&:hover': { backgroundColor: '#b91c1c' },
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <IconButton
                      onClick={() => router.push(`/admin/operations/reservations/${reservation.id}`)}
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

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, reservation: null, action: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          {actionDialog.action === 'confirm' ? 'Confirm Reservation' : 'Cancel Reservation'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {actionDialog.action} this reservation?
          </Typography>
          {actionDialog.reservation && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                {actionDialog.reservation.confirmationNumber}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {actionDialog.reservation.guest.firstName} {actionDialog.reservation.guest.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {formatDate(actionDialog.reservation.checkInDate)} - {formatDate(actionDialog.reservation.checkOutDate)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setActionDialog({ open: false, reservation: null, action: null })}
            sx={{ color: '#6b7280' }}
          >
            Cancel
          </Button>
          <Button
            onClick={actionDialog.action === 'confirm' ? handleConfirm : handleCancel}
            variant="contained"
            disabled={loadingId === actionDialog.reservation?.id}
            sx={{
              backgroundColor: actionDialog.action === 'confirm' ? '#10b981' : '#dc2626',
              '&:hover': {
                backgroundColor: actionDialog.action === 'confirm' ? '#059669' : '#b91c1c'
              },
            }}
          >
            {loadingId === actionDialog.reservation?.id ?
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

export default ReservationListPage;