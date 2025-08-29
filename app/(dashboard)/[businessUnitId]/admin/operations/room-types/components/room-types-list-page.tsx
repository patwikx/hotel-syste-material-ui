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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { deleteRoomType, RoomTypeData, toggleRoomTypeStatus } from '../../../../../../lib/actions/room-type-management';


interface RoomTypeListPageProps {
  initialRoomTypes: RoomTypeData[];
}

const RoomTypeListPage: React.FC<RoomTypeListPageProps> = ({ initialRoomTypes }) => {
  const router = useRouter();
  const [roomTypes, setRoomTypes] = useState<RoomTypeData[]>(initialRoomTypes);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; roomType: RoomTypeData | null }>({
    open: false,
    roomType: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteDialog.roomType) return;

    setLoading('delete');
    try {
      const result = await deleteRoomType(deleteDialog.roomType.id);
      if (result.success) {
        setRoomTypes(prev => prev.filter(rt => rt.id !== deleteDialog.roomType!.id));
        setSnackbar({
          open: true,
          message: 'Room type deleted successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to delete room type',
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
      setDeleteDialog({ open: false, roomType: null });
    }
  };

  const handleToggleStatus = async (roomTypeId: string, currentStatus: boolean) => {
    setLoading(roomTypeId);
    try {
      const result = await toggleRoomTypeStatus(roomTypeId, !currentStatus);
      if (result.success) {
        setRoomTypes(prev => prev.map(rt => 
          rt.id === roomTypeId ? { ...rt, isActive: !currentStatus } : rt
        ));
        setSnackbar({
          open: true,
          message: `Room type ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to update status',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while updating status',
        severity: 'error',
      });
    } finally {
      setLoading(null);
    }
  };

  const formatDate = (date: Date) => {
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
            Room Types Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/operations/room-types/new')}
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
            Create New Room Type
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
          Manage room categories and pricing across all properties.
        </Typography>
      </Box>

      {/* Room Type Cards */}
      {roomTypes.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <CategoryIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
              No room types found
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
              Create your first room type to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/operations/room-types/new')}
              sx={{
                backgroundColor: '#111827',
                '&:hover': { backgroundColor: '#1f2937' },
              }}
            >
              Create Room Type
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {roomTypes.map((roomType) => (
            <Card
              key={roomType.id}
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
                        {roomType.name}
                      </Typography>
                      <Chip
                        label={roomType.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={roomType.isActive ? 'success' : 'default'}
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6b7280',
                        mb: 1,
                        fontWeight: 500,
                      }}
                    >
                      {roomType.businessUnit.displayName}
                    </Typography>

                    {roomType.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6b7280',
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {roomType.description}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: '#111827',
                        fontSize: '1.5rem',
                        mb: 0.5,
                      }}
                    >
                      {formatCurrency(roomType.baseRate, roomType.currency)}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#6b7280',
                        fontSize: '0.875rem',
                      }}
                    >
                      per night
                    </Typography>
                  </Box>
                </Box>

                {/* Room Type Details */}
                <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                      Max {roomType.maxOccupancy} guests
                    </Typography>
                  </Box>
                  {roomType.bedType && (
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                      {roomType.bedType}
                    </Typography>
                  )}
                  {roomType.roomSize && (
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                      {roomType.roomSize} sqm
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ color: '#6b7280' }}>
                    {roomType._count.rooms} rooms
                  </Typography>
                </Stack>

                {/* Amenities */}
                {roomType.amenities.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 1 }}>
                      Amenities:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                      {roomType.amenities.slice(0, 4).map((amenity) => (
                        <Chip
                          key={amenity}
                          label={amenity}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 24 }}
                        />
                      ))}
                      {roomType.amenities.length > 4 && (
                        <Chip
                          label={`+${roomType.amenities.length - 4} more`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 24 }}
                        />
                      )}
                    </Stack>
                  </Box>
                )}

                {/* Metadata */}
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                    Order: {roomType.sortOrder}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                    Updated: {formatDate(roomType.updatedAt)}
                  </Typography>
                </Stack>

                <CardActions sx={{ p: 0, pt: 2, justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={roomType.isActive}
                          onChange={() => handleToggleStatus(roomType.id, roomType.isActive)}
                          disabled={loading === roomType.id}
                          size="small"
                        />
                      }
                      label="Active"
                      sx={{ mr: 2 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => router.push(`/admin/operations/room-types/${roomType.id}`)}
                      sx={{ color: '#6b7280' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setDeleteDialog({ open: true, roomType })}
                      sx={{ color: '#dc2626' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, roomType: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          Delete Room Type
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{deleteDialog.roomType?.name}&quot;? This action cannot be undone.
          </Typography>
          {deleteDialog.roomType && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                {deleteDialog.roomType.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {deleteDialog.roomType.businessUnit.displayName} • {deleteDialog.roomType._count.rooms} rooms
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, roomType: null })}
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

export default RoomTypeListPage;