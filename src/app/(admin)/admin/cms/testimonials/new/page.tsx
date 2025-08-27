'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Alert,
  Snackbar,
  IconButton,
  Rating,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { createTestimonial, CreateTestimonialData } from '../../../../../../../lib/actions/testimonial-actions';


interface TestimonialFormData {
  guestName: string;
  guestTitle: string;
  guestImage: string;
  guestCountry: string;
  content: string;
  rating: number;
  source: string;
  sourceUrl: string;
  stayDate: string;
  reviewDate: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

const NewTestimonialPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>({
    guestName: '',
    guestTitle: '',
    guestImage: '',
    guestCountry: '',
    content: '',
    rating: 5,
    source: '',
    sourceUrl: '',
    stayDate: '',
    reviewDate: '',
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleInputChange = (field: keyof TestimonialFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const testimonialData: CreateTestimonialData = {
        guestName: formData.guestName,
        guestTitle: formData.guestTitle || null,
        guestImage: formData.guestImage || null,
        guestCountry: formData.guestCountry || null,
        content: formData.content,
        rating: formData.rating,
        source: formData.source || null,
        sourceUrl: formData.sourceUrl || null,
        stayDate: formData.stayDate ? new Date(formData.stayDate) : null,
        reviewDate: formData.reviewDate ? new Date(formData.reviewDate) : null,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        sortOrder: formData.sortOrder,
      };

      const result = await createTestimonial(testimonialData);

      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Testimonial created successfully',
          severity: 'success',
        });
        router.push('/admin/cms/testimonials');
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to create testimonial',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `An error occurred while creating testimonial: ${error}`,
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
            onClick={() => router.push('/admin/cms/testimonials')}
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
            Create New Testimonial
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
          Create a new guest testimonial to showcase positive experiences
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Guest Name"
                  value={formData.guestName}
                  onChange={(e) => handleInputChange('guestName', e.target.value)}
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Guest Title"
                    value={formData.guestTitle}
                    onChange={(e) => handleInputChange('guestTitle', e.target.value)}
                    placeholder="e.g., CEO, Travel Blogger"
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                  <TextField
                    label="Guest Country"
                    value={formData.guestCountry}
                    onChange={(e) => handleInputChange('guestCountry', e.target.value)}
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                </Box>

                <TextField
                  label="Guest Image URL"
                  value={formData.guestImage}
                  onChange={(e) => handleInputChange('guestImage', e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Testimonial Content */}
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
                Testimonial Content
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Testimonial Content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                    Rating:
                  </Typography>
                  <Rating
                    value={formData.rating}
                    onChange={(event, newValue) => {
                      handleInputChange('rating', newValue || 5);
                    }}
                    sx={{ color: '#fbbf24' }}
                  />
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    ({formData.rating}/5)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Source & Dates */}
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
                Source & Dates
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Source"
                    value={formData.source}
                    onChange={(e) => handleInputChange('source', e.target.value)}
                    placeholder="e.g., TripAdvisor, Google Reviews"
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                  <TextField
                    label="Source URL"
                    value={formData.sourceUrl}
                    onChange={(e) => handleInputChange('sourceUrl', e.target.value)}
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
                    label="Stay Date"
                    type="date"
                    value={formData.stayDate}
                    onChange={(e) => handleInputChange('stayDate', e.target.value)}
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
                    label="Review Date"
                    type="date"
                    value={formData.reviewDate}
                    onChange={(e) => handleInputChange('reviewDate', e.target.value)}
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isFeatured}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    />
                  }
                  label="Featured"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
            <Button
              type="button"
              onClick={() => router.push('/admin/cms/testimonials')}
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
              {loading ? 'Creating...' : 'Create Testimonial'}
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

export default NewTestimonialPage;