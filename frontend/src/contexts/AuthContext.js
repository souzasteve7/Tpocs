import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials);
      const response = await authAPI.login(credentials);
      console.log('Login response:', response.data);
      
      // Backend returns accessToken, not token
      const { accessToken, user: userData } = response.data;
      
      if (accessToken && userData) {
        // Store token and enhanced user data
        localStorage.setItem('authToken', accessToken);
        
        // Create enhanced user object with name field for compatibility
        const enhancedUser = {
          ...userData,
          name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          phone: userData.phoneNumber
        };
        
        localStorage.setItem('user', JSON.stringify(enhancedUser));
        setUser(enhancedUser);
        
        console.log('Login successful, user data stored:', enhancedUser);
        return { success: true };
      } else {
        console.error('Login response missing token or user data');
        return { success: false, error: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration with:', userData);
      const response = await authAPI.register(userData);
      console.log('Registration response:', response.data);
      
      return { 
        success: true, 
        message: response.data?.message || 'Registration successful. Please check your email to verify your account.' 
      };
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      return { 
        success: false, 
        error: error.response?.data?.message || error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    try {
      // Attempt to call backend logout endpoint
      authAPI.logout().catch((error) => {
        // Log the error but don't prevent logout
        console.error('Backend logout error:', error);
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and state regardless of backend response
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      
      // Optional: redirect to login/home page
      console.log('User logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = response.data;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};