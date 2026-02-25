# API Testing Guide - Roamy Travel Booking Application

This guide provides sample API requests for testing the Roamy backend using tools like Postman, curl, or any HTTP client.

## Base URL
- **Development**: `http://localhost:8080/api`
- **Docker**: `http://localhost:8080/api`

## 🌟 Enhanced Travel Suggestion System

### NEW: Comprehensive Travel Suggestions (Enhanced!)

The new suggestion system provides personalized recommendations for:
- Places to explore based on interests
- Hotel recommendations with pricing
- Transport options with cost estimates
- Complete budget breakdowns
- Day-by-day itineraries
- Travel tips and cultural insights

#### Example: India to Vietnam Travel Suggestion

```http
POST /suggestions/comprehensive
Content-Type: application/json

{
  "fromLocation": "India",
  "toLocation": "Vietnam", 
  "durationDays": 10,
  "numberOfTravelers": 2,
  "budgetLevel": "mid-range",
  "interests": ["CULTURE", "FOOD", "ADVENTURE", "NATURE"],
  "accommodationType": "hotel",
  "minHotelRating": 3,
  "preferredTransportTypes": ["flight", "train"],
  "familyFriendly": true,
  "includeItinerary": true
}
```

#### Quick Suggestions (GET endpoint)

```http
GET /suggestions/quick?from=India&to=Vietnam&budget=mid-range&interests=CULTURE,FOOD,ADVENTURE
```

#### Destination-Specific Suggestions

```http
GET /suggestions/destination/Vietnam?budget=mid-range&interests=CULTURE,FOOD&days=7
```

#### Generate Detailed Itinerary

```http
POST /suggestions/itinerary
Content-Type: application/json

{
  "toLocation": "Vietnam",
  "fromLocation": "India", 
  "durationDays": 7,
  "budgetLevel": "mid-range",
  "interests": ["CULTURE", "FOOD", "SIGHTSEEING"],
  "numberOfTravelers": 2
}
```

**Expected Response Structure:**
```json
{
  "destinationOverview": {
    "name": "Vietnam",
    "country": "Vietnam", 
    "description": "Beautiful destination with rich culture...",
    "highlights": ["Rich cultural heritage", "Delicious cuisine"],
    "bestTimeToVisit": "October to April",
    "currency": "USD",
    "safetyRating": "Generally Safe"
  },
  "suggestedAttractions": [
    {
      "name": "Historic City Center",
      "category": "must-see",
      "description": "Explore the heart of the city",
      "matchingInterests": ["CULTURE", "SIGHTSEEING"],
      "rating": 4.2,
      "priceRange": "$$ - Moderate",
      "estimatedCost": 15,
      "duration": "2-3 hours",
      "priorityScore": 8
    }
  ],
  "suggestedAccommodations": [
    {
      "name": "Central Hotel",
      "category": "mid-range", 
      "pricePerNight": 75,
      "totalEstimatedCost": 525,
      "rating": 4.0,
      "starRating": 3,
      "amenities": ["WIFI", "BREAKFAST_INCLUDED"],
      "priorityScore": 7
    }
  ],
  "suggestedTransportOptions": [
    {
      "type": "flight",
      "category": "international",
      "route": "India → Vietnam",
      "estimatedCost": 500,
      "priceRange": "$400 - $800", 
      "duration": "6-12 hours",
      "priorityScore": 9
    }
  ],
  "budgetBreakdown": {
    "currency": "USD",
    "accommodation": {
      "budgetOption": 50,
      "midRangeOption": 125,
      "luxuryOption": 250,
      "recommended": 125
    },
    "totalBudget": {
      "budgetTotal": 1400,
      "midRangeTotal": 3500,
      "luxuryTotal": 7000,
      "recommendedTotal": 3500,
      "perPersonPerDay": 175
    }
  },
  "suggestedItinerary": [
    {
      "dayNumber": 1,
      "theme": "Arrival and City Orientation",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Breakfast at local café",
          "estimatedCost": 15,
          "type": "meal"
        },
        {
          "time": "10:30 AM", 
          "activity": "Historic City Center",
          "estimatedCost": 15,
          "type": "attraction"
        }
      ],
      "estimatedDailyCost": 85
    }
  ],
  "travelTips": {
    "generalTips": ["Book accommodations in advance", "Learn basic local phrases"],
    "culturalTips": ["Respect local customs", "Dress appropriately"],
    "budgetTips": ["Eat at local restaurants", "Use public transport"],
    "emergencyInfo": {"emergency": "911", "police": "100"}
  }
}
```

