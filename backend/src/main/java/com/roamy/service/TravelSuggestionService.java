package com.roamy.service;

import com.roamy.dto.TravelSuggestionRequestDTO;
import com.roamy.dto.TravelSuggestionResponseDTO;
import com.roamy.entity.*;
import com.roamy.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TravelSuggestionService {
    
    private final DestinationRepository destinationRepository;
    private final AttractionRepository attractionRepository;
    private final HotelRepository hotelRepository;
    
    @SuppressWarnings("unused") // Will be used in future search functionality
    private final SearchService searchService;
    
    // Budget multipliers for different categories - will be used in enhanced budget calculations
    @SuppressWarnings("unused")
    private static final Map<String, BigDecimal> BUDGET_MULTIPLIERS = Map.of(
            "budget", BigDecimal.valueOf(1.0),
            "mid-range", BigDecimal.valueOf(2.5),
            "luxury", BigDecimal.valueOf(5.0)
    );
    
    public TravelSuggestionResponseDTO getComprehensiveSuggestions(TravelSuggestionRequestDTO request) {
        log.info("Generating comprehensive travel suggestions for: {}", request.getToLocation());
        
        long startTime = System.currentTimeMillis();
        
        // Find or create destination
        Destination destination = findDestination(request.getToLocation());
        
        // Generate all suggestion components
        TravelSuggestionResponseDTO.DestinationOverviewDTO overview = generateDestinationOverview(destination);
        List<TravelSuggestionResponseDTO.SuggestedAttractionDTO> attractions = generateAttractionSuggestions(destination, request);
        List<TravelSuggestionResponseDTO.SuggestedAccommodationDTO> accommodations = generateAccommodationSuggestions(destination, request);
        List<TravelSuggestionResponseDTO.SuggestedTransportDTO> transport = generateTransportSuggestions(request);
        TravelSuggestionResponseDTO.TravelBudgetBreakdownDTO budget = generateBudgetBreakdown(request, destination);
        List<TravelSuggestionResponseDTO.TravelItineraryDayDTO> itinerary = generateItinerary(request, attractions, accommodations);
        TravelSuggestionResponseDTO.TravelTipsDTO tips = generateTravelTips(destination, request);
        
        long processingTime = System.currentTimeMillis() - startTime;
        
        return TravelSuggestionResponseDTO.builder()
                .destinationOverview(overview)
                .suggestedAttractions(attractions)
                .suggestedAccommodations(accommodations)
                .suggestedTransportOptions(transport)
                .budgetBreakdown(budget)
                .suggestedItinerary(itinerary)
                .travelTips(tips)
                .metadata(TravelSuggestionResponseDTO.SuggestionMetadataDTO.builder()
                        .requestId(UUID.randomUUID().toString())
                        .processingTimeMs(processingTime)
                        .suggestionAlgorithm("comprehensive-v1")
                        .totalSuggestions(attractions.size() + accommodations.size() + transport.size())
                        .lastUpdated(new Date().toString())
                        .dataFreshness("real-time")
                        .dataSources(Arrays.asList("internal-db", "external-apis"))
                        .personalizedScore("85%")
                        .build())
                .build();
    }
    
    public TravelSuggestionResponseDTO getDestinationSpecificSuggestions(TravelSuggestionRequestDTO request) {
        log.info("Generating destination-specific suggestions for: {}", request.getToLocation());
        
        // Similar to comprehensive but focused only on destination activities
        return getComprehensiveSuggestions(request);
    }
    
    public TravelSuggestionResponseDTO generateTravelItinerary(TravelSuggestionRequestDTO request) {
        log.info("Generating detailed itinerary for {} days", request.getDurationDays());
        
        TravelSuggestionResponseDTO comprehensive = getComprehensiveSuggestions(request);
        
        // Enhanced itinerary generation with day-by-day planning
        List<TravelSuggestionResponseDTO.TravelItineraryDayDTO> detailedItinerary = 
                generateDetailedItinerary(request, comprehensive.getSuggestedAttractions(), 
                        comprehensive.getSuggestedAccommodations());
        
        return TravelSuggestionResponseDTO.builder()
                .destinationOverview(comprehensive.getDestinationOverview())
                .suggestedAttractions(comprehensive.getSuggestedAttractions())
                .suggestedAccommodations(comprehensive.getSuggestedAccommodations())
                .suggestedTransportOptions(comprehensive.getSuggestedTransportOptions())
                .budgetBreakdown(comprehensive.getBudgetBreakdown())
                .suggestedItinerary(detailedItinerary)
                .travelTips(comprehensive.getTravelTips())
                .metadata(comprehensive.getMetadata())
                .build();
    }
    
    private Destination findDestination(String locationName) {
        try {
            log.info("Searching for destination: {}", locationName);
            
            // First try exact match (case insensitive)
            Optional<Destination> existing = destinationRepository.findByNameIgnoreCase(locationName);
            if (existing.isPresent()) {
                Destination dest = existing.get();
                log.info("Found exact match for destination: {} (ID: {})", dest.getName(), dest.getId());
                return dest;
            }
            
            // Try partial match on city or country
            List<Destination> searchResults = destinationRepository.searchByNameCityOrCountry(locationName);
            if (!searchResults.isEmpty()) {
                Destination dest = searchResults.get(0);
                log.info("Found partial match for destination: {} -> {} (ID: {})", locationName, dest.getName(), dest.getId());
                return dest; // Return first match
            }
            
            // Try case-sensitive exact name match as fallback
            List<Destination> allDestinations = destinationRepository.findAll();
            log.info("Total destinations in database: {}", allDestinations.size());
            
            for (Destination dest : allDestinations) {
                if (dest.getName().equalsIgnoreCase(locationName) || 
                    dest.getCity().equalsIgnoreCase(locationName)) {
                    log.info("Found case-insensitive match: {} -> {} (ID: {})", locationName, dest.getName(), dest.getId());
                    return dest;
                }
            }
            
            log.warn("No existing destination found for: {}, will return fallback", locationName);
            // Return fallback destination instead of creating new one
            return createMinimalDestination(locationName);
            
        } catch (Exception e) {
            log.warn("Error finding destination '{}': {}", locationName, e.getMessage());
            
            // Fallback: try to find any existing destination or return a default
            try {
                List<Destination> allDestinations = destinationRepository.findByActiveTrue();
                if (!allDestinations.isEmpty()) {
                    // Try to find a destination that matches by name or city
                    for (Destination dest : allDestinations) {
                        if (dest.getName().toLowerCase().contains(locationName.toLowerCase()) ||
                            dest.getCity().toLowerCase().contains(locationName.toLowerCase())) {
                            log.info("Found fallback destination match: {} for search: {}", dest.getName(), locationName);
                            return dest;
                        }
                    }
                    // If no match found, return first active destination as fallback
                    log.info("Using first active destination as fallback: {}", allDestinations.get(0).getName());
                    return allDestinations.get(0);
                }
            } catch (Exception fallbackEx) {
                log.error("Fallback destination lookup failed", fallbackEx);
            }
            
            // Last resort: create minimal destination without saving to DB
            return createMinimalDestination(locationName);
        }
    }
    
    private Destination createNewDestination(String locationName) {
        try {
            Destination newDestination = Destination.builder()
                    .name(locationName)
                    .city(locationName)
                    .country("Unknown")
                    .description("Exciting destination with lots to explore")
                    .active(true)
                    .averageRating(BigDecimal.valueOf(4.2))
                    .totalReviews(0)
                    .budgetDailyCost(BigDecimal.valueOf(50))
                    .midRangeDailyCost(BigDecimal.valueOf(125))
                    .luxuryDailyCost(BigDecimal.valueOf(250))
                    .build();
            return destinationRepository.save(newDestination);
        } catch (Exception e) {
            log.error("Failed to create new destination: {}", e.getMessage());
            return createMinimalDestination(locationName);
        }
    }
    
    private Destination createMinimalDestination(String locationName) {
        // Create a minimal destination without saving to DB (for fallback)
        return Destination.builder()
                .id(-1L) // Use negative ID to avoid conflicts
                .name(locationName)
                .city(locationName)
                .country("Unknown")
                .description("Destination information")
                .active(true)
                .averageRating(BigDecimal.valueOf(4.0))
                .totalReviews(0)
                .budgetDailyCost(BigDecimal.valueOf(50))
                .midRangeDailyCost(BigDecimal.valueOf(125))
                .luxuryDailyCost(BigDecimal.valueOf(250))
                .popularInterests(new ArrayList<>())
                .build();
    }
    
    private TravelSuggestionResponseDTO.DestinationOverviewDTO generateDestinationOverview(Destination destination) {
        Map<String, Object> quickFacts = new HashMap<>();
        quickFacts.put("population", getDestinationPopulation(destination));
        quickFacts.put("area", getDestinationArea(destination));
        quickFacts.put("founded", getDestinationFounded(destination));
        quickFacts.put("elevation", getDestinationElevation(destination));
        
        // Handle potential null popularInterests
        List<String> topInterests = new ArrayList<>();
        if (destination.getPopularInterests() != null) {
            topInterests = destination.getPopularInterests().stream()
                    .map(Enum::name)
                    .collect(Collectors.toList());
        } else {
            topInterests = Arrays.asList("CULTURE", "SIGHTSEEING", "FOOD"); // Default interests
        }
        
        return TravelSuggestionResponseDTO.DestinationOverviewDTO.builder()
                .name(destination.getName())
                .country(destination.getCountry())
                .region(destination.getCity())
                .description(destination.getDescription() != null ? destination.getDescription() : 
                        "A beautiful destination offering rich culture, stunning landscapes, and unforgettable experiences.")
                .highlights(generateDestinationHighlights(destination))
                .bestTimeToVisit(destination.getBestTimeToVisit() != null ? destination.getBestTimeToVisit() : 
                        "Year-round destination with seasonal variations")
                .climate(destination.getClimate() != null ? destination.getClimate() : "Temperate climate")
                .timeZone(destination.getTimeZone() != null ? destination.getTimeZone() : "Local time zone")
                .currency("USD")
                .languages(Arrays.asList("English", "Local Language"))
                .safetyRating("Generally Safe")
                .averageRating(destination.getAverageRating() != null ? destination.getAverageRating() : BigDecimal.valueOf(4.2))
                .imageUrl(destination.getImageUrl() != null ? destination.getImageUrl() : "/api/images/default-destination.jpg")
                .topInterests(topInterests)
                .quickFacts(quickFacts)
                .build();
    }
    
    private List<TravelSuggestionResponseDTO.SuggestedAttractionDTO> generateAttractionSuggestions(
            Destination destination, TravelSuggestionRequestDTO request) {
        
        List<Attraction> attractions = new ArrayList<>();
        
        // Only query database if destination has a valid ID (was persisted)
        if (destination.getId() != null && destination.getId() > 0) {
            try {
                attractions = attractionRepository.findByDestinationAndActiveTrue(destination);
                
                // Filter by interests if provided
                if (request.getInterests() != null && !request.getInterests().isEmpty()) {
                    List<User.TravelInterest> interests = request.getInterests().stream()
                            .map(interest -> {
                                try {
                                    return User.TravelInterest.valueOf(interest.toUpperCase());
                                } catch (IllegalArgumentException e) {
                                    return null;
                                }
                            })
                            .filter(Objects::nonNull)
                            .collect(Collectors.toList());
                    
                    if (!interests.isEmpty()) {
                        attractions = attractionRepository.findByDestinationAndInterests(destination, interests);
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to load attractions from database for destination: {}", destination.getName());
                attractions = new ArrayList<>();
            }
        }
        
        List<TravelSuggestionResponseDTO.SuggestedAttractionDTO> suggestions = attractions.stream()
                .map(attraction -> createAttractionSuggestion(attraction, request))
                .collect(Collectors.toList());
        
        // Always add sample attractions if database results are empty or unavailable
        if (suggestions.isEmpty()) {
            suggestions = generateSampleAttractions(destination, request);
        }
        
        // Sort by priority score
        return suggestions.stream()
                .sorted((a, b) -> Integer.compare(b.getPriorityScore(), a.getPriorityScore()))
                .collect(Collectors.toList());
    }
    
    private TravelSuggestionResponseDTO.SuggestedAttractionDTO createAttractionSuggestion(
            Attraction attraction, TravelSuggestionRequestDTO request) {
        
        String priceRange = calculateAttractionPriceRange(attraction, request.getBudgetLevel());
        int priorityScore = calculateAttractionPriority(attraction, request);
        
        Map<String, String> practicalInfo = new HashMap<>();
        practicalInfo.put("address", attraction.getAddress());
        practicalInfo.put("openingHours", attraction.getOpeningHours());
        practicalInfo.put("bestTimeToVisit", attraction.getBestTimeToVisit());
        practicalInfo.put("duration", attraction.getRecommendedDurationHours() + " hours");
        
        return TravelSuggestionResponseDTO.SuggestedAttractionDTO.builder()
                .name(attraction.getName())
                .type(attraction.getType() != null ? attraction.getType().name() : "ATTRACTION")
                .category(determineAttractionCategory(attraction, priorityScore))
                .description(attraction.getDescription())
                .matchingInterests(attraction.getMatchingInterests().stream().map(Enum::name).collect(Collectors.toList()))
                .rating(attraction.getAverageRating() != null ? attraction.getAverageRating() : BigDecimal.valueOf(4.0))
                .priceRange(priceRange)
                .estimatedCost(attraction.getEntryFee() != null ? attraction.getEntryFee() : BigDecimal.ZERO)
                .duration(attraction.getRecommendedDurationHours() + " hours")
                .bestTimeToVisit(attraction.getBestTimeToVisit())
                .difficulty("Easy")
                .wheelchairAccessible(attraction.getWheelchairAccessible() != null ? attraction.getWheelchairAccessible() : false)
                .familyFriendly(attraction.getKidsFriendly() != null ? attraction.getKidsFriendly() : true)
                .bookingRequired(attraction.getFreeEntry() != null && !attraction.getFreeEntry() ? "Recommended" : "Not Required")
                .location(attraction.getAddress())
                .imageUrls(attraction.getImageUrls() != null ? attraction.getImageUrls() : Arrays.asList("/api/images/default-attraction.jpg"))
                .practicalInfo(practicalInfo)
                .priorityScore(priorityScore)
                .build();
    }
    
    private List<TravelSuggestionResponseDTO.SuggestedAccommodationDTO> generateAccommodationSuggestions(
            Destination destination, TravelSuggestionRequestDTO request) {
        
        List<Hotel> hotels = new ArrayList<>();
        
        log.info("Looking up hotels for destination: {} (ID: {})", destination.getName(), destination.getId());
        
        // Query database for hotels by destination
        if (destination.getId() != null && destination.getId() > 0) {
            try {
                // Try multiple methods to find hotels
                hotels = hotelRepository.findByDestinationOrderByRatingAndPrice(destination.getId());
                log.info("Found {} hotels using findByDestinationOrderByRatingAndPrice for destination: {}", hotels.size(), destination.getName());
                
                // If no results, try simpler query
                if (hotels.isEmpty()) {
                    hotels = hotelRepository.findByDestination_Id(destination.getId());
                    log.info("Found {} hotels using findByDestination_Id for destination: {}", hotels.size(), destination.getName());
                }
                
                // If still no results, try finding all hotels and filter by destination name
                if (hotels.isEmpty()) {
                    log.warn("No hotels found by destination ID, trying name-based search for: {}", destination.getName());
                    List<Hotel> allHotels = hotelRepository.findAll();
                    log.info("Total hotels in database: {}", allHotels.size());
                    
                    // Log some sample hotels for debugging
                    if (!allHotels.isEmpty()) {
                        log.info("Sample hotels: {}", allHotels.stream().limit(3)
                            .map(h -> h.getName() + " (dest: " + (h.getDestination() != null ? h.getDestination().getName() : "null") + ")")
                            .collect(Collectors.toList()));
                    }
                }
                
            } catch (Exception e) {
                log.error("Failed to load hotels from database for destination: {} - Error: {}", destination.getName(), e.getMessage(), e);
                hotels = new ArrayList<>();
            }
        } else {
            log.warn("Invalid destination ID for {}: {}", destination.getName(), destination.getId());
        }
        
        // Filter by budget and preferences
        String budgetLevel = request.getBudgetLevel() != null ? request.getBudgetLevel() : "mid-range";
        
        List<TravelSuggestionResponseDTO.SuggestedAccommodationDTO> suggestions = hotels.stream()
                .filter(hotel -> hotel.getAvailable() != null ? hotel.getAvailable() : true) // Only available hotels
                .map(hotel -> createAccommodationSuggestion(hotel, request, budgetLevel))
                .collect(Collectors.toList());
        
        log.info("Generated {} accommodation suggestions from {} hotels for destination: {}", 
                suggestions.size(), hotels.size(), destination.getName());
        
        // Sort by priority score and budget compatibility
        return suggestions.stream()
                .sorted((a, b) -> Integer.compare(b.getPriorityScore(), a.getPriorityScore()))
                .collect(Collectors.toList());
    }
    
    private TravelSuggestionResponseDTO.SuggestedAccommodationDTO createAccommodationSuggestion(
            Hotel hotel, TravelSuggestionRequestDTO request, String budgetLevel) {
        
        BigDecimal pricePerNight = hotel.getPricePerNight();
        BigDecimal totalCost = pricePerNight.multiply(BigDecimal.valueOf(request.getDurationDays()));
        String priceRange = categorizeAccommodationPrice(pricePerNight, budgetLevel);
        int priorityScore = calculateAccommodationPriority(hotel, request);
        
        Map<String, String> policies = new HashMap<>();
        policies.put("checkIn", "3:00 PM");
        policies.put("checkOut", "11:00 AM");
        policies.put("cancellation", "Free cancellation up to 24 hours before check-in");
        policies.put("pets", "Pet policy varies by property");
        
        return TravelSuggestionResponseDTO.SuggestedAccommodationDTO.builder()
                .id(hotel.getId()) // Include hotel ID for booking
                .name(hotel.getName())
                .type("Hotel")
                .category(priceRange)
                .description(hotel.getDescription())
                .location(hotel.getAddress())
                .pricePerNight(pricePerNight)
                .totalEstimatedCost(totalCost)
                .priceRange(priceRange)
                .rating(hotel.getAverageRating() != null ? hotel.getAverageRating() : BigDecimal.valueOf(4.0))
                .starRating(hotel.getStarRating() != null ? hotel.getStarRating().getValue() : 3)
                .amenities(hotel.getAmenities().stream().map(Enum::name).collect(Collectors.toList()))
                .nearbyAttractions(Arrays.asList("Main attractions within walking distance"))
                .bookingUrl("https://booking.example.com/hotel/" + hotel.getId())
                .breakfastIncluded(hotel.getAmenities().contains(Hotel.Amenity.BREAKFAST_INCLUDED))
                .freeWifi(hotel.getAmenities().contains(Hotel.Amenity.WIFI))
                .freeCancellation(true)
                .checkInTime("3:00 PM")
                .checkOutTime("11:00 AM")
                .imageUrls(hotel.getImageUrls() != null ? hotel.getImageUrls() : Arrays.asList("/api/images/default-hotel.jpg"))
                .policies(policies)
                .priorityScore(priorityScore)
                .build();
    }
    
    private List<TravelSuggestionResponseDTO.SuggestedTransportDTO> generateTransportSuggestions(
            TravelSuggestionRequestDTO request) {
        
        List<TravelSuggestionResponseDTO.SuggestedTransportDTO> suggestions = new ArrayList<>();
        
        if (request.getFromLocation() != null) {
            // International transport suggestions
            suggestions.add(createFlightSuggestion(request));
            suggestions.add(createTrainSuggestion(request));
        }
        
        // Local transport suggestions
        suggestions.addAll(createLocalTransportSuggestions(request));
        
        return suggestions.stream()
                .sorted((a, b) -> Integer.compare(b.getPriorityScore(), a.getPriorityScore()))
                .collect(Collectors.toList());
    }
    
    private TravelSuggestionResponseDTO.TravelBudgetBreakdownDTO generateBudgetBreakdown(
            TravelSuggestionRequestDTO request, Destination destination) {
        
        String budgetLevel = request.getBudgetLevel() != null ? request.getBudgetLevel() : "mid-range";
    // Remove unused multiplier calculation or use it
    // BigDecimal multiplier = BUDGET_MULTIPLIERS.getOrDefault(budgetLevel, BigDecimal.valueOf(2.5));
        
        // Base costs per day
        BigDecimal baseAccommodation = BigDecimal.valueOf(50);
        BigDecimal baseTransport = BigDecimal.valueOf(30);
        BigDecimal baseActivities = BigDecimal.valueOf(40);
        BigDecimal baseMeals = BigDecimal.valueOf(35);
        BigDecimal baseShopping = BigDecimal.valueOf(25);
        BigDecimal baseMisc = BigDecimal.valueOf(20);
        
        TravelSuggestionResponseDTO.BudgetCategoryDTO accommodation = createBudgetCategory(
                "Accommodation", baseAccommodation, "Hotels, hostels, and alternative lodging");
        TravelSuggestionResponseDTO.BudgetCategoryDTO transport = createBudgetCategory(
                "Transport", baseTransport, "Flights, local transport, and transfers");
        TravelSuggestionResponseDTO.BudgetCategoryDTO activities = createBudgetCategory(
                "Activities", baseActivities, "Attractions, tours, and experiences");
        TravelSuggestionResponseDTO.BudgetCategoryDTO meals = createBudgetCategory(
                "Meals", baseMeals, "Restaurants, street food, and groceries");
        TravelSuggestionResponseDTO.BudgetCategoryDTO shopping = createBudgetCategory(
                "Shopping", baseShopping, "Souvenirs and local products");
        TravelSuggestionResponseDTO.BudgetCategoryDTO miscellaneous = createBudgetCategory(
                "Miscellaneous", baseMisc, "Tips, emergency fund, and extras");
        
        // Calculate totals
        BigDecimal dailyBudget = baseAccommodation.add(baseTransport).add(baseActivities)
                .add(baseMeals).add(baseShopping).add(baseMisc);
        BigDecimal dailyMidRange = dailyBudget.multiply(BigDecimal.valueOf(2.5));
        BigDecimal dailyLuxury = dailyBudget.multiply(BigDecimal.valueOf(5.0));
        
        int days = request.getDurationDays();
        
        TravelSuggestionResponseDTO.BudgetSummaryDTO summary = TravelSuggestionResponseDTO.BudgetSummaryDTO.builder()
                .budgetTotal(dailyBudget.multiply(BigDecimal.valueOf(days)))
                .midRangeTotal(dailyMidRange.multiply(BigDecimal.valueOf(days)))
                .luxuryTotal(dailyLuxury.multiply(BigDecimal.valueOf(days)))
                .recommendedTotal(dailyMidRange.multiply(BigDecimal.valueOf(days)))
                .budgetLevel(budgetLevel)
                .durationDays(days)
                .perPersonPerDay(dailyMidRange)
                .build();
        
        List<TravelSuggestionResponseDTO.BudgetTipDTO> tips = generateBudgetTips();
        
        return TravelSuggestionResponseDTO.TravelBudgetBreakdownDTO.builder()
                .currency(request.getCurrency())
                .accommodation(accommodation)
                .transport(transport)
                .activities(activities)
                .meals(meals)
                .shopping(shopping)
                .miscellaneous(miscellaneous)
                .totalBudget(summary)
                .budgetTips(tips)
                .build();
    }
    
    private List<TravelSuggestionResponseDTO.TravelItineraryDayDTO> generateItinerary(
            TravelSuggestionRequestDTO request,
            List<TravelSuggestionResponseDTO.SuggestedAttractionDTO> attractions,
            List<TravelSuggestionResponseDTO.SuggestedAccommodationDTO> accommodations) {
        
        List<TravelSuggestionResponseDTO.TravelItineraryDayDTO> itinerary = new ArrayList<>();
        
        for (int day = 1; day <= request.getDurationDays(); day++) {
            itinerary.add(generateDayItinerary(day, attractions, request));
        }
        
        return itinerary;
    }
    
    private List<TravelSuggestionResponseDTO.TravelItineraryDayDTO> generateDetailedItinerary(
            TravelSuggestionRequestDTO request,
            List<TravelSuggestionResponseDTO.SuggestedAttractionDTO> attractions,
            List<TravelSuggestionResponseDTO.SuggestedAccommodationDTO> accommodations) {
        
        return generateItinerary(request, attractions, accommodations);
    }
    
    private TravelSuggestionResponseDTO.TravelTipsDTO generateTravelTips(
            Destination destination, TravelSuggestionRequestDTO request) {
        
        Map<String, String> emergencyInfo = new HashMap<>();
        emergencyInfo.put("emergency", "911");
        emergencyInfo.put("police", "Police: 100");
        emergencyInfo.put("medical", "Medical: 102");
        emergencyInfo.put("tourism", "Tourism Helpline: 1363");
        
        return TravelSuggestionResponseDTO.TravelTipsDTO.builder()
                .generalTips(Arrays.asList(
                        "Book accommodations in advance for better rates",
                        "Learn basic local phrases",
                        "Keep copies of important documents",
                        "Research local customs and etiquette"
                ))
                .culturalTips(Arrays.asList(
                        "Respect local customs and traditions",
                        "Dress appropriately for religious sites",
                        "Learn about tipping culture",
                        "Be mindful of photography restrictions"
                ))
                .safetyTips(Arrays.asList(
                        "Stay aware of your surroundings",
                        "Keep emergency contacts handy",
                        "Use registered transportation services",
                        "Avoid displaying expensive items"
                ))
                .budgetTips(Arrays.asList(
                        "Eat at local restaurants for authentic and affordable meals",
                        "Use public transportation when safe and available",
                        "Look for free walking tours and activities",
                        "Book tours and activities online for better deals"
                ))
                .packingTips(Arrays.asList(
                        "Pack light and versatile clothing",
                        "Bring comfortable walking shoes",
                        "Pack weather-appropriate items",
                        "Don't forget chargers and adapters"
                ))
                .localCustoms(Arrays.asList(
                        "Greeting customs vary by region",
                        "Tipping practices differ globally",
                        "Business hours may vary",
                        "Religious and cultural holidays affect schedules"
                ))
                .emergencyInfo(emergencyInfo)
                .usefulApps(Arrays.asList(
                        "Google Translate",
                        "Maps.me (offline maps)",
                        "TripAdvisor",
                        "Local transportation apps"
                ))
                .commonPhrases(Arrays.asList(
                        "Hello / Hi",
                        "Thank you",
                        "Please",
                        "Excuse me / Sorry"
                ))
                .build();
    }
    
    // Helper methods for generating sample data when database is empty
    
    private List<String> generateDestinationHighlights(Destination destination) {
        return Arrays.asList(
                "Rich cultural heritage and history",
                "Stunning natural landscapes",
                "Delicious local cuisine",
                "Friendly local people",
                "Unique attractions and experiences"
        );
    }
    
    private String getDestinationPopulation(Destination destination) {
        return "Population varies by region";
    }
    
    private String getDestinationArea(Destination destination) {
        return "Area information available locally";
    }
    
    private String getDestinationFounded(Destination destination) {
        return "Rich historical background";
    }
    
    private String getDestinationElevation(Destination destination) {
        return "Elevation varies by location";
    }
    
    private List<TravelSuggestionResponseDTO.SuggestedAttractionDTO> generateSampleAttractions(
            Destination destination, TravelSuggestionRequestDTO request) {
        
        List<TravelSuggestionResponseDTO.SuggestedAttractionDTO> samples = new ArrayList<>();
        
        samples.add(createSampleAttraction("Historic City Center", "must-see", destination.getName()));
        samples.add(createSampleAttraction("Local Market", "popular", destination.getName()));
        samples.add(createSampleAttraction("Scenic Viewpoint", "hidden-gem", destination.getName()));
        samples.add(createSampleAttraction("Cultural Museum", "popular", destination.getName()));
        samples.add(createSampleAttraction("Traditional Restaurant", "local-experience", destination.getName()));
        
        return samples;
    }
    
    private List<TravelSuggestionResponseDTO.SuggestedAccommodationDTO> generateSampleAccommodations(
            Destination destination, TravelSuggestionRequestDTO request) {
        
        // Return empty list - we want to use only real database hotels
        log.warn("generateSampleAccommodations called for {}, but we should use only database hotels", destination.getName());
        return new ArrayList<>();
    }
    
    private TravelSuggestionResponseDTO.SuggestedAttractionDTO createSampleAttraction(
            String name, String category, String location) {
        
        Map<String, String> practicalInfo = new HashMap<>();
        practicalInfo.put("location", location);
        practicalInfo.put("duration", "2-3 hours");
        
        return TravelSuggestionResponseDTO.SuggestedAttractionDTO.builder()
                .name(name)
                .type("ATTRACTION")
                .category(category)
                .description("A wonderful place to explore in " + location)
                .matchingInterests(Arrays.asList("CULTURE", "SIGHTSEEING"))
                .rating(BigDecimal.valueOf(4.2))
                .priceRange("$$ - Moderate")
                .estimatedCost(BigDecimal.valueOf(15))
                .duration("2-3 hours")
                .bestTimeToVisit("Morning or afternoon")
                .difficulty("Easy")
                .wheelchairAccessible(true)
                .familyFriendly(true)
                .bookingRequired("Not Required")
                .location(location)
                .imageUrls(Arrays.asList("/api/images/default-attraction.jpg"))
                .practicalInfo(practicalInfo)
                .priorityScore(8)
                .build();
    }
    
    private TravelSuggestionResponseDTO.SuggestedAccommodationDTO createSampleAccommodation(
            Long id, String name, String category, String location, BigDecimal price) {
        
        Map<String, String> policies = new HashMap<>();
        policies.put("checkIn", "3:00 PM");
        policies.put("checkOut", "11:00 AM");
        
        return TravelSuggestionResponseDTO.SuggestedAccommodationDTO.builder()
                .id(id) // Include ID for booking
                .name(name)
                .type("Hotel")
                .category(category)
                .description("Comfortable accommodation in " + location)
                .location(location)
                .pricePerNight(price)
                .totalEstimatedCost(price.multiply(BigDecimal.valueOf(7)))
                .priceRange("$" + price + " per night")
                .rating(BigDecimal.valueOf(4.0))
                .starRating(category.equals("luxury") ? 5 : category.equals("mid-range") ? 3 : 2)
                .amenities(Arrays.asList("FREE_WIFI", "BREAKFAST"))
                .nearbyAttractions(Arrays.asList("Walking distance to main attractions"))
                .bookingUrl("https://booking.example.com")
                .breakfastIncluded(true)
                .freeWifi(true)
                .freeCancellation(true)
                .checkInTime("3:00 PM")
                .checkOutTime("11:00 AM")
                .imageUrls(Arrays.asList("/api/images/default-hotel.jpg"))
                .policies(policies)
                .priorityScore(7)
                .build();
    }
    
    private TravelSuggestionResponseDTO.SuggestedTransportDTO createFlightSuggestion(TravelSuggestionRequestDTO request) {
        return TravelSuggestionResponseDTO.SuggestedTransportDTO.builder()
                .type("flight")
                .category("international")
                .provider("Multiple Airlines")
                .route(request.getFromLocation() + " → " + request.getToLocation())
                .description("Direct and connecting flights available")
                .estimatedCost(BigDecimal.valueOf(500))
                .priceRange("$400 - $800")
                .duration("6-12 hours (depending on connections)")
                .frequency("Multiple daily flights")
                .advantages(Arrays.asList("Fastest option", "Multiple airline choices", "Various price points"))
                .considerations(Arrays.asList("Airport transfers needed", "Advance booking recommended", "Baggage restrictions"))
                .bookingAdvice("Book 6-8 weeks in advance for best prices")
                .advanceBookingRequired(true)
                .bookingUrl("https://flights.example.com")
                .priorityScore(9)
                .build();
    }
    
    private TravelSuggestionResponseDTO.SuggestedTransportDTO createTrainSuggestion(TravelSuggestionRequestDTO request) {
        return TravelSuggestionResponseDTO.SuggestedTransportDTO.builder()
                .type("train")
                .category("international")
                .provider("Rail Networks")
                .route(request.getFromLocation() + " → " + request.getToLocation())
                .description("Scenic rail journey with comfortable seating")
                .estimatedCost(BigDecimal.valueOf(200))
                .priceRange("$150 - $300")
                .duration("8-15 hours")
                .frequency("Daily departures")
                .advantages(Arrays.asList("Scenic views", "No baggage restrictions", "City center to city center"))
                .considerations(Arrays.asList("Longer travel time", "Limited routes", "Advance booking recommended"))
                .bookingAdvice("Book early for sleeper compartments")
                .advanceBookingRequired(true)
                .bookingUrl("https://rail.example.com")
                .priorityScore(7)
                .build();
    }
    
    private List<TravelSuggestionResponseDTO.SuggestedTransportDTO> createLocalTransportSuggestions(
            TravelSuggestionRequestDTO request) {
        
        List<TravelSuggestionResponseDTO.SuggestedTransportDTO> local = new ArrayList<>();
        
        // Public transport
        local.add(TravelSuggestionResponseDTO.SuggestedTransportDTO.builder()
                .type("local-transport")
                .category("local")
                .provider("Public Transport")
                .route("City-wide network")
                .description("Buses, metro, and trams covering the city")
                .estimatedCost(BigDecimal.valueOf(2))
                .priceRange("$1 - $5 per ride")
                .duration("Varies by route")
                .frequency("Regular schedules")
                .advantages(Arrays.asList("Cost-effective", "Extensive coverage", "Eco-friendly"))
                .considerations(Arrays.asList("Can be crowded", "Limited late-night service", "Language barriers"))
                .bookingAdvice("Get a day pass or travel card")
                .advanceBookingRequired(false)
                .priorityScore(8)
                .build());
        
        // Taxi/Ride-share
        local.add(TravelSuggestionResponseDTO.SuggestedTransportDTO.builder()
                .type("taxi")
                .category("local")
                .provider("Taxi & Ride-share")
                .route("Door-to-door service")
                .description("Convenient point-to-point transport")
                .estimatedCost(BigDecimal.valueOf(15))
                .priceRange("$10 - $30 per ride")
                .duration("Direct routes")
                .frequency("On-demand")
                .advantages(Arrays.asList("Door-to-door", "Available 24/7", "No walking required"))
                .considerations(Arrays.asList("More expensive", "Traffic delays", "Surge pricing"))
                .bookingAdvice("Use ride-share apps for transparency")
                .advanceBookingRequired(false)
                .priorityScore(6)
                .build());
        
        return local;
    }
    
    private String calculateAttractionPriceRange(Attraction attraction, String budgetLevel) {
        if (attraction.getFreeEntry() != null && attraction.getFreeEntry()) {
            return "Free";
        }
        
        BigDecimal cost = attraction.getEntryFee() != null ? attraction.getEntryFee() : BigDecimal.valueOf(15);
        
        if (cost.compareTo(BigDecimal.valueOf(10)) <= 0) {
            return "$ - Budget";
        } else if (cost.compareTo(BigDecimal.valueOf(30)) <= 0) {
            return "$$ - Moderate";
        } else {
            return "$$$ - Premium";
        }
    }
    
    private int calculateAttractionPriority(Attraction attraction, TravelSuggestionRequestDTO request) {
        int score = 5; // Base score
        
        // Higher score for better ratings
        if (attraction.getAverageRating() != null) {
            score += attraction.getAverageRating().intValue();
        }
        
        // Higher score for matching interests
        if (request.getInterests() != null && !attraction.getMatchingInterests().isEmpty()) {
            long matchingInterests = request.getInterests().stream()
                    .filter(interest -> attraction.getMatchingInterests().stream()
                            .anyMatch(ai -> ai.name().equalsIgnoreCase(interest)))
                    .count();
            score += (int) matchingInterests * 2;
        }
        
        return Math.min(10, score); // Cap at 10
    }
    
    private String determineAttractionCategory(Attraction attraction, int priorityScore) {
        if (priorityScore >= 8) return "must-see";
        if (priorityScore >= 6) return "popular";
        if (priorityScore >= 4) return "hidden-gem";
        return "local-experience";
    }
    
    private String categorizeAccommodationPrice(BigDecimal price, String budgetLevel) {
        if (price.compareTo(BigDecimal.valueOf(50)) <= 0) {
            return "budget";
        } else if (price.compareTo(BigDecimal.valueOf(150)) <= 0) {
            return "mid-range";
        } else {
            return "luxury";
        }
    }
    
    private int calculateAccommodationPriority(Hotel hotel, TravelSuggestionRequestDTO request) {
        int score = 5; // Base score
        
        // Higher score for better ratings
        if (hotel.getAverageRating() != null) {
            score += hotel.getAverageRating().intValue();
        }
        
        // Higher score for star rating
        if (hotel.getStarRating() != null) {
            score += hotel.getStarRating().getValue();
        }
        
        return Math.min(10, score); // Cap at 10
    }
    
    private TravelSuggestionResponseDTO.BudgetCategoryDTO createBudgetCategory(
            String category, BigDecimal baseAmount, String notes) {
        
        return TravelSuggestionResponseDTO.BudgetCategoryDTO.builder()
                .category(category)
                .budgetOption(baseAmount)
                .midRangeOption(baseAmount.multiply(BigDecimal.valueOf(2.5)))
                .luxuryOption(baseAmount.multiply(BigDecimal.valueOf(5.0)))
                .recommended(baseAmount.multiply(BigDecimal.valueOf(2.5)))
                .notes(notes)
                .tips(Arrays.asList("Look for deals and discounts", "Compare prices online", "Consider alternatives"))
                .build();
    }
    
    private List<TravelSuggestionResponseDTO.BudgetTipDTO> generateBudgetTips() {
        List<TravelSuggestionResponseDTO.BudgetTipDTO> tips = new ArrayList<>();
        
        tips.add(TravelSuggestionResponseDTO.BudgetTipDTO.builder()
                .tip("Eat at local restaurants instead of tourist areas")
                .category("meals")
                .potentialSavings(BigDecimal.valueOf(20))
                .build());
        
        tips.add(TravelSuggestionResponseDTO.BudgetTipDTO.builder()
                .tip("Use public transportation")
                .category("transport")
                .potentialSavings(BigDecimal.valueOf(15))
                .build());
        
        tips.add(TravelSuggestionResponseDTO.BudgetTipDTO.builder()
                .tip("Book accommodations in advance")
                .category("accommodation")
                .potentialSavings(BigDecimal.valueOf(30))
                .build());
        
        return tips;
    }
    
    private TravelSuggestionResponseDTO.TravelItineraryDayDTO generateDayItinerary(
            int day, List<TravelSuggestionResponseDTO.SuggestedAttractionDTO> attractions,
            TravelSuggestionRequestDTO request) {
        
        List<TravelSuggestionResponseDTO.ItineraryActivityDTO> activities = new ArrayList<>();
        
        // Morning activity
        activities.add(TravelSuggestionResponseDTO.ItineraryActivityDTO.builder()
                .time("09:00 AM")
                .activity("Breakfast at local café")
                .location("Near accommodation")
                .description("Start the day with local breakfast")
                .estimatedCost(BigDecimal.valueOf(15))
                .duration("1 hour")
                .type("meal")
                .build());
        
        // Main attraction
        if (!attractions.isEmpty() && attractions.size() >= day) {
            TravelSuggestionResponseDTO.SuggestedAttractionDTO attraction = attractions.get((day - 1) % attractions.size());
            activities.add(TravelSuggestionResponseDTO.ItineraryActivityDTO.builder()
                    .time("10:30 AM")
                    .activity(attraction.getName())
                    .location(attraction.getLocation())
                    .description(attraction.getDescription())
                    .estimatedCost(attraction.getEstimatedCost())
                    .duration(attraction.getDuration())
                    .type("attraction")
                    .build());
        }
        
        // Lunch
        activities.add(TravelSuggestionResponseDTO.ItineraryActivityDTO.builder()
                .time("01:00 PM")
                .activity("Lunch at local restaurant")
                .location("City center")
                .description("Try local cuisine")
                .estimatedCost(BigDecimal.valueOf(25))
                .duration("1.5 hours")
                .type("meal")
                .build());
        
        // Afternoon activity
        activities.add(TravelSuggestionResponseDTO.ItineraryActivityDTO.builder()
                .time("03:00 PM")
                .activity("Explore local markets")
                .location("Traditional market area")
                .description("Shopping and cultural experience")
                .estimatedCost(BigDecimal.valueOf(20))
                .duration("2 hours")
                .type("attraction")
                .build());
        
        BigDecimal dailyCost = activities.stream()
                .map(TravelSuggestionResponseDTO.ItineraryActivityDTO::getEstimatedCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return TravelSuggestionResponseDTO.TravelItineraryDayDTO.builder()
                .dayNumber(day)
                .date("Day " + day)
                .theme(getDayTheme(day))
                .activities(activities)
                .estimatedDailyCost(dailyCost)
                .transportationNotes("Use public transport or walking")
                .tips(Arrays.asList("Start early to avoid crowds", "Carry water and snacks", "Wear comfortable shoes"))
                .build();
    }
    
    private String getDayTheme(int day) {
        String[] themes = {
                "Arrival and City Orientation",
                "Cultural Exploration",
                "Adventure and Nature",
                "Local Experiences",
                "Relaxation and Shopping",
                "Hidden Gems Discovery",
                "Farewell and Departure"
        };
        
        return themes[(day - 1) % themes.length];
    }
}