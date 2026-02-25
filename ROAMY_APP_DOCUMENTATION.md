# 🏖️ Roamy Travel Booking Platform - Complete Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Application Architecture](#application-architecture)
- [User Journey & UI Flow](#user-journey--ui-flow)
- [API Documentation](#api-documentation)
- [Authentication System](#authentication-system)
- [Booking System](#booking-system)
- [Search & Suggestions](#search--suggestions)
- [Frontend Components](#frontend-components)
- [Backend Services](#backend-services)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [Error Handling](#error-handling)
- [Currency Support](#currency-support)

---

## 📖 Overview

**Roamy** is a comprehensive travel booking platform that allows users to search destinations, book hotels, arrange transport, discover attractions, and manage their bookings. Built with Spring Boot backend and React frontend, it provides a seamless travel planning experience.

### 🎯 Key Capabilities
- **Destination Discovery** - Search and explore travel destinations
- **Hotel Booking** - Complete hotel reservation system with room selection
- **Transport Booking** - Multi-modal transport booking (Flight, Train, Bus, Taxi, Car Rental, Ferry)
- **Attraction Discovery** - Find and explore local attractions
- **Itinerary Planning** - Generate travel itineraries based on preferences
- **User Management** - Registration, authentication, and profile management
- **Booking Management** - View, cancel, and manage all bookings
- **Multi-Currency Support** - Support for different currencies

---

## ✨ Features

### 🔐 User Authentication
- **Registration** with email verification
- **JWT-based authentication** with secure token storage
- **User profile management** with travel preferences
- **Protected routes** for authenticated users
- **Session management** with automatic token refresh

### 🏨 Hotel Booking System
- **Search hotels** by destination, dates, and preferences
- **Detailed hotel information** with ratings, amenities, and images
- **Room selection** with different room types (Standard, Deluxe, Suite)
- **Guest management** (adults and children)
- **Date validation** and pricing calculation
- **Booking confirmation** with reference numbers
- **Real-time availability** checking

### 🚗 Transport Booking System
- **Multi-modal transport** support:
  - ✈️ **Flights** - Domestic and international
  - 🚂 **Trains** - Railway bookings
  - 🚌 **Buses** - Intercity bus travel
  - 🚖 **Taxis** - Local transportation
  - 🚗 **Car Rentals** - Self-drive options
  - ⛴️ **Ferry** - Water transport
- **Seat type selection** (Economy, Business, First Class)
- **Passenger details management**
- **Route planning** with departure/arrival locations
- **Real-time pricing** and availability

### 🔍 Search & Discovery
- **Destination search** with auto-suggestions
- **Filter options**:
  - Budget ranges (Budget, Mid-range, Luxury)
  - Travel interests (Adventure, Culture, Beach, etc.)
  - Hotel ratings and amenities
  - Transport preferences
- **Trending destinations** showcase
- **Personalized recommendations** based on user preferences

### 🗺️ Travel Planning
- **Comprehensive travel suggestions** based on multiple criteria
- **Itinerary generation** with day-by-day planning
- **Attraction discovery** with interest-based filtering
- **Budget planning** with cost estimates
- **Travel date optimization**

### 📱 Booking Management
- **Booking dashboard** with all user bookings
- **Booking status tracking** (Pending, Confirmed, Cancelled)
- **Cancellation system** with reason tracking
- **Booking filtering** by type (Hotel/Transport) and status
- **Detailed booking information** with contact details

---

## 🏗️ Application Architecture

### Frontend (React)
```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Navbar.js          # Main navigation
│   │   │   └── Footer.js          # App footer
│   │   ├── Auth/
│   │   │   └── ProtectedRoute.js  # Route protection
│   │   ├── ErrorDisplay.js        # Error handling
│   │   ├── HotelBookingPage.js    # Hotel booking modal
│   │   └── TransportBookingPage.js # Transport booking modal
│   ├── pages/
│   │   ├── Home.js               # Landing page
│   │   ├── SearchResults.js      # Search results display
│   │   ├── TravelSuggestions.js  # Travel planning page
│   │   ├── Bookings.js           # Booking management
│   │   ├── DestinationDetails.js # Destination info
│   │   └── Auth/
│   │       ├── Login.js          # User login
│   │       └── Register.js       # User registration
│   ├── contexts/
│   │   ├── AuthContext.js        # Authentication state
│   │   └── CurrencyContext.js    # Currency management
│   └── services/
│       └── api.js                # API communication
```

### Backend (Spring Boot)
```
backend/
├── src/main/java/com/roamy/
│   ├── controller/
│   │   ├── AuthController.java      # Authentication endpoints
│   │   ├── BookingController.java   # Booking management
│   │   ├── SearchController.java    # Search functionality
│   │   └── ...
│   ├── service/
│   │   ├── AuthService.java         # Authentication logic
│   │   ├── BookingService.java      # Booking operations
│   │   ├── SearchService.java       # Search operations
│   │   └── ...
│   ├── entity/
│   │   ├── User.java               # User entity
│   │   ├── Booking.java            # Booking entity
│   │   ├── Hotel.java              # Hotel entity
│   │   ├── Destination.java        # Destination entity
│   │   └── ...
│   └── config/
│       ├── SecurityConfig.java      # Security configuration
│       └── ApplicationConfig.java   # App configuration
```

---

## 👤 User Journey & UI Flow

### 1. 🏠 **Landing Page (Home.js)**
**Flow**: App Entry Point
- **Search Bar** - Quick destination search
- **Trending Destinations** - Popular travel locations with images
- **Quick Actions** - Navigation to main features
- **API Status Check** - Backend connectivity verification

**User Actions**:
- Search for destinations
- Browse trending destinations  
- Navigate to login/register
- Access main features via navigation

### 2. 🔐 **Authentication Flow**
**Flow**: Register → Login → Protected Access

#### Registration (Register.js)
- **Form Fields**: First Name, Last Name, Email, Phone, Password
- **Travel Preferences**: Select interests (Adventure, Beach, Culture, etc.)
- **Validation**: Email format, password strength
- **Success**: Auto-redirect to login

#### Login (Login.js)  
- **Credentials**: Email and Password
- **JWT Token**: Stored in localStorage as 'authToken'
- **User Data**: Stored in localStorage as 'user'
- **Persistence**: Auto-login on app reload

### 3. 🌍 **Travel Planning (TravelSuggestions.js)**
**Flow**: Search → Explore → Book

#### Search Form
- **From/To Locations** - Origin and destination
- **Travel Dates** - Start and end dates
- **Budget Level** - Budget/Mid-range/Luxury selection
- **Travel Interests** - Multi-select preferences

#### Results Tabs
**🏨 Hotels Tab**:
- Hotel cards with images, ratings, pricing
- **Book Now** buttons for authenticated users
- Filtering by price, rating, amenities

**🚗 Transport Tab**:
- Transport options by type (Flight, Train, Bus, etc.)
- Pricing, duration, and provider information
- **Book Transport** with seat selection

**🎭 Explore Tab**:
- Local attractions based on interests
- Ratings, entry fees, operating hours
- Wheelchair accessible and kid-friendly filters

**📅 Itinerary Tab**:
- AI-generated day-by-day itinerary
- Attraction recommendations with timing
- Budget breakdown and suggestions

### 4. 🏨 **Hotel Booking Flow (HotelBookingPage.js)**
**Flow**: Select Hotel → Guest Details → Review → Confirm

#### Step 1: Guest Details
- **Personal Info**: Name, Email, Phone (auto-populated from profile)
- **Stay Details**: Check-in/out dates, number of guests (adults/children)
- **Room Selection**: Standard/Deluxe/Suite with pricing multipliers
- **Validation**: Required fields, date validation (check-out after check-in)

#### Step 2: Review Booking
- **Booking Summary**: Hotel info, dates, pricing breakdown
- **Total Calculation**: Base price × room multiplier × nights
- **Special Requests**: Optional text field for preferences

#### Step 3: Confirmation
- **Booking Reference**: Unique booking ID generation
- **Status**: Booking confirmation with details
- **Actions**: View booking details, redirect to bookings page

### 5. 🚗 **Transport Booking Flow (TransportBookingPage.js)**
**Flow**: Select Transport → Passenger Details → Review → Confirm

#### Step 1: Passenger Details
- **Contact Info**: Name, Email, Phone
- **Passenger Count**: Adults and children
- **Seat Preference**: Economy/Business/First Class
- **Special Requests**: Dietary preferences, accessibility needs

#### Step 2: Review Booking
- **Transport Details**: Type, route, timing, duration
- **Pricing**: Base price × seat multiplier × passengers
- **Terms**: Cancellation policy and booking terms

#### Step 3: Confirmation
- **Transport Booking Reference**: Unique ID
- **E-ticket Information**: Details for travel
- **Contact Details**: Support information

### 6. 📋 **Booking Management (Bookings.js)**
**Flow**: View All → Filter → Manage → Cancel

#### Booking Dashboard
- **Filter Tabs**: 
  - **Type Filter**: Hotel bookings vs Transport bookings
  - **Status Filter**: All, Confirmed, Pending, Cancelled
- **Booking Cards**: 
  - Booking reference and type
  - Status badges with color coding
  - Quick actions (View details, Cancel)

#### Booking Details
- **Complete Information**: All booking data with contact details
- **Status Tracking**: Current booking status
- **Cancellation**: Cancel with reason selection

#### Cancellation Flow
- **Confirmation Dialog**: Prevent accidental cancellations
- **Reason Selection**: Required cancellation reason
- **Status Update**: Real-time status change to "CANCELLED"

### 7. 🔍 **Search Results (SearchResults.js)**
**Flow**: Search Query → Results → Filter → Select

#### Results Display
- **Destination Cards**: Images, ratings, budget ranges
- **Sorting Options**: Popularity, name, rating
- **Filter Options**: Budget level, type, rating
- **Navigation**: Click to view destination details

---

## 🔌 API Documentation

### Authentication APIs
```http
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/verify/{token}
```

### Search APIs
```http
POST /search/places              # Comprehensive place search
GET  /search/destinations        # All destinations
GET  /search/destinations/search # Destination search by query
GET  /search/destinations/{id}/hotels # Hotels by destination
GET  /search/destinations/{id}/attractions # Attractions by destination
GET  /search/transport          # Transport options
GET  /search/recommendations    # Personalized recommendations
GET  /search/trending          # Trending destinations
```

### Booking APIs
```http
POST /bookings/hotel           # Create hotel booking
POST /bookings/transport       # Create transport booking
GET  /bookings                # Get user bookings
GET  /bookings/{id}          # Get booking by ID
GET  /bookings/reference/{ref} # Get booking by reference
PUT  /bookings/{id}/cancel    # Cancel booking
```

### Travel Suggestions APIs
```http
POST /suggestions/comprehensive  # Comprehensive travel suggestions
GET  /suggestions/quick         # Quick suggestions
GET  /suggestions/destination/{name} # Destination-specific suggestions
POST /suggestions/itinerary     # Generate itinerary
```

---

## 🔐 Authentication System

### JWT Token Management
- **Token Storage**: localStorage as 'authToken'
- **Token Format**: Bearer token in Authorization header
- **Expiration Handling**: Auto-redirect to login on 401 errors
- **User Data**: Stored separately in localStorage as 'user'

### Security Features
- **Protected Routes**: ProtectedRoute component wraps sensitive pages
- **Auth Context**: Global authentication state management
- **Auto-Login**: Persistent login across browser sessions
- **Secure Logout**: Token and user data cleanup

### Authorization Levels
- **Public**: Home, Search, Destination Details
- **Authenticated**: Bookings, Profile, Travel Suggestions with booking capability
- **Admin**: (Future implementation for admin features)

---

## 📅 Booking System

### Hotel Booking Entity
```java
// Key fields in Booking entity
@Entity
public class Booking {
    private String bookingReference;  // Unique ID
    private User user;               // Booking owner
    private Hotel hotel;            // Booked hotel
    private Room room;              // Booked room
    private BookingType type;       // HOTEL/TRANSPORT
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfGuests;
    private BigDecimal totalAmount;
    private BookingStatus status;   // PENDING/CONFIRMED/CANCELLED
    // ... other fields
}
```

### Transport Booking Fields
```java
// Transport-specific fields in Booking entity
private TransportType transportType; // FLIGHT/TRAIN/BUS/CAR_RENTAL/TAXI/FERRY
private String departureLocation;
private String arrivalLocation;
private LocalDateTime departureDate;
private LocalDateTime arrivalDate;
```

### Booking Status Flow
```
PENDING → CONFIRMED → COMPLETED
    ↓
CANCELLED (at any point)
```

### Payment Integration
- **Payment Status**: Separate from booking status
- **Currency Support**: Multiple currency handling
- **Amount Calculation**: Dynamic pricing with taxes and fees

---

## 🔍 Search & Suggestions

### Search Functionality
- **Destination Search**: Name-based with fuzzy matching
- **Filter Support**: Budget, interests, amenities, ratings
- **Sorting Options**: Price, rating, popularity, distance
- **Auto-complete**: Destination name suggestions

### Travel Suggestions Algorithm
```javascript
// Suggestion request format
{
  "fromLocation": "Mumbai",
  "toLocation": "Goa", 
  "budgetLevel": "MID_RANGE",
  "travelStartDate": "2024-03-15",
  "travelEndDate": "2024-03-18",
  "interests": ["BEACH", "ADVENTURE", "CUISINE"]
}
```

### Recommendation Engine
- **Interest-based**: Match user interests with destination features
- **Budget-aware**: Filter options by budget preferences
- **Seasonal**: Consider best time to visit
- **Personalization**: Learn from user booking history

---

## 🎨 Frontend Components

### Core UI Components
- **Material-UI (MUI)**: Complete component library
- **Responsive Design**: Mobile-first approach
- **Theme**: Custom Airbnb-inspired color scheme (#ff5a5f primary)
- **Navigation**: Persistent navbar with user menu
- **Error Handling**: Standardized error display components

### Key Component Files
- **HotelBookingPage.js**: Multi-step hotel booking modal
- **TransportBookingPage.js**: Transport booking with seat selection
- **TravelSuggestions.js**: Main travel planning interface with tabs
- **Bookings.js**: Comprehensive booking management dashboard
- **Navbar.js**: Navigation with authentication and currency selector

### State Management
- **AuthContext**: Global authentication state
- **CurrencyContext**: Multi-currency support
- **Local State**: Component-level state with hooks
- **Form Handling**: Controlled components with validation

---

## ⚙️ Backend Services

### Service Layer Architecture
```java
@Service
public class BookingService {
    // Hotel booking logic
    public BookingResponseDTO createHotelBooking(HotelBookingDTO request);
    
    // Transport booking logic  
    public BookingResponseDTO createTransportBooking(TransportBookingDTO request);
    
    // Booking management
    public List<BookingResponseDTO> getUserBookings(Long userId);
    public BookingResponseDTO cancelBooking(Long bookingId, String reason);
}
```

### External API Integration
- **Hotel APIs**: Integration with hotel booking providers
- **Transport APIs**: Flight, train, and bus booking systems
- **Payment Gateway**: Secure payment processing
- **Maps API**: Location services and geocoding

### Data Validation
- **Request Validation**: Bean validation with custom validators
- **Business Logic**: Date validation, availability checking
- **Security**: User authorization checks
- **Error Handling**: Standardized error responses

---

## 🗄️ Database Schema

### Core Entities

#### Users Table
```sql
users (
    id BIGINT PRIMARY KEY,
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR, 
    phone_number VARCHAR,
    role VARCHAR,
    preferred_currency VARCHAR,
    created_at TIMESTAMP
)
```

#### Bookings Table (Handles both Hotel & Transport)
```sql
bookings (
    id BIGINT PRIMARY KEY,
    booking_reference VARCHAR UNIQUE,
    user_id BIGINT FK,
    hotel_id BIGINT FK,
    room_id BIGINT FK,
    type VARCHAR, -- HOTEL or TRANSPORT
    transport_type VARCHAR, -- FLIGHT/TRAIN/BUS/etc
    departure_location VARCHAR,
    arrival_location VARCHAR,
    check_in_date DATE,
    check_out_date DATE,
    departure_date TIMESTAMP,
    arrival_date TIMESTAMP,
    number_of_guests INT,
    total_amount DECIMAL,
    status VARCHAR, -- PENDING/CONFIRMED/CANCELLED
    created_at TIMESTAMP
)
```

#### Search History Tracking
```sql
search_history (
    id BIGINT PRIMARY KEY,
    user_id BIGINT FK,
    from_location VARCHAR,
    to_location VARCHAR,
    budget_range VARCHAR,
    search_date TIMESTAMP,
    converted_to_booking BOOLEAN
)
```

### Relationship Model
- **Users** → **Bookings** (One-to-Many)
- **Hotels** → **Rooms** → **Bookings** (Hotel bookings)
- **Destinations** → **Hotels** & **Attractions**
- **Search History** → **Bookings** (Conversion tracking)

---

## 🚀 Setup Instructions

### Prerequisites
- **Java 17+** for Spring Boot backend
- **Node.js 16+** for React frontend  
- **MySQL 8+** for database
- **Maven 3.8+** for dependency management

### Backend Setup
```bash
# Navigate to backend directory
cd backend/

# Install dependencies
./mvnw clean install

# Configure database in application.yml
# Update database URL, username, password

# Run the application
./mvnw spring-boot:run

# Backend will start on http://localhost:8080
```

### Frontend Setup  
```bash
# Navigate to frontend directory
cd frontend/

# Install dependencies
npm install

# Install additional packages (if needed)
npm install leaflet react-leaflet

# Start development server
npm start

# Frontend will start on http://localhost:3000
```

### Environment Configuration
```yaml
# backend/src/main/resources/application.yml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/roamy_db
    username: your_db_username  
    password: your_db_password

jwt:
  secret: your_jwt_secret_key
  expiration: 86400000  # 24 hours
```

### Docker Setup (Optional)
```bash
# Use docker-compose.yml in root directory
docker-compose up -d

# This will start:
# - MySQL database
# - Backend application  
# - Frontend application
```

---

## ❌ Error Handling

### Frontend Error Management
```javascript
// Standardized error handling in API calls
try {
  const response = await bookingAPI.createHotelBooking(bookingData);
  // Success handling
} catch (error) {
  if (error.response?.status === 401) {
    // Authentication error - redirect to login
    localStorage.removeItem('authToken');
    navigate('/login');
  } else if (error.response?.status === 400) {
    // Validation error - show form errors
    setFormErrors(error.response.data.errors);
  } else {
    // Generic error - show error message
    toast.error('Booking failed. Please try again.');
  }
}
```

### Backend Error Responses
```java
// Standardized error response format
{
  "timestamp": "2024-03-15T10:30:00",
  "status": 400,
  "error": "Bad Request", 
  "message": "Validation failed",
  "errors": [
    {
      "field": "checkInDate",
      "message": "Check-in date cannot be in the past"
    }
  ],
  "path": "/bookings/hotel"
}
```

### Error Categories
- **Authentication (401)**: Invalid or expired tokens
- **Authorization (403)**: Insufficient permissions  
- **Validation (400)**: Invalid input data
- **Not Found (404)**: Resource not found
- **Server Error (500)**: Internal server issues

---

## 💱 Currency Support

### Multi-Currency Features
```javascript
// Currency context provides global currency management
const { 
  selectedCurrency,
  currencyOptions, 
  convertCurrency,
  formatCurrency,
  updateCurrency 
} = useCurrency();

// Usage in components
const displayPrice = formatCurrency(
  convertCurrency(price, originalCurrency, selectedCurrency)
);
```

### Supported Currencies
- **USD** - US Dollar (default)
- **EUR** - Euro
- **GBP** - British Pound
- **INR** - Indian Rupee
- **CAD** - Canadian Dollar
- **AUD** - Australian Dollar

### Currency Features
- **Real-time Conversion**: API-based exchange rates
- **User Preference**: Persistent currency selection
- **Display Formatting**: Locale-appropriate formatting
- **Booking Currency**: Support for booking in different currencies

---

## 📈 Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Compressed images with lazy loading
- **Caching**: API response caching for static data
- **Debounced Search**: Prevent excessive API calls

### Backend Optimizations  
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Database connection management
- **Caching**: Redis cache for frequently accessed data
- **API Rate Limiting**: Prevent API abuse

### Mobile Performance
- **Responsive Design**: Mobile-first approach
- **Touch Optimization**: Touch-friendly UI elements
- **Progressive Web App**: Service worker implementation
- **Offline Support**: Basic offline functionality

---

## 🧪 Testing Strategy

### Frontend Testing
- **Unit Tests**: Component testing with Jest and React Testing Library
- **Integration Tests**: API integration testing
- **E2E Tests**: User flow testing with Cypress
- **Manual Testing**: Cross-browser compatibility testing

### Backend Testing
- **Unit Tests**: Service and controller testing with JUnit
- **Integration Tests**: Database and API endpoint testing
- **Security Testing**: Authentication and authorization testing
- **Performance Testing**: Load testing for critical endpoints

---

## 🚀 Future Enhancements

### Planned Features
- **Real Payment Gateway**: Integration with Stripe/PayPal
- **Email Notifications**: Booking confirmations and updates
- **Mobile App**: React Native mobile application
- **Social Login**: Google, Facebook authentication
- **Reviews & Ratings**: User review system for hotels and attractions
- **Travel Insurance**: Insurance booking integration
- **Group Bookings**: Support for group travel bookings
- **Admin Dashboard**: Administrative management interface

### Technical Improvements
- **Microservices**: Break monolith into microservices
- **Real-time Updates**: WebSocket notifications
- **Advanced Search**: Elasticsearch integration  
- **AI Recommendations**: Machine learning-based recommendations
- **Analytics**: User behavior tracking and analytics

---

## 📞 Support & Contact

### Development Team
- **Backend**: Spring Boot with MySQL
- **Frontend**: React with Material-UI
- **Architecture**: REST API with JWT authentication

### Documentation
- **API Docs**: Available at `/swagger-ui.html` when backend is running
- **Database Schema**: See [ERD.md](docs/ERD.md) for detailed schema
- **Setup Guides**: See individual README files in backend/ and frontend/

---

*Last Updated: February 2026*
*Version: 1.0.0*

---

## 📱 Quick Reference

### Key URLs in Development
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Database**: localhost:3306/roamy_db

### Important Files
- **Backend Config**: `backend/src/main/resources/application.yml`
- **Frontend Config**: `frontend/src/services/api.js`  
- **Database Schema**: `docs/ERD.md`
- **Docker Setup**: `docker-compose.yml`

### Authentication Flow
1. Register → `/auth/register`
2. Login → `/auth/login` (returns JWT token)
3. Store token in localStorage as 'authToken'  
4. Include token in API headers: `Authorization: Bearer {token}`
5. Access protected routes and booking features

This documentation provides a complete overview of the Roamy travel booking platform, covering all aspects from user flows to technical implementation details.