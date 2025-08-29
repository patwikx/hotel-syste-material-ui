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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Hotel as HotelIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { BusinessUnitData, deleteBusinessUnit, toggleBusinessUnitFeatured, toggleBusinessUnitStatus } from '../../../../../../lib/actions/business-management';


interface BusinessUnitListPageProps {
  initialBusinessUnits: BusinessUnitData[];
}

const BusinessUnitListPage: React.FC<BusinessUnitListPageProps> = ({ initialBusinessUnits }) => {
  const router = useRouter();
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitData[]>(initialBusinessUnits);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; businessUnit: BusinessUnitData | null }>({
    open: false,
    businessUnit: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteDialog.businessUnit) return;

    setLoading('delete');
    try {
      const result = await deleteBusinessUnit(deleteDialog.businessUnit.id);
      if (result.success) {
        setBusinessUnits(prev => prev.filter(bu => bu.id !== deleteDialog.businessUnit!.id));
        setSnackbar({
          open: true,
          message: 'Business unit deleted successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to delete business unit',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while deleting',
        severity: 'error',
      });
    } finally {
      setLoading(null);
      setDeleteDialog({ open: false, businessUnit: null });
    }
  };

  const handleToggleStatus = async (businessUnitId: string, currentStatus: boolean) => {
    setLoading(businessUnitId);
    try {
      const result = await toggleBusinessUnitStatus(businessUnitId, !currentStatus);
      if (result.success) {
        setBusinessUnits(prev => prev.map(bu => 
          bu.id === businessUnitId ? { ...bu, isActive: !currentStatus } : bu
        ));
        setSnackbar({
          open: true,
          message: `Business unit ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
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
        message: 'An error occurred while updating status',
        severity: 'error',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleToggleFeatured = async (businessUnitId: string, currentFeatured: boolean) => {
    setLoading(businessUnitId);
    try {
      const result = await toggleBusinessUnitFeatured(businessUnitId, !currentFeatured);
      if (result.success) {
        setBusinessUnits(prev => prev.map(bu => 
          bu.id === businessUnitId ? { ...bu, isFeatured: !currentFeatured } : bu
        ));
        setSnackbar({
          open: true,
          message: `Business unit ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
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
        message: 'An error occurred while updating featured status',
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
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getPropertyTypeColor = (type: string) => {
    const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      'HOTEL': 'primary',
      'RESORT': 'secondary',
      'VILLA': 'success',
      'APARTMENT': 'info',
      'HOSTEL': 'warning',
    };
    return colorMap[type] || 'default';
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
            Properties Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/operations/properties/new')}
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
            Create New Property
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
          Manage hotel properties and business units across the Tropicana network.
        </Typography>
      </Box>

      {/* Business Unit Cards */}
      {businessUnits.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <HotelIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
              No properties found
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
              Create your first property to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/operations/properties/new')}
              sx={{
                backgroundColor: '#111827',
                '&:hover': { backgroundColor: '#1f2937' },
              }}
            >
              Create Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {businessUnits.map((businessUnit) => (
            <Card
              key={businessUnit.id}
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
                {/* Logo/Image Section */}
                <Box
                  sx={{
                    width: { xs: '100%', md: '200px' },
                    height: '200px',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {businessUnit.logo ? (
                    <Box
                      component="img"
                      src={businessUnit.logo}
                      alt={`${businessUnit.displayName} logo`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: businessUnit.primaryColor || '#111827',
                        fontSize: '2rem',
                        fontWeight: 700,
                      }}
                    >
                      {businessUnit.displayName.charAt(0)}
                    </Avatar>
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
                    {businessUnit.isFeatured && (
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
                      label={businessUnit.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={businessUnit.isActive ? 'success' : 'default'}
                      sx={{ fontSize: '0.75rem' }}
                    />
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
                          {businessUnit.displayName}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#6b7280',
                            mb: 1,
                            fontWeight: 500,
                          }}
                        >
                          {businessUnit.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={businessUnit.propertyType.replace('_', ' ')}
                        color={getPropertyTypeColor(businessUnit.propertyType)}
                        size="small"
                        sx={{ ml: 2, textTransform: 'capitalize' }}
                      />
                    </Box>

                    {businessUnit.shortDescription && (
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
                        {businessUnit.shortDescription}
                      </Typography>
                    )}

                    {/* Contact Information */}
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {businessUnit.city}, {businessUnit.state && `${businessUnit.state}, `}{businessUnit.country}
                        </Typography>
                      </Box>
                      {businessUnit.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            {businessUnit.phone}
                          </Typography>
                        </Box>
                      )}
                      {businessUnit.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            {businessUnit.email}
                          </Typography>
                        </Box>
                      )}
                    </Stack>

                    {/* Statistics */}
                    <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>
                          {businessUnit._count.rooms}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>
                          Rooms
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>
                          {businessUnit._count.restaurants}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>
                          Restaurants
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>
                          {businessUnit._count.specialOffers}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>
                          Offers
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Metadata */}
                    <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        Order: {businessUnit.sortOrder}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        Updated: {formatDate(businessUnit.updatedAt)}
                      </Typography>
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ p: 0, pt: 2, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={businessUnit.isActive}
                            onChange={() => handleToggleStatus(businessUnit.id, businessUnit.isActive)}
                            disabled={loading === businessUnit.id}
                            size="small"
                          />
                        }
                        label="Active"
                        sx={{ mr: 2 }}
                      />
                      <IconButton
                        onClick={() => handleToggleFeatured(businessUnit.id, businessUnit.isFeatured)}
                        disabled={loading === businessUnit.id}
                        sx={{
                          color: businessUnit.isFeatured ? '#fbbf24' : '#9ca3af',
                          '&:hover': {
                            backgroundColor: businessUnit.isFeatured ? 'rgba(251, 191, 36, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                          },
                        }}
                      >
                        {businessUnit.isFeatured ? <StarIcon /> : <StarBorderIcon />}
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => router.push(`/admin/operations/properties/${businessUnit.id}`)}
                        sx={{ color: '#6b7280' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => setDeleteDialog({ open: true, businessUnit })}
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
        onClose={() => setDeleteDialog({ open: false, businessUnit: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          Delete Business Unit
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{deleteDialog.businessUnit?.displayName}&quot;? This action cannot be undone.
          </Typography>
          {deleteDialog.businessUnit && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                {deleteDialog.businessUnit.displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {deleteDialog.businessUnit.city}, {deleteDialog.businessUnit.country}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, businessUnit: null })}
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

export default BusinessUnitListPage;