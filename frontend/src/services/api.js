import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Search API  
export const searchAPI = {
  searchPlaces: (searchData) => api.post('/search/places', searchData),
  getAllDestinations: () => api.get('/search/destinations'),
  searchDestinations: (query) => api.get('/search/destinations/search', { params: { query } }),
  getHotelsByDestination: (destinationId, params = {}) => 
    api.get(`/search/destinations/${destinationId}/hotels`, { params }),
  getAttractionsByDestination: (destinationId, interests = []) => 
    api.get(`/search/destinations/${destinationId}/attractions`, { 
      params: { interests: interests.join(',') } 
    }),
  searchTransport: (params) => api.get('/search/transport', { params }),
  getRecommendations: (params) => api.get('/search/recommendations', { params }),
  getTrendingDestinations: () => api.get('/search/trending'),
};

// Travel Suggestions API
export const suggestionsAPI = {
  getComprehensiveSuggestions: (requestData) => 
    api.post('/suggestions/comprehensive', requestData),
  getQuickSuggestions: (params) => api.get('/suggestions/quick', { params }),
  getDestinationSuggestions: (destinationName, params = {}) => 
    api.get(`/suggestions/destination/${destinationName}`, { params }),
  generateItinerary: (requestData) => api.post('/suggestions/itinerary', requestData),
};

// Booking API
export const bookingAPI = {
  bookHotel: (bookingData) => api.post('/bookings/hotel', bookingData),
  bookTransport: (bookingData) => api.post('/bookings/transport', bookingData),
  getAllBookings: () => api.get('/bookings'),
  getBookingById: (bookingId) => api.get(`/bookings/${bookingId}`),
  getBookingByReference: (reference) => api.get(`/bookings/reference/${reference}`),
  cancelBooking: (bookingId, reason) => 
    api.post(`/bookings/${bookingId}/cancel`, null, { params: { reason } }),
  getUpcomingBookings: () => api.get('/bookings/upcoming'),
  getPastBookings: () => api.get('/bookings/past'),
  getBookingStats: () => api.get('/bookings/stats'),
};

// Test API
export const testAPI = {
  health: () => api.get('/test/health'),
  hello: () => api.get('/test/hello'),
};

export default api;