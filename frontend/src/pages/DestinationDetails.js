import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  Rating,
  Skeleton,
  IconButton,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  ArrowBack,
  Star,
  Hotel,
  AttractionsOutlined,
  Schedule,
  Favorite,
  FavoriteBorder,
  Share,
  CalendarToday,
  AccessTime
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { suggestionsAPI } from '../services/api';
import { useCurrency } from '../contexts/CurrencyContext';

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { convertCurrency, formatCurrency } = useCurrency();
  
  const [destination, setDestination] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [favorites, setFavorites] = useState(new Set());

  // Helper functions for destination mapping (same as TravelSuggestions)
  const getDestinationImage = (name) => {
    const imageMap = {
      'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
      'paris': 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80',
      'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      'kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
      'rajasthan': 'https://images.unsplash.com/photo-1578662996442-48f60b5e1fa4?w=800&q=80',
      'kashmir': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'mumbai': 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800&q=80',
      'delhi': 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=800&q=80',
      'new delhi': 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=800&q=80',
      'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
      'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80'
    };
    return imageMap[name?.toLowerCase()] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';
  };

  const getDestinationDescription = (name) => {
    const descriptionMap = {
      'goa': 'Famous for its pristine beaches, Portuguese colonial architecture, vibrant nightlife, and water sports. A perfect blend of relaxation and adventure.',
      'paris': 'The City of Light captivates with iconic landmarks, world-class museums, romantic Seine cruises, and exquisite cuisine.',
      'tokyo': 'A fascinating metropolis where ancient traditions meet cutting-edge technology, offering incredible food, shopping, and cultural experiences.',
      'kerala': 'Gods Own Country enchants with serene backwaters, lush hill stations, spice plantations, and Ayurvedic wellness retreats.',
      'rajasthan': 'Land of maharajas featuring majestic palaces, desert safaris, colorful festivals, and rich cultural heritage.',
      'kashmir': 'Paradise on Earth with snow-capped mountains, pristine valleys, beautiful lakes, and charming houseboats.',
      'mumbai': 'Indias financial capital and Bollywood hub, offering diverse culture, street food, colonial architecture, and vibrant nightlife.',
      'delhi': 'Historic capital city blending Mughal heritage with modern India, featuring monuments, markets, and diverse culinary scene.',
      'dubai': 'Ultra-modern city known for luxury shopping, futuristic architecture, desert adventures, and world-class hospitality.',
      'london': 'Historic capital combining royal heritage, world-class museums, theater district, and multicultural neighborhoods.'
    };
    return descriptionMap[name?.toLowerCase()] || 'Discover this amazing destination with its unique attractions and experiences.';
  };

  useEffect(() => {
    const loadDestinationDetails = async () => {
      try {
        setLoading(true);
        
        // Create mock destination data based on ID
        const mockDestination = {
          id: id,
          name: id.charAt(0).toUpperCase() + id.slice(1),
          country: 'India',
          description: getDestinationDescription(id),
          imageUrl: getDestinationImage(id),
          rating: 4.5,
          budgetRange: '₹2,000-5,000/day',
          bestTimeToVisit: 'November to March',
          highlights: ['Cultural Heritage', 'Adventure Activities', 'Local Cuisine', 'Shopping'],
          tags: ['Popular', 'Family Friendly', 'Adventure']
        };
        
        setDestination(mockDestination);

        // Load suggestions for this destination
        try {
          const suggestionsResponse = await suggestionsAPI.getComprehensiveSuggestions({
            toLocation: mockDestination.name,
            budgetLevel: 'mid-range',
            durationDays: 7,
            interests: ['CULTURE', 'FOOD', 'NATURE']
          });
          setSuggestions(suggestionsResponse.data);
        } catch (suggestionsError) {
          console.log('Suggestions API not available, using mock data');
        }
      } catch (error) {
        console.error('Error loading destination details:', error);
        setDestination({
          id: id,
          name: id.charAt(0).toUpperCase() + id.slice(1),
          country: 'Unknown',
          description: 'Beautiful destination with amazing experiences waiting to be explored.',
          imageUrl: getDestinationImage(id),
          rating: 4.0,
          budgetRange: '₹2,000-4,000/day'
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDestinationDetails();
    }
  }, [id]);

  const toggleFavorite = (itemId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={300} sx={{ mb: 4, borderRadius: 2 }} />
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="80%" height={60} sx={{ mb: 4 }} />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={200} sx={{ mb: 2, borderRadius: 2 }} />
        ))}
      </Container>
    );
  }

  if (!destination) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" color="error" textAlign="center">
          Destination not found
        </Typography>
        <Box textAlign="center" sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb Navigation */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs>
          <Link color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Home
          </Link>
          <Link color="inherit" onClick={() => navigate('/search')} sx={{ cursor: 'pointer' }}>
            Destinations
          </Link>
          <Typography color="text.primary">{destination.name}</Typography>
        </Breadcrumbs>
      </Box>

      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {/* Hero Section */}
      <Card sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="400"
            image={destination.imageUrl}
            alt={destination.name}
          />
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)'
          }} />
          
          {/* Action Buttons */}
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

          {/* Title Overlay */}
          <Box sx={{ 
            position: 'absolute', 
            bottom: 24, 
            left: 24, 
            right: 24,
            color: 'white'
          }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {destination.name}
              {destination.country && `, ${destination.country}`}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Star sx={{ color: 'warning.main', mr: 0.5 }} />
                <Typography variant="h6">{destination.rating}</Typography>
              </Box>
              <Chip 
                label={destination.budgetRange} 
                sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
              />
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Quick Info */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom fontWeight="600">
              About {destination.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
              {destination.description}
            </Typography>
            
            {destination.highlights && (
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Highlights
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {destination.highlights.map((highlight, index) => (
                    <Chip key={index} label={highlight} variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Travel Information
            </Typography>
            
            {destination.bestTimeToVisit && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Best Time to Visit
                  </Typography>
                  <Typography variant="body1">
                    {destination.bestTimeToVisit}
                  </Typography>
                </Box>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Recommended Duration
                </Typography>
                <Typography variant="body1">
                  5-7 days
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate('/suggestions', { 
                state: { destination: destination.name } 
              })}
              sx={{ mt: 2 }}
            >
              Plan Your Trip
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Mock Activities Section if no suggestions */}
      {!suggestions && (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="600">
            Popular Activities in {destination.name}
          </Typography>
          <Grid container spacing={3}>
            {['Sightseeing Tours', 'Food Tours', 'Adventure Sports', 'Cultural Experiences', 'Shopping Tours', 'Nightlife'].map((activity, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    {activity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Explore the best {activity.toLowerCase()} in {destination.name}
                  </Typography>
                  <Button variant="outlined" size="small">
                    Learn More
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Detailed Information Tabs - Only show if suggestions available */}
      {suggestions && (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': { minHeight: 64, fontWeight: 600 }
            }}
          >
            <Tab icon={<Hotel />} label="Hotels" />
            <Tab icon={<AttractionsOutlined />} label="Attractions" />
            <Tab icon={<Schedule />} label="Activities" />
          </Tabs>

          {/* Hotels Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {suggestions.suggestedAccommodations?.slice(0, 6).map((hotel, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ borderRadius: 2, height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={
                        hotel.category === 'luxury' 
                          ? 'https://images.unsplash.com/photo-1578774443271-39db861dd6d6?w=400&q=80'
                          : hotel.category === 'mid-range'
                          ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'
                          : 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80'
                      }
                      alt={hotel.name}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="600" gutterBottom>
                        {hotel.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={hotel.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {hotel.rating}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {hotel.type} • {hotel.category}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                          {formatCurrency(convertCurrency(hotel.pricePerNight))}/night
                        </Typography>
                        <Button variant="outlined" size="small">
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Attractions Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              {suggestions.suggestedAttractions?.slice(0, 9).map((attraction, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ borderRadius: 2, height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={
                        attraction.type?.toLowerCase().includes('beach') 
                          ? 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&q=80'
                          : attraction.type?.toLowerCase().includes('temple') || attraction.type?.toLowerCase().includes('historical')
                          ? 'https://images.unsplash.com/photo-1578662996442-48f60b5e1fa4?w=300&q=80'
                          : 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=300&q=80'
                      }
                      alt={attraction.name}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="600" gutterBottom>
                        {attraction.name}
                      </Typography>
                      <Typography variant="body2" color="primary.main" fontWeight="500" gutterBottom>
                        {attraction.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {attraction.description}
                      </Typography>
                      {attraction.estimatedCost > 0 && (
                        <Typography variant="body1" color="primary.main" fontWeight="bold">
                          {formatCurrency(convertCurrency(attraction.estimatedCost))}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Activities Tab */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom>
              Popular Activities
            </Typography>
            <Grid container spacing={2}>
              {['Sightseeing Tours', 'Food Tours', 'Adventure Sports', 'Cultural Experiences', 'Shopping Tours', 'Nightlife'].map((activity, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {activity}
                    </Typography>
                    <Button variant="outlined" size="small">
                      Explore
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Paper>
      )}
    </Container>
  );
};

export default DestinationDetails;