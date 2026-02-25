import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Select,
  FormControl,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Flight,
  AccountCircle,
  Home,
  Search,
  TravelExplore,
  BookOnline,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { selectedCurrency, currencyOptions, updateCurrency } = useCurrency();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Search', icon: <Search />, path: '/search' },
    { text: 'Suggestions', icon: <TravelExplore />, path: '/suggestions' },
  ];

  const authMenuItems = [
    { text: 'My Bookings', icon: <BookOnline />, path: '/bookings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: '#ff5a5f', fontWeight: 600 }}>
        <Flight sx={{ mr: 1 }} />
        Roaamy
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              cursor: 'pointer',
              backgroundColor: location.pathname === item.path ? 'action.selected' : 'transparent',
            }}
          >
            <Box sx={{ mr: 1 }}>{item.icon}</Box>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {isAuthenticated && authMenuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              cursor: 'pointer',
              backgroundColor: location.pathname === item.path ? 'action.selected' : 'transparent',
            }}
          >
            <Box sx={{ mr: 1 }}>{item.icon}</Box>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        
        {/* Currency Selector for Mobile */}
        <ListItem>
          <Box sx={{ width: '100%' }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Currency
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selectedCurrency}
                onChange={(e) => updateCurrency(e.target.value)}
              >
                {currencyOptions.map((currency) => (
                  <MenuItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 0 rgba(0,0,0,0.1)',
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: '#ff5a5f' }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              color: '#ff5a5f',
              fontWeight: 600,
              fontSize: '24px'
            }}
            onClick={() => navigate('/')}
          >
            <Flight sx={{ mr: 1, fontSize: 28 }} />
            Roaamy
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Currency Selector */}
          <FormControl sx={{ mr: 2, minWidth: 80 }}>
            <Select
              value={selectedCurrency}
              onChange={(e) => updateCurrency(e.target.value)}
              sx={{
                color: '#717171',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#dddddd',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ff5a5f',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ff5a5f',
                },
                '& .MuiSvgIcon-root': {
                  color: '#717171',
                },
              }}
              size="small"
            >
              {currencyOptions.map((currency) => (
                <MenuItem key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    mx: 1,
                    color: '#222222',
                    fontWeight: 500,
                    textTransform: 'none',
                    borderRadius: '24px',
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#f7f7f7',
                    },
                    backgroundColor: location.pathname === item.path ? '#f7f7f7' : 'transparent',
                  }}
                >
                  {item.text}
                </Button>
              ))}
              {isAuthenticated && authMenuItems.map((item) => (
                <Button
                  key={item.text}
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    mx: 1,
                    color: '#222222',
                    fontWeight: 500,
                    textTransform: 'none',
                    borderRadius: '24px',
                    px: 2,
                    '&:hover': {
                      backgroundColor: '#f7f7f7',
                    },
                    backgroundColor: location.pathname === item.path ? '#f7f7f7' : 'transparent',
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {isAuthenticated ? (
            <Box>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
              >
                <Avatar sx={{ 
                  width: 32, 
                  height: 32,
                  backgroundColor: '#ff5a5f',
                  color: 'white'
                }}>
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                  <AccountCircle sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box>
              <Button 
                onClick={() => navigate('/login')}
                sx={{
                  color: '#222222',
                  fontWeight: 500,
                  textTransform: 'none',
                  mr: 1
                }}
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                sx={{
                  backgroundColor: '#ff5a5f',
                  color: 'white',
                  fontWeight: 500,
                  textTransform: 'none',
                  borderRadius: '24px',
                  px: 3,
                  '&:hover': {
                    backgroundColor: '#e50914',
                  }
                }}
              >
                Sign up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;