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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Restaurant as RestaurantIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { deleteRestaurant, RestaurantData, toggleRestaurantFeatured, toggleRestaurantStatus } from '../../../../../../lib/actions/resto-management';
import { RestaurantType } from '@prisma/client';


interface RestaurantListPageProps {
  initialRestaurants: RestaurantData[];
}

const RestaurantListPage: React.FC<RestaurantListPageProps> = ({ initialRestaurants }) => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<RestaurantData[]>(initialRestaurants);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; restaurant: RestaurantData | null }>({
    open: false,
    restaurant: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteDialog.restaurant) return;

    setLoading('delete');
    try {
      const result = await deleteRestaurant(deleteDialog.restaurant.id);
      if (result.success) {
        setRestaurants(prev => prev.filter(r => r.id !== deleteDialog.restaurant!.id));
        setSnackbar({
          open: true,
          message: 'Restaurant deleted successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to delete restaurant',
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
      setDeleteDialog({ open: false, restaurant: null });
    }
  };

  const handleToggleStatus = async (restaurantId: string, currentStatus: boolean) => {
    setLoading(restaurantId);
    try {
      const result = await toggleRestaurantStatus(restaurantId, !currentStatus);
      if (result.success) {
        setRestaurants(prev => prev.map(r => 
          r.id === restaurantId ? { ...r, isActive: !currentStatus } : r
        ));
        setSnackbar({
          open: true,
          message: `Restaurant ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
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

  const handleToggleFeatured = async (restaurantId: string, currentFeatured: boolean) => {
    setLoading(restaurantId);
    try {
      const result = await toggleRestaurantFeatured(restaurantId, !currentFeatured);
      if (result.success) {
        setRestaurants(prev => prev.map(r => 
          r.id === restaurantId ? { ...r, isFeatured: !currentFeatured } : r
        ));
        setSnackbar({
          open: true,
          message: `Restaurant ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
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

  const formatCurrency = (amount: string | null, currency: string) => {
    if (!amount) return 'Not set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(Number(amount));
  };

  const getRestaurantTypeColor = (type: RestaurantType) => {
    const colorMap: Record<RestaurantType, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      'FINE_DINING': 'primary',
      'CASUAL_DINING': 'secondary',
      'CAFE': 'success',
      'BAR': 'warning',
      'BUFFET': 'info',
      'ROOM_SERVICE': 'secondary',
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
            Restaurants Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/operations/restaurants/new')}
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
            Create New Restaurant
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
          Manage restaurants and dining venues across all properties.
        </Typography>
      </Box>

      {/* Restaurant Cards */}
      {restaurants.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <RestaurantIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
              No restaurants found
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
              Create your first restaurant to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/operations/restaurants/new')}
              sx={{
                backgroundColor: '#111827',
                '&:hover': { backgroundColor: '#1f2937' },
              }}
            >
              Create Restaurant
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
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
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#111827',
                          fontSize: '1.25rem',
                        }}
                      >
                        {restaurant.name}
                      </Typography>
                      <Chip
                        label={restaurant.type.replace('_', ' ')}
                        color={getRestaurantTypeColor(restaurant.type)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                      {restaurant.isFeatured && (
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
                        label={restaurant.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={restaurant.isActive ? 'success' : 'default'}
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6b7280',
                        mb: 1,
                        fontWeight: 500,
                      }}
                    >
                      {restaurant.businessUnit.displayName}
                    </Typography>

                    {restaurant.shortDesc && (
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
                        {restaurant.shortDesc}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: '#111827',
                        fontSize: '1rem',
                        mb: 0.5,
                      }}
                    >
                      {restaurant.priceRange || 'Moderate'}
                    </Typography>
                    {restaurant.averageMeal && (
                      <Typography
                        sx={{
                          color: '#6b7280',
                          fontSize: '0.875rem',
                        }}
                      >
                        Avg: {formatCurrency(restaurant.averageMeal, restaurant.currency)}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Restaurant Details */}
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {restaurant.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {restaurant.location}
                      </Typography>
                    </Box>
                  )}
                  {restaurant.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {restaurant.phone}
                      </Typography>
                    </Box>
                  )}
                  {restaurant.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {restaurant.email}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                {/* Cuisine Types */}
                {restaurant.cuisine.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 1 }}>
                      Cuisine:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                      {restaurant.cuisine.slice(0, 3).map((type) => (
                        <Chip
                          key={type}
                          label={type}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 24 }}
                        />
                      ))}
                      {restaurant.cuisine.length > 3 && (
                        <Chip
                          label={`+${restaurant.cuisine.length - 3} more`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem', height: 24 }}
                        />
                      )}
                    </Stack>
                  </Box>
                )}

                {/* Statistics */}
                <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>
                      {restaurant._count.menuCategories}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>
                      Menu Categories
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>
                      {restaurant._count.reservations}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>
                      Reservations
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>
                      {restaurant.viewCount}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>
                      Views
                    </Typography>
                  </Box>
                </Stack>

                {/* Metadata */}
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                    Order: {restaurant.sortOrder}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                    Updated: {formatDate(restaurant.updatedAt)}
                  </Typography>
                </Stack>

                <CardActions sx={{ p: 0, pt: 2, justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={restaurant.isActive}
                          onChange={() => handleToggleStatus(restaurant.id, restaurant.isActive)}
                          disabled={loading === restaurant.id}
                          size="small"
                        />
                      }
                      label="Active"
                      sx={{ mr: 2 }}
                    />
                    <IconButton
                      onClick={() => handleToggleFeatured(restaurant.id, restaurant.isFeatured)}
                      disabled={loading === restaurant.id}
                      sx={{
                        color: restaurant.isFeatured ? '#fbbf24' : '#9ca3af',
                        '&:hover': {
                          backgroundColor: restaurant.isFeatured ? 'rgba(251, 191, 36, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                        },
                      }}
                    >
                      {restaurant.isFeatured ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => router.push(`/admin/operations/restaurants/${restaurant.id}`)}
                      sx={{ color: '#6b7280' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setDeleteDialog({ open: true, restaurant })}
                      sx={{ color: '#dc2626' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, restaurant: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          Delete Restaurant
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialog.restaurant?.name}"? This action cannot be undone.
          </Typography>
          {deleteDialog.restaurant && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                {deleteDialog.restaurant.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                {deleteDialog.restaurant.businessUnit.displayName}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, restaurant: null })}
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

export default RestaurantListPage;