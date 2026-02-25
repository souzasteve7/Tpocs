import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Avatar,
  Rating,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
} from '@mui/material';
import { 
  TravelExplore, 
  Hotel, 
  AttractionsOutlined, 
  AccessTime, 
  CalendarToday, 
  Favorite, 
  FavoriteBorder, 
  Schedule,
} from '@mui/icons-material';
import { suggestionsAPI } from '../services/api';
import { useCurrency } from '../contexts/CurrencyContext';

const TravelSuggestions = () => {
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    budgetLevel: '',
    durationDays: 7,
    interests: [],
  });
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const { selectedCurrency, convertCurrency, formatCurrency } = useCurrency();

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
  };

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const generateTransportOptions = (fromLocation, toLocation) => {
    const transportMethods = [
      {
        type: 'Flight',
        duration: '2.5 hours',
        price: 8500,
        provider: 'Air India',
        departure: '10:30 AM',
        arrival: '1:00 PM',
        amenities: ['Meals', 'Entertainment', 'WiFi']
      },
      {
        type: 'Train',
        duration: '12 hours',
        price: 2800,
        provider: 'Indian Railways',
        departure: '8:00 PM',
        arrival: '8:00 AM',
        amenities: ['AC Sleeper', 'Meals', 'Charging Points']
      },
      {
        type: 'Bus',
        duration: '14 hours',
        price: 1200,
        provider: 'RedBus Premium',
        departure: '6:00 PM',
        arrival: '8:00 AM',
        amenities: ['Recliner Seats', 'WiFi', 'Blanket']
      },
      {
        type: 'Car Rental',
        duration: '10 hours',
        price: 4500,
        provider: 'Zoomcar',
        departure: 'Flexible',
        arrival: 'Flexible',
        amenities: ['Self Drive', 'GPS', 'Fuel Included']
      }
    ];
    return transportMethods;
  };

  const generatePlaceExploration = (interests) => {
    const allPlaces = {
      'ADVENTURE': [
        { name: 'Dudhsagar Waterfalls Trek', type: 'Adventure', price: 2500, rating: 4.7 },
        { name: 'Scuba Diving at Grande Island', type: 'Water Sports', price: 4500, rating: 4.6 }
      ],
      'CULTURE': [
        { name: 'Old Goa Heritage Walk', type: 'Cultural Tour', price: 800, rating: 4.5 },
        { name: 'Feni Distillery Visit', type: 'Cultural Experience', price: 1200, rating: 4.3 }
      ],
      'FOOD': [
        { name: 'Goan Cooking Class', type: 'Culinary Experience', price: 2200, rating: 4.8 },
        { name: 'Food Walk in Panaji', type: 'Food Tour', price: 1500, rating: 4.6 }
      ],
      'BEACH': [
        { name: 'Beach Hopping Tour', type: 'Beach Experience', price: 1800, rating: 4.5 },
        { name: 'Sunset Cruise', type: 'Beach Activity', price: 2800, rating: 4.7 }
      ],
      'NATURE': [
        { name: 'Spice Plantation Tour', type: 'Nature Tour', price: 1600, rating: 4.4 },
        { name: 'Bird Watching at Salim Ali', type: 'Wildlife', price: 1000, rating: 4.2 }
      ]
    };

    let recommendedPlaces = [];
    interests.forEach(interest => {
      if (allPlaces[interest]) {
        recommendedPlaces = [...recommendedPlaces, ...allPlaces[interest]];
      }
    });

    return recommendedPlaces.length > 0 ? recommendedPlaces : allPlaces['BEACH'];
  };

  const handleHotelBooking = (hotel) => {
    setSelectedHotel(hotel);
    setShowBookingModal(true);
  };

  const handleTransportBooking = (transport) => {
    setSelectedTransport(transport);
    setShowBookingModal(true);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  const handleInterestChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      interests: typeof value === 'string' ? value.split(',') : value,
    });
  };

