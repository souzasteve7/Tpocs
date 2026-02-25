# Roamy Travel Booking Application - Backend Setup Guide

## Prerequisites

Before running the backend, ensure you have the following installed:

### 1. Java Development Kit (JDK) 17 or higher
- Download from: https://adoptium.net/
- Set JAVA_HOME environment variable
- Add Java to your PATH

### 2. Apache Maven 3.6.3 or higher
- Download from: https://maven.apache.org/download.cgi
- Set MAVEN_HOME environment variable
- Add Maven to your PATH

### 3. Database (Optional for Development)
- H2 Database is included for development (no setup required)
- For production: MySQL 8.0+ or PostgreSQL 12+

## Quick Start

### Option 1: Using Maven (Recommended for Development)

```bash
cd backend

# Clean and compile the project
mvn clean compile

# Run tests
mvn test

# Start the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080/api`

### Option 2: Using Docker

```bash
# Build the Docker image
docker build -t roamy-backend ./backend

# Run the container
docker run -p 8080:8080 roamy-backend
```

### Option 3: Using Docker Compose (Full Stack)

```bash
# Start all services (database, backend, frontend)
docker-compose up --build
```

## Environment Configuration

### Development Environment
The application uses H2 in-memory database by default. No additional setup required.

### Production Environment
Create a `.env` file based on `.env.example` and set:

```bash
# Database
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# External APIs
OPENWEATHER_API_KEY=your_openweather_api_key
RAPIDAPI_KEY=your_rapidapi_key
FOURSQUARE_API_KEY=your_foursquare_api_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

## API Documentation

Once the application is running, access:

- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **API Docs**: http://localhost:8080/api/v3/api-docs
- **H2 Console**: http://localhost:8080/api/h2-console (development only)

## Sample Data

The application includes sample data for:
- 8 destinations (Paris, Tokyo, New York, London, Barcelona, Rome, Sydney, Istanbul)
- Hotels and rooms for each destination
- Attractions and points of interest
- Travel interests and categories

## API Endpoints Overview

### Search & Discovery
- `POST /api/search/places` - Search places based on criteria
- `GET /api/search/destinations` - Get all destinations
- `GET /api/search/destinations/{id}/hotels` - Get hotels by destination
- `GET /api/search/destinations/{id}/attractions` - Get attractions by destination

### User Management
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Booking Management
- `POST /api/bookings/hotel` - Book a hotel
- `POST /api/bookings/transport` - Book transport
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings/{id}/cancel` - Cancel booking

## Free APIs Integration

The backend integrates with several free APIs:

### 1. OpenStreetMap Nominatim (Geocoding)
- **URL**: https://nominatim.openstreetmap.org
- **Usage**: Location search and geocoding
- **Cost**: Free, no API key required
- **Rate Limits**: 1 request/second

### 2. OpenWeatherMap (Weather)
- **URL**: https://openweathermap.org/api
- **Usage**: Weather information for destinations
- **Cost**: Free tier (60 calls/min, 1M calls/month)
- **Setup**: Sign up for free API key

### 3. REST Countries (Country Info)
- **URL**: https://restcountries.com
- **Usage**: Country information and flags
- **Cost**: Free, no API key required

### 4. Mock APIs for Development
The application includes mock implementations for:
- Hotel booking (simulates booking.com API)
- Transport search (simulates flight/train APIs)
- Places of interest (simulates Foursquare API)

## Troubleshooting

### Java Version Issues
```bash
# Check Java version
java -version

# Should show Java 17 or higher
# If not, install correct version and update JAVA_HOME
```

### Maven Issues
```bash
# Check Maven version
mvn -version

# If not found, install Maven and add to PATH
```

### Port Already in Use
```bash
# Change port in application.yml
server:
  port: 8081

# Or kill process using port 8080
# Windows: netstat -ano | findstr :8080
# Linux/Mac: lsof -i :8080
```

### Database Connection Issues
- Check database credentials in application.yml
- Ensure database server is running
- Check firewall settings

## Development Tips

### Hot Reload
Use Spring Boot DevTools for automatic restart:
```bash
mvn spring-boot:run
# Make code changes - application will restart automatically
```

### Database Console
Access H2 console at http://localhost:8080/api/h2-console
- JDBC URL: `jdbc:h2:mem:roamy_db`
- Username: `sa`
- Password: (leave empty)

### Logging
Adjust logging levels in `application.yml`:
```yaml
logging:
  level:
    com.roamy: DEBUG
```

## Production Deployment

### Using JAR
```bash
# Build JAR file
mvn clean package -DskipTests

# Run JAR
java -jar target/roamy-backend-1.0.0.jar --spring.profiles.active=prod
```

### Using Docker
```bash
# Build production image
docker build -t roamy-backend:prod ./backend

# Run with environment variables
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=prod roamy-backend:prod
```

## Next Steps

1. **Set up external API keys** for production features
2. **Configure production database** (MySQL/PostgreSQL)
3. **Implement JWT authentication** with proper security
4. **Add email service** for user verification
5. **Set up payment gateway** for booking transactions
6. **Add monitoring** and logging for production

## Support

For issues and questions:
1. Check the application logs
2. Review this documentation
3. Check Spring Boot documentation: https://spring.io/projects/spring-boot