'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { RoomStatus } from '@prisma/client';
import { BusinessUnitData, getBusinessUnits } from '../../../../../../lib/actions/business-units';
import { getRoomTypes, RoomTypeData } from '../../../../../../lib/actions/room-type-management';
import { createRoom, CreateRoomData } from '../../../../../../lib/actions/room-management';

interface RoomFormData {
  roomNumber: string;
  floor: number | null;
  status: RoomStatus;
  isActive: boolean;
  notes: string;
  businessUnitId: string;
  roomTypeId: string;
}

const roomStatuses: { value: RoomStatus; label: string }[] = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'OCCUPIED', label: 'Occupied' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OUT_OF_ORDER', label: 'Out of Order' },
  { value: 'CLEANING', label: 'Cleaning' },
  { value: 'RESERVED', label: 'Reserved' },
];

const NewRoomPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitData[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeData[]>([]);
  const [formData, setFormData] = useState<RoomFormData>({
    roomNumber: '',
    floor: null,
    status: 'AVAILABLE',
    isActive: true,
    notes: '',
    businessUnitId: '',
    roomTypeId: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [units, types] = await Promise.all([
          getBusinessUnits(),
          getRoomTypes()
        ]);
        setBusinessUnits(units);
        setRoomTypes(types);
        if (units.length > 0) {
          setFormData(prev => ({ ...prev, businessUnitId: units[0].id }));
        }
        if (types.length > 0) {
          setFormData(prev => ({ ...prev, roomTypeId: types[0].id }));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (field: keyof RoomFormData, value: string | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const roomData: CreateRoomData = {
        ...formData,
        notes: formData.notes || null,
      };

      const result = await createRoom(roomData);

      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Room created successfully',
          severity: 'success',
        });
        router.push('/admin/operations/rooms');
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to create room',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while creating room',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => router.push('/admin/operations/rooms')}
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
            Create New Room
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
          Create a new room for your properties
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Basic Information */}
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
                Basic Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Room Number"
                    value={formData.roomNumber}
                    onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                    required
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                  <TextField
                    label="Floor"
                    type="number"
                    value={formData.floor || ''}
                    onChange={(e) => handleInputChange('floor', e.target.value ? parseInt(e.target.value) : null)}
                    sx={{
                      flex: 1,
                      minWidth: 150,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Property</InputLabel>
                    <Select
                      value={formData.businessUnitId}
                      onChange={(e) => handleInputChange('businessUnitId', e.target.value)}
                      label="Property"
                      sx={{ borderRadius: 0 }}
                    >
                      {businessUnits.map((unit) => (
                        <MenuItem key={unit.id} value={unit.id}>
                          {unit.displayName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Room Type</InputLabel>
                    <Select
                      value={formData.roomTypeId}
                      onChange={(e) => handleInputChange('roomTypeId', e.target.value)}
                      label="Room Type"
                      sx={{ borderRadius: 0 }}
                    >
                      {roomTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value as RoomStatus)}
                      label="Status"
                      sx={{ borderRadius: 0 }}
                    >
                      {roomStatuses.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <TextField
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  helperText="Any special notes about this room"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Settings */}
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
                Settings
              </Typography>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    />
                  }
                  label="Active"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
            <Button
              type="button"
              onClick={() => router.push('/admin/operations/rooms')}
              sx={{
                color: '#6b7280',
                borderColor: '#6b7280',
                px: 4,
                py: 1.5,
                borderRadius: 0,
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
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
                '&:disabled': {
                  backgroundColor: '#9ca3af',
                },
              }}
            >
              {loading ? 'Creating...' : 'Create Room'}
            </Button>
          </Box>
        </Box>
      </form>

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

export default NewRoomPage;