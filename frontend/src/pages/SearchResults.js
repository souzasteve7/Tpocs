import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia,
  Box,
  CircularProgress,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchAPI } from '../services/api';
import { Star } from '@mui/icons-material';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [filterBy, setFilterBy] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');

  // Helper function to get destination-specific images
  const getDestinationImage = (name) => {
    const imageMap = {
      // India destinations
      'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80',
      'delhi, india': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80',
      'new delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80',
      'mumbai': 'https://images.unsplash.com/photo-1531694611353-d4758f86fa80?w=400&q=80',
      'mumbai, india': 'https://images.unsplash.com/photo-1531694611353-d4758f86fa80?w=400&q=80',
      'agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80',
      'jaipur': 'https://images.unsplash.com/photo-1599661046827-dacde645b4b1?w=400&q=80',
      'rajasthan': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80',
      'rajasthan, india': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80',
      'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80',
      'goa, india': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80',
      'kerala': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
      'kerala, india': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
      'varanasi': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&q=80',
      'kashmir': 'https://images.unsplash.com/photo-1558431382-27579e06e04d?w=400&q=80',
      'kashmir, india': 'https://images.unsplash.com/photo-1558431382-27579e06e04d?w=400&q=80',
      'ladakh': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      'ladakh, india': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      'himachal pradesh': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      'tamil nadu': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
      'karnataka': 'https://images.unsplash.com/photo-1582550945154-019d7a269d59?w=400&q=80',
      'uttarakhand': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      'andhra pradesh': 'https://images.unsplash.com/photo-1582729400575-c9db4ee0b914?w=400&q=80',
      'west bengal': 'https://images.unsplash.com/photo-1558431382-27209c68d0a4?w=400&q=80',
      'gujarat': 'https://images.unsplash.com/photo-1567228475792-34caa959efc3?w=400&q=80',
      
      // Cities
      'udaipur': 'https://images.unsplash.com/photo-1571115764595-d3d95fa0b942?w=400&q=80',
      'rishikesh': 'https://images.unsplash.com/photo-1565118531758-4c28c951d096?w=400&q=80',
      'manali': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      'darjeeling': 'https://images.unsplash.com/photo-1549261499-b391e2b1b47e?w=400&q=80',
      'shimla': 'https://images.unsplash.com/photo-1549261499-b391e2b1b47e?w=400&q=80',
      'ooty': 'https://images.unsplash.com/photo-1549261499-b391e2b1b47e?w=400&q=80',
      'kodaikanal': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80',
      'munnar': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80',
      'alleppey': 'https://images.unsplash.com/photo-1578662932556-949804313f46?w=400&q=80',
      'kochi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Chinese_fishing_nets_Kochi_Kerala.jpg/400px-Chinese_fishing_nets_Kochi_Kerala.jpg',
      'hampi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Hampi_Vijayanagara_Karnataka_India.jpg/400px-Hampi_Vijayanagara_Karnataka_India.jpg',
      'mysore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mysore_Palace_Karnataka_India.jpg/400px-Mysore_Palace_Karnataka_India.jpg',
      'bangalore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bangalore_Lalbagh_Botanical_Garden.jpg/400px-Bangalore_Lalbagh_Botanical_Garden.jpg',
      'chennai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Meenakshi_Temple_Madurai_Tamil_Nadu.jpg/400px-Meenakshi_Temple_Madurai_Tamil_Nadu.jpg',
      'hyderabad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Charminar_Hyderabad_Andhra_Pradesh.jpg/400px-Charminar_Hyderabad_Andhra_Pradesh.jpg',
      'pune': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Shaniwar_Wada_Pune_Maharashtra.jpg/400px-Shaniwar_Wada_Pune_Maharashtra.jpg',
      'kolkata': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Victoria_Memorial_Kolkata_West_Bengal.jpg/400px-Victoria_Memorial_Kolkata_West_Bengal.jpg',
      'ahmedabad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Sabarmati_Ashram_Ahmedabad_Gujarat.jpg/400px-Sabarmati_Ashram_Ahmedabad_Gujarat.jpg',
      'surat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Surat_Castle_Gujarat_India.jpg/400px-Surat_Castle_Gujarat_India.jpg',
      
      // International
      'ho chi minh city': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Notre-Dame_Cathedral_Basilica_of_Saigon.jpg/400px-Notre-Dame_Cathedral_Basilica_of_Saigon.jpg',
      'islamabad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Faisal_Mosque_Islamabad_Pakistan.jpg/400px-Faisal_Mosque_Islamabad_Pakistan.jpg',
      'lahore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Badshahi_Mosque_Lahore_Pakistan.jpg/400px-Badshahi_Mosque_Lahore_Pakistan.jpg',
      'karachi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Quaid-e-Azam_Mausoleum_Karachi_Pakistan.jpg/400px-Quaid-e-Azam_Mausoleum_Karachi_Pakistan.jpg',
      'kandy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Temple_of_Tooth_Kandy_Sri_Lanka.jpg/400px-Temple_of_Tooth_Kandy_Sri_Lanka.jpg',
      'galle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Galle_Fort_Sri_Lanka.jpg/400px-Galle_Fort_Sri_Lanka.jpg',
      'nuwara eliya': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Tea_plantations_Nuwara_Eliya_Sri_Lanka.jpg/400px-Tea_plantations_Nuwara_Eliya_Sri_Lanka.jpg',
      'pokhara': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Phewa_Lake_Pokhara_Nepal.jpg/400px-Phewa_Lake_Pokhara_Nepal.jpg',
      'chitwan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chitwan_National_Park_Nepal.jpg/400px-Chitwan_National_Park_Nepal.jpg',
      'abu dhabi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Sheikh_Zayed_Grand_Mosque_Abu_Dhabi.jpg/400px-Sheikh_Zayed_Grand_Mosque_Abu_Dhabi.jpg',
      'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80',
      'dubai, united arab emirates': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80',
      'sharjah': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sharjah_skyline_UAE.jpg/400px-Sharjah_skyline_UAE.jpg',
      'sharjah, united arab emirates': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sharjah_skyline_UAE.jpg/400px-Sharjah_skyline_UAE.jpg',
      'muscat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Sultan_Qaboos_Grand_Mosque_Muscat_Oman.jpg/400px-Sultan_Qaboos_Grand_Mosque_Muscat_Oman.jpg',
      'muscat, oman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Sultan_Qaboos_Grand_Mosque_Muscat_Oman.jpg/400px-Sultan_Qaboos_Grand_Mosque_Muscat_Oman.jpg',
      'seoul': 'https://images.unsplash.com/photo-1538952331524-8de4920942c6?w=400&q=80',
      'seoul, south korea': 'https://images.unsplash.com/photo-1538952331524-8de4920942c6?w=400&q=80',
      'doha': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c88?w=400&q=80',
      'doha, qatar': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c88?w=400&q=80',
      'bangkok': 'https://images.unsplash.com/photo-1563492065-step-1654822419?w=400&q=80',
      'bangkok, thailand': 'https://images.unsplash.com/photo-1563492065-step-1654822419?w=400&q=80',
      'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80',
      'singapore, singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80',
      'kuala lumpur': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80',
      'kuala lumpur, malaysia': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80',
      'jakarta': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/National_Monument_Jakarta_Indonesia.jpg/400px-National_Monument_Jakarta_Indonesia.jpg',
      
      // More International destinations
      'paris': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/400px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg',
      'paris, france': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/400px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg',
      'tokyo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/400px-Skyscrapers_of_Shinjuku_2009_January.jpg',
      'tokyo, japan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/400px-Skyscrapers_of_Shinjuku_2009_January.jpg',
      'london': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Tower_Bridge_from_Shad_Thames.jpg/400px-Tower_Bridge_from_Shad_Thames.jpg',
      'new york': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/400px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
      'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80',
      'barcelona, spain': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80',
      'london, united kingdom': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Tower_Bridge_from_Shad_Thames.jpg/400px-Tower_Bridge_from_Shad_Thames.jpg',
      'rome': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/400px-Colosseo_2020.jpg',
      'rome, italy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/400px-Colosseo_2020.jpg',
      'sydney': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sydney_Opera_House_-_Dec_2008.jpg/400px-Sydney_Opera_House_-_Dec_2008.jpg',
      'sydney, australia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sydney_Opera_House_-_Dec_2008.jpg/400px-Sydney_Opera_House_-_Dec_2008.jpg',
      'istanbul': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&q=80',
      'istanbul, turkey': 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&q=80',
      'maldives': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
      'thailand': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wat_Arun_Temple_Bangkok_Thailand.jpg/400px-Wat_Arun_Temple_Bangkok_Thailand.jpg',
      'bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=80',
      'malaysia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Petronas_Towers_KL_Malaysia.jpg/400px-Petronas_Towers_KL_Malaysia.jpg',
      
      // Nepal
      'nepal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Mount_Everest_from_Gokyo_Ri_November_2012.jpg/400px-Mount_Everest_from_Gokyo_Ri_November_2012.jpg',
      'kathmandu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Boudhanath_Stupa_Kathmandu_Nepal.jpg/400px-Boudhanath_Stupa_Kathmandu_Nepal.jpg',
      'kathmandu, nepal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Boudhanath_Stupa_Kathmandu_Nepal.jpg/400px-Boudhanath_Stupa_Kathmandu_Nepal.jpg',
      
      // Bhutan
      'bhutan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Paro_Taktsang_Tiger_Nest_Monastery_Bhutan.jpg/400px-Paro_Taktsang_Tiger_Nest_Monastery_Bhutan.jpg',
      'bhutan, bhutan': 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=400&q=80',
      
      // Sri Lanka
      'sri lanka': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&q=80',
      'colombo': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
      'colombo, sri lanka': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
      'ho chi minh city, vietnam': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=80',
      'islamabad, pakistan': 'https://images.unsplash.com/photo-1578662755764-3ac880b55c07?w=400&q=80',
      'lahore, pakistan': 'https://images.unsplash.com/photo-1578662781034-4ca48d5e9c89?w=400&q=80',
      'karachi, pakistan': 'https://images.unsplash.com/photo-1578663263821-e5b57f9108b9?w=400&q=80',
      'kandy, sri lanka': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&q=80',
      'galle, sri lanka': 'https://images.unsplash.com/photo-1578995841866-4b1b6c6a94d7?w=400&q=80',
      'pokhara, nepal': 'https://images.unsplash.com/photo-1578662932754-a356ca0ea6bb?w=400&q=80',
      'chitwan, nepal': 'https://images.unsplash.com/photo-1578662932754-a356ca0ea6bb?w=400&q=80',
      'abu dhabi, united arab emirates': 'https://images.unsplash.com/photo-1578662932556-949804313f46?w=400&q=80',
      'maldives, maldives': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
      'bali, indonesia': 'https://images.unsplash.com/photo-1555400080-d4378725ac15?w=400&q=80'
    };
    return imageMap[name?.toLowerCase()] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80';
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query');
    if (query) {
      setSearchQuery(query);
      searchDestinations(query);
    } else {
      loadAllDestinations();
    }
  }, [location.search]);

  const searchDestinations = async (query) => {
    setLoading(true);
    try {
      const response = await searchAPI.searchDestinations(query);
      setDestinations(response.data);
    } catch (error) {
      console.error('Error searching destinations:', error);
      // Mock data for demo
      setDestinations([
        {
          id: 1,
          name: 'Bangkok',
          country: 'Thailand',
          description: 'Vibrant street life and cultural landmarks',
          averageRating: 4.5,
          budgetRange: '$50-150/day'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadAllDestinations = async () => {
    setLoading(true);
    try {
      const response = await searchAPI.getAllDestinations();
      setDestinations(response.data);
    } catch (error) {
      console.error('Error loading destinations:', error);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationClick = (destinationId) => {
    navigate(`/destinations/${destinationId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ 
      py: 4,
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        color: '#222222', 
        fontWeight: 600,
        mb: 3
      }}>
        {searchQuery ? `Search Results for "${searchQuery}"` : 'All Destinations'}
      </Typography>

      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        '@media (max-width: 768px)': {
          flexDirection: 'column',
          alignItems: 'stretch'
        }
      }}>
        <TextField
          label="Search destinations"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            }
          }}
          sx={{
            flex: 1,
            minWidth: '200px',
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: '12px',
              transition: 'all 0.2s ease',
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
                  borderWidth: '2px',
                  boxShadow: '0 0 0 3px rgba(255, 90, 95, 0.1)'
                }
              },
              '& input': {
                color: '#222222',
                fontSize: '14px',
                padding: '8px 12px'
              }
            },
            '& .MuiInputLabel-root': {
              color: '#717171',
              fontSize: '14px',
              '&.Mui-focused': {
                color: '#ff5a5f',
                fontWeight: 500
              }
            }
          }}
        />
        <FormControl size="small" sx={{ 
          minWidth: 140,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            borderRadius: '12px',
            transition: 'all 0.2s ease',
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
                borderWidth: '2px',
                boxShadow: '0 0 0 3px rgba(255, 90, 95, 0.1)'
              }
            },
            '& .MuiSelect-select': {
              color: '#222222',
              fontSize: '14px',
              padding: '8px 12px'
            }
          },
          '& .MuiInputLabel-root': {
            color: '#717171',
            fontSize: '14px',
            '&.Mui-focused': {
              color: '#ff5a5f',
              fontWeight: 500
            }
          }
        }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  '& .MuiMenuItem-root': {
                    fontSize: '14px',
                    padding: '8px 16px',
                    color: '#222222',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 90, 95, 0.08)',
                      color: '#ff5a5f'
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 90, 95, 0.12)',
                      color: '#ff5a5f',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 90, 95, 0.16)'
                      }
                    }
                  }
                }
              }
            }}
          >
            <MenuItem value="popularity">Most Popular</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
            <MenuItem value="name">Alphabetical</MenuItem>
            <MenuItem value="budget-low">Budget: Low to High</MenuItem>
            <MenuItem value="budget-high">Budget: High to Low</MenuItem>
            <MenuItem value="newest">Recently Added</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ 
          minWidth: 120,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            borderRadius: '12px',
            transition: 'all 0.2s ease',
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
                borderWidth: '2px',
                boxShadow: '0 0 0 3px rgba(255, 90, 95, 0.1)'
              }
            },
            '& .MuiSelect-select': {
              color: '#222222',
              fontSize: '14px',
              padding: '8px 12px'
            }
          },
          '& .MuiInputLabel-root': {
            color: '#717171',
            fontSize: '14px',
            '&.Mui-focused': {
              color: '#ff5a5f',
              fontWeight: 500
            }
          }
        }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filterBy}
            label="Category"
            onChange={(e) => setFilterBy(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  '& .MuiMenuItem-root': {
                    fontSize: '14px',
                    padding: '8px 16px',
                    color: '#222222',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 90, 95, 0.08)',
                      color: '#ff5a5f'
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 90, 95, 0.12)',
                      color: '#ff5a5f',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 90, 95, 0.16)'
                      }
                    }
                  }
                }
              }
            }}
          >
            <MenuItem value="all">All Destinations</MenuItem>
            <MenuItem value="beach">Beach & Islands</MenuItem>
            <MenuItem value="city">City Breaks</MenuItem>
            <MenuItem value="adventure">Adventure</MenuItem>
            <MenuItem value="cultural">Cultural Sites</MenuItem>
            <MenuItem value="nature">Nature & Wildlife</MenuItem>
            <MenuItem value="luxury">Luxury Resorts</MenuItem>
            <MenuItem value="backpacker">Backpacker Friendly</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ 
          minWidth: 130,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            borderRadius: '12px',
            transition: 'all 0.2s ease',
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
                borderWidth: '2px',
                boxShadow: '0 0 0 3px rgba(255, 90, 95, 0.1)'
              }
            },
            '& .MuiSelect-select': {
              color: '#222222',
              fontSize: '14px',
              padding: '8px 12px'
            }
          },
          '& .MuiInputLabel-root': {
            color: '#717171',
            fontSize: '14px',
            '&.Mui-focused': {
              color: '#ff5a5f',
              fontWeight: 500
            }
          }
        }}>
          <InputLabel>Budget Range</InputLabel>
          <Select
            value={budgetFilter}
            label="Budget Range"
            onChange={(e) => setBudgetFilter(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  '& .MuiMenuItem-root': {
                    fontSize: '14px',
                    padding: '8px 16px',
                    color: '#222222',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 90, 95, 0.08)',
                      color: '#ff5a5f'
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 90, 95, 0.12)',
                      color: '#ff5a5f',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 90, 95, 0.16)'
                      }
                    }
                  }
                }
              }
            }}
          >
            <MenuItem value="all">All Budgets</MenuItem>
            <MenuItem value="budget">Budget ($25-50/day)</MenuItem>
            <MenuItem value="mid-range">Mid-range ($50-100/day)</MenuItem>
            <MenuItem value="luxury">Luxury ($100-200/day)</MenuItem>
            <MenuItem value="premium">Premium ($200+/day)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {destinations.length === 0 ? (
        <Typography variant="body1" sx={{ 
          color: '#717171',
          textAlign: 'center',
          py: 4
        }}>
          No destinations found. Try a different search term.
        </Typography>
      ) : (
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
          {destinations.map((destination) => (
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
                    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)',
                    border: '1px solid #ff5a5f'
                  },
                  height: '100%',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
                }}
                onClick={() => handleDestinationClick(destination.id)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={destination.imageUrl || getDestinationImage(destination.name)}
                  alt={destination.name}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {destination.name}
                    {destination.country && `, ${destination.country}`}
                  </Typography>
                  
                  {destination.description && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {destination.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {destination.averageRating && (
                      <>
                        <Star sx={{ color: '#ff5a5f', fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          {destination.averageRating}
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
                        backgroundColor: '#f7f7f7',
                        color: '#222222',
                        border: 'none',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#ff5a5f',
                          color: 'white'
                        }
                      }}
                    />
                  )}

                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ 
                      mt: 2,
                      borderColor: '#ff5a5f',
                      color: '#ff5a5f',
                      borderRadius: '8px',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#ff5a5f',
                        backgroundColor: '#ff5a5f',
                        color: 'white',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(255, 90, 95, 0.3)'
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDestinationClick(destination.id);
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default SearchResults;