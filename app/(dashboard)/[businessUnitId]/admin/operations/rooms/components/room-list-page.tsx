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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Bed as BedIcon,
  CleaningServices as CleaningIcon,
  Build as MaintenanceIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { RoomStatus } from '@prisma/client';
import { deleteRoom, RoomData, toggleRoomStatus, updateRoomStatus } from '../../../../../../lib/actions/room-management';


interface RoomListPageProps {
  initialRooms: RoomData[];
}

const RoomListPage: React.FC<RoomListPageProps> = ({ initialRooms }) => {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomData[]>(initialRooms);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; room: RoomData | null }>({
    open: false,
    room: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteDialog.room) return;

    setLoading('delete');
    try {
      const result = await deleteRoom(deleteDialog.room.id);
      if (result.success) {
        setRooms(prev => prev.filter(r => r.id !== deleteDialog.room!.id));
        setSnackbar({
          open: true,
          message: 'Room deleted successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to delete room',
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
      setDeleteDialog({ open: false, room: null });
    }
  };

  const handleToggleStatus = async (roomId: string, currentStatus: boolean) => {
    setLoading(roomId);
    try {
      const result = await toggleRoomStatus(roomId, !currentStatus);
      if (result.success) {
        setRooms(prev => prev.map(r => 
          r.id === roomId ? { ...r, isActive: !currentStatus } : r
        ));
        setSnackbar({
          open: true,
          message: `Room ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
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

  const handleStatusChange = async (roomId: string, newStatus: RoomStatus) => {
    setLoading(roomId);
    try {
      const result = await updateRoomStatus(roomId, newStatus);
      if (result.success) {
        setRooms(prev => prev.map(r => 
          r.id === roomId ? { ...r, status: newStatus } : r
        ));
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to update room status',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while updating room status',
        severity: 'error',
      });
    } finally {
      setLoading(null);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
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

  const getRoomStatusColor = (status: RoomStatus) => {
    const colorMap: Record<RoomStatus, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      'AVAILABLE': 'success',
      'OCCUPIED': 'primary',
      'MAINTENANCE': 'warning',
      'OUT_OF_ORDER': 'error',
      'CLEANING': 'info',
      'RESERVED': 'secondary',
    };
    return colorMap[status] || 'default';
  };

  const getRoomStatusIcon = (status: RoomStatus) => {
    switch (status) {
      case 'CLEANING':
        return <CleaningIcon sx={{ fontSize: 16 }} />;
      case 'MAINTENANCE':
      case 'OUT_OF_ORDER':
        return <MaintenanceIcon sx={{ fontSize: 16 }} />;
      default:
        return <BedIcon sx={{ fontSize: 16 }} />;
    }
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
            Rooms Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/operations/rooms/new')}
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
            Create New Room
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
          Manage room inventory, status, and assignments across all properties.
        </Typography>
      </Box>

      {/* Room Cards */}
      {rooms.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <BedIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
              No rooms found
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
              Create your first room to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/operations/rooms/new')}
              sx={{
                backgroundColor: '#111827',
                '&:hover': { backgroundColor: '#1f2937' },
              }}
            >
              Create Room
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {rooms.map((room) => (
            <Card
              key={room.id}
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
                        Room {room.roomNumber}
                      </Typography>
                      <Chip
                        icon={getRoomStatusIcon(room.status)}
                        label={room.status.replace('_', ' ')}
                        color={getRoomStatusColor(room.status)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                      <Chip
                        label={room.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={room.isActive ? 'success' : 'default'}
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
                      {room.roomType.name} • {room.businessUnit.displayName}
                    </Typography>

                    {room.roomType.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6b7280',
                          mb: 2,
                        }}
                      >
                        {room.roomType.description}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: '#111827',
                        fontSize: '1.25rem',
                        mb: 0.5,
                      }}
                    >
                      {formatCurrency(room.roomType.baseRate, room.roomType.currency)}
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

                {/* Room Details */}
                <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                  {room.floor && (
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>
                        Floor
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: '#111827' }}>
                        {room.floor}
                      </Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>
                      Last Cleaned
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>
                      {formatDate(room.lastCleaned)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>
                      Last Maintenance
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>
                      {formatDate(room.lastMaintenance)}
                    </Typography>
                  </Box>
                </Stack>

                {room.notes && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#111827', fontWeight: 600, mb: 1 }}>
                      Notes:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                      {room.notes}
                    </Typography>
                  </Box>
                )}

                <CardActions sx={{ p: 0, pt: 2, justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={room.isActive}
                          onChange={() => handleToggleStatus(room.id, room.isActive)}
                          disabled={loading === room.id}
                          size="small"
                        />
                      }
                      label="Active"
                      sx={{ mr: 2 }}
                    />

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={room.status}
                        onChange={(e) => handleStatusChange(room.id, e.target.value as RoomStatus)}
                        label="Status"
                        disabled={loading === room.id}
                        sx={{ borderRadius: 0 }}
                      >
                        <MenuItem value="AVAILABLE">Available</MenuItem>
                        <MenuItem value="OCCUPIED">Occupied</MenuItem>
                        <MenuItem value="CLEANING">Cleaning</MenuItem>
                        <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
                        <MenuItem value="OUT_OF_ORDER">Out of Order</MenuItem>
                        <MenuItem value="RESERVED">Reserved</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => router.push(`/admin/operations/rooms/${room.id}`)}
                      sx={{ color: '#6b7280' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setDeleteDialog({ open: true, room })}
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
        onClose={() => setDeleteDialog({ open: false, room: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          Delete Room
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete Room {deleteDialog.room?.roomNumber}? This action cannot be undone.
          </Typography>
          {deleteDialog.room && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                Room {deleteDialog.room.roomNumber}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {deleteDialog.room.roomType.name} • {deleteDialog.room.businessUnit.displayName}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, room: null })}
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

export default RoomListPage;