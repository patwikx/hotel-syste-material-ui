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
  Chip,
  Stack,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { RestaurantType } from '@prisma/client';
import { getRestaurantById, RestaurantData, updateRestaurant, UpdateRestaurantData } from '../../../../../../lib/actions/resto-management';
import { BusinessUnitData, getBusinessUnits } from '../../../../../../lib/actions/business-units';


interface RestaurantFormData {
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  type: RestaurantType;
  cuisine: string[];
  location: string;
  phone: string;
  email: string;
  operatingHours: Record<string, unknown> | null;
  features: string[];
  priceRange: string;
  averageMeal: number | null;
  currency: string;
  isActive: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  businessUnitId: string;
}

const restaurantTypes: { value: RestaurantType; label: string }[] = [
  { value: 'FINE_DINING', label: 'Fine Dining' },
  { value: 'CASUAL_DINING', label: 'Casual Dining' },
  { value: 'CAFE', label: 'Cafe' },
  { value: 'BAR', label: 'Bar' },
  { value: 'BUFFET', label: 'Buffet' },
  { value: 'ROOM_SERVICE', label: 'Room Service' },
];

const priceRanges = ['Budget', 'Moderate', 'Upscale', 'Luxury'];

const EditRestaurantPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitData[]>([]);
  const [newCuisine, setNewCuisine] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    slug: '',
    description: '',
    shortDesc: '',
    type: 'CASUAL_DINING',
    cuisine: [],
    location: '',
    phone: '',
    email: '',
    operatingHours: null,
    features: [],
    priceRange: 'Moderate',
    averageMeal: null,
    currency: 'PHP',
    isActive: true,
    isPublished: false,
    isFeatured: false,
    sortOrder: 0,
    businessUnitId: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [restaurantData, units] = await Promise.all([
          getRestaurantById(restaurantId),
          getBusinessUnits()
        ]);

        setBusinessUnits(units);

        if (restaurantData) {
          setRestaurant(restaurantData);
          setFormData({
            name: restaurantData.name,
            slug: restaurantData.slug,
            description: restaurantData.description,
            shortDesc: restaurantData.shortDesc || '',
            type: restaurantData.type,
            cuisine: restaurantData.cuisine,
            location: restaurantData.location || '',
            phone: restaurantData.phone || '',
            email: restaurantData.email || '',
            operatingHours: restaurantData.operatingHours,
            features: restaurantData.features,
            priceRange: restaurantData.priceRange || 'Moderate',
            averageMeal: restaurantData.averageMeal ? Number(restaurantData.averageMeal) : null,
            currency: restaurantData.currency,
            isActive: restaurantData.isActive,
            isPublished: restaurantData.isPublished,
            isFeatured: restaurantData.isFeatured,
            sortOrder: restaurantData.sortOrder,
            businessUnitId: restaurantData.businessUnit.id,
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Restaurant not found',
            severity: 'error',
          });
          router.push('/admin/operations/restaurants');
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to load restaurant',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      loadData();
    }
  }, [restaurantId, router]);

  const handleInputChange = (field: keyof RestaurantFormData, value: string | number | boolean | string[] | Record<string, unknown> | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCuisine = () => {
    if (newCuisine.trim() && !formData.cuisine.includes(newCuisine.trim())) {
      setFormData(prev => ({
        ...prev,
        cuisine: [...prev.cuisine, newCuisine.trim()],
      }));
      setNewCuisine('');
    }
  };

  const handleRemoveCuisine = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      cuisine: prev.cuisine.filter(c => c !== cuisine),
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const restaurantData: UpdateRestaurantData = {
        id: restaurantId,
        ...formData,
        shortDesc: formData.shortDesc || null,
        location: formData.location || null,
        phone: formData.phone || null,
        email: formData.email || null,
      };

      const result = await updateRestaurant(restaurantData);

      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Restaurant updated successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to update restaurant',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while updating restaurant',
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
          <Typography>Loading restaurant...</Typography>
        </Box>
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">Restaurant not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => router.push('/admin/operations/restaurants')}
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
            Edit Restaurant
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
          Update restaurant information and settings
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
                  label="Restaurant Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
                  helperText="URL-friendly version of the name"
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
                    <InputLabel>Restaurant Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value as RestaurantType)}
                      label="Restaurant Type"
                      sx={{ borderRadius: 0 }}
                    >
                      {restaurantTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
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

          {/* Location & Contact */}
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
                Location & Contact
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  fullWidth
                  helperText="Specific location within the property"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
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

          {/* Cuisine & Features */}
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
                Cuisine & Features
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Cuisine Types */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280', fontWeight: 600 }}>
                    Cuisine Types
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label="Add Cuisine Type"
                      value={newCuisine}
                      onChange={(e) => setNewCuisine(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCuisine()}
                      sx={{
                        flex: 1,
                        minWidth: 200,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                        },
                      }}
                    />
                    <Button
                      onClick={handleAddCuisine}
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
                    {formData.cuisine.map((cuisine) => (
                      <Chip
                        key={cuisine}
                        label={cuisine}
                        onDelete={() => handleRemoveCuisine(cuisine)}
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

                {/* Features */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280', fontWeight: 600 }}>
                    Features
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label="Add Feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                      sx={{
                        flex: 1,
                        minWidth: 200,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                        },
                      }}
                    />
                    <Button
                      onClick={handleAddFeature}
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
                    {formData.features.map((feature) => (
                      <Chip
                        key={feature}
                        label={feature}
                        onDelete={() => handleRemoveFeature(feature)}
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

          {/* Pricing */}
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
                Pricing Information
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Price Range</InputLabel>
                  <Select
                    value={formData.priceRange}
                    onChange={(e) => handleInputChange('priceRange', e.target.value)}
                    label="Price Range"
                    sx={{ borderRadius: 0 }}
                  >
                    {priceRanges.map((range) => (
                      <MenuItem key={range} value={range}>
                        {range}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Average Meal Price"
                  type="number"
                  value={formData.averageMeal || ''}
                  onChange={(e) => handleInputChange('averageMeal', e.target.value ? parseFloat(e.target.value) : null)}
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
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      />
                    }
                    label="Active"
                  />
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
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
            <Button
              type="button"
              onClick={() => router.push('/admin/operations/restaurants')}
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

export default EditRestaurantPage;