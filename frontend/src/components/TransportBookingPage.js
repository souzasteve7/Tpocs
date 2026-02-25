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
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  Flight, 
  Train, 
  DirectionsBus, 
  DriveEta, 
  CalendarToday, 
  Person, 
  AttachMoney,
  Schedule,
  LocationOn
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { bookingAPI } from '../services/api';

const steps = ['Passenger Details', 'Review Booking', 'Confirmation'];

const TransportBookingPage = ({ open, onClose, transport, fromLocation, toLocation, departureDate }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    numberOfAdults: 1,
    numberOfChildren: 0,
    seatType: 'economy',
    specialRequests: '',
  });
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  // Get user data from localStorage if available
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.name && userData.email) {
      setBookingData(prev => ({
        ...prev,
        contactName: userData.name || '',
        contactEmail: userData.email || '',
        contactPhone: userData.phone || '',
      }));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const getTransportIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'flight':
        return <Flight />;
      case 'train':
        return <Train />;
      case 'bus':
        return <DirectionsBus />;
      case 'car rental':
        return <DriveEta />;
      default:
        return <Flight />;
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate passenger details
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
    const basePrice = transport?.price || 8500;
    const seatMultiplier = bookingData.seatType === 'business' ? 1.8 : bookingData.seatType === 'first' ? 2.5 : 1;
    const totalPassengers = bookingData.numberOfAdults + (bookingData.numberOfChildren * 0.75);
    return Math.round(basePrice * seatMultiplier * totalPassengers);
  };

  const handleBookingSubmit = async () => {
    try {
      setLoading(true);
      
      // Check if user is logged in
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please login to make a booking');
        onClose();
        window.location.href = '/login';
        return;
      }

      const bookingRequest = {
        type: 'transport',
        transportType: transport?.type?.toUpperCase() || 'FLIGHT',
        provider: transport?.provider || 'Transport Provider',
        departureLocation: fromLocation || 'Origin',
        arrivalLocation: toLocation || 'Destination',
        departureDate: departureDate || new Date().toISOString(),
        arrivalDate: transport?.arrival ? 
          new Date(new Date(departureDate).getTime() + (parseFloat(transport.duration) * 60 * 60 * 1000)).toISOString() :
          new Date(Date.now() + (2 * 60 * 60 * 1000)).toISOString(),
        numberOfGuests: bookingData.numberOfAdults + bookingData.numberOfChildren,
        numberOfAdults: bookingData.numberOfAdults,
        numberOfChildren: bookingData.numberOfChildren,
        seatType: bookingData.seatType,
        contactName: bookingData.contactName,
        contactEmail: bookingData.contactEmail,
        contactPhone: bookingData.contactPhone,
        specialRequests: bookingData.specialRequests,
        totalAmount: calculateTotalPrice(),
        currency: 'INR'
      };

      console.log('Transport booking request:', bookingRequest);

      const response = await bookingAPI.bookTransport(bookingRequest);
      
      console.log('Transport booking response:', response.data);
      
      setBookingConfirmation(response.data);
      setActiveStep(2); // Move to confirmation step
      
      toast.success('Transport booking confirmed successfully!');
      
    } catch (error) {
      console.error('Transport booking failed:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        onClose();
        window.location.href = '/login';
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
                <InputLabel>Seat Type</InputLabel>
                <Select
                  value={bookingData.seatType}
                  onChange={(e) => handleInputChange('seatType', e.target.value)}
                >
                  <MenuItem value="economy">Economy Class</MenuItem>
                  <MenuItem value="business">Business Class (+80%)</MenuItem>
                  <MenuItem value="first">First Class (+150%)</MenuItem>
                </Select>
              </FormControl>
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
                placeholder="Meal preferences, accessibility requirements, etc..."
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {getTransportIcon(transport?.type)}
                  <span style={{ marginLeft: 8 }}>Transport Details</span>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="h5" color="primary">
                    {transport?.provider || 'Transport Provider'}
                  </Typography>
                  <Chip 
                    label={transport?.type || 'Flight'} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">From</Typography>
                    </Box>
                    <Typography variant="body1">{fromLocation}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {transport?.departure || '10:30 AM'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">To</Typography>
                    </Box>
                    <Typography variant="body1">{toLocation}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {transport?.arrival || '1:00 PM'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Schedule fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">Duration</Typography>
                    </Box>
                    <Typography variant="body1">{transport?.duration || '2.5 hours'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">Date</Typography>
                    </Box>
                    <Typography variant="body1">
                      {new Date(departureDate || Date.now()).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>

                {transport?.amenities && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Amenities
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {transport.amenities.map((amenity, index) => (
                        <Chip key={index} label={amenity} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Passenger Information
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
                    <Typography variant="body2" color="text.secondary">Passengers</Typography>
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
                  <Typography>Base Price ({bookingData.seatType})</Typography>
                  <Typography>₹{transport?.price || 8500}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Adults ({bookingData.numberOfAdults})</Typography>
                  <Typography>x {bookingData.numberOfAdults}</Typography>
                </Box>
                {bookingData.numberOfChildren > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Children ({bookingData.numberOfChildren})</Typography>
                    <Typography>x {bookingData.numberOfChildren} (25% off)</Typography>
                  </Box>
                )}
                {bookingData.seatType !== 'economy' && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="text.secondary">Seat upgrade</Typography>
                    <Typography color="text.secondary">
                      +{bookingData.seatType === 'business' ? '80%' : '150%'}
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
              {getTransportIcon(transport?.type)}
            </Box>
            <Typography variant="h4" gutterBottom color="success.main">
              Booking Confirmed!
            </Typography>
            <Typography variant="h6" gutterBottom>
              Booking Reference: {bookingConfirmation?.bookingReference || 'TRANSPORT-' + Math.random().toString(36).substr(2, 9)}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Your transport booking has been confirmed. You will receive booking details via email.
            </Typography>
            <Card sx={{ maxWidth: 400, mx: 'auto' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {fromLocation} → {toLocation}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {transport?.provider || 'Transport Provider'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(departureDate || Date.now()).toLocaleDateString()}
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
          {getTransportIcon(transport?.type)}
          Transport Booking
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

export default TransportBookingPage;