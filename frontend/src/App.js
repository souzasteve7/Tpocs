import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import DestinationDetails from './pages/DestinationDetails';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import TravelSuggestions from './pages/TravelSuggestions';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5a5f',
      light: '#ff8a80',
      dark: '#d32f2f',
    },
    secondary: {
      main: '#222222',
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Circular", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CurrencyProvider>
          <Router>
            <div className="App">
              <Navbar />
            <main style={{ minHeight: 'calc(100vh - 120px)', paddingTop: '80px' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/destinations/:id" element={<DestinationDetails />} />
                <Route path="/suggestions" element={<TravelSuggestions />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/bookings" element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  </ThemeProvider>
);
}

export default App;
