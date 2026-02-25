# Roamy - Travel Booking Application

A comprehensive travel booking platform built with Spring Boot and React JS that helps users explore destinations, book hotels, and arrange transportation based on their interests and preferences.

## Features

- 🗺️ **Destination Search**: Search from and to destinations
- 🎯 **Interest-based Recommendations**: Get place suggestions based on your activities
- 🏨 **Hotel Booking**: Find and book accommodations
- 🚗 **Transport Booking**: Book various transportation options
- 💰 **Price Comparison**: View price ranges for different options
- 🗺️ **Interactive Maps**: Visual exploration with map integration

## Architecture

### Backend (Spring Boot)
- RESTful API endpoints
- Integration with travel APIs
- Database management with JPA
- Security with Spring Security
- Real-time pricing data

### Frontend (React JS)
- Modern responsive UI
- Interactive map integration
- Real-time search and filtering
- Booking management dashboard
- Mobile-friendly design

## Quick Start

### Prerequisites
- Java 17+ (for backend)
- Node.js 18+ (for frontend)
- Maven or Gradle
- MySQL/PostgreSQL (optional, H2 included for development)

### Running the Application

#### Backend
```bash
cd backend
./mvnw spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Project Structure

```
personal-roamy/
├── backend/              # Spring Boot application
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── pom.xml
├── frontend/             # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── docs/                 # Documentation
└── docker-compose.yml    # Development environment
```

## API Endpoints

- `GET /api/destinations` - Get available destinations
- `POST /api/search/places` - Search places based on criteria
- `GET /api/hotels` - Get hotel listings
- `POST /api/booking/hotel` - Book hotel
- `GET /api/transport` - Get transport options
- `POST /api/booking/transport` - Book transportation

## Technology Stack

### Backend
- Spring Boot 3.0+
- Spring Data JPA
- Spring Security
- Spring Web
- H2/MySQL Database
- Maven

### Frontend
- React 18+
- React Router
- Axios for API calls
- Material-UI / Tailwind CSS
- Google Maps API
- Chart.js for analytics

## Development

1. Clone the repository
2. Set up environment variables
3. Run backend and frontend applications
4. Access the application at `http://localhost:3000`

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.