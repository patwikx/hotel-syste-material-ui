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
  QuestionAnswer as FAQIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { FAQData } from '../../../../../../../lib/actions/faqs';
import { deleteFAQ, toggleFAQStatus } from '../../../../../../../lib/actions/faq-management';


interface FAQListPageProps {
  initialFAQs: FAQData[];
}

const FAQListPage: React.FC<FAQListPageProps> = ({ initialFAQs }) => {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; faq: FAQData | null }>({
    open: false,
    faq: null,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteDialog.faq) return;

    setLoadingId('delete');
    try {
      const result = await deleteFAQ(deleteDialog.faq.id);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'FAQ deleted successfully',
          severity: 'success',
        });
        router.refresh();
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to delete FAQ',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `An unexpected error occurred.`,
        severity: 'error',
      });
    } finally {
      setLoadingId(null);
      setDeleteDialog({ open: false, faq: null });
    }
  };

  const handleToggleStatus = async (faqId: string, currentStatus: boolean) => {
    setLoadingId(faqId);
    try {
      const result = await toggleFAQStatus(faqId, !currentStatus);
      if (result.success) {
        setSnackbar({
          open: true,
          message: `FAQ status updated successfully`,
          severity: 'success',
        });
        router.refresh();
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
        message: `An unexpected error occurred.`,
        severity: 'error',
      });
    } finally {
      setLoadingId(null);
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

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'> = {
      'General': 'primary',
      'Booking': 'secondary',
      'Payment': 'success',
      'Amenities': 'info',
      'Policies': 'warning',
      'Transportation': 'error',
      'Dining': 'secondary',
    };
    return colorMap[category] || 'default';
  };

  const faqs = initialFAQs || [];

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
            FAQs Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/admin/cms/faqs/new')}
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
            Create New FAQ
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
          Manage frequently asked questions to help guests find answers quickly and improve their experience.
        </Typography>
      </Box>

      {/* FAQ Cards */}
      {faqs.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <FAQIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
              No FAQs found
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
              Create your first FAQ to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/cms/faqs/new')}
              sx={{
                backgroundColor: '#111827',
                '&:hover': { backgroundColor: '#1f2937' },
              }}
            >
              Create FAQ
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {faqs.map((faq) => (
            <Card
              key={faq.id}
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
                      <Chip
                        label={faq.category}
                        color={getCategoryColor(faq.category)}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                      <Chip
                        label={faq.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={faq.isActive ? 'success' : 'default'}
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#111827',
                        mb: 2,
                        fontSize: '1.25rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {faq.question}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6b7280',
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </Box>
                </Box>

                {/* Metadata */}
                <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                    Order: {faq.sortOrder}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                    Updated: {formatDate(faq.updatedAt)}
                  </Typography>
                </Stack>

                <CardActions sx={{ p: 0, justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={faq.isActive}
                          onChange={() => handleToggleStatus(faq.id, faq.isActive)}
                          disabled={loadingId === faq.id}
                          size="small"
                        />
                      }
                      label="Active"
                      sx={{ mr: 2 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={() => router.push(`/admin/cms/faqs/${faq.id}`)}
                      sx={{ color: '#6b7280' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setDeleteDialog({ open: true, faq })}
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
        onClose={() => setDeleteDialog({ open: false, faq: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#111827' }}>
          Delete FAQ
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this FAQ? This action cannot be undone.
          </Typography>
          {deleteDialog.faq && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                {deleteDialog.faq.question}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, faq: null })}
            sx={{ color: '#6b7280' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={loadingId === 'delete'}
            sx={{
              backgroundColor: '#dc2626',
              '&:hover': { backgroundColor: '#b91c1c' },
            }}
          >
            {loadingId === 'delete' ? 'Deleting...' : 'Delete'}
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

export default FAQListPage;