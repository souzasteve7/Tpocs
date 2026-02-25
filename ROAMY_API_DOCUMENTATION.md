# 🔌 Roamy API Documentation

## 📋 Overview
REST API endpoints for the Roamy travel booking platform. All authenticated endpoints require JWT token in Authorization header.

**Base URL**: `http://localhost:8080`  
**Authentication**: Bearer Token in `Authorization` header  
**Content-Type**: `application/json`

---

## 🔐 Authentication APIs

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "password": "securePassword123",
  "interests": ["ADVENTURE", "BEACH", "CULTURE"]
}
```

**Response (201)**:
```json
{
  "message": "User registered successfully",
  "userId": 123
}
```

### Login User  
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (200)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 123,
    "email": "john.doe@example.com", 
    "firstName": "John",
    "lastName": "Doe",
    "name": "John Doe",
    "phoneNumber": "+1234567890",
    "role": "USER"
  }
}
```

---

## 🔍 Search APIs

### Search Places (Comprehensive)
```http
POST /search/places
Authorization: Bearer {token}
Content-Type: application/json

{
  "fromLocation": "Mumbai",
  "toLocation": "Goa",
  "checkInDate": "2024-03-15",
  "checkOutDate": "2024-03-18", 
  "numberOfGuests": 2,
  "budgetLevel": "MID_RANGE",
  "interests": ["BEACH", "ADVENTURE"]
}
```

### Get All Destinations
```http
GET /search/destinations
```

**Response (200)**:
```json
[
  {
    "id": 1,
    "name": "Goa",
    "city": "Panaji", 
    "country": "India",
    "countryCode": "IN",
    "description": "Beautiful coastal state...",
    "imageUrl": "https://images.unsplash.com/...",
    "averageRating": 4.5,
    "totalReviews": 1250,
    "budgetDailyCost": 2000.00,
    "midRangeDailyCost": 4500.00,
    "luxuryDailyCost": 8000.00,
    "currency": "INR",
    "bestTimeToVisit": "November to March"
  }
]
```

### Search Destinations by Query
```http
GET /search/destinations/search?query=beach destinations
```

### Get Hotels by Destination
```http
GET /search/destinations/{destinationId}/hotels?sortBy=price&sortOrder=asc&minPrice=2000&maxPrice=5000&minRating=4
```

### Get Attractions by Destination
```http
GET /search/destinations/{destinationId}/attractions?interests=ADVENTURE,CULTURE
```

### Search Transport Options
```http
GET /search/transport?from=Mumbai&to=Goa&date=2024-03-15&transportTypes=FLIGHT,TRAIN
```

**Response (200)**:
```json
[
  {
    "id": "FL001", 
    "type": "FLIGHT",
    "provider": "Air India",
    "departureLocation": "Mumbai",
    "arrivalLocation": "Goa",
    "departureTime": "08:30",
    "arrivalTime": "10:00", 
    "duration": "1h 30m",
    "price": 8500.00,
    "currency": "INR",
    "availableSeats": 45,
    "rating": 4.2
  }
]
```

### Get Trending Destinations
```http
GET /search/trending
```

---

## 📅 Booking APIs

### Create Hotel Booking
```http
POST /bookings/hotel
Authorization: Bearer {token}
Content-Type: application/json

{
  "hotelId": 1,
  "roomId": 2,
  "checkInDate": "2024-03-15",
  "checkOutDate": "2024-03-18",
  "numberOfGuests": 2,
  "numberOfAdults": 2,
  "numberOfChildren": 0,
  "contactName": "John Doe",
  "contactEmail": "john.doe@example.com", 
  "contactPhone": "+1234567890",
  "roomType": "DELUXE",
  "specialRequests": "Sea view preferred",
  "totalAmount": 12000.00,
  "currency": "INR"
}
```

**Response (201)**:
```json
{
  "bookingId": 456,
  "bookingReference": "HTL-2024-456",
  "status": "CONFIRMED",
  "message": "Hotel booking confirmed successfully",
  "totalAmount": 12000.00,
  "currency": "INR",
  "checkInDate": "2024-03-15",
  "checkOutDate": "2024-03-18"
}
```

### Create Transport Booking  
```http
POST /bookings/transport
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "TRANSPORT",
  "transportType": "FLIGHT", 
  "provider": "Air India",
  "departureLocation": "Mumbai",
  "arrivalLocation": "Goa",
  "departureDate": "2024-03-15T08:30:00",
  "arrivalDate": "2024-03-15T10:00:00", 
  "numberOfGuests": 2,
  "numberOfAdults": 2,
  "numberOfChildren": 0,
  "seatType": "ECONOMY",
  "contactName": "John Doe",
  "contactEmail": "john.doe@example.com",
  "contactPhone": "+1234567890", 
  "specialRequests": "Aisle seats preferred",
  "totalAmount": 17000.00,
  "currency": "INR"
}
```

### Get User Bookings
```http
GET /bookings
Authorization: Bearer {token}
```

**Response (200)**:
```json
[
  {
    "id": 456,
    "bookingReference": "HTL-2024-456", 
    "type": "HOTEL",
    "status": "CONFIRMED",
    "hotel": {
      "name": "Beach Resort Goa",
      "address": "Calangute Beach, Goa"
    },
    "checkInDate": "2024-03-15",
    "checkOutDate": "2024-03-18", 
    "numberOfGuests": 2,
    "totalAmount": 12000.00,
    "currency": "INR",
    "contactName": "John Doe",
    "contactEmail": "john.doe@example.com",
    "createdAt": "2024-03-10T14:30:00"
  }
]
```

