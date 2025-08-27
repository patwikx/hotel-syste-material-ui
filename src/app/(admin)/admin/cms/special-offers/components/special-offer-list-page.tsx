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
  LocalOffer as OfferIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { SpecialOfferData } from '../../../../../../../lib/actions/special-offers';
import { deleteSpecialOffer, toggleSpecialOfferFeatured, toggleSpecialOfferStatus } from '../../../../../../../lib/cms-actions/special-offer';


interface SpecialOfferListPageProps {
  initialOffers: SpecialOfferData[];
}

const SpecialOfferListPage: React.FC<SpecialOfferListPageProps> = ({ initialOffers }) => {
  const router = useRouter();
  const [offers, setOffers] = useState<SpecialOfferData[]>(initialOffers);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; offer: SpecialOfferData | null }>({
    open: false,
    offer: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteDialog.offer) return;

    setLoading('delete');
    try {
      const result = await deleteSpecialOffer(deleteDialog.offer.id);
      if (result.success) {
        setOffers(prev => prev.filter(o => o.id !== deleteDialog.offer!.id));
        setSnackbar({
          open: true,
          message: 'Special offer deleted successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to delete special offer',
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
      setDeleteDialog({ open: false, offer: null });
    }
  };

  const handleToggleStatus = async (offerId: string, currentStatus: boolean) => {
    setLoading(offerId);
    try {
      const result = await toggleSpecialOfferStatus(offerId, !currentStatus);
      if (result.success) {
        setOffers(prev => prev.map(o => 
          o.id === offerId ? { ...o, isPublished: !currentStatus } : o
        ));
        setSnackbar({
          open: true,
          message: `Special offer ${!currentStatus ? 'published' : 'unpublished'} successfully`,
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

  const handleToggleFeatured = async (offerId: string, currentFeatured: boolean) => {
    setLoading(offerId);
    try {
      const result = await toggleSpecialOfferFeatured(offerId, !currentFeatured);
      if (result.success) {
        setOffers(prev => prev.map(o => 
          o.id === offerId ? { ...o, isFeatured: !currentFeatured } : o
        ));
        setSnackbar({
          open: true,
          message: `Special offer ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
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

  const calculateDiscount = (offer: SpecialOfferData): string => {
    if (offer.savingsPercent) {
      return `${offer.savingsPercent}% OFF`;
    }
    if (offer.savingsAmount && offer.originalPrice) {
      const percentage = Math.round((offer.savingsAmount / offer.originalPrice) * 100);
      return `${percentage}% OFF`;
    }
    return 'SPECIAL OFFER';
  };

  const getOfferTypeColor = (type: string) => {
    const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      'ROOM_DISCOUNT': 'primary',
      'PACKAGE_DEAL': 'secondary',
      'EARLY_BIRD': 'success',
      'LAST_MINUTE': 'warning',
      'SEASONAL': 'info',
      'LOYALTY': 'secondary',
    };
    return colorMap[type] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      'ACTIVE': 'success',
      'INACTIVE': 'warning',
      'EXPIRED': 'error',
      'SCHEDULED': 'info',
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
            Special Offers
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/cms/special-offers/new')}
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
            Create New Offer
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
          Manage special offers and promotional deals across all properties to attract and retain guests.
        </Typography>
      </Box>

      {/* Offer Cards */}
      {offers.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <OfferIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
              No special offers found
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
              Create your first special offer to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/cms/special-offers/new')}
              sx={{
                backgroundColor: '#111827',
                '&:hover': { backgroundColor: '#1f2937' },
              }}
            >
              Create Special Offer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {offers.map((offer) => (
            <Card
              key={offer.id}
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
                  {offer.images.length > 0 ? (
                    <Box
                      component="img"
                      src={offer.images[0].image.originalUrl}
                      alt={offer.images[0].image.altText || offer.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#9ca3af' }}>
                      <OfferIcon sx={{ fontSize: 32 }} />
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
                    {offer.isFeatured && (
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
                      label={offer.isPublished ? 'Published' : 'Draft'}
                      size="small"
                      color={offer.isPublished ? 'success' : 'default'}
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </Box>

                  {/* Discount Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      backgroundColor: '#dc2626',
                      color: 'white',
                      px: 2,
                      py: 1,
                      fontSize: '0.875rem',
                      fontWeight: 900,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
                    }}
                  >
                    {calculateDiscount(offer)}
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
                          {offer.title}
                        </Typography>
                        {offer.subtitle && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#6b7280',
                              mb: 1,
                              fontWeight: 500,
                            }}
                          >
                            {offer.subtitle}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                        <Chip
                          label={offer.type.replace('_', ' ')}
                          color={getOfferTypeColor(offer.type)}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                        <Chip
                          label={offer.status}
                          color={getStatusColor(offer.status)}
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
                      {offer.description}
                    </Typography>

                    {/* Offer Details */}
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          Valid: {formatDate(offer.validFrom)} - {formatDate(offer.validTo)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MoneyIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {offer.currency} {offer.offerPrice.toLocaleString()}
                          {offer.originalPrice && (
                            <span style={{ textDecoration: 'line-through', marginLeft: '8px', color: '#9ca3af' }}>
                              {offer.currency} {offer.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </Typography>
                      </Box>
                      {offer.businessUnit && (
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          Property: {offer.businessUnit.displayName}
                        </Typography>
                      )}
                    </Stack>

                    {/* Savings Information */}
                    {(offer.savingsAmount || offer.savingsPercent) && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                          Save {offer.savingsPercent ? `${offer.savingsPercent}%` : `${offer.currency} ${offer.savingsAmount?.toLocaleString()}`}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 0, pt: 2, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={offer.isPublished}
                            onChange={() => handleToggleStatus(offer.id, offer.isPublished)}
                            disabled={loading === offer.id}
                            size="small"
                          />
                        }
                        label="Published"
                        sx={{ mr: 2 }}
                      />
                      <IconButton
                        onClick={() => handleToggleFeatured(offer.id, offer.isFeatured)}
                        disabled={loading === offer.id}
                        sx={{
                          color: offer.isFeatured ? '#fbbf24' : '#9ca3af',
                          '&:hover': {
                            backgroundColor: offer.isFeatured ? 'rgba(251, 191, 36, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                          },
                        }}
                      >
                        {offer.isFeatured ? <StarIcon /> : <StarBorderIcon />}
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => router.push(`/admin/cms/special-offers/${offer.id}`)}
                        sx={{ color: '#6b7280' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => setDeleteDialog({ open: true, offer })}
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
        onClose={() => setDeleteDialog({ open: false, offer: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          Delete Special Offer
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{deleteDialog.offer?.title}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, offer: null })}
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

export default SpecialOfferListPage;