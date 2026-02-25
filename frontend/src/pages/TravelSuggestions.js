import React, { useEffect, useState } from 'react';
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
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputAdornment,
  Stepper,
  Step,
  StepLabel
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
  LocationOn,
  Person,
  Email,
  Phone,
  Notes,
  Payment,
  CheckCircle,
  Close
} from '@mui/icons-material';
import { suggestionsAPI, bookingAPI, searchAPI } from '../services/api';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { BookingError } from '../components/ErrorDisplay';
import ErrorDisplay from '../components/ErrorDisplay';

const TravelSuggestions = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { selectedCurrency, convertCurrency, formatCurrency } = useCurrency();

  const defaultStartDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const defaultEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    budgetLevel: '',
    travelStartDate: defaultStartDate,
    travelEndDate: defaultEndDate,
    interests: [],
  });
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [transportOptions, setTransportOptions] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    numberOfGuests: 1,
    numberOfAdults: 1,
    numberOfChildren: 0,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    specialRequests: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [successTitle, setSuccessTitle] = useState('Success');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [resolvedDestinationCoordinates, setResolvedDestinationCoordinates] = useState(null);
  const [destinationCatalog, setDestinationCatalog] = useState([]);

  useEffect(() => {
    const prefetchedDestination = location.state?.destination;
    if (typeof prefetchedDestination === 'string' && prefetchedDestination.trim()) {
      setFormData((prev) => ({
        ...prev,
        toLocation: prefetchedDestination.trim()
      }));
    }
  }, [location.state]);

  useEffect(() => {
    const resolveDestinationCoordinates = async () => {
      const destinationName = suggestions?.destinationOverview?.name || formData.toLocation;
      if (!destinationName) {
        setResolvedDestinationCoordinates(null);
        return;
      }

      try {
        const response = await searchAPI.getAllDestinations();
        const destinations = response.data || [];

        const normalizedTarget = destinationName.toString().trim().toLowerCase();
        const matchedDestination = destinations.find((item) => {
          const candidates = [item?.name, item?.city, item?.country]
            .filter(Boolean)
            .map((value) => value.toString().trim().toLowerCase());
          return candidates.some((candidate) =>
            candidate === normalizedTarget ||
            candidate.includes(normalizedTarget) ||
            normalizedTarget.includes(candidate)
          );
        });

        const latitude = Number(matchedDestination?.latitude);
        const longitude = Number(matchedDestination?.longitude);

        if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
          setResolvedDestinationCoordinates({ latitude, longitude });
        } else {
          setResolvedDestinationCoordinates(null);
        }
      } catch (coordinateError) {
        console.warn('Unable to resolve destination coordinates:', coordinateError);
        setResolvedDestinationCoordinates(null);
      }
    };

    if (suggestions?.destinationOverview || formData.toLocation) {
      resolveDestinationCoordinates();
    } else {
      setResolvedDestinationCoordinates(null);
    }
  }, [suggestions?.destinationOverview, formData.toLocation]);

  useEffect(() => {
    const loadDestinationCatalog = async () => {
      try {
        const response = await searchAPI.getAllDestinations();
        setDestinationCatalog(response.data || []);
      } catch (catalogError) {
        console.warn('Unable to load destination catalog:', catalogError);
        setDestinationCatalog([]);
      }
    };

    loadDestinationCatalog();
  }, []);

  const calculateTripDays = () => {
    if (!formData.travelStartDate || !formData.travelEndDate) return 1;

    const startDate = new Date(formData.travelStartDate);
    const endDate = new Date(formData.travelEndDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    return days > 0 ? days : 1;
  };

  // Handler to update booking details
  const updateBookingDetail = (field, value) => {
    setBookingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  // Hotel booking handler - show detailed modal first
  const handleHotelBooking = (hotel) => {
    if (!isAuthenticated) {
      setError('Please login to book hotels');
      return;
    }

    setSelectedHotel(hotel);
    setSelectedTransport(null);
    // Pre-fill contact info if user is logged in
    if (user) {
      setBookingDetails(prev => ({
        ...prev,
        contactName: `${user.firstName} ${user.lastName}` || user.name || '',
        contactEmail: user.email || '',
        contactPhone: user.phoneNumber || ''
      }));
    }
    setShowBookingModal(true);
  };

  // Calculate total nights and cost
  const calculateBookingCost = () => {
    if (!selectedHotel || !bookingDetails.checkInDate || !bookingDetails.checkOutDate) return 0;
    
    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights * selectedHotel.pricePerNight : 0;
  };

  const calculateNights = () => {
    if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate) return 0;
    
    const checkIn = new Date(bookingDetails.checkInDate);
    const checkOut = new Date(bookingDetails.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights : 0;
  };

  const getBookingCurrency = () => selectedCurrency || 'INR';

  const getConvertedAmountForBooking = (amountInInr) => {
    if (!amountInInr || Number.isNaN(amountInInr)) return 0;

    const bookingCurrency = getBookingCurrency();
    if (bookingCurrency === 'INR') return amountInInr;

    return convertCurrency(amountInInr, 'INR', bookingCurrency) || 0;
  };

  const normalizeTransportType = (type) => (type || '').toString().trim().toLowerCase().replace(/_/g, '-');

  const getTransportDisplayName = (type) => {
    const normalizedType = normalizeTransportType(type);

    if (normalizedType === 'flight') return 'Flight';
    if (normalizedType === 'train') return 'Train';
    if (normalizedType === 'taxi') return 'Taxi';
    if (normalizedType === 'bus' || normalizedType === 'local-transport' || normalizedType === 'local transport') return 'Local Transport';

    return type || 'Transport';
  };

  const mapTransportTypeForBooking = (type) => {
    const normalizedType = normalizeTransportType(type);

    if (normalizedType === 'flight') return 'FLIGHT';
    if (normalizedType === 'train') return 'TRAIN';
    if (normalizedType === 'taxi') return 'TAXI';
    if (normalizedType === 'car-rental' || normalizedType === 'car rental') return 'CAR_RENTAL';
    if (normalizedType === 'ferry') return 'FERRY';
    if (normalizedType === 'bus' || normalizedType === 'local-transport' || normalizedType === 'local transport') return 'BUS';

    return 'BUS';
  };

  const getTransportImage = (type) => {
    const normalizedType = normalizeTransportType(type);

    // Use direct and verified Unsplash CDN image URLs (not page URLs)
    if (normalizedType === 'flight') return 'https://images.unsplash.com/photo-1587019158091-1a103c5dd17f?auto=format&fit=crop&w=900&q=80';
    if (normalizedType === 'train') return 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=900&q=80';
    if (normalizedType === 'taxi') return 'https://images.unsplash.com/photo-1628947733273-cdae71c9bfd3?auto=format&fit=crop&w=900&q=80';
    if (normalizedType === 'bus' || normalizedType === 'local-transport' || normalizedType === 'local transport') return 'https://images.unsplash.com/photo-1547886596-61770d06925b?auto=format&fit=crop&w=900&q=80';

    // Default transport image
    return 'https://images.unsplash.com/photo-1628947733273-cdae71c9bfd3?auto=format&fit=crop&w=900&q=80';
  };

  const getTransportEmoji = (type) => {
    const normalizedType = normalizeTransportType(type);

    if (normalizedType === 'flight') return '✈️';
    if (normalizedType === 'train') return '🚆';
    if (normalizedType === 'taxi') return '🚕';
    if (normalizedType === 'bus' || normalizedType === 'local-transport' || normalizedType === 'local transport') return '🚌';

    return '🚗';
  };

  const getHotelFallbackImage = (category) => {
    const normalizedCategory = (category || '').toString().trim().toLowerCase();

    if (normalizedCategory === 'luxury') return 'https://images.unsplash.com/photo-1578774443271-39db861dd6d6?auto=format&fit=crop&w=900&q=80';
    if (normalizedCategory === 'mid-range' || normalizedCategory === 'mid range') return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80';

    return 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80';
  };

  const getHotelImage = (hotel) => {
    if (!hotel) return getHotelFallbackImage();

    const candidateImage = hotel.imageUrls?.[0] || hotel.imageUrl || hotel.thumbnailUrl || '';
    if (typeof candidateImage === 'string' && candidateImage.trim()) {
      return candidateImage.trim();
    }

    return getHotelFallbackImage(hotel.category);
  };

  const getAttractionFallbackImage = () =>
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80';

  const getAttractionImage = (attraction) => {
    if (!attraction) return getAttractionFallbackImage();

    const candidateImage = attraction.imageUrls?.[0] || attraction.imageUrl || attraction.thumbnailUrl || '';
    if (typeof candidateImage === 'string' && candidateImage.trim()) {
      return candidateImage.trim();
    }

    return getAttractionFallbackImage();
  };

  const getDestinationFallbackImage = () =>
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80';

  const getDestinationImage = (overview) => {
    const candidateImage = overview?.imageUrl || overview?.thumbnailUrl || '';
    if (typeof candidateImage === 'string' && candidateImage.trim()) {
      return candidateImage.trim();
    }

    return getDestinationFallbackImage();
  };

  const toValidNumber = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
  };

  const getDestinationCoordinates = (overview, fallbackCoordinates = null) => {
    if (!overview && !fallbackCoordinates) return null;

    const safeOverview = overview || {};

    const latitude =
      toValidNumber(safeOverview.latitude) ??
      toValidNumber(safeOverview.lat) ??
      toValidNumber(safeOverview.destinationLatitude) ??
      toValidNumber(safeOverview?.quickFacts?.latitude) ??
      toValidNumber(fallbackCoordinates?.latitude);

    const longitude =
      toValidNumber(safeOverview.longitude) ??
      toValidNumber(safeOverview.lng) ??
      toValidNumber(safeOverview.lon) ??
      toValidNumber(safeOverview.destinationLongitude) ??
      toValidNumber(safeOverview?.quickFacts?.longitude) ??
      toValidNumber(fallbackCoordinates?.longitude);

    if (latitude === null || longitude === null) return null;
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;

    return { latitude, longitude };
  };

  const getOpenStreetMapEmbedUrl = (overview, fallbackCoordinates = null) => {
    const coordinates = getDestinationCoordinates(overview, fallbackCoordinates);
    if (!coordinates) return '';

    const { latitude, longitude } = coordinates;
    const delta = 0.08;
    const left = (longitude - delta).toFixed(6);
    const right = (longitude + delta).toFixed(6);
    const top = (latitude + delta).toFixed(6);
    const bottom = (latitude - delta).toFixed(6);

    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  };

  const isImageUrl = (value) => {
    if (typeof value !== 'string') return false;
    const url = value.trim().toLowerCase();
    if (!url) return false;
    return /(\.png|\.jpg|\.jpeg|\.webp|\.gif)(\?|$)/.test(url) || url.includes('images.unsplash.com');
  };

  const getMapRenderData = (overview, fallbackCoordinates = null) => {
    const openStreetMapEmbedUrl = getOpenStreetMapEmbedUrl(overview, fallbackCoordinates);
    if (openStreetMapEmbedUrl) {
      return { type: 'iframe', url: openStreetMapEmbedUrl };
    }

    const rawMapUrl = overview?.mapUrl;
    if (typeof rawMapUrl === 'string' && rawMapUrl.trim()) {
      const mapUrl = rawMapUrl.trim();
      if (isImageUrl(mapUrl)) {
        return { type: 'none', url: '' };
      }
      return { type: 'iframe', url: mapUrl };
    }

    return { type: 'none', url: '' };
  };

  const getEstimatedTotalCost = (suggestionData) => {
    const recommended = toValidNumber(suggestionData?.budgetBreakdown?.totalBudget?.recommendedTotal);
    if (recommended !== null && recommended >= 0) {
      return recommended;
    }

    const summary = suggestionData?.budgetBreakdown?.totalBudget;
    if (summary) {
      const summaryFallback =
        toValidNumber(summary.midRangeTotal) ??
        toValidNumber(summary.budgetTotal) ??
        toValidNumber(summary.luxuryTotal);

      if (summaryFallback !== null && summaryFallback >= 0) {
        return summaryFallback;
      }
    }

    const budget = suggestionData?.budgetBreakdown;
    if (budget) {
      const keys = ['accommodation', 'transport', 'activities', 'meals', 'shopping', 'miscellaneous'];
      const sum = keys.reduce((total, key) => {
        const value = toValidNumber(budget[key]?.recommended);
        return total + (value !== null ? value : 0);
      }, 0);

      if (sum > 0) {
        return sum;
      }
    }

    return null;
  };

  const normalizeLocationText = (value) =>
    (value || '')
      .toString()
      .trim()
      .toLowerCase();

  const findLocationRecord = (locationText) => {
    const normalizedLocation = normalizeLocationText(locationText);
    if (!normalizedLocation || destinationCatalog.length === 0) return null;

    return destinationCatalog.find((item) => {
      const candidates = [item?.name, item?.city, item?.country]
        .filter(Boolean)
        .map((candidate) => normalizeLocationText(candidate));

      return candidates.some(
        (candidate) =>
          candidate === normalizedLocation ||
          candidate.includes(normalizedLocation) ||
          normalizedLocation.includes(candidate)
      );
    });
  };

  const isInternationalRoute = (fromLocation, toLocation) => {
    const fromRecord = findLocationRecord(fromLocation);
    const toRecord = findLocationRecord(toLocation);

    const fromCountry = normalizeLocationText(fromRecord?.country);
    const toCountry = normalizeLocationText(toRecord?.country);

    if (fromCountry && toCountry) {
      return fromCountry !== toCountry;
    }

    const normalizedFrom = normalizeLocationText(fromLocation);
    const normalizedTo = normalizeLocationText(toLocation);

    if (!normalizedFrom || !normalizedTo) return false;

    const indiaHints = ['india', 'goa', 'mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 'kerala'];
    const fromLooksIndian = indiaHints.some((hint) => normalizedFrom.includes(hint));
    const toLooksIndian = indiaHints.some((hint) => normalizedTo.includes(hint));

    return fromLooksIndian !== toLooksIndian;
  };

  const getDefaultTransportDuration = (type, isInternational) => {
    const normalizedType = normalizeTransportType(type);

    if (isInternational) return '9h 30m';
    if (normalizedType === 'flight') return '2h 15m';
    if (normalizedType === 'train') return '8h 30m';
    if (normalizedType === 'bus' || normalizedType === 'local-transport' || normalizedType === 'local transport') return '10h 00m';
    if (normalizedType === 'taxi') return '6h 00m';

    return 'N/A';
  };

  const getDefaultTransportPrice = (type, isInternational) => {
    const normalizedType = normalizeTransportType(type);

    if (isInternational) return 42000;
    if (normalizedType === 'flight') return 6500;
    if (normalizedType === 'train') return 2200;
    if (normalizedType === 'bus' || normalizedType === 'local-transport' || normalizedType === 'local transport') return 1500;
    if (normalizedType === 'taxi') return 4500;

    return 2500;
  };

  const normalizeTransportOption = (option, isInternational = false) => {
    const rawType = option.type || 'transport';
    const normalizedType = normalizeTransportType(rawType);
    const finalType = isInternational ? 'flight' : normalizedType;

    const rawPrice = Number(option.price || option.estimatedCost || 0);
    const hasValidPrice = Number.isFinite(rawPrice) && rawPrice > 0;

    const normalizedOption = {
    id: option.id || `${finalType}-${option.provider || 'provider'}`,
    type: finalType,
    displayType: getTransportDisplayName(finalType),
    provider: option.provider || (isInternational ? 'International Airline' : 'Provider'),
    departure: option.departureTime || option.departure || option.departureDate || 'N/A',
    arrival: option.arrivalTime || option.arrival || option.arrivalDate || 'N/A',
    departureLocation: option.departureLocation || formData.fromLocation || 'Current Location',
    arrivalLocation: option.arrivalLocation || formData.toLocation,
    duration: option.duration || getDefaultTransportDuration(finalType, isInternational),
    amenities: option.amenities || [],
    price: hasValidPrice ? rawPrice : getDefaultTransportPrice(finalType, isInternational),
    currency: option.currency || 'INR'
  };

    return normalizedOption;
  };

  const getProcessedTransportOptions = (options, isInternational = false) => {
    const normalized = (options || []).map((option) => normalizeTransportOption(option, isInternational));

    const relevant = isInternational
      ? normalized.filter((option) => normalizeTransportType(option.type) === 'flight')
      : normalized;

    if (relevant.length > 0) {
      return relevant;
    }

    if (isInternational) {
      return [
        normalizeTransportOption(
          {
            id: `intl-flight-${normalizeLocationText(formData.toLocation) || 'destination'}`,
            type: 'flight',
            provider: 'International Airline',
            departureTime: '06:30',
            arrivalTime: '16:00',
            departureLocation: formData.fromLocation || 'Origin',
            arrivalLocation: formData.toLocation || 'Destination',
            duration: '9h 30m',
            price: 42000,
            currency: 'INR',
            amenities: ['Cabin Baggage', 'Checked Baggage', 'In-flight Meal']
          },
          true
        )
      ];
    }

    return [];
  };

  // Execute hotel booking with complete details
  const executeHotelBooking = async () => {
    if (!selectedHotel || !user) return;
    
    try {
      setBookingLoading(true);
      
      const bookingData = {
        type: 'hotel',
        hotelId: selectedHotel.id, // Include hotel ID for proper backend lookup
        hotelName: selectedHotel.name,
        hotelCategory: selectedHotel.category,
        hotelDescription: selectedHotel.description,
        hotelRating: selectedHotel.rating,
        hotelImageUrl: selectedHotel.imageUrls?.[0] || '',
        checkInDate: bookingDetails.checkInDate,
        checkOutDate: bookingDetails.checkOutDate,
        numberOfGuests: bookingDetails.numberOfGuests,
        numberOfAdults: bookingDetails.numberOfAdults,
        numberOfChildren: bookingDetails.numberOfChildren,
        contactName: bookingDetails.contactName,
        contactEmail: bookingDetails.contactEmail,
        contactPhone: bookingDetails.contactPhone,
        specialRequests: bookingDetails.specialRequests,
        totalAmount: getConvertedAmountForBooking(calculateBookingCost()),
        currency: getBookingCurrency(),
        nights: calculateNights()
      };

      console.log('Booking hotel with data:', bookingData);
      
      // Check if token exists
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }
      
      const response = await bookingAPI.bookHotel(bookingData);
      
      setSuccessTitle('Booking Successful');
      setSuccessMessage(`Hotel "${selectedHotel.name}" booked successfully! Booking reference: ${response.data.bookingReference}`);
      setShowBookingModal(false);
      setSelectedHotel(null);
      
      // Reset booking details
      setBookingDetails({
        checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        numberOfGuests: 1,
        numberOfAdults: 1,
        numberOfChildren: 0,
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        specialRequests: ''
      });
      
    } catch (error) {
      console.error('Hotel booking error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Session expired. Please log in again.');
        // Could trigger re-authentication here
      } else {
        setError(
          error.response?.data?.message || 
          'Failed to book hotel. Please try again.'
        );
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // Transport booking handler - show modal first for confirmation 
  const handleTransportBooking = (transport) => {
    if (!isAuthenticated) {
      setError('Please login to book transport');
      return;
    }

    setSelectedTransport(transport);
    setSelectedHotel(null);
    if (user) {
      setBookingDetails(prev => ({
        ...prev,
        contactName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || '',
        contactEmail: user.email || '',
        contactPhone: user.phoneNumber || ''
      }));
    }
    setShowBookingModal(true);
  };

  // Actual transport booking execution after user confirmation
  const executeTransportBooking = async () => {
    if (!selectedTransport) return;

    if (!bookingDetails.contactName || !bookingDetails.contactEmail) {
      setError('Please provide contact name and email to continue.');
      return;
    }
    
    try {
      setBookingLoading(true);
      
      const departureDate = formData.travelStartDate
        ? new Date(formData.travelStartDate)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      
      const bookingData = {
        type: 'transport',
        transportType: mapTransportTypeForBooking(selectedTransport.type),
        departureLocation: selectedTransport.departureLocation || formData.fromLocation || 'Current Location',
        arrivalLocation: selectedTransport.arrivalLocation || formData.toLocation,
        departureDate: departureDate.toISOString(),
        transportProviderId: selectedTransport.id || selectedTransport.provider || 'TRANSPORT_PROVIDER',
        provider: selectedTransport.provider || 'Transport Provider',
        numberOfGuests: bookingDetails.numberOfGuests,
        numberOfAdults: bookingDetails.numberOfAdults,
        numberOfChildren: bookingDetails.numberOfChildren,
        contactName: bookingDetails.contactName,
        contactEmail: bookingDetails.contactEmail,
        contactPhone: bookingDetails.contactPhone,
        specialRequests: bookingDetails.specialRequests,
        totalAmount: getConvertedAmountForBooking(selectedTransport.price || selectedTransport.estimatedCost || 0),
        currency: getBookingCurrency(),
        seatType: 'economy'
      };

      console.log('Booking transport:', bookingData);
      
      const response = await bookingAPI.bookTransport(bookingData);
      
      setSuccessTitle('Booking Successful');
      setSuccessMessage(`${getTransportDisplayName(selectedTransport.type)} booked successfully! Booking reference: ${response.data.bookingReference}`);
      setShowBookingModal(false);
      setSelectedTransport(null);

      setBookingDetails({
        checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        numberOfGuests: 1,
        numberOfAdults: 1,
        numberOfChildren: 0,
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        specialRequests: ''
      });
      
    } catch (error) {
      console.error('Transport booking error:', error);
      setError(
        error.response?.data?.message || 
        'Failed to book transport. Please try again.'
      );
    } finally {
      setBookingLoading(false);
    }
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

  const tripDays = calculateTripDays();
  const mockItinerary = generateMockItinerary(tripDays);




  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.toLocation.trim()) {
      setError('Please enter a destination');
      return;
    }

    if (!formData.travelStartDate || !formData.travelEndDate) {
      setError('Please select travel start and end dates');
      return;
    }

    if (new Date(formData.travelEndDate) <= new Date(formData.travelStartDate)) {
      setError('Travel end date must be after the start date');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Prepare request data matching backend DTO structure
      const requestData = {
        toLocation: formData.toLocation,
        fromLocation: formData.fromLocation || null,
        durationDays: tripDays,
        budgetLevel: formData.budgetLevel || 'mid-range',
        interests: formData.interests,
        numberOfTravelers: 1,
        currency: selectedCurrency || 'INR'
      };
      
      console.log('Sending request:', requestData);
      
      const response = await suggestionsAPI.getComprehensiveSuggestions(requestData);
      console.log('API Response:', response.data);

      let normalizedTransport = [];
      const internationalRoute = isInternationalRoute(formData.fromLocation, formData.toLocation);
      if (formData.fromLocation?.trim() && formData.toLocation?.trim()) {
        try {
          const transportResponse = await searchAPI.searchTransport({
            from: formData.fromLocation.trim(),
            to: formData.toLocation.trim(),
            date: formData.travelStartDate
          });

          normalizedTransport = getProcessedTransportOptions(transportResponse.data || [], internationalRoute);
          console.log('Transport API response:', normalizedTransport);
        } catch (transportError) {
          console.warn('Transport API failed, using suggestions transport fallback:', transportError);
        }
      }

      if (normalizedTransport.length === 0) {
        normalizedTransport = getProcessedTransportOptions(response.data?.suggestedTransportOptions || [], internationalRoute);
      }
      
      setSuggestions(response.data);
      setTransportOptions(normalizedTransport);
      setSuccessTitle('Travel Suggestions Ready');
      setSuccessMessage('Travel suggestions loaded successfully!');
      
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to get travel suggestions. Please try again.'
      );
      
      // Clear any existing suggestions on error
      setSuggestions(null);
      setTransportOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const estimatedTotalCost = getEstimatedTotalCost(suggestions);
  const originalBudgetCurrency = suggestions?.budgetBreakdown?.totalBudget?.currency || 'INR';
  const mapRenderData = getMapRenderData(suggestions?.destinationOverview, resolvedDestinationCoordinates);
  const internationalRoute = isInternationalRoute(formData.fromLocation, formData.toLocation);
  const displayTransportOptions = transportOptions.length > 0
    ? getProcessedTransportOptions(transportOptions, internationalRoute)
    : getProcessedTransportOptions(suggestions?.suggestedTransportOptions || [], internationalRoute);

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
      
      {/* Error and Success Messages */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box sx={{ width: '100%' }}>
          <BookingError 
            error={error}
            onClose={() => setError('')}
          />
        </Box>
      </Snackbar>
      
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => {
          setSuccessMessage('');
          setSuccessTitle('Success');
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Box sx={{ width: '100%' }}>
          <ErrorDisplay 
            success={successMessage}
            title={successTitle}
            onClose={() => {
              setSuccessMessage('');
              setSuccessTitle('Success');
            }}
          />
        </Box>
      </Snackbar>
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

              {/* <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="📅 Travel Start Date"
                    name="travelStartDate"
                    type="date"
                    value={formData.travelStartDate}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="📅 Travel End Date"
                    name="travelEndDate"
                    type="date"
                    value={formData.travelEndDate}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
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
                  />
                </Grid>
              </Grid> */}

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

          {showBookingModal && selectedTransport && (
            <Dialog
              open={showBookingModal}
              onClose={() => setShowBookingModal(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: '16px',
                  maxHeight: '85vh'
                }
              }}
            >
              <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e9ecef'
              }}>
                <Typography variant="h5" fontWeight="600" sx={{ color: '#ff5a5f' }}>
                  🚌 Book Your Transport
                </Typography>
                <IconButton onClick={() => setShowBookingModal(false)} sx={{ color: '#6c757d' }}>
                  <Close />
                </IconButton>
              </DialogTitle>

              <DialogContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 140, height: 90, borderRadius: '8px', objectFit: 'cover' }}
                      image={getTransportImage(selectedTransport.type)}
                      alt={getTransportDisplayName(selectedTransport.type)}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="600">
                        {selectedTransport.displayType || getTransportDisplayName(selectedTransport.type)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        by {selectedTransport.provider || 'Transport Provider'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedTransport.departureLocation || formData.fromLocation || 'Current Location'} → {selectedTransport.arrivalLocation || formData.toLocation}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip size="small" label={`Departure: ${selectedTransport.departure || 'N/A'}`} />
                        <Chip size="small" label={`Arrival: ${selectedTransport.arrival || 'N/A'}`} />
                        <Chip size="small" label={`Duration: ${selectedTransport.duration || 'N/A'}`} />
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Adults"
                      type="number"
                      value={bookingDetails.numberOfAdults}
                      onChange={(e) => {
                        const adults = Math.max(1, parseInt(e.target.value, 10) || 1);
                        setBookingDetails(prev => ({
                          ...prev,
                          numberOfAdults: adults,
                          numberOfGuests: adults + prev.numberOfChildren
                        }));
                      }}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Children"
                      type="number"
                      value={bookingDetails.numberOfChildren}
                      onChange={(e) => {
                        const children = Math.max(0, parseInt(e.target.value, 10) || 0);
                        setBookingDetails(prev => ({
                          ...prev,
                          numberOfChildren: children,
                          numberOfGuests: prev.numberOfAdults + children
                        }));
                      }}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Total Guests"
                      value={bookingDetails.numberOfGuests}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Contact Name"
                      value={bookingDetails.contactName}
                      onChange={(e) => updateBookingDetail('contactName', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Email Address"
                      type="email"
                      value={bookingDetails.contactEmail}
                      onChange={(e) => updateBookingDetail('contactEmail', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={bookingDetails.contactPhone}
                      onChange={(e) => updateBookingDetail('contactPhone', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Special Requests (Optional)"
                      value={bookingDetails.specialRequests}
                      onChange={(e) => updateBookingDetail('specialRequests', e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{
                  backgroundColor: '#f8f9fa',
                  p: 2,
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    💰 Price Summary
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      {formatCurrency(convertCurrency(selectedTransport.price || 0))} × {bookingDetails.numberOfGuests} guest(s)
                    </Typography>
                    <Typography variant="h6" fontWeight="600" sx={{ color: '#ff5a5f' }}>
                      {formatCurrency(convertCurrency((selectedTransport.price || 0) * bookingDetails.numberOfGuests))}
                    </Typography>
                  </Box>
                </Box>
              </DialogContent>

              <DialogActions sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Button variant="outlined" onClick={() => setShowBookingModal(false)} sx={{ minWidth: 120 }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={executeTransportBooking}
                  disabled={bookingLoading || !bookingDetails.contactName || !bookingDetails.contactEmail}
                  sx={{
                    minWidth: 120,
                    backgroundColor: '#ff5a5f',
                    '&:hover': { backgroundColor: '#e04e53' }
                  }}
                >
                  {bookingLoading
                    ? 'Processing...'
                    : `Book Now - ${formatCurrency(convertCurrency((selectedTransport.price || 0) * bookingDetails.numberOfGuests))}`}
                </Button>
              </DialogActions>
            </Dialog>
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
                    image={getDestinationImage(suggestions.destinationOverview)}
                    alt={suggestions.destinationOverview?.name}
                    onError={(e) => {
                      if (e.currentTarget.src !== getDestinationFallbackImage()) {
                        e.currentTarget.src = getDestinationFallbackImage();
                      }
                    }}
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
                            label={`${tripDays} days`}
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
                            {estimatedTotalCost !== null
                              ? formatCurrency(convertCurrency(estimatedTotalCost, originalBudgetCurrency))
                              : 'Cost unavailable'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total estimated cost
                          </Typography>
                          {estimatedTotalCost !== null && selectedCurrency !== originalBudgetCurrency && (
                            <Typography variant="caption" color="text.secondary">
                              Original: {originalBudgetCurrency} {Math.round(estimatedTotalCost).toLocaleString('en-IN')}
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
                                  {formatCurrency(convertCurrency(suggestions.budgetBreakdown.accommodation?.recommended, suggestions.budgetBreakdown?.currency || 'INR'))}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={2.4}>
                              <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Transport</Typography>
                                <Typography variant="body2" fontWeight="600">
                                  {formatCurrency(convertCurrency(suggestions.budgetBreakdown.transport?.recommended, suggestions.budgetBreakdown?.currency || 'INR'))}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={2.4}>
                              <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Food</Typography>
                                <Typography variant="body2" fontWeight="600">
                                  {formatCurrency(convertCurrency(suggestions.budgetBreakdown.meals?.recommended, suggestions.budgetBreakdown?.currency || 'INR'))}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={2.4}>
                              <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Activities</Typography>
                                <Typography variant="body2" fontWeight="600">
                                  {formatCurrency(convertCurrency(suggestions.budgetBreakdown.activities?.recommended, suggestions.budgetBreakdown?.currency || 'INR'))}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={2.4}>
                              <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Misc</Typography>
                                <Typography variant="body2" fontWeight="600">
                                  {formatCurrency(convertCurrency(suggestions.budgetBreakdown.miscellaneous?.recommended, suggestions.budgetBreakdown?.currency || 'INR'))}
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
                        {mapRenderData.type === 'iframe' ? (
                          <iframe 
                            src={mapRenderData.url}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Map of ${suggestions.destinationOverview?.name}`}
                          />
                        ) : mapRenderData.type === 'image' ? (
                          <CardMedia
                            component="img"
                            image={mapRenderData.url}
                            alt={`${suggestions.destinationOverview?.name || 'Destination'} map`}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                      From {formData.fromLocation} to {formData.toLocation} • {tripDays} nights
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 3,
                      justifyContent: suggestions.suggestedAccommodations?.length === 1 ? 'center' : 'flex-start'
                    }}
                  >
                    {suggestions.suggestedAccommodations?.map((hotel, index, hotelList) => {
                      const totalCards = hotelList?.length || 0;
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
                            borderRadius: '12px', 
                            transition: 'all 0.2s ease', 
                            border: '1px solid #ebebeb',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            '&:hover': { 
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                              borderColor: '#ff5a5f'
                            },
                            overflow: 'hidden',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Box sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              height="150"
                              image={getHotelImage(hotel)}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = getHotelFallbackImage(hotel.category);
                              }}
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
                          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 1.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="600">
                                  {hotel.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <LocationOn sx={{ fontSize: 16 }} />
                                  {hotel.location}
                                </Typography>
                              </Box>
                              <Chip 
                                label={hotel.category} 
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
                              <Rating value={hotel.rating} precision={0.1} size="small" readOnly />
                              <Typography variant="caption" sx={{ ml: 1, fontWeight: 500 }}>
                                {hotel.rating} ({Math.floor(Math.random() * 500) + 100} reviews)
                              </Typography>
                            </Box>
                            {hotel.amenities && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.25 }}>
                                {hotel.amenities.slice(0, 3).map((amenity, i) => (
                                  <Chip key={i} label={amenity} size="small" variant="outlined" />
                                ))}
                                {hotel.amenities.length > 3 && (
                                  <Chip label={`+${hotel.amenities.length - 3} more`} size="small" variant="outlined" />
                                )}
                              </Box>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', mb: 0.5 }}>
                              <Box>
                                <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                                  {formatCurrency(convertCurrency(hotel.pricePerNight))}/night
                                </Typography>
                                {selectedCurrency !== 'INR' && hotel.pricePerNight && (
                                  <Typography variant="caption" color="text.secondary">
                                    (₹{hotel.pricePerNight})
                                  </Typography>
                                )}
                                <Typography variant="body2" color="text.secondary">
                                  Total: {formatCurrency(convertCurrency(hotel.pricePerNight * tripDays))}
                                </Typography>
                              </Box>
                              <Button 
                                variant="contained"
                                color="primary"
                                onClick={() => handleHotelBooking(hotel)}
                                disabled={bookingLoading}
                                sx={{
                                  backgroundColor: '#ff5a5f',
                                  '&:hover': { backgroundColor: '#e04e53' },
                                  borderRadius: '8px',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  fontSize: '0.8rem',
                                  px: 1.5,
                                  py: 0.6,
                                  '&:disabled': {
                                    backgroundColor: '#ccc',
                                    color: '#999'
                                  }
                                }}
                              >
                                {bookingLoading ? 'Booking...' : isAuthenticated ? 'Book Now' : 'Login to Book'}
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                      );
                    })}
                  </Box>
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
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 3,
                      justifyContent: displayTransportOptions?.length === 1 ? 'center' : 'flex-start'
                    }}
                  >
                    {displayTransportOptions?.map((transport, index, transportList) => {
                      const totalCards = transportList?.length || 0;
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
                            borderRadius: '12px',
                            border: '1px solid #ebebeb',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            '&:hover': { 
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                              borderColor: '#ff5a5f'
                            },
                            transition: 'all 0.2s ease',
                            overflow: 'hidden',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="150"
                            image={getTransportImage(transport.type)}
                            alt={getTransportDisplayName(transport.type)}
                          />
                          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 1.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.25 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  backgroundColor: normalizeTransportType(transport.type) === 'flight' ? '#4CAF50' : normalizeTransportType(transport.type) === 'train' ? '#2196F3' : normalizeTransportType(transport.type) === 'taxi' ? '#9C27B0' : '#FF9800',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: 2
                                }}>
                                  <Typography variant="body1" color="white" fontWeight="600">
                                    {getTransportEmoji(transport.type)}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="subtitle1" fontWeight="600">
                                    {transport.displayType || getTransportDisplayName(transport.type)}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
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
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.25 }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Departure
                                </Typography>
                                <Typography variant="body2" fontWeight="500">
                                  {transport.departure}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" color="text.secondary">
                                  Arrival
                                </Typography>
                                <Typography variant="body2" fontWeight="500">
                                  {transport.arrival}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ mb: 1.25 }}>
                              <Typography variant="caption" color="text.secondary" gutterBottom>
                                Included Amenities
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {transport.amenities?.map((amenity, i) => (
                                  <Chip key={i} label={amenity} size="small" variant="outlined" />
                                ))}
                              </Box>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                              <Box>
                                <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
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
                                disabled={bookingLoading}
                                sx={{
                                  backgroundColor: '#ff5a5f',
                                  '&:hover': { backgroundColor: '#e04e53' },
                                  borderRadius: '8px',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  fontSize: '0.8rem',
                                  px: 1.5,
                                  py: 0.6,
                                  '&:disabled': {
                                    backgroundColor: '#ccc',
                                    color: '#999'
                                  }
                                }}
                              >
                                {bookingLoading ? 'Booking...' : isAuthenticated ? `Book ${transport.type}` : 'Login to Book'}
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                      );
                    })}
                  </Box>
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
                        {suggestions.suggestedAttractions?.map((place, index) => (
                          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <Card 
                              sx={{ 
                                borderRadius: '10px', 
                                transition: 'all 0.2s ease', 
                                border: '1px solid #ebebeb',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                '&:hover': { 
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                                  borderColor: '#ff5a5f'
                                },
                                overflow: 'hidden',
                                height: '260px',
                                minWidth: '220px',
                                maxWidth: '260px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                m: 'auto'
                              }}
                            >
                              <CardMedia
                                component="img"
                                height="110"
                                image={getAttractionImage(place)}
                                alt={place.name}
                                sx={{ objectFit: 'cover', width: '100%' }}
                                onError={(e) => {
                                  if (e.currentTarget.src !== getAttractionFallbackImage()) {
                                    e.currentTarget.src = getAttractionFallbackImage();
                                  }
                                }}
                              />
                              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 1, width: '100%' }}>
                                <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 0.5 }} noWrap>
                                  {place.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.75 }} noWrap>
                                  {place.type || 'Attraction'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, flex: 1, overflow: 'hidden' }}>
                                  {place.description || 'Recommended activity based on your interests.'}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Rating value={place.rating || 0} precision={0.1} size="small" readOnly />
                                    <Typography variant="caption" sx={{ ml: 0.5 }}>
                                      {place.rating || 'N/A'}
                                    </Typography>
                                  </Box>
                                  <Typography variant="subtitle2" color="primary.main" fontWeight="bold">
                                    {formatCurrency(convertCurrency(place.price || place.estimatedCost || 0))}
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
                              image={getAttractionImage(attraction)}
                              alt={attraction.name}
                              onError={(e) => {
                                if (e.currentTarget.src !== getAttractionFallbackImage()) {
                                  e.currentTarget.src = getAttractionFallbackImage();
                                }
                              }}
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
                      Your {tripDays}-Day Itinerary for {formData.toLocation}
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
                    {mockItinerary.slice(0, tripDays).map((day, index) => (
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

          {/* Comprehensive Hotel Booking Modal */}
          {showBookingModal && selectedHotel && (
            <Dialog 
              open={showBookingModal}
              onClose={() => setShowBookingModal(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: '16px',
                  maxHeight: '85vh'
                }
              }}
            >
              <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e9ecef'
              }}>
                <Typography variant="h5" fontWeight="600" sx={{ color: '#ff5a5f' }}>
                  🏨 Book Your Stay
                </Typography>
                <IconButton 
                  onClick={() => setShowBookingModal(false)}
                  sx={{ color: '#6c757d' }}
                >
                  <Close />
                </IconButton>
              </DialogTitle>
              
              <DialogContent sx={{ p: 3 }}>
                {/* Hotel Overview */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 120, height: 80, borderRadius: '8px', objectFit: 'cover' }}
                      image={getHotelImage(selectedHotel)}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getHotelFallbackImage(selectedHotel.category);
                      }}
                      alt={selectedHotel.name}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="600">
                        {selectedHotel.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOn sx={{ fontSize: 16, color: '#6c757d' }} />
                        <Typography variant="body2" color="text.secondary">
                          {selectedHotel.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={selectedHotel.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          ({selectedHotel.rating})
                        </Typography>
                        <Chip 
                          label={selectedHotel.category}
                          size="small"
                          sx={{ ml: 1, textTransform: 'capitalize' }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {selectedHotel.description}
                  </Typography>
                  
                  {/* Amenities */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1 }}>
                      Amenities:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedHotel.amenities.map((amenity, i) => (
                        <Chip 
                          key={i}
                          label={amenity.replace('_', ' ')}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  {/* Hotel Policies */}
                  <Box sx={{ display: 'flex', gap: 3, fontSize: '0.875rem', color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                      Check-in: {selectedHotel.checkInTime}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                      Check-out: {selectedHotel.checkOutTime}
                    </Box>
                    {selectedHotel.freeCancellation && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                        Free cancellation
                      </Box>
                    )}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                {/* Booking Form */}
                <Grid container spacing={3}>
                  {/* Check-in & Check-out Dates */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Check-in Date"
                      type="date"
                      value={bookingDetails.checkInDate}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev, 
                        checkInDate: e.target.value
                      }))}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Check-out Date"
                      type="date"
                      value={bookingDetails.checkOutDate}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev, 
                        checkOutDate: e.target.value
                      }))}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  {/* Guest Information */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Adults"
                      type="number"
                      value={bookingDetails.numberOfAdults}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev, 
                        numberOfAdults: parseInt(e.target.value) || 1,
                        numberOfGuests: parseInt(e.target.value) + prev.numberOfChildren
                      }))}
                      inputProps={{ min: 1 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Children"
                      type="number"
                      value={bookingDetails.numberOfChildren}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev, 
                        numberOfChildren: parseInt(e.target.value) || 0,
                        numberOfGuests: prev.numberOfAdults + parseInt(e.target.value)
                      }))}
                      inputProps={{ min: 0 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Total Guests"
                      value={bookingDetails.numberOfGuests}
                      InputProps={{ readOnly: true }}
                      sx={{ backgroundColor: '#f8f9fa' }}
                    />
                  </Grid>
                  
                  {/* Contact Information */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Contact Name"
                      value={bookingDetails.contactName}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev, 
                        contactName: e.target.value
                      }))}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Email Address"
                      type="email"
                      value={bookingDetails.contactEmail}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev, 
                        contactEmail: e.target.value
                      }))}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={bookingDetails.contactPhone}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev, 
                        contactPhone: e.target.value
                      }))}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  {/* Special Requests */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Special Requests (Optional)"
                      placeholder="Any special requirements or preferences..."
                      value={bookingDetails.specialRequests}
                      onChange={(e) => setBookingDetails(prev => ({
                        ...prev, 
                        specialRequests: e.target.value
                      }))}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                            <Notes sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                {/* Price Breakdown */}
                <Box sx={{ 
                  backgroundColor: '#f8f9fa', 
                  p: 2, 
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    💰 Price Breakdown
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {formatCurrency(convertCurrency(selectedHotel.pricePerNight))} × {calculateNights()} nights
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(convertCurrency(calculateBookingCost()))}
                    </Typography>
                  </Box>
                  
                  {selectedHotel.breakfastIncluded && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="success.main">
                        ✓ Breakfast included
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        Complimentary
                      </Typography>
                    </Box>
                  )}
                  
                  {selectedHotel.freeWifi && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="success.main">
                        ✓ Free Wi-Fi
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        Complimentary
                      </Typography>
                    </Box>
                  )}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="600">
                      Total Amount
                    </Typography>
                    <Typography variant="h6" fontWeight="600" sx={{ color: '#ff5a5f' }}>
                      {formatCurrency(convertCurrency(calculateBookingCost()))}
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    * Prices are in {selectedCurrency}. Taxes and fees may apply.
                  </Typography>
                </Box>
              </DialogContent>
              
              <DialogActions sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                <Button 
                  variant="outlined"
                  onClick={() => setShowBookingModal(false)}
                  sx={{ minWidth: 120 }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained"
                  onClick={executeHotelBooking}
                  disabled={bookingLoading || !bookingDetails.contactName || !bookingDetails.contactEmail}
                  sx={{ 
                    minWidth: 120,
                    backgroundColor: '#ff5a5f',
                    '&:hover': { backgroundColor: '#e04e53' }
                  }}
                >
                  {bookingLoading ? 'Processing...' : `Book Now - ${formatCurrency(convertCurrency(calculateBookingCost()))}`}
                </Button>
              </DialogActions>
            </Dialog>
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