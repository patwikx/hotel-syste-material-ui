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
import { OfferType, OfferStatus } from '@prisma/client';
import { BusinessUnitData } from '../../../../../../types/properties';
import { getBusinessUnits } from '../../../../../../lib/actions/business-units';


interface SpecialOfferFormData {
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  shortDesc: string;
  type: OfferType;
  status: OfferStatus;
  offerPrice: number;
  originalPrice: number | null;
  savingsAmount: number | null;
  savingsPercent: number | null;
  currency: string;
  validFrom: string;
  validTo: string;
  businessUnitId: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  isPinned: boolean;
  sortOrder: number;
}

const offerTypes: { value: OfferType; label: string }[] = [
  { value: 'ROOM_DISCOUNT', label: 'Room Discount' },
  { value: 'PACKAGE_DEAL', label: 'Package Deal' },
  { value: 'EARLY_BIRD', label: 'Early Bird' },
  { value: 'LAST_MINUTE', label: 'Last Minute' },
  { value: 'SEASONAL', label: 'Seasonal' },
  { value: 'LOYALTY', label: 'Loyalty' },
];

const offerStatuses: { value: OfferStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'SCHEDULED', label: 'Scheduled' },
];

const NewSpecialOfferPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitData[]>([]);
  const [formData, setFormData] = useState<SpecialOfferFormData>({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    shortDesc: '',
    type: 'ROOM_DISCOUNT',
    status: 'ACTIVE',
    offerPrice: 0,
    originalPrice: null,
    savingsAmount: null,
    savingsPercent: null,
    currency: 'PHP',
    validFrom: '',
    validTo: '',
    businessUnitId: null,
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

  const calculateSavings = (originalPrice: number | null, offerPrice: number) => {
    if (!originalPrice || originalPrice <= offerPrice) return;
    
    const savingsAmount = originalPrice - offerPrice;
    const savingsPercent = Math.round((savingsAmount / originalPrice) * 100);
    
    setFormData(prev => ({
      ...prev,
      savingsAmount,
      savingsPercent,
    }));
  };

  const handleInputChange = (field: keyof SpecialOfferFormData, value: string | number | boolean) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when title changes
      if (field === 'title' && typeof value === 'string') {
        updated.slug = generateSlug(value);
      }
      
      // Auto-calculate savings when prices change
      if (field === 'originalPrice' || field === 'offerPrice') {
        const originalPrice = field === 'originalPrice' ? (typeof value === 'number' ? value : null) : prev.originalPrice;
        const offerPrice = field === 'offerPrice' ? (typeof value === 'number' ? value : 0) : prev.offerPrice;
        
        if (originalPrice && originalPrice > offerPrice) {
          updated.savingsAmount = originalPrice - offerPrice;
          updated.savingsPercent = Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
        } else {
          updated.savingsAmount = null;
          updated.savingsPercent = null;
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const offerData: CreateSpecialOfferData = {
        ...formData,
        validFrom: new Date(formData.validFrom),
        validTo: new Date(formData.validTo),
      };

      const result = await createSpecialOffer(offerData);

      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Special offer created successfully',
          severity: 'success',
        });
        router.push('/admin/cms/special-offers');
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to create special offer',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `An error occurred while creating special offer: ${error}`,
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
            onClick={() => router.push('/admin/cms/special-offers')}
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
            Create New Special Offer
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
          Create a new special offer to attract guests
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
                  label="Offer Title"
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
                    <InputLabel>Offer Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value as OfferType)}
                      label="Offer Type"
                      sx={{ borderRadius: 0 }}
                    >
                      {offerTypes.map((type) => (
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
                      onChange={(e) => handleInputChange('status', e.target.value as OfferStatus)}
                      label="Status"
                      sx={{ borderRadius: 0 }}
                    >
                      {offerStatuses.map((status) => (
                        <MenuItem key={status.value} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Property</InputLabel>
                    <Select
                      value={formData.businessUnitId || ''}
                      onChange={(e) => handleInputChange('businessUnitId', e.target.value || null)}
                      label="Property"
                      sx={{ borderRadius: 0 }}
                    >
                      <MenuItem value="">All Properties</MenuItem>
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

          {/* Pricing Information */}
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

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Offer Price"
                    type="number"
                    value={formData.offerPrice}
                    onChange={(e) => handleInputChange('offerPrice', parseFloat(e.target.value) || 0)}
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
                    label="Original Price"
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value ? parseFloat(e.target.value) : null)}
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

                {/* Savings Display */}
                {formData.savingsAmount && formData.savingsPercent && (
                  <Box sx={{ 
                    p: 2, 
                    backgroundColor: '#f0f9ff', 
                    border: '1px solid #0ea5e9',
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center'
                  }}>
                    <Typography sx={{ color: '#0369a1', fontWeight: 600 }}>
                      Savings: {formData.currency} {formData.savingsAmount.toLocaleString()} ({formData.savingsPercent}% OFF)
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Savings Amount"
                    type="number"
                    value={formData.savingsAmount || ''}
                    onChange={(e) => handleInputChange('savingsAmount', e.target.value ? parseFloat(e.target.value) : null)}
                    helperText="Auto-calculated or manual override"
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                      },
                    }}
                  />
                  <TextField
                    label="Savings Percent"
                    type="number"
                    value={formData.savingsPercent || ''}
                    onChange={(e) => handleInputChange('savingsPercent', e.target.value ? parseInt(e.target.value) : null)}
                    helperText="Auto-calculated or manual override"
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

          {/* Validity Period */}
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
                Validity Period
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="Valid From"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => handleInputChange('validFrom', e.target.value)}
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
                  label="Valid To"
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => handleInputChange('validTo', e.target.value)}
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
              onClick={() => router.push('/admin/cms/special-offers')}
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
              {loading ? 'Creating...' : 'Create Special Offer'}
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

export default NewSpecialOfferPage;