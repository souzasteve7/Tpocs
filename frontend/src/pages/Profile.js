import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Welcome, {user?.firstName || 'User'}!</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Email: {user?.email}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 3 }} color="text.secondary">
          Profile management features will be available here.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Profile;