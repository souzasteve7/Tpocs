package com.roamy.external;

import com.roamy.dto.SearchRequestDTO;
import com.roamy.dto.SearchResponseDTO;
import com.roamy.entity.Destination;
import com.roamy.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExternalAPIService {
    
    private final WebClient webClient;
    
    @Value("${external.apis.weather.api-key}")
    private String weatherApiKey;
    
    @Value("${external.apis.hotels.api-key}")
    private String hotelsApiKey;
    
    @Value("${external.apis.places.api-key}")
    private String placesApiKey;
    
    /**
     * Get destination information from OpenStreetMap Nominatim API (Free)
     */
    public Optional<Destination> getDestinationInfo(String locationName) {
        try {
            log.info("Fetching destination info for: {}", locationName);
            
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://nominatim.openstreetmap.org/search")
                    .queryParam("q", locationName)
                    .queryParam("format", "json")
                    .queryParam("limit", 1)
                    .queryParam("addressdetails", 1)
                    .build()
                    .toUriString();
            
            @SuppressWarnings("unchecked")
            Map<String, Object>[] response = webClient.get()
                    .uri(url)
                    .header("User-Agent", "RoamyApp/1.0")
                    .retrieve()
                    .bodyToMono(Map[].class)
                    .block();
            
            if (response != null && response.length > 0) {
                Map<String, Object> place = response[0];
                @SuppressWarnings("unchecked")
                Map<String, Object> address = (Map<String, Object>) place.get("address");
                
                return Optional.of(Destination.builder()
                        .name(locationName)
                        .city(getAddressField(address, "city"))
                        .country(getAddressField(address, "country"))
                        .countryCode(getAddressField(address, "country_code"))
                        .latitude(new BigDecimal(place.get("lat").toString()))
                        .longitude(new BigDecimal(place.get("lon").toString()))
                        .description("Destination information from OpenStreetMap")
                        .active(true)
                        .build());
            }
            
        } catch (Exception e) {
            log.error("Error fetching destination info for {}: {}", locationName, e.getMessage());
        }
        
        return Optional.empty();
    }
    
    /**
     * Search destinations from external APIs
     */
    public List<Destination> searchDestinations(String query) {
        List<Destination> destinations = new ArrayList<>();
        
        try {
            log.info("Searching destinations externally for: {}", query);
            
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://nominatim.openstreetmap.org/search")
                    .queryParam("q", query)
                    .queryParam("format", "json")
                    .queryParam("limit", 5)
                    .queryParam("addressdetails", 1)
                    .build()
                    .toUriString();
            
            @SuppressWarnings("unchecked")
            Map<String, Object>[] response = webClient.get()
                    .uri(url)
                    .header("User-Agent", "RoamyApp/1.0")
                    .retrieve()
                    .bodyToMono(Map[].class)
                    .block();
            
            if (response != null) {
                for (Map<String, Object> place : response) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> address = (Map<String, Object>) place.get("address");
                    
                    destinations.add(Destination.builder()
                            .name(place.get("display_name").toString())
                            .city(getAddressField(address, "city"))
                            .country(getAddressField(address, "country"))
                            .countryCode(getAddressField(address, "country_code"))
                            .latitude(new BigDecimal(place.get("lat").toString()))
                            .longitude(new BigDecimal(place.get("lon").toString()))
                            .active(true)
                            .build());
                }
            }
            
        } catch (Exception e) {
            log.error("Error searching destinations for {}: {}", query, e.getMessage());
        }
        
        return destinations;
    }
    
    /**
     * Search hotels using RapidAPI booking.com API (Free tier)
     * Note: This is a mock implementation - you'd need to sign up for RapidAPI
     */
    public List<SearchResponseDTO.HotelDTO> searchHotels(Destination destination, SearchRequestDTO searchRequest) {
        List<SearchResponseDTO.HotelDTO> hotels = new ArrayList<>();
        
        try {
            log.info("Searching hotels for destination: {}", destination.getName());
            
            // Mock data for demonstration - replace with actual API call
            hotels.addAll(generateMockHotels(destination));
            
            // Actual implementation would look like this:
            /*
            String url = "https://booking-com.p.rapidapi.com/v1/hotels/search";
            
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path(url)
                            .queryParam("dest_id", destination.getId())
                            .queryParam("checkin_date", searchRequest.getCheckInDate())
                            .queryParam("checkout_date", searchRequest.getCheckOutDate())
                            .queryParam("adults_number", searchRequest.getNumberOfAdults())
                            .build())
                    .header("X-RapidAPI-Key", hotelsApiKey)
                    .header("X-RapidAPI-Host", "booking-com.p.rapidapi.com")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            
            // Process response and convert to DTOs
            */
            
        } catch (Exception e) {
            log.error("Error searching hotels for destination {}: {}", destination.getName(), e.getMessage());
        }
        
        return hotels;
    }
    
    /**
     * Search attractions using Foursquare Places API (Free tier)
     */
    public List<SearchResponseDTO.AttractionDTO> searchAttractions(Destination destination, List<User.TravelInterest> interests) {
        List<SearchResponseDTO.AttractionDTO> attractions = new ArrayList<>();
        
        try {
            log.info("Searching attractions for destination: {}", destination.getName());
            
            if (destination.getLatitude() != null && destination.getLongitude() != null) {
                // Mock data for demonstration
                attractions.addAll(generateMockAttractions(destination));
                
                // Actual Foursquare API implementation:
                /*
                String url = "https://api.foursquare.com/v3/places/search";
                
                Map<String, Object> response = webClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path(url)
                                .queryParam("ll", destination.getLatitude() + "," + destination.getLongitude())
                                .queryParam("radius", 5000)
                                .queryParam("categories", getCategoriesForInterests(interests))
                                .queryParam("limit", 20)
                                .build())
                        .header("Authorization", placesApiKey)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();
                
                // Process response
                */
            }
            
        } catch (Exception e) {
            log.error("Error searching attractions for destination {}: {}", destination.getName(), e.getMessage());
        }
        
        return attractions;
    }
    
    /**
     * Get transport options (mock implementation)
     */
    public List<SearchResponseDTO.TransportOptionDTO> getTransportOptions(String from, String to, String date, List<String> transportTypes) {
        List<SearchResponseDTO.TransportOptionDTO> options = new ArrayList<>();
        
        try {
            log.info("Searching transport from {} to {}", from, to);
            
            // Mock transport data - replace with actual APIs like Rome2Rio, etc.
            options.addAll(generateMockTransportOptions(from, to, date));
            
        } catch (Exception e) {
            log.error("Error searching transport from {} to {}: {}", from, to, e.getMessage());
        }
        
        return options;
    }
    
    /**
     * Get weather information from OpenWeatherMap API
     */
    public Map<String, Object> getWeatherInfo(BigDecimal latitude, BigDecimal longitude) {
        try {
            log.info("Fetching weather for coordinates: {}, {}", latitude, longitude);
            
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://api.openweathermap.org/data/2.5/weather")
                    .queryParam("lat", latitude)
                    .queryParam("lon", longitude)
                    .queryParam("appid", weatherApiKey)
                    .queryParam("units", "metric")
                    .build()
                    .toUriString();
            
            @SuppressWarnings("unchecked")
            Map<String, Object> result = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            return result;
            
        } catch (Exception e) {
            log.error("Error fetching weather info: {}", e.getMessage());
            return new HashMap<>();
        }
    }
    
    // Private helper methods
    
    private String getAddressField(Map<String, Object> address, String field) {
        if (address == null) return "Unknown";
        return address.getOrDefault(field, "Unknown").toString();
    }
    
    private List<SearchResponseDTO.HotelDTO> generateMockHotels(Destination destination) {
        List<SearchResponseDTO.HotelDTO> mockHotels = new ArrayList<>();
        
        String[] hotelNames = {
            "Grand " + destination.getCity() + " Hotel",
            destination.getCity() + " Plaza",
            "Luxury " + destination.getCity() + " Resort",
            "Budget Inn " + destination.getCity(),
            destination.getCity() + " Business Hotel"
        };
        
        for (int i = 0; i < hotelNames.length; i++) {
            mockHotels.add(SearchResponseDTO.HotelDTO.builder()
                    .id((long) (1000 + i))
                    .name(hotelNames[i])
                    .address("Main Street, " + destination.getCity())
                    .starRating(3 + (i % 3))
                    .pricePerNight(new BigDecimal(80 + (i * 25)))
                    .currency("USD")
                    .averageRating(new BigDecimal(3.5 + (i * 0.3)))
                    .totalReviews(100 + (i * 50))
                    .imageUrls(List.of("https://via.placeholder.com/400x300"))
                    .amenities(List.of("WIFI", "PARKING", "RESTAURANT"))
                    .description("Beautiful hotel in " + destination.getCity())
                    .featured(i == 0)
                    .build());
        }
        
        return mockHotels;
    }
    
    private List<SearchResponseDTO.AttractionDTO> generateMockAttractions(Destination destination) {
        List<SearchResponseDTO.AttractionDTO> mockAttractions = new ArrayList<>();
        
        String[] attractionNames = {
            destination.getCity() + " Museum",
            "Historic " + destination.getCity() + " Square",
            destination.getCity() + " Park",
            "Cultural Center of " + destination.getCity(),
            destination.getCity() + " Viewpoint"
        };
        
        String[] types = {"MUSEUM", "SQUARE", "PARK", "THEATER", "VIEWPOINT"};
        
        for (int i = 0; i < attractionNames.length; i++) {
            mockAttractions.add(SearchResponseDTO.AttractionDTO.builder()
                    .id((long) (2000 + i))
                    .name(attractionNames[i])
                    .address("Tourist District, " + destination.getCity())
                    .type(types[i])
                    .entryFee(i == 0 ? new BigDecimal(15) : null)
                    .freeEntry(i != 0)
                    .currency("USD")
                    .averageRating(new BigDecimal(4.0 + (i * 0.2)))
                    .totalReviews(50 + (i * 25))
                    .imageUrls(List.of("https://via.placeholder.com/400x300"))
                    .matchingInterests(List.of("CULTURE", "HISTORY"))
                    .description("Popular attraction in " + destination.getCity())
                    .openingHours("09:00 - 18:00")
                    .operatingDays("Mon-Sun")
                    .wheelchairAccessible(true)
                    .kidsFriendly(true)
                    .recommendedDurationHours(2)
                    .build());
        }
        
        return mockAttractions;
    }
    
    private List<SearchResponseDTO.TransportOptionDTO> generateMockTransportOptions(String from, String to, String date) {
        List<SearchResponseDTO.TransportOptionDTO> mockOptions = new ArrayList<>();
        
        // Mock flight
        mockOptions.add(SearchResponseDTO.TransportOptionDTO.builder()
                .id("FL001")
                .type("FLIGHT")
                .provider("SkyLine Airways")
                .departureLocation(from)
                .arrivalLocation(to)
                .departureTime("09:00")
                .arrivalTime("11:30")
                .duration("2h 30m")
                .price(new BigDecimal(150))
                .currency("USD")
                .availableSeats(45)
                .rating(new BigDecimal(4.2))
                .amenities(List.of("WiFi", "Meals", "Entertainment"))
                .build());
        
        // Mock train
        mockOptions.add(SearchResponseDTO.TransportOptionDTO.builder()
                .id("TR001")
                .type("TRAIN")
                .provider("National Railways")
                .departureLocation(from)
                .arrivalLocation(to)
                .departureTime("08:15")
                .arrivalTime("12:45")
                .duration("4h 30m")
                .price(new BigDecimal(75))
                .currency("USD")
                .availableSeats(120)
                .rating(new BigDecimal(4.0))
                .amenities(List.of("WiFi", "Cafe", "Power Outlets"))
                .build());
        
        // Mock bus
        mockOptions.add(SearchResponseDTO.TransportOptionDTO.builder()
                .id("BU001")
                .type("BUS")
                .provider("Express Coach Lines")
                .departureLocation(from)
                .arrivalLocation(to)
                .departureTime("07:30")
                .arrivalTime("13:00")
                .duration("5h 30m")
                .price(new BigDecimal(35))
                .currency("USD")
                .availableSeats(25)
                .rating(new BigDecimal(3.8))
                .amenities(List.of("WiFi", "Air Conditioning"))
                .build());
        
        return mockOptions;
    }
}