### Get Booking by Reference
```http
GET /bookings/reference/{bookingReference}
Authorization: Bearer {token}
```

### Cancel Booking
```http
PUT /bookings/{bookingId}/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Change of plans"
}
```

---

## 🌍 Travel Suggestions APIs

### Get Comprehensive Suggestions
```http
POST /suggestions/comprehensive 
Authorization: Bearer {token}
Content-Type: application/json

{
  "fromLocation": "Mumbai",
  "toLocation": "Goa", 
  "budgetLevel": "MID_RANGE",
  "travelStartDate": "2024-03-15",
  "travelEndDate": "2024-03-18",
  "interests": ["BEACH", "ADVENTURE", "CUISINE"],
  "numberOfGuests": 2
}
```

**Response (200)**:
```json
{
  "destination": {
    "name": "Goa",
    "description": "Tropical paradise...",
    "bestTimeToVisit": "November to March"
  },
  "hotels": [
    {
      "id": 1,
      "name": "Beach Resort Goa", 
      "pricePerNight": 4000.00,
      "rating": 4.5,
      "amenities": ["Pool", "WiFi", "Beach Access"]
    }
  ],
  "transportOptions": [
    {
      "type": "FLIGHT",
      "provider": "Air India",
      "price": 8500.00,
      "duration": "1h 30m"
    }
  ],
  "attractions": [
    {
      "name": "Baga Beach",
      "type": "BEACH", 
      "entryFee": 0.00,
      "rating": 4.3
    }
  ],
  "itinerary": {
    "day1": [
      {
        "time": "09:00",
        "activity": "Arrival and hotel check-in",
        "location": "Beach Resort Goa"
      }
    ]
  }
}
```

### Generate Itinerary
```http
POST /suggestions/itinerary
Authorization: Bearer {token} 
Content-Type: application/json

{
  "destination": "Goa",
  "numberOfDays": 3,
  "interests": ["BEACH", "CULTURE", "CUISINE"],
  "budgetLevel": "MID_RANGE"
}
```

---

## ❌ Error Responses

### Authentication Error (401)
```json
{
  "timestamp": "2024-03-15T10:30:00",
  "status": 401,
  "error": "Unauthorized", 
  "message": "JWT token is expired",
  "path": "/bookings"
}
```

### Validation Error (400)
```json
{
  "timestamp": "2024-03-15T10:30:00",  
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    {
      "field": "checkInDate",
      "message": "Check-in date cannot be in the past"
    },
    {
      "field": "contactEmail", 
      "message": "Invalid email format"
    }
  ],
  "path": "/bookings/hotel"
}
```

### Resource Not Found (404)
```json
{
  "timestamp": "2024-03-15T10:30:00",
  "status": 404, 
  "error": "Not Found",
  "message": "Hotel not found with id: 999",
  "path": "/bookings/hotel"
}
```

---

## 📊 Response Status Codes

| Status Code | Description |
|-------------|-------------|
| **200** | OK - Request successful |
| **201** | Created - Resource created successfully |  
| **400** | Bad Request - Invalid input data |
| **401** | Unauthorized - Authentication required |
| **403** | Forbidden - Insufficient permissions |
| **404** | Not Found - Resource not found |
| **409** | Conflict - Resource already exists |
| **500** | Internal Server Error - Server issue |

---

## 🔒 Authentication Flow

### 1. Register/Login
- Call `/auth/register` or `/auth/login`
- Receive `accessToken` in response
- Store token securely (localStorage in frontend)

### 2. Authenticated Requests
- Include token in Authorization header:
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

### 3. Token Expiration
- Tokens expire after 24 hours
- API returns 401 status when expired
- Frontend should redirect to login page

---

## 📝 Request/Response Examples

### Complete Hotel Booking Flow
```bash
# 1. Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# 2. Search Hotels  
curl -X GET "http://localhost:8080/search/destinations/1/hotels" \
  -H "Authorization: Bearer {token}"

# 3. Book Hotel
curl -X POST http://localhost:8080/bookings/hotel \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "hotelId": 1,
    "checkInDate": "2024-03-15", 
    "checkOutDate": "2024-03-18",
    "numberOfGuests": 2,
    "contactName": "John Doe",
    "contactEmail": "john@example.com",
    "totalAmount": 12000.00
  }'

# 4. View Bookings
curl -X GET http://localhost:8080/bookings \
  -H "Authorization: Bearer {token}"
```

---

## 🌐 CORS Configuration
API supports cross-origin requests from:
- `http://localhost:3000` (Frontend development)
- `https://your-domain.com` (Production frontend)

---

## 📈 Rate Limiting  
- **Authentication APIs**: 5 requests per minute per IP
- **Search APIs**: 60 requests per minute per user
- **Booking APIs**: 10 requests per minute per user

---

## 🔧 Development Tools
- **API Testing**: Use Postman collection (if available)
- **Documentation**: Swagger UI at `http://localhost:8080/swagger-ui.html`
- **Database**: H2 Console at `http://localhost:8080/h2-console` (dev only)

---

**Note**: Replace `{token}` with actual JWT token received from login endpoint.

*API Version: 1.0 | Last Updated: February 2026*