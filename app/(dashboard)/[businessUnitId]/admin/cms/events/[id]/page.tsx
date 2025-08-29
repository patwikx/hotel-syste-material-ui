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
import { useRouter, useParams } from 'next/navigation';
import { EventType, EventStatus } from '@prisma/client';
import { EventData } from '../../../../../../lib/actions/events';
import { BusinessUnitData, getBusinessUnits } from '../../../../../../lib/actions/business-units';
import { getEventById, updateEvent, UpdateEventData } from '../../../../../../lib/cms-actions/events-management';


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

const EditEventPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState<EventData | null>(null);
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
    const loadData = async () => {
      try {
        const [eventData, units] = await Promise.all([
          getEventById(eventId),
          getBusinessUnits()
        ]);

        setBusinessUnits(units);

        if (eventData) {
          setEvent(eventData);
          setFormData({
            title: eventData.title,
            slug: eventData.slug,
            description: eventData.description,
            shortDesc: eventData.shortDesc || '',
            type: eventData.type as EventType,
            status: eventData.status as EventStatus,
            startDate: new Date(eventData.startDate).toISOString().slice(0, 10),
            endDate: new Date(eventData.endDate).toISOString().slice(0, 10),
            startTime: eventData.startTime || '',
            endTime: eventData.endTime || '',
            venue: eventData.venue,
            venueDetails: eventData.venueDetails || '',
            venueCapacity: eventData.venueCapacity,
            isFree: eventData.isFree,
            ticketPrice: eventData.ticketPrice,
            currency: eventData.currency,
            requiresBooking: eventData.requiresBooking,
            maxAttendees: eventData.maxAttendees,
            businessUnitId: eventData.businessUnit?.id || '',
            isPublished: true, // Assuming published if we can fetch it
            isFeatured: false, // You might want to add this to EventData
            isPinned: false, // You might want to add this to EventData
            sortOrder: 0, // You might want to add this to EventData
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Event not found',
            severity: 'error',
          });
          router.push('/admin/cms/events');
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Failed to load event: ${error}`,
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadData();
    }
  }, [eventId, router]);

  const handleInputChange = (field: keyof EventFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const eventData: UpdateEventData = {
        id: eventId,
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      };

      const result = await updateEvent(eventData);

      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Event updated successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to update event',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `An error occurred while updating event: ${error}`,
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography>Loading event...</Typography>
        </Box>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">Event not found</Alert>
      </Container>
    );
  }

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
            Edit Event
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
          Update event information and settings
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
              disabled={saving}
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
              {saving ? 'Saving...' : 'Save Changes'}
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

export default EditEventPage;