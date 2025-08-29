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
  Image as ImageIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { HeroData } from '../../../../../../lib/actions/heroes';
import { deleteHeroSlide, toggleHeroFeatured, toggleHeroStatus } from '../../../../../../lib/cms-actions/hero-management';


interface HeroListPageProps {
  initialHeroes: HeroData[];
}

const HeroListPage: React.FC<HeroListPageProps> = ({ initialHeroes }) => {
  const router = useRouter();
  const [heroes, setHeroes] = useState<HeroData[]>(initialHeroes);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; hero: HeroData | null }>({
    open: false,
    hero: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteDialog.hero) return;

    setLoading('delete');
    try {
      const result = await deleteHeroSlide(deleteDialog.hero.id);
      if (result.success) {
        setHeroes(prev => prev.filter(h => h.id !== deleteDialog.hero!.id));
        setSnackbar({
          open: true,
          message: 'Hero slide deleted successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to delete hero slide',
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
      setDeleteDialog({ open: false, hero: null });
    }
  };

  const handleToggleStatus = async (heroId: string, currentStatus: boolean) => {
    setLoading(heroId);
    try {
      const result = await toggleHeroStatus(heroId, !currentStatus);
      if (result.success) {
        setHeroes(prev => prev.map(h => 
          h.id === heroId ? { ...h, isActive: !currentStatus } : h
        ));
        setSnackbar({
          open: true,
          message: `Hero slide ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
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

  const handleToggleFeatured = async (heroId: string, currentFeatured: boolean) => {
    setLoading(heroId);
    try {
      const result = await toggleHeroFeatured(heroId, !currentFeatured);
      if (result.success) {
        setHeroes(prev => prev.map(h => 
          h.id === heroId ? { ...h, isFeatured: !currentFeatured } : h
        ));
        setSnackbar({
          open: true,
          message: `Hero slide ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
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
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getDisplayTypeColor = (type: string) => {
    switch (type) {
      case 'fullscreen': return 'primary';
      case 'banner': return 'secondary';
      case 'carousel': return 'success';
      default: return 'default';
    }
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
            Hero Slides
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/cms/hero/new')}
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
            Create New Hero
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
          Manage hero slides that appear on your website. Create engaging visuals to capture visitor attention.
        </Typography>
      </Box>

      {/* Hero Cards */}
      {heroes.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <ImageIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
              No hero slides found
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
              Create your first hero slide to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/cms/hero/new')}
              sx={{
                backgroundColor: '#111827',
                '&:hover': { backgroundColor: '#1f2937' },
              }}
            >
              Create Hero Slide
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {heroes.map((hero) => (
            <Card
              key={hero.id}
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
                {/* Image/Video Preview */}
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
                  {hero.backgroundImage ? (
                    <Box
                      component="img"
                      src={hero.backgroundImage}
                      alt={hero.altText || hero.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : hero.backgroundVideo ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b7280' }}>
                      <PlayIcon sx={{ fontSize: 32 }} />
                      <Typography variant="body2">Video Background</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#9ca3af' }}>
                      <ImageIcon sx={{ fontSize: 32 }} />
                      <Typography variant="body2">No Media</Typography>
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
                    }}
                  >
                    {hero.isFeatured && (
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
                      label={hero.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={hero.isActive ? 'success' : 'default'}
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
                          {hero.title}
                        </Typography>
                        {hero.subtitle && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#6b7280',
                              mb: 1,
                              fontWeight: 500,
                            }}
                          >
                            {hero.subtitle}
                          </Typography>
                        )}
                      </Box>
                      <Chip
                        label={hero.displayType}
                        color={getDisplayTypeColor(hero.displayType)}
                        size="small"
                        sx={{ ml: 2, textTransform: 'capitalize' }}
                      />
                    </Box>

                    {hero.description && (
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
                        {hero.description}
                      </Typography>
                    )}

                    {/* Metadata */}
                    <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        Views: {hero.viewCount}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        Clicks: {hero.clickCount}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        Order: {hero.sortOrder}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        Updated: {formatDate(hero.updatedAt)}
                      </Typography>
                    </Stack>

                    {/* Target Pages */}
                    {hero.targetPages.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 1 }}>
                          Target Pages:
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                          {hero.targetPages.map((page) => (
                            <Chip
                              key={page}
                              label={page}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 24 }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 0, pt: 2, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={hero.isActive}
                            onChange={() => handleToggleStatus(hero.id, hero.isActive)}
                            disabled={loading === hero.id}
                            size="small"
                          />
                        }
                        label="Active"
                        sx={{ mr: 2 }}
                      />
                      <IconButton
                        onClick={() => handleToggleFeatured(hero.id, hero.isFeatured)}
                        disabled={loading === hero.id}
                        sx={{
                          color: hero.isFeatured ? '#fbbf24' : '#9ca3af',
                          '&:hover': {
                            backgroundColor: hero.isFeatured ? 'rgba(251, 191, 36, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                          },
                        }}
                      >
                        {hero.isFeatured ? <StarIcon /> : <StarBorderIcon />}
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => router.push(`/admin/cms/hero/${hero.id}`)}
                        sx={{ color: '#6b7280' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => setDeleteDialog({ open: true, hero })}
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
        onClose={() => setDeleteDialog({ open: false, hero: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          Delete Hero Slide
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{deleteDialog.hero?.title}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, hero: null })}
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

export default HeroListPage;