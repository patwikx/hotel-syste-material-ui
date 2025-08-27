'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  Alert,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import {
  Save,
  ArrowBack,
  Image as ImageIcon,
  Monitor,
  Palette,
  Visibility,
  Star,
  People,
  Link as LinkIcon,
  AccessTime,
  BarChart,
  Report,
} from '@mui/icons-material';
import Link from 'next/link';
import { createHeroSlide } from '../../../../../../../lib/cms-actions/hero';


const NewHeroSlidePage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Use state to manage the multi-select values as arrays
  const [targetPages, setTargetPages] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setNotification(null);
    setErrors({});

    if (!formRef.current) return;

    const formData = new FormData(event.currentTarget);
    targetPages.forEach(page => formData.append('targetPages', page));
    targetAudience.forEach(audience => formData.append('targetAudience', audience));

    const result = await createHeroSlide(formData);

    if (result.success) {
      setNotification({ type: 'success', message: 'Hero slide created successfully! Redirecting...' });
      setTimeout(() => {
        router.push('/admin/cms/hero-slides');
      }, 2000);
    } else {
      setNotification({ type: 'error', message: result.message });
      setErrors(result.errors || {});
    }
    setIsLoading(false);
  };

  const getError = (field: string) => errors[field];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                component={Link} 
                href="/admin/cms/hero-slides"
                sx={{ 
                  color: '#6b7280',
                  '&:hover': { backgroundColor: 'rgba(107, 114, 128, 0.1)' }
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography
                sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Back to Hero Slides
              </Typography>
              <Typography sx={{ color: '#6b7280', mx: 1 }}>/</Typography>
              <Typography
                sx={{
                  color: '#111827',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Add New Hero Slide
              </Typography>
            </Box>
            
            <Button
              form="hero-form"
              type="submit"
              disabled={isLoading}
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
                  backgroundColor: '#6b7280',
                },
              }}
              startIcon={isLoading ? null : <Save />}
            >
              {isLoading ? 'Creating...' : 'Create Hero Slide'}
            </Button>
          </Box>

          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2rem', md: '3rem' },
              color: '#111827',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.9,
              textAlign: 'center',
              mb: 2,
            }}
          >
            Create New Hero Slide
          </Typography>
          
          <Typography
            sx={{
              color: '#6b7280',
              fontSize: '1.125rem',
              textAlign: 'center',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Design compelling hero sections that capture attention and drive engagement
          </Typography>
        </Box>

        {/* Notification Alert */}
        {notification && (
          <Alert 
            severity={notification.type} 
            sx={{ 
              mb: 4,
              backgroundColor: notification.type === 'success' ? '#f0fdf4' : '#fef2f2',
              borderColor: notification.type === 'success' ? '#bbf7d0' : '#fecaca',
              color: notification.type === 'success' ? '#166534' : '#dc2626',
              '& .MuiAlert-icon': { color: notification.type === 'success' ? '#16a34a' : '#dc2626' }
            }}
          >
            {notification.message}
            {notification.type === 'error' && Object.keys(errors).length > 0 && (
              <Box component="ul" sx={{ m: 0, pl: 2, mt: 1 }}>
                {Object.entries(errors).map(([field, error]) => (
                  <Box component="li" key={field} sx={{ fontSize: '0.875rem' }}>
                    {error}
                  </Box>
                ))}
              </Box>
            )}
          </Alert>
        )}

        <form onSubmit={handleSubmit} ref={formRef} id="hero-form">
          <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', xl: 'row' } }}>
            {/* Left Column - Main Content */}
            <Box sx={{ flex: { xl: '2' } }}>
              <Stack spacing={4}>
                {/* Hero Content Card */}
                <Card 
                  sx={{ 
                    backgroundColor: 'white',
                    borderRadius: 0,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ p: 4, borderBottom: '1px solid #e5e7eb' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: '#dbeafe',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ImageIcon sx={{ color: '#2563eb', fontSize: 24 }} />
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: '1.5rem',
                          color: '#111827',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        Hero Content
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      Main content and messaging for your hero slide
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={4}>
                      <TextField
                        label="Title"
                        name="title"
                        required
                        fullWidth
                        placeholder="Discover Paradise Across the Philippines"
                        error={!!getError('title')}
                        helperText={getError('title')}
                        sx={{
                          '& .MuiInputLabel-root': {
                            fontWeight: 600,
                            color: '#374151',
                          },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '&:hover fieldset': {
                              borderColor: '#111827',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#111827',
                            },
                          },
                        }}
                      />

                      <TextField
                        label="Subtitle"
                        name="subtitle"
                        fullWidth
                        placeholder="Experience world-class hospitality"
                        sx={{
                          '& .MuiInputLabel-root': {
                            fontWeight: 600,
                            color: '#374151',
                          },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '&:hover fieldset': {
                              borderColor: '#111827',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#111827',
                            },
                          },
                        }}
                      />

                      <TextField
                        label="Description"
                        name="description"
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Detailed description for the hero section..."
                        sx={{
                          '& .MuiInputLabel-root': {
                            fontWeight: 600,
                            color: '#374151',
                          },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '&:hover fieldset': {
                              borderColor: '#111827',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#111827',
                            },
                          },
                        }}
                      />

                      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                        <TextField
                          label="Button Text"
                          name="buttonText"
                          fullWidth
                          placeholder="Book Your Stay"
                          sx={{
                            '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 0,
                              '&:hover fieldset': { borderColor: '#111827' },
                              '&.Mui-focused fieldset': { borderColor: '#111827' },
                            },
                          }}
                        />

                        <TextField
                          label="Button URL"
                          name="buttonUrl"
                          fullWidth
                          placeholder="/reservations"
                          sx={{
                            '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 0,
                              '&:hover fieldset': { borderColor: '#111827' },
                              '&.Mui-focused fieldset': { borderColor: '#111827' },
                            },
                          }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Call-to-Action Buttons Card */}
                <Card 
                  sx={{ 
                    backgroundColor: 'white',
                    borderRadius: 0,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ p: 4, borderBottom: '1px solid #e5e7eb' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: '#f3e8ff',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <LinkIcon sx={{ color: '#7c3aed', fontSize: 24 }} />
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: '1.5rem',
                          color: '#111827',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        Call-to-Action Buttons
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      Primary and secondary action buttons
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={4}>
                      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                        <TextField
                          label="Primary Button Text"
                          name="primaryButtonText"
                          fullWidth
                          placeholder="Book Now"
                          sx={{
                            '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 0,
                              '&:hover fieldset': { borderColor: '#111827' },
                              '&.Mui-focused fieldset': { borderColor: '#111827' },
                            },
                          }}
                        />

                        <TextField
                          label="Primary Button URL"
                          name="primaryButtonUrl"
                          fullWidth
                          placeholder="/reservations"
                          sx={{
                            '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 0,
                              '&:hover fieldset': { borderColor: '#111827' },
                              '&.Mui-focused fieldset': { borderColor: '#111827' },
                            },
                          }}
                        />
                      </Box>

                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}>
                        <InputLabel sx={{ fontWeight: 600, color: '#374151' }}>Primary Button Style</InputLabel>
                        <Select
                          name="primaryButtonStyle"
                          defaultValue="primary"
                          label="Primary Button Style"
                        >
                          <MenuItem value="primary">Primary</MenuItem>
                          <MenuItem value="secondary">Secondary</MenuItem>
                          <MenuItem value="outline">Outline</MenuItem>
                          <MenuItem value="ghost">Ghost</MenuItem>
                        </Select>
                      </FormControl>

                      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                        <TextField
                          label="Secondary Button Text"
                          name="secondaryButtonText"
                          fullWidth
                          placeholder="Learn More"
                          sx={{
                            '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 0,
                              '&:hover fieldset': { borderColor: '#111827' },
                              '&.Mui-focused fieldset': { borderColor: '#111827' },
                            },
                          }}
                        />

                        <TextField
                          label="Secondary Button URL"
                          name="secondaryButtonUrl"
                          fullWidth
                          placeholder="/about"
                          sx={{
                            '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 0,
                              '&:hover fieldset': { borderColor: '#111827' },
                              '&.Mui-focused fieldset': { borderColor: '#111827' },
                            },
                          }}
                        />
                      </Box>

                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}>
                        <InputLabel sx={{ fontWeight: 600, color: '#374151' }}>Secondary Button Style</InputLabel>
                        <Select
                          name="secondaryButtonStyle"
                          defaultValue="secondary"
                          label="Secondary Button Style"
                        >
                          <MenuItem value="primary">Primary</MenuItem>
                          <MenuItem value="secondary">Secondary</MenuItem>
                          <MenuItem value="outline">Outline</MenuItem>
                          <MenuItem value="ghost">Ghost</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Media Assets Card */}
                <Card 
                  sx={{ 
                    backgroundColor: 'white',
                    borderRadius: 0,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ p: 4, borderBottom: '1px solid #e5e7eb' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: '#d1fae5',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Monitor sx={{ color: '#059669', fontSize: 24 }} />
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: '1.5rem',
                          color: '#111827',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        Media Assets
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: '#6b7280',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      Images and videos for your hero slide
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={4}>
                      <TextField
                        label="Background Image URL"
                        name="backgroundImage"
                        fullWidth
                        placeholder="https://example.com/hero-image.jpg"
                        error={!!getError('backgroundImage')}
                        helperText={getError('backgroundImage')}
                        sx={{
                          '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '&:hover fieldset': { borderColor: '#111827' },
                            '&.Mui-focused fieldset': { borderColor: '#111827' },
                          },
                        }}
                      />

                      <TextField
                        label="Background Video URL"
                        name="backgroundVideo"
                        fullWidth
                        placeholder="https://example.com/hero-video.mp4"
                        error={!!getError('backgroundVideo')}
                        helperText={getError('backgroundVideo')}
                        sx={{
                          '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '&:hover fieldset': { borderColor: '#111827' },
                            '&.Mui-focused fieldset': { borderColor: '#111827' },
                          },
                        }}
                      />

                      <TextField
                        label="Overlay Image URL"
                        name="overlayImage"
                        fullWidth
                        placeholder="https://example.com/overlay-image.jpg"
                        error={!!getError('overlayImage')}
                        helperText={getError('overlayImage') || "Additional image overlay (optional)"}
                        sx={{
                          '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '&:hover fieldset': { borderColor: '#111827' },
                            '&.Mui-focused fieldset': { borderColor: '#111827' },
                          },
                        }}
                      />

                      <TextField
                        label="Alt Text"
                        name="altText"
                        fullWidth
                        placeholder="Stunning view of tropical resort"
                        helperText="Accessibility description for screen readers"
                        sx={{
                          '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '&:hover fieldset': { borderColor: '#111827' },
                            '&.Mui-focused fieldset': { borderColor: '#111827' },
                          },
                        }}
                      />

                      <TextField
                        label="Caption"
                        name="caption"
                        fullWidth
                        placeholder="Image caption or subtitle"
                        sx={{
                          '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '&:hover fieldset': { borderColor: '#111827' },
                            '&.Mui-focused fieldset': { borderColor: '#111827' },
                          },
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Box>

            {/* Right Column - Sidebar */}
            <Box sx={{ flex: { xl: '1' }, minWidth: { xl: '350px' } }}>
              <Stack spacing={3}>
                {/* Hero Status Card */}
                <Card 
                  sx={{ 
                    backgroundColor: 'white',
                    borderRadius: 0,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: '#f3e8ff',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Report sx={{ color: '#7c3aed', fontSize: 16 }} />
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: '1.125rem',
                          color: '#111827',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        Slide Status
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>
                              Active
                            </Typography>
                            <Chip
                                size="small"
                                icon={<Visibility sx={{ fontSize: 14 }} />}
                                label="Visible"
                                sx={{
                                    backgroundColor: '#dbeafe',
                                    color: '#1d4ed8',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    height: 24,
                                    '& .MuiChip-icon': { color: '#1d4ed8' },
                                }}
                            />
                          </Box>
                          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            Slide is visible to users
                          </Typography>
                        </Box>
                        <Switch
                          name="isActive"
                          defaultChecked={true}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#111827',
                              '&:hover': { backgroundColor: 'rgba(17, 24, 39, 0.04)' },
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#111827',
                            },
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>
                              Featured
                            </Typography>
                            <Chip
                                size="small"
                                icon={<Star sx={{ fontSize: 14 }} />}
                                label="Priority"
                                sx={{
                                    backgroundColor: '#fef3c7',
                                    color: '#d97706',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    height: 24,
                                    '& .MuiChip-icon': { color: '#d97706' },
                                }}
                            />
                          </Box>
                          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            Higher priority display
                          </Typography>
                        </Box>
                        <Switch
                          name="isFeatured"
                          defaultChecked={false}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#111827',
                              '&:hover': { backgroundColor: 'rgba(17, 24, 39, 0.04)' },
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#111827',
                            },
                          }}
                        />
                      </Box>

                      <TextField
                        label="Sort Order"
                        name="sortOrder"
                        type="number"
                        defaultValue={0}
                        placeholder="0"
                        inputProps={{ min: "0" }}
                        helperText="Lower numbers appear first"
                        fullWidth
                        sx={{
                          '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '&:hover fieldset': { borderColor: '#111827' },
                            '&.Mui-focused fieldset': { borderColor: '#111827' },
                          },
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>

                {/* Design & Layout Card */}
                <Card 
                  sx={{ 
                    backgroundColor: 'white',
                    borderRadius: 0,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: '#fef3c7',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Palette sx={{ color: '#f59e0b', fontSize: 16 }} />
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: '1.125rem',
                          color: '#111827',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        Design & Layout
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}>
                        <InputLabel sx={{ fontWeight: 600, color: '#374151' }}>Display Type</InputLabel>
                        <Select
                          name="displayType"
                          defaultValue="fullscreen"
                          label="Display Type"
                        >
                          <MenuItem value="fullscreen">Fullscreen</MenuItem>
                          <MenuItem value="banner">Banner</MenuItem>
                          <MenuItem value="carousel">Carousel</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}>
                        <InputLabel sx={{ fontWeight: 600, color: '#374151' }}>Text Alignment</InputLabel>
                        <Select
                          name="textAlignment"
                          defaultValue="center"
                          label="Text Alignment"
                        >
                          <MenuItem value="left">Left Aligned</MenuItem>
                          <MenuItem value="center">Center Aligned</MenuItem>
                          <MenuItem value="right">Right Aligned</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: '#374151', mb: 1, fontSize: '0.875rem' }}>
                          Overlay Color
                        </Typography>
                        <TextField
                          name="overlayColor"
                          type="color"
                          defaultValue="#000000"
                          fullWidth
                          sx={{
                            height: '56px',
                            '& .MuiInputBase-root': { p: 0 },
                            '& .MuiOutlinedInput-input': { 
                              height: '100%', 
                              p: 0, 
                              borderRadius: '4px',
                              border: '1px solid #d1d5db',
                              '&::-webkit-color-swatch-wrapper': { p: 0 },
                              '&::-webkit-color-swatch': { border: 'none' },
                            },
                          }}
                        />
                      </Box>
                      
                      <TextField
                        label="Overlay Opacity"
                        name="overlayOpacity"
                        type="number"
                        defaultValue={0.3}
                        placeholder="0.3"
                        inputProps={{ min: "0", max: "1", step: "0.1" }}
                        fullWidth
                        error={!!getError('overlayOpacity')}
                        helperText={getError('overlayOpacity')}
                        sx={{
                          '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '&:hover fieldset': { borderColor: '#111827' },
                            '&.Mui-focused fieldset': { borderColor: '#111827' },
                          },
                        }}
                      />
                      
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: '#374151', mb: 1, fontSize: '0.875rem' }}>
                          Text Color
                        </Typography>
                        <TextField
                          name="textColor"
                          type="color"
                          defaultValue="#ffffff"
                          fullWidth
                          sx={{
                            height: '56px',
                            '& .MuiInputBase-root': { p: 0 },
                            '& .MuiOutlinedInput-input': { 
                              height: '100%', 
                              p: 0, 
                              borderRadius: '4px',
                              border: '1px solid #d1d5db',
                              '&::-webkit-color-swatch-wrapper': { p: 0 },
                              '&::-webkit-color-swatch': { border: 'none' },
                            },
                          }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Targeting Card */}
                <Card 
                  sx={{ 
                    backgroundColor: 'white',
                    borderRadius: 0,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: '#f3e8ff',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <People sx={{ color: '#7c3aed', fontSize: 16 }} />
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: '1.125rem',
                          color: '#111827',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        Targeting
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}>
                        <InputLabel sx={{ fontWeight: 600, color: '#374151' }}>Target Pages</InputLabel>
                        <Select
                          name="targetPages"
                          multiple
                          value={targetPages}
                          onChange={(e) => {
                            const value = e.target.value as string[];
                            setTargetPages(typeof value === 'string' ? [value] : value);
                          }}
                          label="Target Pages"
                          renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} size="small" />
                                ))}
                              </Box>
                          )}
                        >
                          <MenuItem value="homepage">Homepage</MenuItem>
                          <MenuItem value="properties">Properties</MenuItem>
                          <MenuItem value="offers">Offers</MenuItem>
                          <MenuItem value="events">Events</MenuItem>
                          <MenuItem value="about">About</MenuItem>
                          <MenuItem value="all">All Pages</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}>
                        <InputLabel sx={{ fontWeight: 600, color: '#374151' }}>Target Audience</InputLabel>
                        <Select
                          name="targetAudience"
                          multiple
                          value={targetAudience}
                          onChange={(e) => {
                            const value = e.target.value as string[];
                            setTargetAudience(typeof value === 'string' ? [value] : value);
                          }}
                          label="Target Audience"
                          renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} size="small" />
                                ))}
                              </Box>
                          )}
                        >
                          <MenuItem value="all">All Visitors</MenuItem>
                          <MenuItem value="returning-visitors">Returning Visitors</MenuItem>
                          <MenuItem value="mobile-users">Mobile Users</MenuItem>
                          <MenuItem value="desktop-users">Desktop Users</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Schedule Card */}
                <Card 
                  sx={{ 
                    backgroundColor: 'white',
                    borderRadius: 0,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: '#e0e7ff',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AccessTime sx={{ color: '#4f46e5', fontSize: 16 }} />
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: '1.125rem',
                          color: '#111827',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        Schedule
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <TextField
                        label="Show From"
                        name="showFrom"
                        type="datetime-local"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '&:hover fieldset': { borderColor: '#111827' },
                            '&.Mui-focused fieldset': { borderColor: '#111827' },
                          },
                        }}
                      />

                      <TextField
                        label="Show Until"
                        name="showUntil"
                        type="datetime-local"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          '& .MuiInputLabel-root': { fontWeight: 600, color: '#374151' },
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            '&:hover fieldset': { borderColor: '#111827' },
                            '&.Mui-focused fieldset': { borderColor: '#111827' },
                          },
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>

                {/* Analytics Preview Card */}
                <Card 
                  sx={{ 
                    backgroundColor: 'white',
                    borderRadius: 0,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: 'none',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ p: 3, borderBottom: '1px solid #e5e7eb' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: '#d1fae5',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <BarChart sx={{ color: '#059669', fontSize: 16 }} />
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: '1.125rem',
                          color: '#111827',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        Analytics
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', mb: 2 }}>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '2rem',
                            fontWeight: 900,
                            color: '#111827',
                            lineHeight: 1,
                          }}
                        >
                          0
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontWeight: 600,
                          }}
                        >
                          Views
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '2rem',
                            fontWeight: 900,
                            color: '#111827',
                            lineHeight: 1,
                          }}
                        >
                          0
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontWeight: 600,
                          }}
                        >
                          Clicks
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '2rem',
                            fontWeight: 900,
                            color: '#111827',
                            lineHeight: 1,
                          }}
                        >
                          0
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontWeight: 600,
                          }}
                        >
                          Conversions
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        textAlign: 'center',
                      }}
                    >
                      Analytics will be available after publishing
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Box>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default NewHeroSlidePage;