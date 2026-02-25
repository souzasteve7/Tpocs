import React from 'react';
import { Box, Typography, Container, Link, Grid } from '@mui/material';
import { Flight } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 3,
        mt: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Flight sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Roamy
              </Typography>
            </Box>
            <Typography variant="body2" color="inherit">
              Your trusted travel companion for discovering amazing destinations 
              and booking unforgettable experiences.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
                Home
              </Link>
              <Link href="/search" color="inherit" display="block" sx={{ mb: 1 }}>
                Search Destinations
              </Link>
              <Link href="/suggestions" color="inherit" display="block" sx={{ mb: 1 }}>
                Travel Suggestions
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Box>
              <Link href="/help" color="inherit" display="block" sx={{ mb: 1 }}>
                Help Center
              </Link>
              <Link href="/contact" color="inherit" display="block" sx={{ mb: 1 }}>
                Contact Us
              </Link>
              <Link href="/terms" color="inherit" display="block" sx={{ mb: 1 }}>
                Terms of Service
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Box
          sx={{
            borderTop: 1,
            borderColor: 'rgba(255,255,255,0.12)',
            mt: 3,
            pt: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="inherit">
            © {new Date().getFullYear()} Roamy Travel. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;