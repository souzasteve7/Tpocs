package com.roamy.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponseDTO {
    
    private List<DestinationDTO> destinations;
    private List<HotelDTO> hotels;
    private List<AttractionDTO> attractions;
    private List<TransportOptionDTO> transportOptions;
    private SearchMetaDataDTO metadata;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DestinationDTO {
        private Long id;
        private String name;
        private String city;
        private String country;
        private String countryCode;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private String description;
        private String imageUrl;
        private List<String> popularInterests;
        private BigDecimal averageRating;
        private Integer totalReviews;
        private PricingDTO pricing;
        private String timeZone;
        private String climate;
        private String bestTimeToVisit;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HotelDTO {
        private Long id;
        private String name;
        private String address;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private String description;
        private List<String> imageUrls;
        private Integer starRating;
        private List<String> amenities;
        private BigDecimal pricePerNight;
        private String currency;
        private BigDecimal averageRating;
        private Integer totalReviews;
        private String phoneNumber;
        private String website;
        private List<RoomDTO> availableRooms;
        private DestinationDTO destination;
        private Boolean featured;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoomDTO {
        private Long id;
        private String roomNumber;
        private String roomType;
        private String description;
        private Integer maxOccupancy;
        private Integer numberOfBeds;
        private String bedType;
        private Integer roomSizeSquareMeters;
        private BigDecimal basePrice;
        private String currency;
        private List<String> amenities;
        private List<String> imageUrls;
        private Boolean available;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttractionDTO {
        private Long id;
        private String name;
        private String description;
        private String address;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private String type;
        private List<String> matchingInterests;
        private List<String> imageUrls;
        private BigDecimal entryFee;
        private String currency;
        private Boolean freeEntry;
        private String openingHours;
        private String operatingDays;
        private BigDecimal averageRating;
        private Integer totalReviews;
        private Boolean wheelchairAccessible;
        private Boolean kidsFriendly;
        private Integer recommendedDurationHours;
        private String bestTimeToVisit;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransportOptionDTO {
        private String id;
        private String type; // flight, train, bus, car_rental, taxi
        private String provider;
        private String departureLocation;
        private String arrivalLocation;
        private String departureTime;
        private String arrivalTime;
        private String duration;
        private BigDecimal price;
        private String currency;
        private String bookingUrl;
        private List<String> amenities;
        private Integer availableSeats;
        private String vehicleType;
        private BigDecimal rating;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PricingDTO {
        private BigDecimal budgetDailyCost;
        private BigDecimal midRangeDailyCost;
        private BigDecimal luxuryDailyCost;
        private String currency;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchMetaDataDTO {
        private Integer totalResults;
        private Integer currentPage;
        private Integer totalPages;
        private Integer pageSize;
        private String sortBy;
        private String sortOrder;
        private Long searchTimeMs;
        private String searchId;
    }
}