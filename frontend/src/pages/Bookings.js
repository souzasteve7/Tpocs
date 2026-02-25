import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Snackbar,
  TextField,
  Tabs,
  Tab
} from '@mui/material';
import {
  BookOnline,
  Hotel,
  TravelExplore,
  Cancel,
  Person,
  Email,
  Phone
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { bookingAPI } from '../services/api';

const Bookings = () => {
  const { user, isAuthenticated } = useAuth();
  const { selectedCurrency, convertCurrency, formatCurrency } = useCurrency();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cancelDialog, setCancelDialog] = useState({ open: false, booking: null });
  const [canceling, setCanceling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [typeTab, setTypeTab] = useState(0);
  const [statusTab, setStatusTab] = useState(0);

  // Fetch user bookings
  const fetchBookings = useCallback(async () => {
    if (!isAuthenticated) {
      setError('Please login to view your bookings');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await bookingAPI.getAllBookings();
      console.log('Bookings response:', response.data);
      
      setBookings(response.data);
      
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(
        err.response?.data?.message || 
        'Failed to load bookings. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    try {
      setCanceling(true);
      
      const response = await bookingAPI.cancelBooking(bookingId, cancelReason);
      console.log('Cancel response:', response.data);
      
      setSuccessMessage('Booking cancelled successfully');
      fetchBookings(); // Refresh the list
      setCancelDialog({ open: false, booking: null });
      setCancelReason('');
      
    } catch (err) {
      console.error('Cancel booking error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to cancel booking. Please try again.'
      );
    } finally {
      setCanceling(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, fetchBookings]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const isCancelledBooking = (booking) => (booking.status || '').toLowerCase() === 'cancelled';

  const normalizeBookingType = (booking) => {
    const type = (booking.type || '').toLowerCase();
    if (type.includes('transport')) return 'transport';
    if (type.includes('hotel')) return 'hotel';
    return booking.transport || booking.transportType ? 'transport' : 'hotel';
  };

  const getDisplayStatus = (booking) => (isCancelledBooking(booking) ? 'Cancelled' : 'Confirmed');

  const getDisplayAmount = (booking) => {
    const rawAmount = Number(booking.totalAmount || 0);
    const fromCurrency = booking.currency || 'INR';
    const toCurrency = selectedCurrency || fromCurrency;
    const convertedAmount = convertCurrency(rawAmount, fromCurrency, toCurrency);
    return formatCurrency(convertedAmount, toCurrency);
  };

  const typeFilteredBookings = bookings.filter((booking) =>
    typeTab === 0 ? normalizeBookingType(booking) === 'hotel' : normalizeBookingType(booking) === 'transport'
  );
  const confirmedBookings = typeFilteredBookings.filter((booking) => !isCancelledBooking(booking));
  const cancelledBookings = typeFilteredBookings.filter((booking) => isCancelledBooking(booking));
  const displayedBookings = statusTab === 0 ? confirmedBookings : cancelledBookings;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 4 } }}>
      {/* Success Message Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BookOnline sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          My Bookings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={220}>
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No bookings found. Start exploring and book your next adventure!
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3} alignItems="flex-start">
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 1.5, position: 'sticky', top: 16, borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ px: 1, pb: 1, color: 'text.secondary' }}>
                  Booking Type
                </Typography>
                <Tabs
                  value={typeTab}
                  onChange={(_, newValue) => setTypeTab(newValue)}
                  orientation="vertical"
                  variant="scrollable"
                  indicatorColor="primary"
                  textColor="primary"
                  sx={{
                    minHeight: 120,
                    '& .MuiTabs-indicator': {
                      left: 0,
                      width: 3,
                      borderRadius: '0 4px 4px 0'
                    },
                    '& .MuiTab-root': {
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      textTransform: 'none',
                      minHeight: 48,
                      borderRadius: 1,
                      mb: 0.5,
                      px: 1.25
                    }
                  }}
                >
                  <Tab icon={<Hotel />} iconPosition="start" label={`Hotels (${bookings.filter((booking) => normalizeBookingType(booking) === 'hotel').length})`} />
                  <Tab icon={<TravelExplore />} iconPosition="start" label={`Transport (${bookings.filter((booking) => normalizeBookingType(booking) === 'transport').length})`} />
                </Tabs>
              </Paper>
            </Grid>

            <Grid item xs={12} md={9} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Paper sx={{ mb: 3, borderRadius: 2, flexShrink: 0 }}>
                <Tabs
                  value={statusTab}
                  onChange={(_, newValue) => setStatusTab(newValue)}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 500
                    }
                  }}
                >
                  <Tab label={`Confirmed (${confirmedBookings.length})`} />
                  <Tab label={`Cancelled (${cancelledBookings.length})`} />
                </Tabs>
              </Paper>

              <Box sx={{ width: '100%', minHeight: { xs: 320, md: 560 } }}>
                {displayedBookings.length === 0 ? (
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      height: '100%',
                      minHeight: { xs: 320, md: 560 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      {statusTab === 0
                        ? 'No confirmed bookings for this category yet.'
                        : 'No cancelled bookings for this category.'}
                    </Typography>
                  </Paper>
                ) : (
                  <Grid container spacing={3} alignContent="flex-start" sx={{ minHeight: { xs: 320, md: 560 } }}>
                    {displayedBookings.map((booking) => (
            <Grid item xs={12} key={booking.id}>
              <Card sx={{ mb: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Booking #{booking.id}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={normalizeBookingType(booking) === 'hotel' ? 'Hotel' : 'Transport'}
                          color="primary"
                          size="small"
                        />
                        <Chip
                          label={getDisplayStatus(booking)}
                          color={getStatusColor(getDisplayStatus(booking))}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                      <Typography variant="h6" color="primary">
                        {getDisplayAmount(booking)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Amount
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Hotel Details */}
                  {booking.hotel && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Hotel sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1" fontWeight="bold">
                          {booking.hotel.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {booking.hotel.address}
                      </Typography>
                      <Grid container spacing={1} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2"><strong>Check-in:</strong> {formatDate(booking.checkInDate)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2"><strong>Check-out:</strong> {formatDate(booking.checkOutDate)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2"><strong>Guests:</strong> {booking.numberOfGuests || 1}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  {(booking.transport || booking.transportType || normalizeBookingType(booking) === 'transport') && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TravelExplore sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1" fontWeight="bold">
                          {(booking.transportType || booking.type || 'Transport').toString().replace(/_/g, ' ')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {(booking.departureLocation || 'Origin')} → {(booking.arrivalLocation || 'Destination')}
                      </Typography>
                      <Grid container spacing={1} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2"><strong>Departure:</strong> {formatDate(booking.departureDate)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2"><strong>Provider:</strong> {booking.transportProviderId || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2"><strong>Guests:</strong> {booking.numberOfGuests || 1}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  {/* Contact Information */}
                  {(booking.contactName || booking.contactEmail || booking.contactPhone) && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Contact Information
                      </Typography>
                      <List dense sx={{ '& .MuiListItemIcon-root': { minWidth: 32 } }}>
                        {booking.contactName && (
                          <ListItem disablePadding>
                            <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                            <ListItemText primary={booking.contactName} />
                          </ListItem>
                        )}
                        {booking.contactEmail && (
                          <ListItem disablePadding>
                            <ListItemIcon><Email fontSize="small" /></ListItemIcon>
                            <ListItemText primary={booking.contactEmail} />
                          </ListItem>
                        )}
                        {booking.contactPhone && (
                          <ListItem disablePadding>
                            <ListItemIcon><Phone fontSize="small" /></ListItemIcon>
                            <ListItemText primary={booking.contactPhone} />
                          </ListItem>
                        )}
                      </List>
                    </>
                  )}

                  {/* Special Requests */}
                  {booking.specialRequests && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Special Requests
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {booking.specialRequests}
                      </Typography>
                    </>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, mt: 2.5 }}>
                    {!isCancelledBooking(booking) && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => setCancelDialog({ open: true, booking })}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Grid>
          </Grid>
        </>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, booking: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Cancel Booking #{cancelDialog.booking?.id}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Cancellation Reason (Optional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="Please provide a reason for cancellation..."
          />
          
          {cancelDialog.booking?.hotel && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2">{cancelDialog.booking.hotel.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(cancelDialog.booking.checkInDate)} - {formatDate(cancelDialog.booking.checkOutDate)}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                {cancelDialog.booking ? getDisplayAmount(cancelDialog.booking) : formatCurrency(0, selectedCurrency || 'INR')}
              </Typography>
            </Box>
          )}

          {!cancelDialog.booking?.hotel && cancelDialog.booking && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2">
                {(cancelDialog.booking.transportType || cancelDialog.booking.type || 'Transport').toString().replace(/_/g, ' ')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(cancelDialog.booking.departureLocation || 'Origin')} → {(cancelDialog.booking.arrivalLocation || 'Destination')}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                {getDisplayAmount(cancelDialog.booking)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCancelDialog({ open: false, booking: null })}
            disabled={canceling}
          >
            Keep Booking
          </Button>
          <Button
            onClick={() => handleCancelBooking(cancelDialog.booking.id)}
            color="error"
            variant="contained"
            disabled={canceling}
            startIcon={canceling ? <CircularProgress size={18} /> : <Cancel />}
          >
            {canceling ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Bookings;