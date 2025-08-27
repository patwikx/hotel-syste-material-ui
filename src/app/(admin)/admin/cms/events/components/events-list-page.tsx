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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { EventData } from '../../../../../../../lib/actions/events';
import { deleteEvent } from '../../../../../../../lib/cms-actions/events-management';


interface EventListPageProps {
  initialEvents: EventData[];
}

const EventListPage: React.FC<EventListPageProps> = ({ initialEvents }) => {
  const router = useRouter();
  const [events, setEvents] = useState<EventData[]>(initialEvents);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; event: EventData | null }>({
    open: false,
    event: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteDialog.event) return;

    setLoading('delete');
    try {
      const result = await deleteEvent(deleteDialog.event.id);
      if (result.success) {
        setEvents(prev => prev.filter(e => e.id !== deleteDialog.event!.id));
        setSnackbar({
          open: true,
          message: 'Event deleted successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to delete event',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `An error occurred while deleting ${error}`,
        severity: 'error',
      });
    } finally {
      setLoading(null);
      setDeleteDialog({ open: false, event: null });
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

  const getEventTypeColor = (type: string) => {
    const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      'WEDDING': 'secondary',
      'CONFERENCE': 'primary',
      'MEETING': 'info',
      'WORKSHOP': 'success',
      'CELEBRATION': 'warning',
      'CULTURAL': 'secondary',
      'SEASONAL': 'success',
      'ENTERTAINMENT': 'warning',
      'CORPORATE': 'primary',
      'PRIVATE': 'info',
    };
    return colorMap[type] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      'PLANNING': 'info',
      'CONFIRMED': 'success',
      'IN_PROGRESS': 'warning',
      'COMPLETED': 'primary',
      'CANCELLED': 'error',
      'POSTPONED': 'warning',
    };
    return colorMap[status] || 'default';
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
            Events Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/cms/events/new')}
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
            Create New Event
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
          Manage events across all properties. Create, edit, and organize events to engage your guests.
        </Typography>
      </Box>

      {/* Event Cards */}
      {events.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <EventIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
              No events found
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
              Create your first event to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/cms/events/new')}
              sx={{
                backgroundColor: '#111827',
                '&:hover': { backgroundColor: '#1f2937' },
              }}
            >
              Create Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {events.map((event) => (
            <Card
              key={event.id}
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
                {/* Image Preview */}
                <Box
                  sx={{
                    width: { xs: '100%', md: '300px' },
                    height: '200px',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {event.images.length > 0 ? (
                    <Box
                      component="img"
                      src={event.images[0].image.originalUrl}
                      alt={event.images[0].image.altText || event.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#9ca3af' }}>
                      <EventIcon sx={{ fontSize: 32 }} />
                      <Typography variant="body2">No Image</Typography>
                    </Box>
                  )}

                  {/* Status Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      display: 'flex',
                      gap: 1,
                      flexDirection: 'column',
                    }}
                  >

                  </Box>

                  {/* Date Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      backgroundColor: 'white',
                      px: 2,
                      py: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      minWidth: '60px',
                    }}
                  >
                    <Typography 
                      sx={{ 
                        fontWeight: 900,
                        color: '#111827',
                        fontSize: '1.25rem',
                        lineHeight: 1,
                      }}
                    >
                      {event.startDate.getDate()}
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontWeight: 700,
                        color: '#6b7280',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        lineHeight: 1,
                      }}
                    >
                      {event.startDate.toLocaleDateString('en-US', { month: 'short' })}
                    </Typography>
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
                          {event.title}
                        </Typography>
                        {event.shortDesc && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#6b7280',
                              mb: 1,
                              fontWeight: 500,
                            }}
                          >
                            {event.shortDesc}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                        <Chip
                          label={event.type.replace('_', ' ')}
                          color={getEventTypeColor(event.type)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                        <Chip
                          label={event.status}
                          color={getStatusColor(event.status)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                    </Box>

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
                      {event.description}
                    </Typography>

                    {/* Event Details */}
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {formatDate(event.startDate)} - {formatDate(event.endDate)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {event.venue}
                          {event.businessUnit && ` • ${event.businessUnit.displayName}`}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Metadata */}
                    <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        Capacity: {event.venueCapacity || 'Unlimited'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        Attendees: {event.currentAttendees}/{event.maxAttendees || '∞'}
                      </Typography>
                      {event.isFree ? (
                        <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                          Free Event
                        </Typography>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          {event.currency} {event.ticketPrice?.toLocaleString()}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ p: 0, pt: 2, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => router.push(`/admin/cms/events/${event.id}`)}
                        sx={{ color: '#6b7280' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => setDeleteDialog({ open: true, event })}
                        sx={{ color: '#dc2626' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardActions>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, event: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          Delete Event
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{deleteDialog.event?.title}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, event: null })}
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

export default EventListPage;