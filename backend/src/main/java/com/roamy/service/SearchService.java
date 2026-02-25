package com.roamy.service;

import com.roamy.dto.SearchRequestDTO;
import com.roamy.dto.SearchResponseDTO;
import com.roamy.entity.*;
import com.roamy.repository.*;
import com.roamy.external.ExternalAPIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {
    
    private final DestinationRepository destinationRepository;
    private final AttractionRepository attractionRepository;
    private final SearchHistoryRepository searchHistoryRepository;
    private final ExternalAPIService externalAPIService;
    
    public SearchResponseDTO searchPlaces(SearchRequestDTO searchRequest) {
        log.info("Searching places for destination: {}", searchRequest.getToLocation());
        
        long startTime = System.currentTimeMillis();
        
        // Find or create destination
        Destination destination = findOrCreateDestination(searchRequest.getToLocation());
        
        // Get hotels from database and external APIs
        List<SearchResponseDTO.HotelDTO> hotels = getHotelsForSearch(destination, searchRequest);
        
        // Get attractions based on interests
        List<SearchResponseDTO.AttractionDTO> attractions = getAttractionsForSearch(destination, searchRequest.getInterests());
        
        // Get transport options (mock data for now)
        List<SearchResponseDTO.TransportOptionDTO> transportOptions = getTransportOptions(
                searchRequest.getFromLocation(), searchRequest.getToLocation());
        
        // Save search history (if user is authenticated)
        saveSearchHistory(searchRequest);
        
        long searchTime = System.currentTimeMillis() - startTime;
        
        return SearchResponseDTO.builder()
                .destinations(List.of(convertDestinationToDTO(destination)))
                .hotels(hotels)
                .attractions(attractions)
                .transportOptions(transportOptions)
                .metadata(SearchResponseDTO.SearchMetaDataDTO.builder()
                        .totalResults(hotels.size() + attractions.size())
                        .currentPage(searchRequest.getPage())
                        .pageSize(searchRequest.getSize())
                        .sortBy(searchRequest.getSortBy())
                        .sortOrder(searchRequest.getSortOrder())
                        .searchTimeMs(searchTime)
                        .searchId(UUID.randomUUID().toString())
                        .build())
                .build();
    }
    
    @Cacheable("destinations")
    public List<SearchResponseDTO.DestinationDTO> getAllDestinations() {
        log.info("Fetching all active destinations");
        
        return destinationRepository.findByActiveTrue().stream()
                .map(this::convertDestinationToDTO)
                .collect(Collectors.toList());
    }
    
    public List<SearchResponseDTO.DestinationDTO> searchDestinations(String query) {
        log.info("Searching destinations with query: {}", query);
        
        List<Destination> destinations = destinationRepository.searchByNameCityOrCountry(query);
        
        // If no local results, try external API
        if (destinations.isEmpty()) {
            destinations = searchDestinationsFromExternalAPI(query);
        }
        
        return destinations.stream()
                .map(this::convertDestinationToDTO)
                .collect(Collectors.toList());
    }
    
    public List<SearchResponseDTO.HotelDTO> getHotelsByDestination(
            Long destinationId, String sortBy, String sortOrder, Double minPrice, Double maxPrice, Integer minRating) {
        
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new RuntimeException("Destination not found"));
        
        // Hotel repository functionality temporarily disabled
        List<Hotel> hotels = new ArrayList<>(); // hotelRepository.findByDestinationAndAvailableTrue(destination);
        
        // Apply filters
        if (minPrice != null || maxPrice != null) {
            hotels = hotels.stream()
                    .filter(hotel -> {
                        double price = hotel.getPricePerNight().doubleValue();
                        return (minPrice == null || price >= minPrice) && 
                               (maxPrice == null || price <= maxPrice);
                    })
                    .collect(Collectors.toList());
        }
        
        if (minRating != null) {
            hotels = hotels.stream()
                    .filter(hotel -> hotel.getAverageRating() != null && 
                                   hotel.getAverageRating().doubleValue() >= minRating)
                    .collect(Collectors.toList());
        }
        
        // Apply sorting
        if ("price".equals(sortBy)) {
            hotels.sort(Comparator.comparing(Hotel::getPricePerNight));
            if ("desc".equals(sortOrder)) {
                Collections.reverse(hotels);
            }
        } else if ("rating".equals(sortBy)) {
            hotels.sort((h1, h2) -> {
                if (h1.getAverageRating() == null) return 1;
                if (h2.getAverageRating() == null) return -1;
                return h2.getAverageRating().compareTo(h1.getAverageRating());
            });
            if ("asc".equals(sortOrder)) {
                Collections.reverse(hotels);
            }
        }
        
        return hotels.stream()
                .map(this::convertHotelToDTO)
                .collect(Collectors.toList());
    }
    
    public List<SearchResponseDTO.AttractionDTO> getAttractionsByDestination(Long destinationId, List<String> interests) {
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new RuntimeException("Destination not found"));
        
        List<Attraction> attractions;
        
        if (interests != null && !interests.isEmpty()) {
            List<User.TravelInterest> travelInterests = interests.stream()
                    .map(User.TravelInterest::valueOf)
                    .collect(Collectors.toList());
            attractions = attractionRepository.findByDestinationAndInterests(destination, travelInterests);
        } else {
            attractions = attractionRepository.findByDestinationAndActiveTrue(destination);
        }
        
        return attractions.stream()
                .map(this::convertAttractionToDTO)
                .collect(Collectors.toList());
    }
    
    public List<SearchResponseDTO.TransportOptionDTO> searchTransport(String from, String to, String date, List<String> transportTypes) {
        log.info("Searching transport from {} to {} on {}", from, to, date);
        
        // For now, return mock data - in production this would call real transport APIs
        return externalAPIService.getTransportOptions(from, to, date, transportTypes);
    }
    
    public SearchResponseDTO getRecommendations(String destination, List<String> interests, String budgetLevel) {
        log.info("Getting recommendations for destination: {}", destination);
        
        Destination dest = destinationRepository.findByNameIgnoreCase(destination)
                .orElseGet(() -> findOrCreateDestination(destination));
        
        List<SearchResponseDTO.HotelDTO> recommendedHotels = getRecommendedHotels(dest, budgetLevel);
        List<SearchResponseDTO.AttractionDTO> recommendedAttractions = getRecommendedAttractions(dest, interests);
        
        return SearchResponseDTO.builder()
                .destinations(List.of(convertDestinationToDTO(dest)))
                .hotels(recommendedHotels)
                .attractions(recommendedAttractions)
                .transportOptions(new ArrayList<>())
                .build();
    }
    
    @Cacheable("trendingDestinations")
    public List<SearchResponseDTO.DestinationDTO> getTrendingDestinations() {
        log.info("Fetching trending destinations");
        
        // Get destinations based on recent search history
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        List<Object[]> trendingData = searchHistoryRepository.getTrendingDestinations(oneWeekAgo);
        
        List<SearchResponseDTO.DestinationDTO> trendingDestinations = new ArrayList<>();
        
        for (Object[] data : trendingData) {
            String destinationName = (String) data[0];
            destinationRepository.findByNameIgnoreCase(destinationName)
                    .ifPresent(dest -> trendingDestinations.add(convertDestinationToDTO(dest)));
            
            if (trendingDestinations.size() >= 10) break; // Limit to top 10
        }
        
        // If no trending data found (e.g., new app with no search history), return popular destinations
        if (trendingDestinations.isEmpty()) {
            log.info("No search history found, returning default trending destinations");
            String[] defaultTrendingNames = {"Goa", "Paris", "Tokyo", "New Delhi", "Mumbai", "Dubai"};
            
            for (String name : defaultTrendingNames) {
                destinationRepository.findByNameIgnoreCase(name)
                        .ifPresent(dest -> trendingDestinations.add(convertDestinationToDTO(dest)));
                
                if (trendingDestinations.size() >= 6) break; // Limit to top 6 for default
            }
        }
        
        return trendingDestinations;
    }
    
    // Private helper methods
    
    private Destination findOrCreateDestination(String locationName) {
        return destinationRepository.findByNameIgnoreCase(locationName)
                .orElseGet(() -> {
                    // Try to get destination info from external API
                    Optional<Destination> externalDestination = externalAPIService.getDestinationInfo(locationName);
                    if (externalDestination.isPresent()) {
                        return destinationRepository.save(externalDestination.get());
                    }
                    
                    // Create a basic destination entry
                    return destinationRepository.save(Destination.builder()
                            .name(locationName)
                            .city(locationName)
                            .country("Unknown")
                            .active(true)
                            .build());
                });
    }
    
    private List<SearchResponseDTO.HotelDTO> getHotelsForSearch(Destination destination, SearchRequestDTO searchRequest) {
        // Hotel repository functionality temporarily disabled
        List<Hotel> localHotels = new ArrayList<>(); // hotelRepository.findByDestinationAndAvailableTrue(destination);
        List<SearchResponseDTO.HotelDTO> hotelDTOs = localHotels.stream()
                .map(this::convertHotelToDTO)
                .collect(Collectors.toList());
        
        // Get additional hotels from external APIs
        List<SearchResponseDTO.HotelDTO> externalHotels = externalAPIService.searchHotels(destination, searchRequest);
        hotelDTOs.addAll(externalHotels);
        
        return hotelDTOs;
    }
    
    private List<SearchResponseDTO.AttractionDTO> getAttractionsForSearch(Destination destination, List<User.TravelInterest> interests) {
        List<Attraction> localAttractions;
        
        if (interests != null && !interests.isEmpty()) {
            localAttractions = attractionRepository.findByDestinationAndInterests(destination, interests);
        } else {
            localAttractions = attractionRepository.findByDestinationAndActiveTrue(destination);
        }
        
        List<SearchResponseDTO.AttractionDTO> attractionDTOs = localAttractions.stream()
                .map(this::convertAttractionToDTO)
                .collect(Collectors.toList());
        
        // Get additional attractions from external APIs
        List<SearchResponseDTO.AttractionDTO> externalAttractions = externalAPIService.searchAttractions(destination, interests);
        attractionDTOs.addAll(externalAttractions);
        
        return attractionDTOs;
    }
    
    private List<SearchResponseDTO.TransportOptionDTO> getTransportOptions(String from, String to) {
        return externalAPIService.getTransportOptions(from, to, null, null);
    }
    
    private void saveSearchHistory(SearchRequestDTO searchRequest) {
        // This would save search history for authenticated users
        // Implementation depends on security context
    }
    
    private List<Destination> searchDestinationsFromExternalAPI(String query) {
        return externalAPIService.searchDestinations(query);
    }
    
    private List<SearchResponseDTO.HotelDTO> getRecommendedHotels(Destination destination, String budgetLevel) {
        // Hotel repository functionality temporarily disabled
        List<Hotel> hotels = new ArrayList<>(); // hotelRepository.findByDestinationOrderByRating(destination);
        
        // Filter by budget level
        if ("budget".equals(budgetLevel)) {
            hotels = hotels.stream()
                    .sorted(Comparator.comparing(Hotel::getPricePerNight))
                    .limit(5)
                    .collect(Collectors.toList());
        } else if ("luxury".equals(budgetLevel)) {
            hotels = hotels.stream()
                    .filter(h -> h.getStarRating() != null && h.getStarRating().getValue() >= 4)
                    .limit(5)
                    .collect(Collectors.toList());
        } else {
            hotels = hotels.stream().limit(5).collect(Collectors.toList());
        }
        
        return hotels.stream()
                .map(this::convertHotelToDTO)
                .collect(Collectors.toList());
    }
    
    private List<SearchResponseDTO.AttractionDTO> getRecommendedAttractions(Destination destination, List<String> interests) {
        List<Attraction> attractions = attractionRepository.findByDestinationOrderByPopularity(destination)
                .stream()
                .limit(10)
                .collect(Collectors.toList());
        
        return attractions.stream()
                .map(this::convertAttractionToDTO)
                .collect(Collectors.toList());
    }
    
    // DTO Conversion methods
    
    private SearchResponseDTO.DestinationDTO convertDestinationToDTO(Destination destination) {
        return SearchResponseDTO.DestinationDTO.builder()
                .id(destination.getId())
                .name(destination.getName())
                .city(destination.getCity())
                .country(destination.getCountry())
                .countryCode(destination.getCountryCode())
                .latitude(destination.getLatitude())
                .longitude(destination.getLongitude())
                .description(destination.getDescription())
                .imageUrl(destination.getImageUrl())
                .popularInterests(destination.getPopularInterests().stream()
                        .map(Enum::name).collect(Collectors.toList()))
                .averageRating(destination.getAverageRating())
                .totalReviews(destination.getTotalReviews())
                .timeZone(destination.getTimeZone())
                .climate(destination.getClimate())
                .bestTimeToVisit(destination.getBestTimeToVisit())
                .pricing(SearchResponseDTO.PricingDTO.builder()
                        .budgetDailyCost(destination.getBudgetDailyCost())
                        .midRangeDailyCost(destination.getMidRangeDailyCost())
                        .luxuryDailyCost(destination.getLuxuryDailyCost())
                        .currency("USD")
                        .build())
                .build();
    }
    
    private SearchResponseDTO.HotelDTO convertHotelToDTO(Hotel hotel) {
        return SearchResponseDTO.HotelDTO.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .address(hotel.getAddress())
                .latitude(hotel.getLatitude())
                .longitude(hotel.getLongitude())
                .description(hotel.getDescription())
                .imageUrls(hotel.getImageUrls())
                .starRating(hotel.getStarRating() != null ? hotel.getStarRating().getValue() : null)
                .amenities(hotel.getAmenities().stream()
                        .map(Enum::name).collect(Collectors.toList()))
                .pricePerNight(hotel.getPricePerNight())
                .currency(hotel.getCurrency())
                .averageRating(hotel.getAverageRating())
                .totalReviews(hotel.getTotalReviews())
                .phoneNumber(hotel.getPhoneNumber())
                .website(hotel.getWebsite())
                .featured(hotel.getFeatured())
                .destination(convertDestinationToDTO(hotel.getDestination()))
                .build();
    }
    
    private SearchResponseDTO.AttractionDTO convertAttractionToDTO(Attraction attraction) {
        return SearchResponseDTO.AttractionDTO.builder()
                .id(attraction.getId())
                .name(attraction.getName())
                .description(attraction.getDescription())
                .address(attraction.getAddress())
                .latitude(attraction.getLatitude())
                .longitude(attraction.getLongitude())
                .type(attraction.getType() != null ? attraction.getType().name() : null)
                .matchingInterests(attraction.getMatchingInterests().stream()
                        .map(Enum::name).collect(Collectors.toList()))
                .imageUrls(attraction.getImageUrls())
                .entryFee(attraction.getEntryFee())
                .currency(attraction.getCurrency())
                .freeEntry(attraction.getFreeEntry())
                .openingHours(attraction.getOpeningHours())
                .operatingDays(attraction.getOperatingDays())
                .averageRating(attraction.getAverageRating())
                .totalReviews(attraction.getTotalReviews())
                .wheelchairAccessible(attraction.getWheelchairAccessible())
                .kidsFriendly(attraction.getKidsFriendly())
                .recommendedDurationHours(attraction.getRecommendedDurationHours())
                .bestTimeToVisit(attraction.getBestTimeToVisit())
                .build();
    }
}