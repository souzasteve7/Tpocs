import React, { useState, useEffect } from 'react';
import {  
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Hotel, Person, AttachMoney } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { bookingAPI } from '../services/api';

const steps = ['Guest Details', 'Review Booking', 'Confirmation'];

const HotelBookingPage = ({ open, onClose, hotel, checkIn: initialCheckIn, checkOut: initialCheckOut, guests }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState(initialCheckIn ? new Date(initialCheckIn) : new Date());
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut ? new Date(initialCheckOut) : new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [bookingData, setBookingData] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    numberOfAdults: guests?.adults || 2,
    numberOfChildren: guests?.children || 0,
    specialRequests: '',
    roomType: 'standard',
  });
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  // Get user data from localStorage if available
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('authToken');
    
    console.log('User data from localStorage:', userData);
    console.log('Auth token available:', !!token);
    console.log('Auth token value:', token ? token.substring(0, 50) + '...' : 'No token');
    
    // Check if user is logged in
    if (!token) {
      toast.error('Please login to make a booking');
      onClose();
      return;
    }
    
    if (userData.name || userData.email) {
      setBookingData(prev => ({
        ...prev,
        contactName: userData.name || userData.username || userData.firstName || '',
        contactEmail: userData.email || '',
        contactPhone: userData.phone || userData.phoneNumber || userData.mobile || '',
      }));
    }
  }, [onClose]);

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate guest details
      if (!bookingData.contactName || !bookingData.contactEmail || !bookingData.contactPhone) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(bookingData.contactEmail)) {
        toast.error('Please enter a valid email address');
        return;
      }
    }
    
    if (activeStep === 1) {
      // Submit booking
      handleBookingSubmit();
      return;
    }
    
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const calculateTotalPrice = () => {
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const basePrice = hotel?.pricePerNight || 2500;
    const roomMultiplier = bookingData.roomType === 'deluxe' ? 1.5 : bookingData.roomType === 'suite' ? 2 : 1;
    return Math.round(basePrice * nights * roomMultiplier);
  };

  const handleBookingSubmit = async () => {
    try {
      setLoading(true);
      
      // Check if user is logged in
      const token = localStorage.getItem('authToken');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      console.log('=== BOOKING DEBUG INFO ===');
      console.log('Token exists:', !!token);
      console.log('Token length:', token ? token.length : 0);
      console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'No token');
      console.log('User data:', userData);
      console.log('LocalStorage keys:', Object.keys(localStorage));
      
      if (!token) {
        toast.error('Authentication required. Please login to make a booking.');
        console.log('No auth token found - redirecting to login');
        onClose();
        window.location.href = '/login';
        return;
      }

      // Validate dates
      if (checkInDate >= checkOutDate) {
        toast.error('Check-out date must be after check-in date');
        return;
      }

      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      
      // Format dates as YYYY-MM-DD
      const formatDate = (date) => {
        const d = new Date(date);
        return d.getFullYear() + '-' + 
               String(d.getMonth() + 1).padStart(2, '0') + '-' + 
               String(d.getDate()).padStart(2, '0');
      };
      
      const bookingRequest = {
        type: 'hotel',
        hotelId: hotel?.id || Math.floor(Math.random() * 1000),
        hotelName: hotel?.name || 'Selected Hotel',
        hotelAddress: hotel?.address || 'Hotel Address Not Available',
        hotelCategory: hotel?.category || 'mid-range',
        hotelAvailability: hotel?.availability || 'available',
        hotelRating: hotel?.rating || 4.0,
        hotelImageUrl: hotel?.imageUrl || hotel?.image,
        hotelDescription: hotel?.description || `Experience luxury at ${hotel?.name || 'this beautiful hotel'}`,
        checkInDate: formatDate(checkInDate),
        checkOutDate: formatDate(checkOutDate),
        numberOfGuests: bookingData.numberOfAdults + bookingData.numberOfChildren,
        numberOfAdults: bookingData.numberOfAdults,
        numberOfChildren: bookingData.numberOfChildren,
        roomType: bookingData.roomType,
        contactName: bookingData.contactName,
        contactEmail: bookingData.contactEmail,
        contactPhone: bookingData.contactPhone,
        specialRequests: bookingData.specialRequests,
        totalAmount: calculateTotalPrice(),
        currency: 'INR',
        nights: nights
      };

      console.log('Booking request:', bookingRequest);
      console.log('Auth token:', token ? 'Present' : 'Missing');
      console.log('Token details:', {
        exists: !!token,
        length: token ? token.length : 0,
        starts_with: token ? token.substring(0, 20) : 'N/A'
      });

      const response = await bookingAPI.bookHotel(bookingRequest);
      
      console.log('Booking response:', response.data);
      
      setBookingConfirmation(response.data);
      setActiveStep(2); // Move to confirmation step
      
      toast.success('Hotel booking confirmed successfully!');
      
    } catch (error) {
      console.error('Booking failed:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        onClose();
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Please check your authentication.');
        console.error('403 Forbidden Error details:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Try to get fresh token or redirect to login
        const token = localStorage.getItem('authToken');
        if (!token || token.length < 10) {
          toast.error('Invalid authentication token. Please login again.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          onClose();
          window.location.href = '/login';
        }
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Booking failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name *"
                value={bookingData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address *"
                type="email"
                value={bookingData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number *"
                value={bookingData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Room Type</InputLabel>
                <Select
                  value={bookingData.roomType}
                  onChange={(e) => handleInputChange('roomType', e.target.value)}
                >
                  <MenuItem value="standard">Standard Room</MenuItem>
                  <MenuItem value="deluxe">Deluxe Room (+50%)</MenuItem>
                  <MenuItem value="suite">Suite (+100%)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Check-in Date *"
                  value={checkInDate}
                  onChange={(newValue) => {
                    setCheckInDate(newValue);
                    // Auto-adjust check-out if it's before the new check-in
                    if (newValue && checkOutDate && newValue >= checkOutDate) {
                      const newCheckOut = new Date(newValue);
                      newCheckOut.setDate(newCheckOut.getDate() + 1);
                      setCheckOutDate(newCheckOut);
                    }
                  }}
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: "Select your arrival date"
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Check-out Date *"
                  value={checkOutDate}
                  onChange={(newValue) => setCheckOutDate(newValue)}
                  minDate={checkInDate || new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: "Select your departure date"
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Number of Adults"
                type="number"
                inputProps={{ min: 1, max: 10 }}
                value={bookingData.numberOfAdults}
                onChange={(e) => handleInputChange('numberOfAdults', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Number of Children"
                type="number"
                inputProps={{ min: 0, max: 10 }}
                value={bookingData.numberOfChildren}
                onChange={(e) => handleInputChange('numberOfChildren', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Requests"
                multiline
                rows={3}
                value={bookingData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                placeholder="Any special requests or preferences..."
              />
            </Grid>
          </Grid>
        );

      case 1:
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        return (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Hotel sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Hotel Details
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  {hotel?.name || 'Selected Hotel'}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {hotel?.type || 'Resort'} • ⭐ {hotel?.rating || 4.5}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Check-in</Typography>
                    <Typography variant="body2">{checkInDate.toLocaleDateString()}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Check-out</Typography>
                    <Typography variant="body2">{checkOutDate.toLocaleDateString()}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Nights</Typography>
                    <Typography variant="body2">{nights}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Guest Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Name</Typography>
                    <Typography variant="body1">{bookingData.contactName}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{bookingData.contactEmail}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                    <Typography variant="body1">{bookingData.contactPhone}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">Guests</Typography>
                    <Typography variant="body1">
                      {bookingData.numberOfAdults} Adults, {bookingData.numberOfChildren} Children
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Price Breakdown
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Room ({bookingData.roomType})</Typography>
                  <Typography>₹{hotel?.pricePerNight || 2500} x {nights} nights</Typography>
                </Box>
                {bookingData.roomType !== 'standard' && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="text.secondary">Room upgrade</Typography>
                    <Typography color="text.secondary">
                      +{bookingData.roomType === 'deluxe' ? '50%' : '100%'}
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total Amount</Typography>
                  <Typography variant="h6" color="primary">
                    ₹{calculateTotalPrice().toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );

      case 2:
        return (
          <Box textAlign="center">
            <Box sx={{ mb: 3 }}>
              <Hotel sx={{ fontSize: 64, color: 'success.main' }} />
            </Box>
            <Typography variant="h4" gutterBottom color="success.main">
              Booking Confirmed!
            </Typography>
            <Typography variant="h6" gutterBottom>
              Booking Reference: {bookingConfirmation?.bookingReference || 'HOTEL-' + Math.random().toString(36).substr(2, 9)}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Your hotel booking has been confirmed. You will receive a confirmation email shortly.
            </Typography>
            <Card sx={{ maxWidth: 400, mx: 'auto' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{hotel?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {checkInDate?.toLocaleDateString()} - {checkOutDate?.toLocaleDateString()}
                </Typography>
                <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
                  ₹{calculateTotalPrice().toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '60vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Hotel />
          Hotel Booking
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        
        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {activeStep > 0 && activeStep < 2 && (
          <Button onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}
        {activeStep < 2 && (
          <Button 
            variant="contained" 
            onClick={handleNext}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {activeStep === 1 ? 'Confirm Booking' : 'Next'}
          </Button>
        )}
        {activeStep === 2 && (
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default HotelBookingPage;