---

## Authentication

Most endpoints require authentication. First register and login to get an access token.

### 1. User Registration

```http
POST /auth/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "interests": ["CULTURE", "FOOD", "ADVENTURE"],
  "preferredCurrency": "USD"
}
```

### 2. User Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "mock-jwt-token-1",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## Search & Discovery APIs

### 3. Search All Destinations

```http
GET /search/destinations
```

### 4. Search Destinations by Query

```http
GET /search/destinations/search?query=Paris
```

### 5. Comprehensive Place Search

```http
POST /search/places
Content-Type: application/json

{
  "fromLocation": "New York",
  "toLocation": "Paris",
  "checkInDate": "2024-06-15",
  "checkOutDate": "2024-06-20",
  "numberOfGuests": 2,
  "numberOfAdults": 2,
  "numberOfChildren": 0,
  "minBudget": 100,
  "maxBudget": 500,
  "interests": ["CULTURE", "ART", "FOOD"],
  "minHotelRating": 3,
  "requiredAmenities": ["WIFI", "PARKING"],
  "preferredTransportTypes": ["FLIGHT"],
  "sortBy": "price",
  "sortOrder": "asc",
  "page": 0,
  "size": 10
}
```

### 6. Get Hotels by Destination

```http
GET /search/destinations/1/hotels?sortBy=price&sortOrder=asc&minPrice=100&maxPrice=400&minRating=4
```

### 7. Get Attractions by Destination

```http
GET /search/destinations/1/attractions?interests=CULTURE,ART,HISTORY
```

### 8. Search Transport Options

```http
GET /search/transport?from=New York&to=Paris&date=2024-06-15&transportTypes=FLIGHT,TRAIN
```

### 9. Get Recommendations

```http
GET /search/recommendations?destination=Paris&interests=CULTURE,FOOD&budgetLevel=mid-range
```

### 10. Get Trending Destinations

```http
GET /search/trending
```

## Booking APIs (Require Authentication)

Add the authorization header to all booking requests:
```http
Authorization: Bearer mock-jwt-token-1
```

### 11. Book a Hotel

```http
POST /bookings/hotel
Content-Type: application/json
Authorization: Bearer mock-jwt-token-1

{
  "type": "hotel",
  "hotelId": 1,
  "roomId": 1,
  "checkInDate": "2024-06-15",
  "checkOutDate": "2024-06-20",
  "numberOfGuests": 2,
  "numberOfAdults": 2,
  "numberOfChildren": 0,
  "contactName": "John Doe",
  "contactEmail": "john.doe@example.com",
  "contactPhone": "+1234567890",
  "specialRequests": "Late check-in please",
  "paymentMethod": "credit_card",
  "guests": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "+1234567890",
      "dateOfBirth": "1990-01-01",
      "nationality": "US",
      "isChild": false
    },
    {
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@example.com",
      "phoneNumber": "+1234567891",
      "dateOfBirth": "1992-05-15",
      "nationality": "US",
      "isChild": false
    }
  ]
}
```

### 12. Book Transport

```http
POST /bookings/transport
Content-Type: application/json
Authorization: Bearer mock-jwt-token-1

{
  "type": "transport",
  "transportType": "FLIGHT",
  "departureLocation": "New York",
  "arrivalLocation": "Paris",
  "departureDate": "2024-06-15T10:00:00",
  "arrivalDate": "2024-06-15T22:00:00",
  "transportProviderId": "FL001",
  "numberOfGuests": 2,
  "numberOfAdults": 2,
  "numberOfChildren": 0,
  "contactName": "John Doe",
  "contactEmail": "john.doe@example.com",
  "contactPhone": "+1234567890",
  "paymentMethod": "credit_card"
}
```

### 13. Get User Bookings

```http
GET /bookings
Authorization: Bearer mock-jwt-token-1
```

### 14. Get Specific Booking

```http
GET /bookings/1
Authorization: Bearer mock-jwt-token-1
```

### 15. Get Booking by Reference

```http
GET /bookings/reference/RMY1708534567890
Authorization: Bearer mock-jwt-token-1
```

### 16. Cancel Booking

```http
POST /bookings/1/cancel?reason=Change of plans
Authorization: Bearer mock-jwt-token-1
```

### 17. Get Upcoming Bookings

