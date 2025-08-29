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
import { useRouter, useParams } from 'next/navigation';
import { getGuestById, GuestData, updateGuest, UpdateGuestData } from '../../../../../../lib/actions/guest-management';


interface GuestFormData {
  businessUnitId: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  country: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  passportNumber: string;
  passportExpiry: string;
  idNumber: string;
  idType: string;
  preferences: string; // Stored as a string for the form input
  loyaltyNumber: string;
  vipStatus: boolean;
  marketingOptIn: boolean;
  source: string;
  notes: string;
}

const EditGuestPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const guestId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [guest, setGuest] = useState<GuestData | null>(null);
  const [formData, setFormData] = useState<GuestFormData>({
    businessUnitId: '',
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    country: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    passportNumber: '',
    passportExpiry: '',
    idNumber: '',
    idType: '',
    preferences: '',
    loyaltyNumber: '',
    vipStatus: false,
    marketingOptIn: false,
    source: '',
    notes: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const loadGuest = async () => {
      try {
        const guestData = await getGuestById(guestId);
        if (guestData) {
          setGuest(guestData);
          setFormData({
            businessUnitId: guestData.businessUnitId,
            title: guestData.title || '',
            firstName: guestData.firstName,
            lastName: guestData.lastName,
            email: guestData.email,
            phone: guestData.phone || '',
            dateOfBirth: guestData.dateOfBirth ? new Date(guestData.dateOfBirth).toISOString().slice(0, 10) : '',
            nationality: guestData.nationality || '',
            country: guestData.country || '',
            address: guestData.address || '',
            city: guestData.city || '',
            state: guestData.state || '',
            postalCode: guestData.postalCode || '',
            passportNumber: guestData.passportNumber || '',
            passportExpiry: guestData.passportExpiry ? new Date(guestData.passportExpiry).toISOString().slice(0, 10) : '',
            idNumber: guestData.idNumber || '',
            idType: guestData.idType || '',
            preferences: guestData.preferences ? JSON.stringify(guestData.preferences) : '',
            loyaltyNumber: guestData.loyaltyNumber || '',
            vipStatus: guestData.vipStatus,
            marketingOptIn: guestData.marketingOptIn,
            source: guestData.source || '',
            notes: guestData.notes || '',
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Guest not found',
            severity: 'error',
          });
          router.push('/admin/operations/guests');
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to load guest',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    if (guestId) {
      loadGuest();
    }
  }, [guestId, router]);

  const handleInputChange = (field: keyof GuestFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const preferencesObj = formData.preferences ? JSON.parse(formData.preferences) : null;

      const guestData: UpdateGuestData = {
        id: guestId,
        businessUnitId: formData.businessUnitId,
        title: formData.title || null,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        nationality: formData.nationality || null,
        country: formData.country || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        postalCode: formData.postalCode || null,
        passportNumber: formData.passportNumber || null,
        passportExpiry: formData.passportExpiry ? new Date(formData.passportExpiry) : null,
        idNumber: formData.idNumber || null,
        idType: formData.idType || null,
        preferences: preferencesObj,
        notes: formData.notes || null,
        loyaltyNumber: formData.loyaltyNumber || null,
        vipStatus: formData.vipStatus,
        marketingOptIn: formData.marketingOptIn,
        source: formData.source || null,
      };

      const result = await updateGuest(guestData);

      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Guest updated successfully',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to update guest',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'An error occurred while updating guest',
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
          <Typography>Loading guest...</Typography>
        </Box>
      </Container>
    );
  }

  if (!guest) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">Guest not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => router.push('/admin/operations/guests')}
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
            Edit Guest
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
          Update guest information and preferences
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Personal Information */}
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
                Personal Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    sx={{
                      flex: 1,
                      minWidth: 100,
                      '& .MuiOutlinedInput-root': { borderRadius: 0 },
                    }}
                  />
                  <TextField
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': { borderRadius: 0 },
                    }}
                  />
                  <TextField
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': { borderRadius: 0 },
                    }}
                  />
                </Box>
                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': { borderRadius: 0 },
                    }}
                  />
                  <TextField
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': { borderRadius: 0 },
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Nationality"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': { borderRadius: 0 },
                    }}
                  />
                  <TextField
                    label="Country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    sx={{
                      flex: 1,
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': { borderRadius: 0 },
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Address Information */}
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
                Address Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                  <TextField
                    label="State/Province"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                  <TextField
                    label="Postal Code"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    sx={{ flex: 1, minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Identification */}
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
                Identification
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Passport Number"
                    value={formData.passportNumber}
                    onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                    sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                  <TextField
                    label="Passport Expiry"
                    type="date"
                    value={formData.passportExpiry}
                    onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="ID Number"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange('idNumber', e.target.value)}
                    sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                  <TextField
                    label="ID Type"
                    value={formData.idType}
                    onChange={(e) => handleInputChange('idType', e.target.value)}
                    sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                  />
                </Box>
                <TextField
                  label="Loyalty Number"
                  value={formData.loyaltyNumber}
                  onChange={(e) => handleInputChange('loyaltyNumber', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Preferences */}
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
                Preferences & Notes
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Preferences (JSON)"
                  value={formData.preferences}
                  onChange={(e) => handleInputChange('preferences', e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  helperText="Enter preferences as a JSON object (e.g., {'bedType': 'King', 'diet': 'Vegan'})"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
                />
                <TextField
                  label="Internal Notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  helperText="Internal staff notes about the guest"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0 } }}
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
              <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.vipStatus}
                      onChange={(e) => handleInputChange('vipStatus', e.target.checked)}
                    />
                  }
                  label="VIP Status"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.marketingOptIn}
                      onChange={(e) => handleInputChange('marketingOptIn', e.target.checked)}
                    />
                  }
                  label="Marketing Opt-In"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
            <Button
              type="button"
              onClick={() => router.push('/admin/operations/guests')}
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
                '&:hover': { backgroundColor: '#1f2937' },
                '&:disabled': { backgroundColor: '#9ca3af' },
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

export default EditGuestPage;