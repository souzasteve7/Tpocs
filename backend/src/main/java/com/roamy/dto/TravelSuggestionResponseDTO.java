package com.roamy.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelSuggestionResponseDTO {
    
    private DestinationOverviewDTO destinationOverview;
    private List<SuggestedAttractionDTO> suggestedAttractions;
    private List<SuggestedAccommodationDTO> suggestedAccommodations;
    private List<SuggestedTransportDTO> suggestedTransportOptions;
    private TravelBudgetBreakdownDTO budgetBreakdown;
    private List<TravelItineraryDayDTO> suggestedItinerary;
    private TravelTipsDTO travelTips;
    private SuggestionMetadataDTO metadata;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DestinationOverviewDTO {
        private String name;
        private String country;
        private String region;
        private String description;
        private List<String> highlights;
        private String bestTimeToVisit;
        private String climate;
        private String timeZone;
        private String currency;
        private List<String> languages;
        private String safetyRating;
        private BigDecimal averageRating;
        private String imageUrl;
        private List<String> topInterests;
        private Map<String, Object> quickFacts;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SuggestedAttractionDTO {
        private String name;
        private String type;
        private String category; // must-see, popular, hidden-gem, local-experience
        private String description;
        private List<String> matchingInterests;
        private BigDecimal rating;
        private String priceRange;
        private BigDecimal estimatedCost;
        private String duration;
        private String bestTimeToVisit;
        private String difficulty; // easy, moderate, challenging
        private Boolean wheelchairAccessible;
        private Boolean familyFriendly;
        private String bookingRequired;
        private String location;
        private List<String> imageUrls;
        private Map<String, String> practicalInfo;
        private Integer priorityScore; // 1-10, higher = more recommended
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SuggestedAccommodationDTO {
        private Long id; // Hotel ID for booking
        private String name;
        private String type; // hotel, hostel, apartment, resort, guesthouse
        private String category; // budget, mid-range, luxury
        private String description;
        private String location;
        private BigDecimal pricePerNight;
        private BigDecimal totalEstimatedCost;
        private String priceRange;
        private BigDecimal rating;
        private Integer starRating;
        private List<String> amenities;
        private List<String> nearbyAttractions;
        private String bookingUrl;
        private Boolean breakfastIncluded;
        private Boolean freeWifi;
        private Boolean freeCancellation;
        private String checkInTime;
        private String checkOutTime;
        private List<String> imageUrls;
        private Map<String, String> policies;
        private Integer priorityScore;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SuggestedTransportDTO {
        private String type; // flight, train, bus, car-rental, local-transport
        private String category; // international, domestic, local
        private String provider;
        private String route;
        private String description;
        private BigDecimal estimatedCost;
        private String priceRange;
        private String duration;
        private String frequency;
        private List<String> advantages;
        private List<String> considerations;
        private String bookingAdvice;
        private Boolean advanceBookingRequired;
        private String bookingUrl;
        private Map<String, Object> scheduleInfo;
        private Integer priorityScore;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TravelBudgetBreakdownDTO {
        private String currency;
        private BudgetCategoryDTO accommodation;
        private BudgetCategoryDTO transport;
        private BudgetCategoryDTO activities;
        private BudgetCategoryDTO meals;
        private BudgetCategoryDTO shopping;
        private BudgetCategoryDTO miscellaneous;
        private BudgetSummaryDTO totalBudget;
        private List<BudgetTipDTO> budgetTips;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BudgetCategoryDTO {
        private String category;
        private BigDecimal budgetOption;
        private BigDecimal midRangeOption;
        private BigDecimal luxuryOption;
        private BigDecimal recommended;
        private String notes;
        private List<String> tips;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BudgetSummaryDTO {
        private BigDecimal budgetTotal;
        private BigDecimal midRangeTotal;
        private BigDecimal luxuryTotal;
        private BigDecimal recommendedTotal;
        private String budgetLevel;
        private Integer durationDays;
        private BigDecimal perPersonPerDay;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BudgetTipDTO {
        private String tip;
        private String category;
        private BigDecimal potentialSavings;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TravelItineraryDayDTO {
        private Integer dayNumber;
        private String date;
        private String theme;
        private List<ItineraryActivityDTO> activities;
        private BigDecimal estimatedDailyCost;
        private String transportationNotes;
        private List<String> tips;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItineraryActivityDTO {
        private String time;
        private String activity;
        private String location;
        private String description;
        private BigDecimal estimatedCost;
        private String duration;
        private String type; // attraction, meal, transport, break
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TravelTipsDTO {
        private List<String> generalTips;
        private List<String> culturalTips;
        private List<String> safetyTips;
        private List<String> budgetTips;
        private List<String> packingTips;
        private List<String> localCustoms;
        private Map<String, String> emergencyInfo;
        private List<String> usefulApps;
        private List<String> commonPhrases;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SuggestionMetadataDTO {
        private String requestId;
        private Long processingTimeMs;
        private String suggestionAlgorithm;
        private Integer totalSuggestions;
        private String lastUpdated;
        private String dataFreshness;
        private List<String> dataSources;
        private String personalizedScore;
    }
}