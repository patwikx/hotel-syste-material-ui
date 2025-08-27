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
  IconButton,
  Alert,
  Snackbar,

} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { EventType, EventStatus } from '@prisma/client';
import { BusinessUnitData, getBusinessUnits } from '../../../../../../../lib/actions/business-units';
import { createEvent, CreateEventData } from '../../../../../../../lib/cms-actions/events-management';


interface EventFormData {
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  venueDetails: string;
  venueCapacity: number | null;
  isFree: boolean;
  ticketPrice: number | null;
  currency: string;
  requiresBooking: boolean;
  maxAttendees: number | null;
  businessUnitId: string;
  isPublished: boolean;
  isFeatured: boolean;
  isPinned: boolean;
  sortOrder: number;
}

const eventTypes: { value: EventType; label: string }[] = [
  { value: 'WEDDING', label: 'Wedding' },
  { value: 'CONFERENCE', label: 'Conference' },
  { value: 'MEETING', label: 'Meeting' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'CELEBRATION', label: 'Celebration' },
  { value: 'CULTURAL', label: 'Cultural' },
  { value: 'SEASONAL', label: 'Seasonal' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'CORPORATE', label: 'Corporate' },
  { value: 'PRIVATE', label: 'Private' },
];

const eventStatuses: { value: EventStatus; label: string }[] = [
  { value: 'PLANNING', label: 'Planning' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'POSTPONED', label: 'Postponed' },
];

const NewEventPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitData[]>([]);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    slug: '',
    description: '',
    shortDesc: '',
    type: 'CONFERENCE',
    status: 'PLANNING',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    venueDetails: '',
    venueCapacity: null,
    isFree: false,
    ticketPrice: null,
    currency: 'PHP',
    requiresBooking: true,
    maxAttendees: null,
    businessUnitId: '',
    isPublished: false,
    isFeatured: false,
    isPinned: false,
    sortOrder: 0,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const loadBusinessUnits = async () => {
      try {
        const units = await getBusinessUnits();
        setBusinessUnits(units);
        if (units.length > 0) {
          setFormData(prev => ({ ...prev, businessUnitId: units[0].id }));
        }
      } catch (error) {
        console.error('Failed to load business units:', error);
      }
    };

    loadBusinessUnits();
  }, []);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field: keyof EventFormData, value: string | number | boolean) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when title changes
      if (field === 'title' && typeof value === 'string') {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData: CreateEventData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      };

      const result = await createEvent(eventData);

      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Event created successfully',
          severity: 'success',
        });
        router.push('/admin/cms/events');
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to create event',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `An error occurred while creating event: ${error}`,
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
            onClick={() => router.push('/admin/cms/events')}
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
            Create New Event
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
          Create a new event for your properties
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
                <TextField
                  label="Event Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />

                <TextField
                  label="Slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  required
                  fullWidth
                  helperText="URL-friendly version of the title"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />

                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  multiline
                  rows={4}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />

                <TextField
                  label="Short Description"
                  value={formData.shortDesc}
                  onChange={(e) => handleInputChange('shortDesc', e.target.value)}
                  multiline
                  rows={2}
                  fullWidth
                  helperText="Brief description for cards and previews"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Event Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value as EventType)}
                      label="Event Type"
                      sx={{ borderRadius: 0 }}
                    >
                      {eventTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value as EventStatus)}
                      label="Status"
                      sx={{ borderRadius: 0 }}
                    >
                      {eventStatuses.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

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
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Date & Time */}
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
                Date & Time
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                  <TextField
                    label="End Date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Start Time"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                  <TextField
                    label="End Time"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Venue Information */}
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
                Venue Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Venue"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />

                <TextField
                  label="Venue Details"
                  value={formData.venueDetails}
                  onChange={(e) => handleInputChange('venueDetails', e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Venue Capacity"
                    type="number"
                    value={formData.venueCapacity || ''}
                    onChange={(e) => handleInputChange('venueCapacity', e.target.value ? parseInt(e.target.value) : "")}
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                  <TextField
                    label="Max Attendees"
                    type="number"
                    value={formData.maxAttendees || ''}
                    onChange={(e) => handleInputChange('maxAttendees', e.target.value ? parseInt(e.target.value) : "")}
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Pricing & Booking */}
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
                Pricing & Booking
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFree}
                      onChange={(e) => handleInputChange('isFree', e.target.checked)}
                    />
                  }
                  label="Free Event"
                />

                {!formData.isFree && (
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label="Ticket Price"
                      type="number"
                      value={formData.ticketPrice || ''}
                      onChange={(e) => handleInputChange('ticketPrice', e.target.value ? parseFloat(e.target.value) : "")}
                      sx={{
                        flex: 1,
                        minWidth: 200,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                        },
                      }}
                    />
                    <TextField
                      label="Currency"
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      sx={{
                        width: 150,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                        },
                      }}
                    />
                  </Box>
                )}

                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.requiresBooking}
                      onChange={(e) => handleInputChange('requiresBooking', e.target.checked)}
                    />
                  }
                  label="Requires Booking"
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

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Sort Order"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
                  sx={{
                    width: 200,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 4 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isPublished}
                        onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                      />
                    }
                    label="Published"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isFeatured}
                        onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      />
                    }
                    label="Featured"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isPinned}
                        onChange={(e) => handleInputChange('isPinned', e.target.checked)}
                      />
                    }
                    label="Pinned"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
            <Button
              type="button"
              onClick={() => router.push('/admin/cms/events')}
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
              {loading ? 'Creating...' : 'Create Event'}
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

export default NewEventPage;