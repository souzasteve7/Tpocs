import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Paper,
  Rating,
  Skeleton,
  IconButton,
  Breadcrumbs,
  Link,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  Star,
  Favorite,
  FavoriteBorder,
  Share,
  CalendarToday,
  AccessTime,
  LocationOn
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { searchAPI } from '../services/api';
import { useCurrency } from '../contexts/CurrencyContext';

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { convertCurrency, formatCurrency } = useCurrency();

  const [destination, setDestination] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  const getFallbackImage = () =>
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';

  const formatInterest = (interest) =>
    (interest || '')
      .toString()
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

  useEffect(() => {
    const loadDestinationDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const destinationId = Number(id);
        if (Number.isNaN(destinationId)) {
          setError('Invalid destination id.');
          setDestination(null);
          setHotels([]);
          setAttractions([]);
          return;
        }

        const destinationsResponse = await searchAPI.getAllDestinations();
        const destinationData = (destinationsResponse.data || []).find(
          (item) => Number(item.id) === destinationId
        );

        if (!destinationData) {
          setError('Destination not found.');
          setDestination(null);
          setHotels([]);
          setAttractions([]);
          return;
        }

        setDestination(destinationData);

        const [hotelsResponse, attractionsResponse] = await Promise.allSettled([
          searchAPI.getHotelsByDestination(destinationId),
          searchAPI.getAttractionsByDestination(destinationId)
        ]);

        setHotels(hotelsResponse.status === 'fulfilled' ? (hotelsResponse.value.data || []) : []);
        setAttractions(attractionsResponse.status === 'fulfilled' ? (attractionsResponse.value.data || []) : []);
      } catch (loadError) {
        console.error('Error loading destination details:', loadError);
        setError('Failed to load destination details. Please try again.');
        setDestination(null);
        setHotels([]);
        setAttractions([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDestinationDetails();
    }
  }, [id]);

  const toggleFavorite = (itemId) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (updated.has(itemId)) {
        updated.delete(itemId);
      } else {
        updated.add(itemId);
      }
      return updated;
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={300} sx={{ mb: 4, borderRadius: 2 }} />
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="80%" height={60} sx={{ mb: 4 }} />
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={150} sx={{ mb: 2, borderRadius: 2 }} />
        ))}
      </Container>
    );
  }

  if (!destination) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" color="error" textAlign="center">
          {error || 'Destination not found'}
        </Typography>
        <Box textAlign="center" sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => navigate('/search')}>
            Back to Search
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Box sx={{ mb: 2.5 }}>
        <Breadcrumbs>
          <Link color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer', color: '#717171', textDecoration: 'none' }}>
            Home
          </Link>
          <Link color="inherit" onClick={() => navigate('/search')} sx={{ cursor: 'pointer', color: '#717171', textDecoration: 'none' }}>
            Destinations
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>{destination.name}</Typography>
        </Breadcrumbs>
      </Box>

      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2.5, color: '#484848', fontWeight: 600 }}>
        Back
      </Button>

      <Card sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', border: '1px solid #ebebeb', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="360"
            image={destination.imageUrl || getFallbackImage()}
            alt={destination.name}
            sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5' }}
            onError={(event) => {
              if (event.currentTarget.src !== getFallbackImage()) {
                event.currentTarget.src = getFallbackImage();
              }
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)'
            }}
          />

          <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
            <IconButton
              sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
              onClick={() => toggleFavorite('destination')}
            >
              {favorites.has('destination') ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <IconButton sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
              <Share />
            </IconButton>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              right: 24,
              color: 'white'
            }}
          >
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {destination.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Star sx={{ color: 'warning.main', mr: 0.5 }} />
                <Typography variant="h6">{destination.averageRating || 'N/A'}</Typography>
              </Box>
              {destination.country && (
                <Chip label={destination.country} sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              )}
            </Box>
          </Box>
        </Box>
      </Card>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: '16px',
              border: '1px solid #ebebeb',
              boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
              backgroundColor: '#ffffff'
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight="700" sx={{ color: '#222222', mb: 1.5 }}>
              About {destination.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75, mb: 3, fontSize: '15px' }}>
              {destination.description || `Explore ${destination.name} and discover local highlights and experiences.`}
            </Typography>

            {destination.popularInterests?.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Popular Interests
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {destination.popularInterests.map((interest, index) => (
                    <Chip
                      key={index}
                      label={formatInterest(interest)}
                      variant="outlined"
                      sx={{
                        borderRadius: '999px',
                        borderColor: '#dddddd',
                        fontWeight: 500,
                        backgroundColor: '#ffffff'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: '16px',
              border: '1px solid #ebebeb',
              boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
              backgroundColor: '#ffffff'
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="700" sx={{ color: '#222222', mb: 2 }}>
              Destination Details
            </Typography>

            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              {(destination.city || destination.country) && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ p: 1.5, borderRadius: '12px', border: '1px solid #f0f0f0', backgroundColor: '#fff', height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <LocationOn sx={{ mr: 0.75, color: 'primary.main', fontSize: 18 }} />
                      <Typography variant="caption" sx={{ color: '#717171', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Location
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#222222', fontWeight: 600 }}>
                      {destination.city || destination.name}
                      {destination.country ? `, ${destination.country}` : ''}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {destination.bestTimeToVisit && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ p: 1.5, borderRadius: '12px', border: '1px solid #f0f0f0', backgroundColor: '#fff', height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <CalendarToday sx={{ mr: 0.75, color: 'primary.main', fontSize: 16 }} />
                      <Typography variant="caption" sx={{ color: '#717171', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Best Time
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#222222', fontWeight: 600 }}>
                      {destination.bestTimeToVisit}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {destination.climate && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ p: 1.5, borderRadius: '12px', border: '1px solid #f0f0f0', backgroundColor: '#fff', height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <AccessTime sx={{ mr: 0.75, color: 'primary.main', fontSize: 16 }} />
                      <Typography variant="caption" sx={{ color: '#717171', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Climate
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#222222', fontWeight: 600 }}>
                      {destination.climate}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {destination.timeZone && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ p: 1.5, borderRadius: '12px', border: '1px solid #f0f0f0', backgroundColor: '#fff', height: '100%' }}>
                    <Typography variant="caption" sx={{ color: '#717171', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 0.5 }}>
                      Time Zone
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#222222', fontWeight: 600 }}>
                      {destination.timeZone}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {!!destination.totalReviews && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ p: 1.5, borderRadius: '12px', border: '1px solid #f0f0f0', backgroundColor: '#fff', height: '100%' }}>
                    <Typography variant="caption" sx={{ color: '#717171', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 0.5 }}>
                      Reviews
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#222222', fontWeight: 600 }}>
                      {destination.totalReviews} total reviews
                    </Typography>
                  </Box>
                </Grid>
              )}

              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ p: 1.5, borderRadius: '12px', border: '1px solid #f0f0f0', backgroundColor: '#fff', height: '100%' }}>
                  <Typography variant="caption" sx={{ color: '#717171', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 0.5 }}>
                    Availability
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#222222', fontWeight: 600 }}>
                    Attractions: {attractions.length}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {(destination.pricing?.budgetDailyCost || destination.pricing?.midRangeDailyCost || destination.pricing?.luxuryDailyCost) && (
              <Box sx={{ mb: 2, p: 1.75, borderRadius: '12px', backgroundColor: '#f8f9fa', border: '1px solid #f0f0f0' }}>
                <Typography variant="caption" sx={{ color: '#717171', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', mb: 0.75 }}>
                  Daily Budget Estimates
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {!!destination.pricing?.budgetDailyCost && (
                    <Typography variant="body2" sx={{ color: '#222222' }}>
                      Budget: {formatCurrency(convertCurrency(destination.pricing.budgetDailyCost, destination.pricing.currency || 'USD'))}
                    </Typography>
                  )}
                  {!!destination.pricing?.midRangeDailyCost && (
                    <Typography variant="body2" sx={{ color: '#222222' }}>
                      Mid-range: {formatCurrency(convertCurrency(destination.pricing.midRangeDailyCost, destination.pricing.currency || 'USD'))}
                    </Typography>
                  )}
                  {!!destination.pricing?.luxuryDailyCost && (
                    <Typography variant="body2" sx={{ color: '#222222' }}>
                      Luxury: {formatCurrency(convertCurrency(destination.pricing.luxuryDailyCost, destination.pricing.currency || 'USD'))}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() =>
                navigate('/suggestions', {
                  state: { destination: destination.name }
                })
              }
              sx={{ mt: 2 }}
            >
              Plan Your Trip
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: '16px',
          border: '1px solid #ebebeb',
          boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
          backgroundColor: '#ffffff'
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight="700" sx={{ color: '#222222', mb: 2 }}>
          Top Attractions
        </Typography>
        {attractions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No attraction data available for this destination.
          </Typography>
        ) : (
          <Grid container spacing={2.5}>
            {attractions.slice(0, 3).map((attraction) => {
              const visibleAttractionCount = Math.min(attractions.length, 3);
              const mdColumns = visibleAttractionCount === 1 ? 12 : visibleAttractionCount === 2 ? 6 : 4;

              return (
              <Grid item xs={12} sm={visibleAttractionCount === 1 ? 12 : 6} md={mdColumns} key={attraction.id || attraction.name}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: '1px solid #efefef',
                    height: '100%',
                    maxWidth: visibleAttractionCount === 1 ? 560 : '100%',
                    mx: visibleAttractionCount === 1 ? 'auto' : 0,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={attraction.imageUrls?.[0] || getFallbackImage()}
                    alt={attraction.name}
                    sx={{ objectFit: 'cover', backgroundColor: '#f5f5f5' }}
                    onError={(event) => {
                      if (event.currentTarget.src !== getFallbackImage()) {
                        event.currentTarget.src = getFallbackImage();
                      }
                    }}
                  />
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      {attraction.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '4.2em'
                      }}
                    >
                      {attraction.description || 'Description not available'}
                    </Typography>
                    {attraction.type && <Chip size="small" label={attraction.type} sx={{ mb: 1, alignSelf: 'flex-start' }} />}
                    {(attraction.entryFee || attraction.entryFee === 0) && (
                      <Typography variant="body2" fontWeight="600" color="primary.main" sx={{ mt: 'auto' }}>
                        {Number(attraction.entryFee) === 0
                          ? 'Free Entry'
                          : formatCurrency(convertCurrency(attraction.entryFee, attraction.currency || 'USD'))}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default DestinationDetails;