const generateMockItinerary = (days) => {
    const activities = [
      {
        day: 1,
        title: 'Arrival & Local Exploration',
        activities: [
          { time: '10:00 AM', activity: 'Airport pickup and hotel check-in', icon: '🏨' },
          { time: '2:00 PM', activity: 'Local market visit and authentic lunch', icon: '🍽️' },
          { time: '6:00 PM', activity: 'Sunset viewing at scenic location', icon: '🌅' }
        ]
      },
      {
        day: 2,
        title: 'Cultural Heritage Tour',
        activities: [
          { time: '9:00 AM', activity: 'Historic monument visit with guide', icon: '🏛️' },
          { time: '1:00 PM', activity: 'Traditional cuisine cooking class', icon: '👨‍🍳' },
          { time: '4:00 PM', activity: 'Art gallery and cultural center', icon: '🎨' },
          { time: '7:00 PM', activity: 'Traditional dance performance', icon: '💃' }
        ]
      },
      {
        day: 3,
        title: 'Adventure & Nature',  
        activities: [
          { time: '7:00 AM', activity: 'Nature trek or water sports', icon: '🥾' },
          { time: '12:00 PM', activity: 'Picnic lunch in scenic location', icon: '🧺' },
          { time: '3:00 PM', activity: 'Adventure activity (based on interest)', icon: '🚵‍♂️' },
          { time: '6:00 PM', activity: 'Relaxation and spa treatment', icon: '💆‍♀️' }
        ]
      },
      {
        day: 4,
        title: 'Local Markets & Shopping',
        activities: [
          { time: '9:00 AM', activity: 'Traditional market exploration', icon: '🛒' },
          { time: '12:00 PM', activity: 'Street food tour', icon: '🌮' },
          { time: '4:00 PM', activity: 'Handicraft workshop', icon: '🎨' },
          { time: '7:00 PM', activity: 'Night market visit', icon: '🌙' }
        ]
      },
      {
        day: 5,
        title: 'Outdoor Adventures',
        activities: [
          { time: '6:00 AM', activity: 'Mountain hiking or beach activities', icon: '⛰️' },
          { time: '11:00 AM', activity: 'Outdoor lunch with views', icon: '🏞️' },
          { time: '3:00 PM', activity: 'Photography tour', icon: '📸' },
          { time: '6:00 PM', activity: 'Scenic viewpoint sunset', icon: '🌅' }
        ]
      },
      {
        day: 6,
        title: 'Relaxation & Wellness',
        activities: [
          { time: '9:00 AM', activity: 'Spa and wellness treatment', icon: '💆‍♀️' },
          { time: '12:00 PM', activity: 'Healthy local cuisine', icon: '🥗' },
          { time: '3:00 PM', activity: 'Beach or garden relaxation', icon: '🌺' },
          { time: '6:00 PM', activity: 'Meditation or yoga session', icon: '🧘‍♀️' }
        ]
      },
      {
        day: 7,
        title: 'Farewell & Departure',
        activities: [
          { time: '9:00 AM', activity: 'Last-minute souvenir shopping', icon: '🛍️' },
          { time: '11:00 AM', activity: 'Farewell breakfast at local cafe', icon: '☕' },
          { time: '2:00 PM', activity: 'Airport transfer and departure', icon: '✈️' }
        ]
      }
    ];
    
    return activities.slice(0, Math.min(days, activities.length));
  };

  const mockItinerary = generateMockItinerary(formData.durationDays);




  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await suggestionsAPI.getComprehensiveSuggestions(formData);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      // Enhanced mock response based on user inputs
      const transportOptions = generateTransportOptions(formData.fromLocation, formData.toLocation);
      const explorationPlaces = generatePlaceExploration(formData.interests);
      
      setSuggestions({
        destinationOverview: {
          name: formData.toLocation || 'Goa',
          description: 'Beach paradise with Portuguese heritage, nightlife, and water sports.',
          bestTimeToVisit: 'November to March',
          currency: 'INR',
          mapUrl: `https://maps.google.com/embed?pb=!1m18!1m12!1m3!1d246196.37729529118!2d73.69815272387695!3d15.347142839999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1`
        },
        budgetBreakdown: {
          totalBudget: {
            recommended: formData.budgetLevel === 'luxury' ? 85000 : formData.budgetLevel === 'mid-range' ? 45000 : 25000,
            currency: 'INR'
          },
          breakdown: {
            accommodation: formData.budgetLevel === 'luxury' ? 35000 : formData.budgetLevel === 'mid-range' ? 18000 : 8000,
            transport: formData.budgetLevel === 'luxury' ? 20000 : formData.budgetLevel === 'mid-range' ? 12000 : 6000,
            food: formData.budgetLevel === 'luxury' ? 15000 : formData.budgetLevel === 'mid-range' ? 8000 : 4000,
            activities: formData.budgetLevel === 'luxury' ? 12000 : formData.budgetLevel === 'mid-range' ? 6000 : 3000,
            miscellaneous: formData.budgetLevel === 'luxury' ? 3000 : formData.budgetLevel === 'mid-range' ? 1000 : 4000
          }
        },
        suggestedAccommodations: [
          {
            name: formData.budgetLevel === 'luxury' ? 'The Leela Goa' : 'Goa Beach Resort',
            type: formData.budgetLevel === 'luxury' ? 'luxury resort' : 'resort',
            pricePerNight: formData.budgetLevel === 'luxury' ? 15000 : formData.budgetLevel === 'mid-range' ? 6500 : 2500,
            rating: formData.budgetLevel === 'luxury' ? 4.8 : 4.5,
            category: formData.budgetLevel || 'mid-range',
            amenities: formData.budgetLevel === 'luxury' 
              ? ['Private Beach', 'Spa', 'Golf Course', 'Fine Dining', 'Butler Service']
              : ['Beach Access', 'Pool', 'Spa', 'Restaurant'],
            bookingUrl: '#',
            availability: 'Available'
          },
          {
            name: formData.budgetLevel === 'luxury' ? 'Taj Exotica Goa' : 'Backpacker Hostel Goa',
            type: formData.budgetLevel === 'luxury' ? 'luxury resort' : 'hostel',
            pricePerNight: formData.budgetLevel === 'luxury' ? 12000 : formData.budgetLevel === 'mid-range' ? 3500 : 1200,
            rating: formData.budgetLevel === 'luxury' ? 4.7 : 4.2,
            category: formData.budgetLevel || 'budget',
            amenities: formData.budgetLevel === 'luxury' 
              ? ['Beach Villa', 'Infinity Pool', 'Spa', 'Multiple Restaurants']
              : ['WiFi', 'Common Kitchen', 'Beach Nearby'],
            bookingUrl: '#',
            availability: 'Available'
          }
        ],
        transportOptions: transportOptions,
        explorationPlaces: explorationPlaces,
        suggestedAttractions: [
          {
            name: 'Basilica of Bom Jesus',
            type: 'Historical Site',
            estimatedCost: 5,
            description: 'UNESCO World Heritage Church housing St. Francis Xavier',
            rating: 4.5,
            duration: '1 hour',
            bookingRequired: false
          },
          {
            name: 'Baga Beach',
            type: 'Beach',
            estimatedCost: 0,
            description: 'Famous beach known for water sports and nightlife',
            rating: 4.4,
            duration: '3 hours',
            bookingRequired: false
          },
          {
            name: 'Dudhsagar Falls',
            type: 'Natural Wonder',
            estimatedCost: 1500,
            description: 'Four-tiered waterfall on Mandovi River (includes transport)',
            rating: 4.6,
            duration: '4 hours',
            bookingRequired: true
          }
        ],
        priceRange: {
          budget: { min: 15000, max: 30000 },
          midRange: { min: 30000, max: 60000 },
          luxury: { min: 60000, max: 150000 }
        },
        metadata: {
          suggestedDuration: formData.durationDays,
          fromLocation: formData.fromLocation,
          interests: formData.interests
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="lg" sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
      <Grid container spacing={4} sx={{ 
        maxWidth: '900px',
        mx: 'auto',
        justifyContent: 'center'
      }}>
        {/* Search Form - Glass Card */}
        <Grid item xs={12} md={5}>
          <Paper 
            sx={{ 
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid #ebebeb',
              p: 4,
              height: 'fit-content',
              mx: 'auto'
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight="600" sx={{ 
              color: '#222222',
              textAlign: 'center',
              mb: 1
            }}>
              ✈️ Plan Your Adventure
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#717171', 
              mb: 4,
              textAlign: 'center'
            }}>
              Tell us your dreams and we'll craft the perfect journey
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="🏠 From (City/Country)"
                name="fromLocation"
                value={formData.fromLocation}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#ddd',
                      borderWidth: '1px'
                    },
                    '&:hover': {
                      '& fieldset': {
                        borderColor: '#ff5a5f',
                        borderWidth: '2px'
                      }
                    },
                    '&.Mui-focused': {
                      '& fieldset': {
                        borderColor: '#ff5a5f',
                        borderWidth: '2px'
                      }
                    },
                    '& input': {
                      color: '#222222',
                      fontSize: '14px'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#717171',
                    '&.Mui-focused': {
                      color: '#ff5a5f',
                      fontWeight: 500
                    }
                  }
                }}
                placeholder="e.g., Mumbai, Delhi, Bangalore"
              />
              <TextField
                fullWidth
                label="✈️ To (Destination)"
                name="toLocation"
                value={formData.toLocation}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#ddd',
                      borderWidth: '1px'
                    },
                    '&:hover': {
                      '& fieldset': {
                        borderColor: '#ff5a5f',
                        borderWidth: '2px'
                      }
                    },
                    '&.Mui-focused': {
                      '& fieldset': {
                        borderColor: '#ff5a5f',
                        borderWidth: '2px'
                      }
                    },
                    '& input': {
                      color: '#222222',
                      fontSize: '14px'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#717171',
                    '&.Mui-focused': {
                      color: '#ff5a5f',
                      fontWeight: 500
                    }
                  }
                }}
                placeholder="e.g., Goa, Kashmir, Kerala"
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ color: '#717171', '&.Mui-focused': { color: '#ff5a5f' } }}>💰 Budget Level</InputLabel>
                <Select
                  name="budgetLevel"
                  value={formData.budgetLevel}
                  label="💰 Budget Level"
                  onChange={handleChange}
                  sx={{ 
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#ddd',
                      borderWidth: '1px'
                    },
                    '&:hover': {
                      '& fieldset': {
                        borderColor: '#ff5a5f',
                        borderWidth: '2px'
                      }
                    },
                    '&.Mui-focused': {
                      '& fieldset': {
                        borderColor: '#ff5a5f',
                        borderWidth: '2px'
                      }
                    },
                    '& .MuiSelect-select': {
                      color: '#222222',
                      fontSize: '14px'
                    },
                    '& .MuiSvgIcon-root': { color: '#717171' }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        '& .MuiMenuItem-root': {
                          fontSize: '14px',
                          color: '#222222',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 90, 95, 0.08)'
                          }
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="budget">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>💡</span>
                      Budget (₹500-1,500/day)
                    </Box>
                  </MenuItem>
                  <MenuItem value="mid-range">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>⭐</span>
                      Mid-range (₹1,500-4,000/day)
                    </Box>
                  </MenuItem>
                  <MenuItem value="luxury">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>💎</span>
                      Luxury (₹4,000+/day)
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="📅 Duration (Days)"
                name="durationDays"
                type="number"
                value={formData.durationDays}
                onChange={handleChange}
                margin="normal"
                inputProps={{ min: 1, max: 30 }}
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#ddd',
                      borderWidth: '1px'
                    },
                    '&:hover': {
                      '& fieldset': {
                        borderColor: '#ff5a5f',
                        borderWidth: '2px'
                      }
                    },
                    '&.Mui-focused': {
                      '& fieldset': {
                        borderColor: '#ff5a5f',
                        borderWidth: '2px'
                      }
                    },
                    '& input': {
                      color: '#222222',
                      fontSize: '14px'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#717171',
                    '&.Mui-focused': {
                      color: '#ff5a5f',
                      fontWeight: 500
                    }
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#717171',
                    fontSize: '12px'
                  }
                }}
                helperText="How many days do you want to travel?"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ color: '#717171', '&.Mui-focused': { color: '#ff5a5f', fontWeight: 500 } }}>🎯 Interests</InputLabel>
                <Select
                  multiple
                  value={formData.interests}
                  onChange={handleInterestChange}
                  label="🎯 Interests"
                  sx={{ 
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#ddd',
                      borderWidth: '1px'
                    },
                    '&:hover': {
                      '& fieldset': {
                        borderColor: '#ff5a5f',
                        borderWidth: '2px'
                      }
                    },
                    '&.Mui-focused': {
                      '& fieldset': {
                        borderColor: '#ff5a5f',
                        borderWidth: '2px'
                      }
                    },
                    '& .MuiSelect-select': {
                      color: '#222222',
                      fontSize: '14px'
                    },
                    '& .MuiSvgIcon-root': { color: '#717171' }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        '& .MuiMenuItem-root': {
                          fontSize: '14px',
                          color: '#222222',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 90, 95, 0.08)'
                          }
                        }
                      }
                    }
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip 
                          key={value} 
                          label={value} 
                          size="small" 
                          sx={{ 
                            borderRadius: '6px',
                            backgroundColor: '#ff5a5f',
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '12px',
                            '&:hover': {
                              backgroundColor: '#e04e53'
                            }
                          }} 
                        />
                      ))}
                    </Box>
                  )}
                >
                  {interestOptions.map((interest) => (
                    <MenuItem key={interest} value={interest}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {interest === 'ADVENTURE' && <span>🏔️</span>}
                        {interest === 'CULTURE' && <span>🏛️</span>}
                        {interest === 'FOOD' && <span>🍜</span>}
                        {interest === 'NIGHTLIFE' && <span>🌙</span>}
                        {interest === 'NATURE' && <span>🌿</span>}
                        {interest === 'BEACH' && <span>🏖️</span>}
                        {interest === 'SHOPPING' && <span>🛍️</span>}
                        {interest === 'HISTORY' && <span>📜</span>}
                        {interest === 'ART' && <span>🎨</span>}
                        {interest === 'MUSIC' && <span>🎵</span>}
                        {interest === 'SPORTS' && <span>⚽</span>}
                        {interest === 'WELLNESS' && <span>🧘</span>}
                        {interest === 'BUSINESS' && <span>💼</span>}
                        {interest === 'LUXURY' && <span>💎</span>}
                        {interest === 'BUDGET' && <span>💡</span>}
                        {interest === 'FAMILY' && <span>👨‍👩‍👧‍👦</span>}
                        {interest === 'ROMANTIC' && <span>💕</span>}
                        {interest}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: '8px',
                  backgroundColor: '#ff5a5f',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '16px',
                  textTransform: 'none',
                  boxShadow: '0 2px 8px rgba(255, 90, 95, 0.3)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#e04e53',
                    boxShadow: '0 4px 12px rgba(255, 90, 95, 0.4)',
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc',
                    color: '#999',
                    boxShadow: 'none'
                  }
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      width: 20, 
                      height: 20, 
                      border: '2px solid rgba(255,255,255,0.3)', 
                      borderTop: '2px solid white', 
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }} />
                    Creating Your Journey...
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>✨</span>
                    Discover My Perfect Trip
                  </Box>
                )}
              </Button>

              <Typography variant="caption" sx={{ 
                mt: 2, 
                display: 'block', 
                textAlign: 'center', 
                color: '#717171',
                fontSize: '12px'
              }}>
                🚀 Get personalized recommendations powered by AI
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}>
          {loading && (
            <Box sx={{ 
              textAlign: 'center', 
              py: 6,
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '1px solid #ebebeb',
              width: '100%',
              maxWidth: '600px'
            }}>
              <Box sx={{ mb: 4 }}>
                {[...Array(3)].map((_, i) => (
                  <Skeleton 
                    key={i} 
                    variant="rectangular" 
                    height={200} 
                    sx={{ 
                      mb: 2, 
                      borderRadius: '12px',
                      backgroundColor: '#f7f7f7'
                    }} 
                  />
                ))}
              </Box>
              <Typography variant="h6" sx={{ color: '#ff5a5f', fontWeight: 600 }}>
                Creating your perfect travel experience...
              </Typography>
            </Box>
          )}

          {suggestions && !loading && (
            <Box sx={{ 
              width: '100%',
              maxWidth: '800px',
              mx: 'auto'
            }}>
              {/* Destination Overview Card */}
              <Card sx={{ 
                mb: 4, 
                borderRadius: '12px', 
                overflow: 'hidden', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid #ebebeb'
              }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={
                      suggestions.destinationOverview?.name?.toLowerCase().includes('goa') 
                        ? 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80'
                        : suggestions.destinationOverview?.name?.toLowerCase().includes('paris')
                        ? 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&q=80'
                        : suggestions.destinationOverview?.name?.toLowerCase().includes('tokyo')
                        ? 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80'
                        : suggestions.destinationOverview?.name?.toLowerCase().includes('kerala')
                        ? 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80'
                        : suggestions.destinationOverview?.name?.toLowerCase().includes('kashmir')
                        ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
                        : suggestions.destinationOverview?.name?.toLowerCase().includes('rajasthan')
                        ? 'https://images.unsplash.com/photo-1578662996442-48f60b5e1fa4?w=800&q=80'
                        : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
                    }
                    alt={suggestions.destinationOverview?.name}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0,
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)'
                  }} />
                  <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <IconButton 
                      sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.9)', 
                        '&:hover': { backgroundColor: 'white' }
                      }}
                      onClick={() => toggleFavorite('destination')}
                    >
                      {favorites.has('destination') ? <Favorite color="error" /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: 24, 
                    left: 24, 
                    right: 24,
                    color: 'white'
                  }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {suggestions.destinationOverview?.name || 'Your Destination'}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      {suggestions.destinationOverview?.description}
                    </Typography>
                  </Box>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                          <Chip 
                            icon={<CalendarToday />} 
                            label={`Best time: ${suggestions.destinationOverview?.bestTimeToVisit || 'Year round'}`}
                            sx={{
                              backgroundColor: '#f7f7f7',
                              color: '#222222',
                              border: '1px solid #ddd',
                              fontWeight: 500
                            }}
                          />
                          <Chip 
                            icon={<AccessTime />} 
                            label={`${formData.durationDays} days`}
                            sx={{
                              backgroundColor: '#f7f7f7',
                              color: '#222222',
                              border: '1px solid #ddd',
                              fontWeight: 500
                            }}
                          />
                          <Chip 
                            label={`From ${formData.fromLocation || 'Your City'}`}
                            sx={{
                              backgroundColor: '#e3f2fd',
                              color: '#1976d2',
                              border: '1px solid #bbdefb',
                              fontWeight: 500
                            }}
                          />
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h5" color="primary.main" fontWeight="bold">
                            {formatCurrency(convertCurrency(suggestions.budgetBreakdown?.totalBudget?.recommended, suggestions.budgetBreakdown?.totalBudget?.currency))}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total estimated cost
                          </Typography>
                          {selectedCurrency !== (suggestions.budgetBreakdown?.totalBudget?.currency || 'INR') && (
                            <Typography variant="caption" color="text.secondary">
                              Original: {suggestions.budgetBreakdown?.totalBudget?.currency || 'INR'} {suggestions.budgetBreakdown?.totalBudget?.recommended || 'N/A'}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      {/* Budget Breakdown */}
                      {suggestions.budgetBreakdown?.breakdown && (
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="h6" fontWeight="600" gutterBottom>
                            💰 Budget Breakdown
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={6} md={2.4}>
                              <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Accommodation</Typography>
                                <Typography variant="body2" fontWeight="600">
                                  {formatCurrency(convertCurrency(suggestions.budgetBreakdown.breakdown.accommodation, suggestions.budgetBreakdown.totalBudget?.currency))}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={2.4}>
                              <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Transport</Typography>
                                <Typography variant="body2" fontWeight="600">
                                  {formatCurrency(convertCurrency(suggestions.budgetBreakdown.breakdown.transport, suggestions.budgetBreakdown.totalBudget?.currency))}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={2.4}>
                              <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Food</Typography>
                                <Typography variant="body2" fontWeight="600">
                                  {formatCurrency(convertCurrency(suggestions.budgetBreakdown.breakdown.food, suggestions.budgetBreakdown.totalBudget?.currency))}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={2.4}>
                              <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Activities</Typography>
                                <Typography variant="body2" fontWeight="600">
                                  {formatCurrency(convertCurrency(suggestions.budgetBreakdown.breakdown.activities, suggestions.budgetBreakdown.totalBudget?.currency))}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={2.4}>
                              <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Misc</Typography>
                                <Typography variant="body2" fontWeight="600">
                                  {formatCurrency(convertCurrency(suggestions.budgetBreakdown.breakdown.miscellaneous, suggestions.budgetBreakdown.totalBudget?.currency))}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </Grid>
                    
                    {/* Map Integration */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{
                        height: '200px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #e0e0e0'
                      }}>
                        {suggestions.destinationOverview?.mapUrl ? (
                          <iframe 
                            src={suggestions.destinationOverview.mapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Map of ${suggestions.destinationOverview?.name}`}
                          />
                        ) : (
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ color: '#ff5a5f', mb: 1 }}>
                              🗺️
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {suggestions.destinationOverview?.name} Map
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Tabs for different sections */}
              <Paper sx={{ 
                borderRadius: '12px', 
                overflow: 'hidden', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid #ebebeb'
              }}>
                <Tabs 
                  value={activeTab} 
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{ 
                    borderBottom: 1, 
                    borderColor: '#ebebeb',
                    backgroundColor: 'white',
                    '& .MuiTab-root': { 
                      minHeight: 60, 
                      fontWeight: 500,
                      color: '#717171',
                      textTransform: 'none',
                      fontSize: '14px',
                      '&.Mui-selected': {
                        color: '#ff5a5f',
                        fontWeight: 600
                      }
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#ff5a5f',
                      height: 3
                    }
                  }}
                >
                  <Tab icon={<Hotel />} label="Hotels" />
                  <Tab icon={<TravelExplore />} label="Transport" />
                  <Tab icon={<AttractionsOutlined />} label="Explore" />
                  <Tab icon={<Schedule />} label="Itinerary" />
                </Tabs>

                {/* Hotels Tab with Booking */}
                <TabPanel value={activeTab} index={0}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      Hotels & Accommodations
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      From {formData.fromLocation} to {formData.toLocation} • {formData.durationDays} nights
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    {suggestions.suggestedAccommodations?.map((hotel, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card 
                          sx={{ 
                            borderRadius: '12px', 
                            transition: 'all 0.2s ease', 
                            border: '1px solid #ebebeb',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            '&:hover': { 
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                              borderColor: '#ff5a5f'
                            },
                            overflow: 'hidden'
                          }}
                        >
                          <Box sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              height="200"
                              image={
                                hotel.category === 'luxury' 
                                  ? 'https://images.unsplash.com/photo-1578774443271-39db861dd6d6?w=400&q=80'
                                  : hotel.category === 'mid-range'
                                  ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'
                                  : 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80'
                              }
                              alt={hotel.name}
                            />
                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                              <IconButton 
                                size="small" 
                                sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                                onClick={() => toggleFavorite(`hotel-${index}`)}
                              >
                                {favorites.has(`hotel-${index}`) ? <Favorite color="error" /> : <FavoriteBorder />}
                              </IconButton>
                            </Box>
                            <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                              <Chip 
                                label={hotel.availability} 
                                size="small"
                                color="success"
                                sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                              />
                            </Box>
                          </Box>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="h6" fontWeight="600">
                                {hotel.name}
                              </Typography>
                              <Chip 
                                label={hotel.category} 
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Rating value={hotel.rating} precision={0.1} size="small" readOnly />
                              <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                                {hotel.rating} ({Math.floor(Math.random() * 500) + 100} reviews)
                              </Typography>
                            </Box>
                            {hotel.amenities && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                {hotel.amenities.slice(0, 3).map((amenity, i) => (
                                  <Chip key={i} label={amenity} size="small" variant="outlined" />
                                ))}
                                {hotel.amenities.length > 3 && (
                                  <Chip label={`+${hotel.amenities.length - 3} more`} size="small" variant="outlined" />
                                )}
                              </Box>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Box>
                                <Typography variant="h6" color="primary.main" fontWeight="bold">
                                  {formatCurrency(convertCurrency(hotel.pricePerNight))}/night
                                </Typography>
                                {selectedCurrency !== 'INR' && hotel.pricePerNight && (
                                  <Typography variant="caption" color="text.secondary">
                                    (₹{hotel.pricePerNight})
                                  </Typography>
                                )}
                                <Typography variant="body2" color="text.secondary">
                                  Total: {formatCurrency(convertCurrency(hotel.pricePerNight * formData.durationDays))}
                                </Typography>
                              </Box>
                              <Button 
                                variant="contained"
                                color="primary"
                                onClick={() => handleHotelBooking(hotel)}
                                sx={{
                                  backgroundColor: '#ff5a5f',
                                  '&:hover': { backgroundColor: '#e04e53' },
                                  borderRadius: '8px',
                                  textTransform: 'none',
                                  fontWeight: 600
                                }}
                              >
                                Book Now
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>

                {/* Transport Tab */}
                <TabPanel value={activeTab} index={1}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      Transport Options
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Travel from {formData.fromLocation} to {formData.toLocation}
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    {suggestions.transportOptions?.map((transport, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card 
                          sx={{ 
                            borderRadius: '12px',
                            border: '1px solid #ebebeb',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            '&:hover': { 
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                              borderColor: '#ff5a5f'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: '50%',
                                  backgroundColor: transport.type === 'Flight' ? '#4CAF50' : transport.type === 'Train' ? '#2196F3' : transport.type === 'Bus' ? '#FF9800' : '#9C27B0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: 2
                                }}>
                                  <Typography variant="h6" color="white" fontWeight="600">
                                    {transport.type === 'Flight' ? '✈️' : transport.type === 'Train' ? '🚆' : transport.type === 'Bus' ? '🚌' : '🚗'}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="h6" fontWeight="600">
                                    {transport.type}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    by {transport.provider}
                                  </Typography>
                                </Box>
                              </Box>
                              <Chip 
                                label={transport.duration}
                                color="primary"
                                variant="outlined"
                                size="small"
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Departure
                                </Typography>
                                <Typography variant="body1" fontWeight="500">
                                  {transport.departure}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" color="text.secondary">
                                  Arrival
                                </Typography>
                                <Typography variant="body1" fontWeight="500">
                                  {transport.arrival}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Included Amenities
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {transport.amenities?.map((amenity, i) => (
                                  <Chip key={i} label={amenity} size="small" variant="outlined" />
                                ))}
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="h5" color="primary.main" fontWeight="bold">
                                  {formatCurrency(convertCurrency(transport.price))}
                                </Typography>
                                {selectedCurrency !== 'INR' && (
                                  <Typography variant="caption" color="text.secondary">
                                    (₹{transport.price})
                                  </Typography>
                                )}
                              </Box>
                              <Button 
                                variant="contained"
                                onClick={() => handleTransportBooking(transport)}
                                sx={{
                                  backgroundColor: '#ff5a5f',
                                  '&:hover': { backgroundColor: '#e04e53' },
                                  borderRadius: '8px',
                                  textTransform: 'none',
                                  fontWeight: 600
                                }}
                              >
                                Book {transport.type}
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>
                {/* Explore Tab */}
                <TabPanel value={activeTab} index={2}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      Places to Explore
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Based on your interests: {formData.interests?.join(', ') || 'General exploration'}
                    </Typography>
                  </Box>
                  
                  {/* Interest-based Activities */}
                  {suggestions.explorationPlaces?.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
                        🎯 Recommended Activities
                      </Typography>
                      <Grid container spacing={3}>
                        {suggestions.explorationPlaces.map((place, index) => (
                          <Grid item xs={12} md={4} key={index}>
                            <Card 
                              sx={{ 
                                borderRadius: '12px',
                                border: '1px solid #ebebeb',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                '&:hover': { 
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <CardContent>
                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                  {place.name}
                                </Typography>
                                <Chip 
                                  label={place.type}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{ mb: 2 }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Rating value={place.rating} precision={0.1} size="small" readOnly />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                      {place.rating}
                                    </Typography>
                                  </Box>
                                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                                    {formatCurrency(convertCurrency(place.price))}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                  
                  {/* Popular Attractions */}
                  <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
                    🏛️ Popular Attractions
                  </Typography>
                  <Box 
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 3,
                      justifyContent: suggestions.suggestedAttractions?.length === 1 ? 'center' : 'flex-start'
                    }}
                  >
                    {suggestions.suggestedAttractions?.map((attraction, index) => {
                      const totalCards = suggestions.suggestedAttractions?.length || 0;
                      const isLastOddCard = totalCards % 2 === 1 && index === totalCards - 1;
                      
                      return (
                        <Box 
                          key={index}
                          sx={{
                            flex: '1 1 calc(50% - 12px)',
                            maxWidth: 'calc(50% - 12px)',
                            minWidth: '300px',
                            ...(isLastOddCard && {
                              marginLeft: 'auto',
                              marginRight: 'auto',
                              flex: '0 0 calc(50% - 12px)'
                            })
                          }}
                        >
                        <Card 
                          sx={{ 
                            borderRadius: 2, 
                            transition: 'all 0.3s ease', 
                            '&:hover': { 
                              transform: 'translateY(-4px)',
                              boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                            },
                            cursor: 'pointer',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Box sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              height="180"
                              image={
                                attraction.type?.toLowerCase().includes('beach') 
                                  ? 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&q=80'
                                  : attraction.type?.toLowerCase().includes('temple') || attraction.type?.toLowerCase().includes('historical')
                                  ? 'https://images.unsplash.com/photo-1578662996442-48f60b5e1fa4?w=300&q=80'
                                  : attraction.type?.toLowerCase().includes('museum')
                                  ? 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=300&q=80'
                                  : attraction.type?.toLowerCase().includes('natural') || attraction.type?.toLowerCase().includes('waterfall')
                                  ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80'
                                  : attraction.name?.toLowerCase().includes('church')
                                  ? 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&q=80'
                                  : 'https://images.unsplash.com/photo-1578662996442-48f60b5e1fa4?w=300&q=80'
                              }
                              alt={attraction.name}
                            />
                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                              <IconButton 
                                size="small" 
                                sx={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                                onClick={() => toggleFavorite(`attraction-${index}`)}
                              >
                                {favorites.has(`attraction-${index}`) ? <Favorite color="error" /> : <FavoriteBorder />}
                              </IconButton>
                            </Box>
                            {attraction.estimatedCost === 0 && (
                              <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
                                <Chip label="FREE" size="small" color="success" sx={{ fontWeight: 'bold' }} />
                              </Box>
                            )}
                          </Box>
                          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" fontWeight="600" gutterBottom>
                              {attraction.name}
                            </Typography>
                            <Typography variant="body2" color="primary.main" fontWeight="500" gutterBottom>
                              {attraction.type}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                              {attraction.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                {attraction.rating && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Rating value={attraction.rating} precision={0.1} size="small" readOnly />
                                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                                      {attraction.rating}
                                    </Typography>
                                  </Box>
                                )}
                                {attraction.duration && (
                                  <Typography variant="caption" color="text.secondary">
                                    ⏱️ {attraction.duration}
                                  </Typography>
                                )}
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                {attraction.estimatedCost > 0 && (
                                  <>
                                    <Typography variant="body1" color="primary.main" fontWeight="bold">
                                      {formatCurrency(convertCurrency(attraction.estimatedCost))}
                                    </Typography>
                                    {selectedCurrency !== 'INR' && (
                                      <Typography variant="caption" color="text.secondary">
                                        (₹{attraction.estimatedCost})
                                      </Typography>
                                    )}
                                  </>
                                )}
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                        </Box>
                      )
                    })}
                  </Box>
                </TabPanel>

                {/* Itinerary Tab */}
                <TabPanel value={activeTab} index={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                      Your {formData.durationDays}-Day Itinerary for {formData.toLocation}
                    </Typography>
                    
                    {/* Price Range Summary */}
                    {suggestions.priceRange && (
                      <Card sx={{ mb: 3, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                        <CardContent>
                          <Typography variant="h6" fontWeight="600" gutterBottom>
                            💰 Budget Overview
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <Box sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="body2" color="text.secondary">Budget</Typography>
                                <Typography variant="h6" color="success.main" fontWeight="bold">
                                  {formatCurrency(convertCurrency(suggestions.priceRange.budget.min))} - {formatCurrency(convertCurrency(suggestions.priceRange.budget.max))}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Box sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="body2" color="text.secondary">Mid-Range</Typography>
                                <Typography variant="h6" color="primary.main" fontWeight="bold">
                                  {formatCurrency(convertCurrency(suggestions.priceRange.midRange.min))} - {formatCurrency(convertCurrency(suggestions.priceRange.midRange.max))}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Box sx={{ textAlign: 'center', p: 2 }}>
                                <Typography variant="body2" color="text.secondary">Luxury</Typography>
                                <Typography variant="h6" color="error.main" fontWeight="bold">
                                  {formatCurrency(convertCurrency(suggestions.priceRange.luxury.min))} - {formatCurrency(convertCurrency(suggestions.priceRange.luxury.max))}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    )}
                    {mockItinerary.slice(0, formData.durationDays).map((day, index) => (
                      <Card key={index} sx={{ mb: 3, borderRadius: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                              {day.day}
                            </Avatar>
                            <Typography variant="h6" fontWeight="600">
                              Day {day.day}: {day.title}
                            </Typography>
                          </Box>
                          <List>
                            {day.activities.map((activity, actIndex) => (
                              <ListItem key={actIndex} sx={{ py: 1 }}>
                                <ListItemIcon>
                                  <Box sx={{ 
                                    width: 40, 
                                    height: 40, 
                                    borderRadius: '50%', 
                                    backgroundColor: 'primary.light',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2em'
                                  }}>
                                    {activity.icon}
                                  </Box>
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Typography variant="body1" fontWeight="500">
                                        {activity.activity}
                                      </Typography>
                                      <Chip 
                                        label={activity.time} 
                                        size="small" 
                                        variant="outlined"
                                        color="primary"
                                      />
                                    </Box>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Box sx={{ textAlign: 'center', mt: 4, p: 3, backgroundColor: 'primary.light', borderRadius: 2 }}>
                      <Typography variant="body1" color="primary.main" fontWeight="600">
                        💡 This is a sample itinerary. Customize it based on your interests and preferences!
                      </Typography>
                    </Box>
                  </Box>
                </TabPanel>
              </Paper>
            </Box>
          )}

          {/* Booking Modal */}
          {showBookingModal && (selectedHotel || selectedTransport) && (
            <Paper 
              sx={{ 
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1300,
                p: 4,
                borderRadius: '12px',
                minWidth: '400px',
                maxWidth: '600px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
            >
              <Typography variant="h5" fontWeight="600" gutterBottom sx={{ color: '#ff5a5f' }}>
                🎉 Booking Confirmation
              </Typography>
              
              {selectedHotel && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedHotel.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formData.durationDays} nights • {selectedHotel.category}
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="bold" sx={{ mb: 2 }}>
                    Total: {formatCurrency(convertCurrency(selectedHotel.pricePerNight * formData.durationDays))}
                  </Typography>
                </Box>
              )}
              
              {selectedTransport && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedTransport.type} by {selectedTransport.provider}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formData.fromLocation} to {formData.toLocation} • {selectedTransport.duration}
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="bold" sx={{ mb: 2 }}>
                    Price: {formatCurrency(convertCurrency(selectedTransport.price))}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button 
                  variant="outlined"
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedHotel(null);
                    setSelectedTransport(null);
                  }}
                  sx={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained"
                  onClick={() => {
                    // Handle actual booking logic here
                    alert('Booking confirmed! Redirecting to payment...');
                    setShowBookingModal(false);
                    setSelectedHotel(null);
                    setSelectedTransport(null);
                  }}
                  sx={{ 
                    flex: 1,
                    backgroundColor: '#ff5a5f',
                    '&:hover': { backgroundColor: '#e04e53' }
                  }}
                >
                  Confirm Booking
                </Button>
              </Box>
            </Paper>
          )}
          
          {/* Modal Backdrop */}
          {showBookingModal && (
            <Box 
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 1200
              }}
              onClick={() => {
                setShowBookingModal(false);
                setSelectedHotel(null);
                setSelectedTransport(null);
              }}
            />
          )}

          {!suggestions && !loading && (
            <Paper 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                borderRadius: '12px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid #ebebeb',
                width: '100%',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              <TravelExplore sx={{ fontSize: 64, color: '#ff5a5f', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ color: '#ff5a5f', fontWeight: 600 }}>
                Ready to Explore?
              </Typography>
              <Typography variant="body1" sx={{ color: '#717171' }}>
                Fill out the form to get your personalized travel suggestions with detailed itineraries, handpicked accommodations, and must-visit attractions.
              </Typography>
            </Paper>
          )}
          </Box>
        </Grid>
      </Grid>  
    </Container>
    </Box>
  );
};

export default TravelSuggestions;