```http
GET /bookings/upcoming
Authorization: Bearer mock-jwt-token-1
```

### 18. Get Past Bookings

```http
GET /bookings/past
Authorization: Bearer mock-jwt-token-1
```

### 19. Get Booking Statistics

```http
GET /bookings/stats
Authorization: Bearer mock-jwt-token-1
```

## User Profile APIs (Require Authentication)

### 20. Get User Profile

```http
GET /auth/profile
Authorization: Bearer mock-jwt-token-1
```

### 21. Update User Profile

```http
PUT /auth/profile
Content-Type: application/json
Authorization: Bearer mock-jwt-token-1

{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "phoneNumber": "+1234567899",
  "interests": ["CULTURE", "FOOD", "ADVENTURE", "BEACH"],
  "preferredCurrency": "EUR"
}
```

### 22. Change Password

```http
POST /auth/change-password
Content-Type: application/json
Authorization: Bearer mock-jwt-token-1

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

## Sample curl Commands

Here are some curl examples for command-line testing:

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "interests": ["CULTURE", "FOOD"]
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Search Destinations
```bash
curl -X GET "http://localhost:8080/api/search/destinations"
```

### Search Places
```bash
curl -X POST http://localhost:8080/api/search/places \
  -H "Content-Type: application/json" \
  -d '{
    "toLocation": "Paris",
    "checkInDate": "2024-06-15",
    "checkOutDate": "2024-06-20",
    "numberOfGuests": 2,
    "interests": ["CULTURE", "FOOD"]
  }'
```

### Book Hotel (with token)
```bash
curl -X POST http://localhost:8080/api/bookings/hotel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "hotelId": 1,
    "roomId": 1,
    "checkInDate": "2024-06-15",
    "checkOutDate": "2024-06-20",
    "numberOfGuests": 2,
    "contactName": "Test User",
    "contactEmail": "test@example.com"
  }'
```

## Response Examples

### Successful Search Response
```json
{
  "destinations": [
    {
      "id": 1,
      "name": "Paris",
      "city": "Paris",
      "country": "France",
      "latitude": 48.8566,
      "longitude": 2.3522,
      "description": "The City of Light...",
      "averageRating": 4.5,
      "totalReviews": 15420
    }
  ],
  "hotels": [
    {
      "id": 1,
      "name": "Grand Hotel Paris",
      "starRating": 5,
      "pricePerNight": 350.00,
      "averageRating": 4.6,
      "amenities": ["WIFI", "POOL", "SPA"],
      "featured": true
    }
  ],
  "attractions": [
    {
      "id": 1,
      "name": "Eiffel Tower",
      "type": "MONUMENT",
      "entryFee": 29.40,
      "freeEntry": false,
      "averageRating": 4.5
    }
  ],
  "metadata": {
    "totalResults": 25,
    "currentPage": 0,
    "searchTimeMs": 245
  }
}
```

### Booking Response
```json
{
  "id": 1,
  "bookingReference": "RMY1708534567890",
  "type": "HOTEL",
  "status": "PENDING",
  "totalAmount": 1750.00,
  "currency": "USD",
  "hotelDetails": {
    "hotelName": "Grand Hotel Paris",
    "checkInDate": "2024-06-15",
    "checkOutDate": "2024-06-20",
    "numberOfNights": 5,
    "pricePerNight": 350.00
  },
  "createdAt": "2024-02-21T10:30:00",
  "cancellationDeadline": "2024-02-22T10:30:00"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Validation failed",
  "timestamp": "2024-02-21T10:30:00",
  "path": "/api/auth/register"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Access token is required",
  "timestamp": "2024-02-21T10:30:00"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Hotel not found",
  "timestamp": "2024-02-21T10:30:00"
}
```

## Testing with Postman

1. **Import Collection**: Create a new collection in Postman
2. **Set Base URL**: Create an environment variable `base_url` = `http://localhost:8080/api`
3. **Set Token**: After login, save the token as `auth_token` environment variable
4. **Use Variables**: Use `{{base_url}}` and `{{auth_token}}` in requests

## Database Console (H2)

Access the H2 database console at: `http://localhost:8080/api/h2-console`

- **JDBC URL**: `jdbc:h2:mem:roamy_db`
- **Username**: `sa`
- **Password**: (leave empty)

## Health Check

Check if the application is running:
```http
GET /actuator/health
```

Response:
```json
{
  "status": "UP"
}
```