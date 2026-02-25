package com.roamy.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TravelSuggestionRequestDTO {
    
    @NotBlank(message = "Destination (to location) is required")
    private String toLocation;
    
    private String fromLocation; // Optional for destination-only suggestions
    
    private LocalDate preferredDepartureDate;
    private LocalDate preferredReturnDate;
    
    @Min(value = 1, message = "Duration must be at least 1 day")
    @Builder.Default
    private Integer durationDays = 7;
    
    @Min(value = 1, message = "Number of travelers must be at least 1")
    @Builder.Default
    private Integer numberOfTravelers = 1;
    
    @Builder.Default
    private Integer numberOfAdults = 1;
    @Builder.Default
    private Integer numberOfChildren = 0;
    
    // Budget preferences
    private String budgetLevel; // budget, mid-range, luxury, custom
    private Double minBudget;
    private Double maxBudget;
    @Builder.Default
    private String currency = "USD";
    
    // Travel interests/activities
    private List<String> interests; // adventure, culture, food, nature, nightlife, etc.
    
    // Accommodation preferences
    private String accommodationType; // hotel, hostel, apartment, resort, any
    private Integer minHotelRating;
    private List<String> requiredAmenities;
    
    // Transport preferences
    private List<String> preferredTransportTypes; // flight, train, bus, car
    private String transportClass; // economy, business, first
    
    // Special requirements
    @Builder.Default
    private Boolean wheelchairAccessible = false;
    @Builder.Default
    private Boolean familyFriendly = false;
    @Builder.Default
    private Boolean petFriendly = false;
    
    // Suggestion preferences
    @Builder.Default
    private Boolean includePopularAttractions = true;
    @Builder.Default
    private Boolean includeHiddenGems = true;
    @Builder.Default
    private Boolean includeLocalExperiences = true;
    @Builder.Default
    private Boolean includeTransportOptions = true;
    @Builder.Default
    private Boolean includeAccommodationOptions = true;
    @Builder.Default
    private Boolean includePriceBreakdown = true;
    
    @Builder.Default
    private String suggestionDepth = "comprehensive"; // basic, detailed, comprehensive
}