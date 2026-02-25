import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Flight } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthError } from '../../components/ErrorDisplay';
import ErrorDisplay from '../../components/ErrorDisplay';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    phoneNumber: '',
    interests: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const interestOptions = [
    'ADVENTURE', 'CULTURE', 'FOOD', 'NIGHTLIFE', 'NATURE', 'BEACH', 
    'SHOPPING', 'HISTORY', 'ART', 'MUSIC', 'SPORTS', 'WELLNESS', 
    'BUSINESS', 'LUXURY', 'BUDGET', 'FAMILY', 'ROMANTIC'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleInterestChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      interests: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
      
      if (result.success) {
        setSuccess(result.message || 'Registration successful! Please log in.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <Flight sx={{ mr: 1, fontSize: 32, color: 'primary.main' }} />
            <Typography component="h1" variant="h4">
              Roamy
            </Typography>
          </Box>

          <Typography component="h2" variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>

          {error && (
            <AuthError 
              error={error}
              onClose={() => setError('')}
            />
          )}

          {success && (
            <ErrorDisplay 
              success={success}
              title="Registration Successful"
              onClose={() => setSuccess('')}
            />
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  helperText="Minimum 6 characters"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="dateOfBirth"
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="interests-label">Travel Interests</InputLabel>
                  <Select
                    labelId="interests-label"
                    id="interests"
                    multiple
                    value={formData.interests}
                    label="Travel Interests"
                    onChange={handleInterestChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    disabled={loading}
                  >
                    {interestOptions.map((interest) => (
                      <MenuItem key={interest} value={interest}>
                        {interest}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" variant="body2">
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;