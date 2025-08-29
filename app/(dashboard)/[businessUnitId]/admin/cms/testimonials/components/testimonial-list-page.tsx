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
  Avatar,
  Rating,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  RateReview as TestimonialIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { TestimonialData } from '../../../../../../lib/actions/testimonials';
import { deleteTestimonial, toggleTestimonialFeatured, toggleTestimonialStatus } from '../../../../../../lib/actions/testimonial-actions';


interface TestimonialListPageProps {
  initialTestimonials: TestimonialData[];
}

const TestimonialListPage: React.FC<TestimonialListPageProps> = ({ initialTestimonials }) => {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<TestimonialData[]>(initialTestimonials);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; testimonial: TestimonialData | null }>({
    open: false,
    testimonial: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteDialog.testimonial) return;

    setLoading('delete');
    try {
      const result = await deleteTestimonial(deleteDialog.testimonial.id);
      if (result.success) {
        setTestimonials(prev => prev.filter(t => t.id !== deleteDialog.testimonial!.id));
        setSnackbar({
          open: true,
          message: 'Testimonial deleted successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to delete testimonial',
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
      setDeleteDialog({ open: false, testimonial: null });
    }
  };

  const handleToggleStatus = async (testimonialId: string, currentStatus: boolean) => {
    setLoading(testimonialId);
    try {
      const result = await toggleTestimonialStatus(testimonialId, !currentStatus);
      if (result.success) {
        setTestimonials(prev => prev.map(t => 
          t.id === testimonialId ? { ...t, isActive: !currentStatus } : t
        ));
        setSnackbar({
          open: true,
          message: `Testimonial ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
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
        message: `An error occurred while updating status ${error}`,
        severity: 'error',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleToggleFeatured = async (testimonialId: string, currentFeatured: boolean) => {
    setLoading(testimonialId);
    try {
      const result = await toggleTestimonialFeatured(testimonialId, !currentFeatured);
      if (result.success) {
        setTestimonials(prev => prev.map(t => 
          t.id === testimonialId ? { ...t, isFeatured: !currentFeatured } : t
        ));
        setSnackbar({
          open: true,
          message: `Testimonial ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to update featured status',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `An error occurred while updating featured status ${error}`,
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
    }).format(new Date(date));
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
            Testimonials Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/cms/testimonials/new')}
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
            Create New Testimonial
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
          Manage guest testimonials and reviews to showcase positive experiences and build trust.
        </Typography>
      </Box>

      {/* Testimonial Cards */}
      {testimonials.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <TestimonialIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
              No testimonials found
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
              Create your first testimonial to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/cms/testimonials/new')}
              sx={{
                backgroundColor: '#111827',
                '&:hover': { backgroundColor: '#1f2937' },
              }}
            >
              Create Testimonial
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
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
                      src={testimonial.guestImage || undefined}
                      alt={testimonial.guestName}
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        fontSize: '2rem',
                        fontWeight: 700,
                        backgroundColor: '#111827',
                      }}
                    >
                      {!testimonial.guestImage && 
                        testimonial.guestName.charAt(0).toUpperCase()
                      }
                    </Avatar>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: '#111827',
                        fontSize: '1rem',
                        mb: 0.5,
                      }}
                    >
                      {testimonial.guestName}
                    </Typography>
                    {testimonial.guestCountry && (
                      <Typography
                        sx={{
                          color: '#6b7280',
                          fontSize: '0.875rem',
                        }}
                      >
                        {testimonial.guestCountry}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, p: 3 }}>
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          {testimonial.rating && (
                            <Rating 
                              value={testimonial.rating} 
                              readOnly 
                              size="small"
                              sx={{ color: '#fbbf24' }} 
                            />
                          )}
                          {testimonial.isFeatured && (
                            <Chip
                              icon={<StarIcon />}
                              label="Featured"
                              size="small"
                              sx={{
                                backgroundColor: '#fbbf24',
                                color: 'white',
                                fontSize: '0.75rem',
                              }}
                            />
                          )}
                          <Chip
                            label={testimonial.isActive ? 'Active' : 'Inactive'}
                            size="small"
                            color={testimonial.isActive ? 'success' : 'default'}
                            sx={{ fontSize: '0.75rem' }}
                          />
                        </Box>
                        
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#6b7280',
                            lineHeight: 1.6,
                            mb: 2,
                            fontStyle: 'italic',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          &quot;{testimonial.content}&quot;
                        </Typography>

                        {/* Guest Details */}
                        <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                          {testimonial.guestTitle && (
                            <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                              Title: {testimonial.guestTitle}
                            </Typography>
                          )}
                          {testimonial.source && (
                            <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                              Source: {testimonial.source}
                            </Typography>
                          )}
                          {testimonial.stayDate && (
                            <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                              Stay: {formatDate(testimonial.stayDate)}
                            </Typography>
                          )}
                          {testimonial.reviewDate && (
                            <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                              Review: {formatDate(testimonial.reviewDate)}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    </Box>

                    <CardActions sx={{ p: 0, justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={testimonial.isActive}
                              onChange={() => handleToggleStatus(testimonial.id, testimonial.isActive)}
                              disabled={loading === testimonial.id}
                              size="small"
                            />
                          }
                          label="Active"
                          sx={{ mr: 2 }}
                        />
                        <IconButton
                          onClick={() => handleToggleFeatured(testimonial.id, testimonial.isFeatured)}
                          disabled={loading === testimonial.id}
                          sx={{
                            color: testimonial.isFeatured ? '#fbbf24' : '#9ca3af',
                            '&:hover': {
                              backgroundColor: testimonial.isFeatured ? 'rgba(251, 191, 36, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                            },
                          }}
                        >
                          {testimonial.isFeatured ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => router.push(`/admin/cms/testimonials/${testimonial.id}`)}
                          sx={{ color: '#6b7280' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => setDeleteDialog({ open: true, testimonial })}
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
        onClose={() => setDeleteDialog({ open: false, testimonial: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          Delete Testimonial
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this testimonial? This action cannot be undone.
          </Typography>
          {deleteDialog.testimonial && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                {deleteDialog.testimonial.guestName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                &quot;{deleteDialog.testimonial.content.substring(0, 100)}...&quot;
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, testimonial: null })}
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

export default TestimonialListPage;