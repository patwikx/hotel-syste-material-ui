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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { deleteGuest, GuestData, toggleGuestVipStatus } from '../../../../../../lib/actions/guest-management';

interface GuestListPageProps {
  initialGuests: GuestData[];
}

const GuestListPage: React.FC<GuestListPageProps> = ({ initialGuests }) => {
  const router = useRouter();
  const [guests, setGuests] = useState<GuestData[]>(initialGuests);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; guest: GuestData | null }>({
    open: false,
    guest: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteDialog.guest) return;

    setLoading('delete');
    try {
      const result = await deleteGuest(deleteDialog.guest.id);
      if (result.success) {
        setGuests(prev => prev.filter(g => g.id !== deleteDialog.guest!.id));
        setSnackbar({
          open: true,
          message: 'Guest deleted successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to delete guest',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while deleting',
        severity: 'error',
      });
    } finally {
      setLoading(null);
      setDeleteDialog({ open: false, guest: null });
    }
  };

  const handleToggleVip = async (guestId: string, currentVipStatus: boolean) => {
    setLoading(guestId);
    try {
      const result = await toggleGuestVipStatus(guestId, !currentVipStatus);
      if (result.success) {
        setGuests(prev => prev.map(g =>
          g.id === guestId ? { ...g, vipStatus: !currentVipStatus } : g
        ));
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to update VIP status',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while updating VIP status',
        severity: 'error',
      });
    } finally {
      setLoading(null);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not provided';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getGuestInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: '#111827',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            Guest Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/operations/guests/new')}
            sx={{
              backgroundColor: '#111827',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '0.875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: '#1f2937',
              },
            }}
          >
            Create New Guest
          </Button>
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: '#6b7280',
            fontSize: '1.1rem',
            maxWidth: '600px',
          }}
        >
          Manage guest profiles, preferences, and contact information across all properties.
        </Typography>
      </Box>

      {/* Guest Cards */}
      {guests.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <PersonIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
              No guests found
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
              Guest profiles will appear here when reservations are made
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/operations/guests/new')}
              sx={{
                backgroundColor: '#111827',
                '&:hover': { backgroundColor: '#1f2937' },
              }}
            >
              Create Guest
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {guests.map((guest) => (
            <Card
              key={guest.id}
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
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                {/* Avatar Section */}
                <Box
                  sx={{
                    width: { xs: '100%', md: '200px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                    p: 3,
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        fontSize: '2rem',
                        fontWeight: 700,
                        backgroundColor: guest.vipStatus ? '#fbbf24' : '#111827',
                      }}
                    >
                      {getGuestInitials(guest.firstName, guest.lastName)}
                    </Avatar>
                    {guest.vipStatus && (
                      <Chip
                        icon={<StarIcon />}
                        label="VIP"
                        size="small"
                        sx={{
                          backgroundColor: '#fbbf24',
                          color: 'white',
                          fontSize: '0.75rem',
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, p: 3 }}>
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: '#111827',
                            mb: 1,
                            fontSize: '1.25rem',
                          }}
                        >
                          {guest.firstName} {guest.lastName}
                        </Typography>

                        <Stack spacing={1} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                              {guest.email}
                            </Typography>
                          </Box>
                          {guest.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PhoneIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                {guest.phone}
                              </Typography>
                            </Box>
                          )}
                          {guest.country && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocationIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                {guest.city && `${guest.city}, `}{guest.country}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    </Box>

                    {/* Guest Statistics */}
                    <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>
                          {guest._count.reservations}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>
                          Reservations
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>
                          {guest._count.stays}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>
                          Stays
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Additional Information */}
                    <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      {guest.nationality && (
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          Nationality: {guest.nationality}
                        </Typography>
                      )}
                      {guest.loyaltyNumber && (
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          Loyalty: {guest.loyaltyNumber}
                        </Typography>
                      )}
                      {guest.dateOfBirth && (
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          DOB: {formatDate(guest.dateOfBirth)}
                        </Typography>
                      )}
                    </Stack>

                    {/* Preferences */}
                    {guest.preferences && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 1 }}>
                          Preferences:
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                          {JSON.stringify(guest.preferences)}
                        </Typography>
                      </Box>
                    )}

                    <CardActions sx={{ p: 0, pt: 2, justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => handleToggleVip(guest.id, guest.vipStatus)}
                          disabled={loading === guest.id}
                          sx={{
                            color: guest.vipStatus ? '#fbbf24' : '#9ca3af',
                            '&:hover': {
                              backgroundColor: guest.vipStatus ? 'rgba(251, 191, 36, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                            },
                          }}
                        >
                          {guest.vipStatus ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => router.push(`/admin/operations/guests/${guest.id}`)}
                          sx={{ color: '#6b7280' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => setDeleteDialog({ open: true, guest })}
                          sx={{ color: '#dc2626' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </CardContent>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, guest: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          Delete Guest
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this guest profile? This action cannot be undone.
          </Typography>
          {deleteDialog.guest && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                {deleteDialog.guest.firstName} {deleteDialog.guest.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {deleteDialog.guest.email}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, guest: null })}
            sx={{ color: '#6b7280' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={loading === 'delete'}
            sx={{
              backgroundColor: '#dc2626',
              '&:hover': { backgroundColor: '#b91c1c' },
            }}
          >
            {loading === 'delete' ? 'Deleting...' : 'Delete'}
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

export default GuestListPage;