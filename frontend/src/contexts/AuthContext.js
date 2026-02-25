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
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle new backend error format
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          // Handle different error types
          switch (errorData.error) {
            case 'INVALID_CREDENTIALS':
              errorMessage = 'Invalid email or password. Please check your credentials.';
              break;
            case 'USER_NOT_FOUND':
              errorMessage = 'No account found with this email. Please register first.';
              break;
            case 'ACCOUNT_NOT_VERIFIED':
              errorMessage = 'Please verify your email address before logging in.';
              break;
            case 'ACCOUNT_DISABLED':
              errorMessage = 'Your account has been disabled. Contact support for help.';
              break;
            default:
              errorMessage = errorData.error;
          }
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.response?.status === 404) {
        errorMessage = 'No account found with this email address.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      return { 
        success: false, 
        error: errorMessage
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
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle new backend error format
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          // Handle different error types
          switch (errorData.error) {
            case 'EMAIL_ALREADY_EXISTS':
              errorMessage = 'An account with this email already exists. Please try logging in instead.';
              break;
            case 'VALIDATION_ERROR':
              if (errorData.fieldErrors) {
                const fieldErrors = Object.entries(errorData.fieldErrors)
                  .map(([field, message]) => `${field}: ${message}`)
                  .join(', ');
                errorMessage = `Please fix the following: ${fieldErrors}`;
              } else {
                errorMessage = 'Please check your input and try again.';
              }
              break;
            case 'INVALID_ARGUMENT':
              errorMessage = 'Invalid registration data provided.';
              break;
            default:
              errorMessage = errorData.error;
          }
        }
      } else if (error.response?.status === 409) {
        errorMessage = 'An account with this email already exists. Please try logging in instead.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Please check your input and try again.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      return { 
        success: false, 
        error: errorMessage
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