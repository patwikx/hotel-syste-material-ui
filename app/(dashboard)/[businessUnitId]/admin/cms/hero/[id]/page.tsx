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
  Stack,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { HeroData } from '../../../../../../lib/actions/heroes';
import { getHeroById, updateHeroSlide } from '../../../../../../lib/cms-actions/hero-management';


interface HeroFormData {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  backgroundImage: string;
  backgroundVideo: string;
  overlayImage: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  displayType: string;
  textAlignment: string;
  overlayColor: string;
  overlayOpacity: number;
  textColor: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  primaryButtonStyle: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  secondaryButtonStyle: string;
  showFrom: string;
  showUntil: string;
  targetPages: string[];
  targetAudience: string[];
  altText: string;
  caption: string;
}

const EditHeroPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const heroId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hero, setHero] = useState<HeroData | null>(null);
  const [formData, setFormData] = useState<HeroFormData>({
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonUrl: '',
    backgroundImage: '',
    backgroundVideo: '',
    overlayImage: '',
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
    displayType: 'fullscreen',
    textAlignment: 'center',
    overlayColor: '',
    overlayOpacity: 0.4,
    textColor: '',
    primaryButtonText: '',
    primaryButtonUrl: '',
    primaryButtonStyle: 'contained',
    secondaryButtonText: '',
    secondaryButtonUrl: '',
    secondaryButtonStyle: 'outlined',
    showFrom: '',
    showUntil: '',
    targetPages: ['homepage'],
    targetAudience: [],
    altText: '',
    caption: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [newTargetPage, setNewTargetPage] = useState('');
  const [newTargetAudience, setNewTargetAudience] = useState('');

  useEffect(() => {
    const loadHero = async () => {
      try {
        const heroData = await getHeroById(heroId);
        if (heroData) {
          setHero(heroData);
          setFormData({
            title: heroData.title,
            subtitle: heroData.subtitle || '',
            description: heroData.description || '',
            buttonText: heroData.buttonText || '',
            buttonUrl: heroData.buttonUrl || '',
            backgroundImage: heroData.backgroundImage || '',
            backgroundVideo: heroData.backgroundVideo || '',
            overlayImage: heroData.overlayImage || '',
            isActive: heroData.isActive,
            isFeatured: heroData.isFeatured,
            sortOrder: heroData.sortOrder,
            displayType: heroData.displayType,
            textAlignment: heroData.textAlignment || 'center',
            overlayColor: heroData.overlayColor || '',
            overlayOpacity: heroData.overlayOpacity || 0.4,
            textColor: heroData.textColor || '',
            primaryButtonText: heroData.primaryButtonText || '',
            primaryButtonUrl: heroData.primaryButtonUrl || '',
            primaryButtonStyle: heroData.primaryButtonStyle || 'contained',
            secondaryButtonText: heroData.secondaryButtonText || '',
            secondaryButtonUrl: heroData.secondaryButtonUrl || '',
            secondaryButtonStyle: heroData.secondaryButtonStyle || 'outlined',
            showFrom: heroData.showFrom ? new Date(heroData.showFrom).toISOString().slice(0, 16) : '',
            showUntil: heroData.showUntil ? new Date(heroData.showUntil).toISOString().slice(0, 16) : '',
            targetPages: heroData.targetPages,
            targetAudience: heroData.targetAudience,
            altText: heroData.altText || '',
            caption: heroData.caption || '',
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Hero slide not found',
            severity: 'error',
          });
          router.push('/admin/cms/hero');
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Failed to load hero slide ${error}`,
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    if (heroId) {
      loadHero();
    }
  }, [heroId, router]);

  const handleInputChange = (field: keyof HeroFormData, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTargetPage = () => {
    if (newTargetPage.trim() && !formData.targetPages.includes(newTargetPage.trim())) {
      setFormData(prev => ({
        ...prev,
        targetPages: [...prev.targetPages, newTargetPage.trim()],
      }));
      setNewTargetPage('');
    }
  };

  const handleRemoveTargetPage = (page: string) => {
    setFormData(prev => ({
      ...prev,
      targetPages: prev.targetPages.filter(p => p !== page),
    }));
  };

  const handleAddTargetAudience = () => {
    if (newTargetAudience.trim() && !formData.targetAudience.includes(newTargetAudience.trim())) {
      setFormData(prev => ({
        ...prev,
        targetAudience: [...prev.targetAudience, newTargetAudience.trim()],
      }));
      setNewTargetAudience('');
    }
  };

  const handleRemoveTargetAudience = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.filter(a => a !== audience),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await updateHeroSlide(heroId, {
        ...formData,
        showFrom: formData.showFrom ? new Date(formData.showFrom) : null,
        showUntil: formData.showUntil ? new Date(formData.showUntil) : null,
      });

      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Hero slide updated successfully',
          severity: 'success',
        });
        // Optionally redirect back to list
        // router.push('/admin/cms/hero');
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to update hero slide',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `An error occurred while updating ${error}`,
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
          <Typography>Loading hero slide...</Typography>
        </Box>
      </Container>
    );
  }

  if (!hero) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">Hero slide not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => router.push('/admin/cms/hero')}
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
            Edit Hero Slide
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
          Update the hero slide content and settings
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
                  label="Title"
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
                  label="Subtitle"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  fullWidth
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
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Display Type</InputLabel>
                    <Select
                      value={formData.displayType}
                      onChange={(e) => handleInputChange('displayType', e.target.value)}
                      label="Display Type"
                      sx={{ borderRadius: 0 }}
                    >
                      <MenuItem value="fullscreen">Fullscreen</MenuItem>
                      <MenuItem value="banner">Banner</MenuItem>
                      <MenuItem value="carousel">Carousel</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Text Alignment</InputLabel>
                    <Select
                      value={formData.textAlignment}
                      onChange={(e) => handleInputChange('textAlignment', e.target.value)}
                      label="Text Alignment"
                      sx={{ borderRadius: 0 }}
                    >
                      <MenuItem value="left">Left</MenuItem>
                      <MenuItem value="center">Center</MenuItem>
                      <MenuItem value="right">Right</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Sort Order"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
                    sx={{
                      width: 150,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                </Box>

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
              </Box>
            </CardContent>
          </Card>

          {/* Media Settings */}
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
                Media Settings
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Background Image URL"
                  value={formData.backgroundImage}
                  onChange={(e) => handleInputChange('backgroundImage', e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />

                <TextField
                  label="Background Video URL"
                  value={formData.backgroundVideo}
                  onChange={(e) => handleInputChange('backgroundVideo', e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />

                <TextField
                  label="Overlay Image URL"
                  value={formData.overlayImage}
                  onChange={(e) => handleInputChange('overlayImage', e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Overlay Color"
                    value={formData.overlayColor}
                    onChange={(e) => handleInputChange('overlayColor', e.target.value)}
                    placeholder="#000000"
                    sx={{
                      width: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />

                  <TextField
                    label="Overlay Opacity"
                    type="number"
                    value={formData.overlayOpacity}
                    onChange={(e) => handleInputChange('overlayOpacity', parseFloat(e.target.value) || 0)}
                    inputProps={{ min: 0, max: 1, step: 0.1 }}
                    sx={{
                      width: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />

                  <TextField
                    label="Text Color"
                    value={formData.textColor}
                    onChange={(e) => handleInputChange('textColor', e.target.value)}
                    placeholder="#ffffff"
                    sx={{
                      width: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Alt Text"
                    value={formData.altText}
                    onChange={(e) => handleInputChange('altText', e.target.value)}
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />

                  <TextField
                    label="Caption"
                    value={formData.caption}
                    onChange={(e) => handleInputChange('caption', e.target.value)}
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

          {/* Call-to-Action Buttons */}
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
                Call-to-Action Buttons
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Primary Button */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280', fontWeight: 600 }}>
                    Primary Button
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label="Button Text"
                      value={formData.primaryButtonText}
                      onChange={(e) => handleInputChange('primaryButtonText', e.target.value)}
                      sx={{
                        flex: 1,
                        minWidth: 200,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                        },
                      }}
                    />
                    <TextField
                      label="Button URL"
                      value={formData.primaryButtonUrl}
                      onChange={(e) => handleInputChange('primaryButtonUrl', e.target.value)}
                      sx={{
                        flex: 1,
                        minWidth: 200,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                        },
                      }}
                    />
                    <FormControl sx={{ minWidth: 150 }}>
                      <InputLabel>Style</InputLabel>
                      <Select
                        value={formData.primaryButtonStyle}
                        onChange={(e) => handleInputChange('primaryButtonStyle', e.target.value)}
                        label="Style"
                        sx={{ borderRadius: 0 }}
                      >
                        <MenuItem value="contained">Contained</MenuItem>
                        <MenuItem value="outlined">Outlined</MenuItem>
                        <MenuItem value="text">Text</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                <Divider />

                {/* Secondary Button */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280', fontWeight: 600 }}>
                    Secondary Button
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label="Button Text"
                      value={formData.secondaryButtonText}
                      onChange={(e) => handleInputChange('secondaryButtonText', e.target.value)}
                      sx={{
                        flex: 1,
                        minWidth: 200,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                        },
                      }}
                    />
                    <TextField
                      label="Button URL"
                      value={formData.secondaryButtonUrl}
                      onChange={(e) => handleInputChange('secondaryButtonUrl', e.target.value)}
                      sx={{
                        flex: 1,
                        minWidth: 200,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                        },
                      }}
                    />
                    <FormControl sx={{ minWidth: 150 }}>
                      <InputLabel>Style</InputLabel>
                      <Select
                        value={formData.secondaryButtonStyle}
                        onChange={(e) => handleInputChange('secondaryButtonStyle', e.target.value)}
                        label="Style"
                        sx={{ borderRadius: 0 }}
                      >
                        <MenuItem value="contained">Contained</MenuItem>
                        <MenuItem value="outlined">Outlined</MenuItem>
                        <MenuItem value="text">Text</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Scheduling & Targeting */}
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
                Scheduling & Targeting
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Show From"
                    type="datetime-local"
                    value={formData.showFrom}
                    onChange={(e) => handleInputChange('showFrom', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      flex: 1,
                      minWidth: 250,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                  <TextField
                    label="Show Until"
                    type="datetime-local"
                    value={formData.showUntil}
                    onChange={(e) => handleInputChange('showUntil', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      flex: 1,
                      minWidth: 250,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                </Box>

                {/* Target Pages */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280', fontWeight: 600 }}>
                    Target Pages
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label="Add Target Page"
                      value={newTargetPage}
                      onChange={(e) => setNewTargetPage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTargetPage()}
                      sx={{
                        flex: 1,
                        minWidth: 200,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                        },
                      }}
                    />
                    <Button
                      onClick={handleAddTargetPage}
                      variant="outlined"
                      startIcon={<AddIcon />}
                      sx={{
                        borderRadius: 0,
                        borderColor: '#111827',
                        color: '#111827',
                        '&:hover': {
                          borderColor: '#1f2937',
                          backgroundColor: 'rgba(17, 24, 39, 0.04)',
                        },
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {formData.targetPages.map((page) => (
                      <Chip
                        key={page}
                        label={page}
                        onDelete={() => handleRemoveTargetPage(page)}
                        deleteIcon={<CloseIcon />}
                        sx={{
                          backgroundColor: '#111827',
                          color: 'white',
                          '& .MuiChip-deleteIcon': {
                            color: 'white',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Target Audience */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280', fontWeight: 600 }}>
                    Target Audience
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label="Add Target Audience"
                      value={newTargetAudience}
                      onChange={(e) => setNewTargetAudience(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTargetAudience()}
                      sx={{
                        flex: 1,
                        minWidth: 200,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                        },
                      }}
                    />
                    <Button
                      onClick={handleAddTargetAudience}
                      variant="outlined"
                      startIcon={<AddIcon />}
                      sx={{
                        borderRadius: 0,
                        borderColor: '#111827',
                        color: '#111827',
                        '&:hover': {
                          borderColor: '#1f2937',
                          backgroundColor: 'rgba(17, 24, 39, 0.04)',
                        },
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {formData.targetAudience.map((audience) => (
                      <Chip
                        key={audience}
                        label={audience}
                        onDelete={() => handleRemoveTargetAudience(audience)}
                        deleteIcon={<CloseIcon />}
                        variant="outlined"
                        sx={{
                          borderColor: '#6b7280',
                          color: '#6b7280',
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
            <Button
              type="button"
              onClick={() => router.push('/admin/cms/hero')}
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

export default EditHeroPage;