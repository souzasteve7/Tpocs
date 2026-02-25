import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Search,
  TravelExplore,
  LocationOn,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { searchAPI, testAPI } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingDestinations, setTrendingDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState(null);

  // Helper function to get destination-specific images
  const getDestinationImage = (name) => {
    const imageMap = {
      'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80',
      'paris': 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&q=80',
      'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
      'kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80',
      'rajasthan': 'https://images.unsplash.com/photo-1578662996442-48f60b5e1fa4?w=400&q=80',
      'kashmir': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      'mumbai': 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400&q=80',
      'delhi': 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=400&q=80',
      'new delhi': 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=400&q=80',
      'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80',
      'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80',
      'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80',
      'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80',
      'thailand': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80',
      'bangkok': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80',
      'bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=80',
      'malaysia': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80',
      'maldives': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      'nepal': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=80',
      'bhutan': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=80',
      'sri lanka': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'
    };
    return imageMap[name?.toLowerCase()] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80';
  };

  useEffect(() => {
    const checkAPIAndLoadData = async () => {
      try {
        // Check API health
        const healthResponse = await testAPI.health();
        setApiStatus(healthResponse.data.status === 'UP' ? 'UP' : 'DOWN');

        // Load trending destinations
        const destinationsResponse = await searchAPI.getTrendingDestinations();
        
        // Map API response to include proper images
        const mappedDestinations = destinationsResponse.data.slice(0, 3).map(dest => ({
          ...dest,
          imageUrl: dest.imageUrl || getDestinationImage(dest.name)
        }));
        
        setTrendingDestinations(mappedDestinations);
      } catch (error) {
        console.error('Error loading data:', error);
        setApiStatus('DOWN');
        // Set some mock data for display with correct images
        setTrendingDestinations([
          {
            id: 1,
            name: 'Paris',
            country: 'France',
            description: 'The City of Light',
            imageUrl: getDestinationImage('Paris'),
            rating: 4.5,
            budgetRange: '$200-400/day'
          },
          {
            id: 2,
            name: 'Tokyo',
            country: 'Japan',
            description: 'Modern metropolis meets tradition',
            imageUrl: getDestinationImage('Tokyo'),
            rating: 4.7,
            budgetRange: '$150-350/day'
          },
          {
            id: 3,
            name: 'Goa',
            country: 'India',
            description: 'Beautiful beaches and Portuguese heritage',
            imageUrl: getDestinationImage('Goa'),
            rating: 4.6,
            budgetRange: '₹2,000-4,000/day'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    checkAPIAndLoadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleDestinationClick = (destination) => {
    // Navigate with destination name as URL parameter
    const destinationSlug = destination.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/destinations/${destinationSlug}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #fef7f0 100%)',
        position: 'relative'
      }}
    >
    <Container maxWidth="lg" sx={{ py: 1 }}>
      {/* API Status Indicator */}
      {apiStatus && (
        <Box sx={{ mb: 2 }}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              backgroundColor: apiStatus === 'UP' ? '#f24805' : '#fff3cd',
              borderRadius: '10px',
              border: `0.5px solid ${apiStatus === 'UP' ? '#bf4203' : '#ff5722'}`,
              color: apiStatus === 'UP' ? '#c44517' : '#c85a1f'
            }}
          >
            {/* <Typography variant="body2">
              🌐 Backend API: {apiStatus} {apiStatus === 'UP' ? '✅' : '❌'}
              {apiStatus === 'DOWN' && ' - Showing demo data'}
            </Typography> */}
          </Paper>
        </Box>
      )}

      {/* Hero Section */}
      <Box 
        sx={{ 
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 2px 16px rgba(0, 0, 0, 0.1)',
          p: 6,
          mb: 6,
          textAlign: 'center',
          border: '1px solid #f0f0f0'
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            {/* Flight Logo */}
            <Box 
              sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%',
                background: '#ff5a5f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 3,
                boxShadow: '0 4px 12px rgba(255, 90, 95, 0.3)'
              }}
            >
              <Typography sx={{ fontSize: '28px' }}>✈️</Typography>
            </Box>
            <Box>
              <Typography 
                variant="h2" 
                component="h1" 
                fontWeight="bold"
                sx={{ color: '#ff5a5f' }}
              >
                Roaamy
              </Typography>
              <Typography variant="h6" sx={{ color: '#484848', mt: 1 }}>
                Belong anywhere
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 400, color: '#222222' }}>
            Find your next stay
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: '#717171', maxWidth: '600px', mx: 'auto' }}>
            Search deals on hotels, homes, and much more...
          </Typography>

          {/* Search Bar Glass Effect */}
          <Box 
            component="form" 
            onSubmit={handleSearch}
            sx={{ 
              display: 'flex', 
              gap: 1, 
              maxWidth: 600, 
              mx: 'auto',
              mb: 4,
              background: '#ffffff',
              borderRadius: '32px',
              border: '1px solid #dddddd',
              p: 1,
              boxShadow: '0 8px 28px rgba(0, 0, 0, 0.12)',
              transition: 'all 0.2s ease',
              '&:hover': {
                border: '1px solid #ff5a5f',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-2px)'
              },
              '&:focus-within': {
                border: '1px solid #ff5a5f',
                boxShadow: '0 12px 35px rgba(255, 90, 95, 0.25)'
              }
            }}
          >
            <TextField
              fullWidth
              placeholder="Where are you going?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <LocationOn sx={{ color: '#717171', mr: 1 }} />,
                sx: {
                  color: '#222222',
                  '& fieldset': { border: 'none' },
                  '& input::placeholder': { 
                    color: '#717171',
                    opacity: 1,
                    transition: 'color 0.2s ease'
                  },
                  '& input:hover::placeholder': {
                    color: '#ff5a5f'
                  },
                  '& input:focus::placeholder': {
                    color: '#ff5a5f'
                  },
                  borderRadius: '32px',
                  transition: 'all 0.2s ease'
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Search />}
              sx={{
                px: 4,
                py: 2,
                borderRadius: '32px',
                background: 'linear-gradient(135deg, #e61e4d 0%, #e31c5f 50%, #d70466 100%)',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '16px',
                '&:hover': {
                  background: 'linear-gradient(135deg, #d01346 0%, #d11356 50%, #c1045d 100%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 25px rgba(230, 30, 77, 0.4)'
                }
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
        </Box>

      {/* Quick Actions */}
      <Box 
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          justifyContent: 'center',
          mb: 6,
          '--Grid-columns': 12,
          '--Grid-columnSpacing': '24px',
          '--Grid-rowSpacing': '24px'
        }}
      >
        <Box 
          sx={{
            flex: '1 1 calc(33.333% - 16px)',
            maxWidth: 'calc(33.333% - 16px)',
            minWidth: '280px',
            '@media (max-width: 1024px)': {
              flex: '1 1 calc(50% - 12px)',
              maxWidth: 'calc(50% - 12px)'
            },
            '@media (max-width: 640px)': {
              flex: '1 1 100%',
              maxWidth: '100%'
            }
          }}
        >
          <Card
            sx={{
              cursor: 'pointer',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #f0f0f0',
              transition: 'all 0.2s ease',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)'
              },
              height: '100%',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}
            onClick={() => navigate('/search')}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Search sx={{ fontSize: 48, color: '#ff5a5f', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#222222', fontWeight: 600 }}>
                Explore Destinations
              </Typography>
              <Typography variant="body2" sx={{ color: '#717171' }}>
                Browse through our curated list of amazing travel destinations
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box 
          sx={{
            flex: '1 1 calc(33.333% - 16px)',
            maxWidth: 'calc(33.333% - 16px)',
            minWidth: '280px',
            '@media (max-width: 1024px)': {
              flex: '1 1 calc(50% - 12px)',
              maxWidth: 'calc(50% - 12px)'
            },
            '@media (max-width: 640px)': {
              flex: '1 1 100%',
              maxWidth: '100%'
            }
          }}
        >
          <Card
            sx={{
              cursor: 'pointer',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #f0f0f0',
              transition: 'all 0.2s ease',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)'
              },
              height: '100%',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}
            onClick={() => navigate('/suggestions')}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <TravelExplore sx={{ fontSize: 48, color: '#ff5a5f', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#222222', fontWeight: 600 }}>
                Get Suggestions
              </Typography>
              <Typography variant="body2" sx={{ color: '#717171' }}>
                Get personalized travel recommendations based on your preferences
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box 
          sx={{
            flex: '1 1 calc(33.333% - 16px)',
            maxWidth: 'calc(33.333% - 16px)',
            minWidth: '280px',
            '@media (max-width: 1024px)': {
              flex: '1 1 calc(50% - 12px)',
              maxWidth: 'calc(50% - 12px)'
            },
            '@media (max-width: 640px)': {
              flex: '1 1 100%',
              maxWidth: '100%'
            }
          }}
        >
          <Card
            sx={{
              cursor: 'pointer',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #f0f0f0',
              transition: 'all 0.2s ease',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)'
              },
              height: '100%',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}
            onClick={() => navigate('/bookings')}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <LocationOn sx={{ fontSize: 48, color: '#ff5a5f', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#222222', fontWeight: 600 }}>
                My Bookings
              </Typography>
              <Typography variant="body2" sx={{ color: '#717171' }}>
                Manage your current and past bookings
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Trending Destinations */}
      <Box sx={{ 
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 2px 16px rgba(0, 0, 0, 0.1)',
        p: 4,
        mb: 4,
        border: '1px solid #f0f0f0'
      }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, color: '#222222', fontWeight: 600, textAlign: 'center' }}>
          Trending destinations
        </Typography>
        <Box 
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            justifyContent: 'center',
            '--Grid-columns': 12,
            '--Grid-columnSpacing': '24px',
            '--Grid-rowSpacing': '24px'
          }}
        >
          {trendingDestinations.map((destination) => (
            <Box 
              key={destination.id}
              sx={{
                flex: '1 1 calc(33.333% - 16px)',
                maxWidth: 'calc(33.333% - 16px)',
                minWidth: '300px',
                '@media (max-width: 1024px)': {
                  flex: '1 1 calc(50% - 12px)',
                  maxWidth: 'calc(50% - 12px)'
                },
                '@media (max-width: 640px)': {
                  flex: '1 1 100%',
                  maxWidth: '100%'
                }
              }}
            >
              <Card
                sx={{
                  cursor: 'pointer',
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)'
                  },
                  height: '450px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
                }}
                onClick={() => handleDestinationClick(destination)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={destination.imageUrl}
                  alt={destination.name}
                  sx={{
                    objectFit: 'cover',
                    height: '200px',
                    width: '100%'
                  }}
                />
                <CardContent sx={{ 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  p: 3,
                  height: '250px',
                  '&:last-child': { pb: 3 }
                }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      minHeight: '2.4em',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      color: '#222222',
                      fontSize: '1.1rem'
                    }}
                  >
                    {destination.name}
                    {destination.country && `, ${destination.country}`}
                  </Typography>
                  
                  {destination.description && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2,
                        flex: 1,
                        minHeight: '2.4em',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        color: '#717171'
                      }}
                    >
                      {destination.description}
                    </Typography>
                  )}

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 'auto'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {destination.rating && (
                        <>
                          <Star sx={{ color: '#ff5a5f', fontSize: 18, mr: 0.5 }} />
                          <Typography variant="body2" fontWeight="500" sx={{ color: '#222222' }}>
                            {destination.rating}
                          </Typography>
                        </>
                      )}
                    </Box>
                    {destination.budgetRange && (
                      <Chip
                        label={destination.budgetRange}
                        size="small"
                        sx={{
                          borderRadius: '16px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor: '#f7f7f7',
                          color: '#222222',
                          border: 'none'
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
    </Box>
  );
};

export default Home;