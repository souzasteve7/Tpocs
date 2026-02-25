import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  CardMedia,
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
  ListItemIcon
} from '@mui/material';
import {
  BookOnline,
  Hotel,
  FlightTakeoff,
  Cancel,
  CheckCircle,
  Schedule,
  Person,
  Email,
  Phone
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialog, setCancelDialog] = useState({ open: false, booking: null });
  const [canceling, setCanceling] = useState(false);
  const { user } = useAuth();

  const baseURL = 'http://localhost:8080/api';

  // Fetch user bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${baseURL}/bookings/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
        setError('');
      } else if (response.status === 401) {
        setError('Please login to view your bookings');
      } else {
        throw new Error('Failed to fetch bookings');
      }
    } catch (err) {
      setError('Error loading bookings: ' + err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    try {
      setCanceling(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${baseURL}/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Booking cancelled successfully');
        fetchBookings(); // Refresh the list
        setCancelDialog({ open: false, booking: null });
      } else {
        throw new Error('Failed to cancel booking');
      }
    } catch (err) {
      toast.error('Error cancelling booking: ' + err.message);
      console.error('Error cancelling booking:', err);
    } finally {
      setCanceling(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
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
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No bookings found. Start exploring and book your next adventure!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} key={booking.id}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Booking #{booking.id}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={booking.type?.charAt(0).toUpperCase() + booking.type?.slice(1) || 'Hotel'}
                          color="primary"
                          size="small"
                        />
                        <Chip
                          label={booking.status || 'Confirmed'}
                          color={getStatusColor(booking.status)}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary">
                        ${booking.totalAmount || '0.00'}
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
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Typography variant="body2">
                          <strong>Check-in:</strong> {formatDate(booking.checkInDate)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Check-out:</strong> {formatDate(booking.checkOutDate)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Guests:</strong> {booking.numberOfGuests || 1}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Contact Information */}
                  {(booking.contactName || booking.contactEmail || booking.contactPhone) && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Contact Information
                      </Typography>
                      <List dense>
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

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    {booking.status !== 'cancelled' && (
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
          {cancelDialog.booking?.hotel && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2">{cancelDialog.booking.hotel.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(cancelDialog.booking.checkInDate)} - {formatDate(cancelDialog.booking.checkOutDate)}
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                ${cancelDialog.booking.totalAmount}
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