package com.roamy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hotels")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String address;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id")
    private Destination destination;
    
    // Geographic coordinates
    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;
    
    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "hotel_images", joinColumns = @JoinColumn(name = "hotel_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();
    
    // Hotel details
    @Enumerated(EnumType.STRING)
    private StarRating starRating;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "hotel_amenities", joinColumns = @JoinColumn(name = "hotel_id"))
    @Column(name = "amenity")
    @Builder.Default
    private List<Amenity> amenities = new ArrayList<>();
    
    // Pricing
    @Column(name = "price_per_night", precision = 10, scale = 2)
    private BigDecimal pricePerNight;
    
    @Column(name = "currency", length = 3)
    @Builder.Default
    private String currency = "USD";
    
    // Contact information
    private String phoneNumber;
    private String email;
    private String website;
    
    // Ratings
    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating;
    
    @Column(name = "total_reviews")
    @Builder.Default
    private Integer totalReviews = 0;
    
    // External API reference
    private String externalId; // For booking.com or other API integration
    private String externalSource; // 'booking.com', 'rapidapi', etc.
    
    @Builder.Default
    private Boolean available = true;
    
    @Builder.Default
    private Boolean featured = false;
    
    // Check-in/out policies
    private String checkInTime;
    private String checkOutTime;
    
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Room> rooms = new ArrayList<>();
    
    public enum StarRating {
        ONE(1), TWO(2), THREE(3), FOUR(4), FIVE(5);
        
        private final int value;
        
        StarRating(int value) {
            this.value = value;
        }
        
        public int getValue() {
            return value;
        }
    }
    
    public enum Amenity {
        WIFI, PARKING, POOL, GYM, SPA, RESTAURANT, BAR, 
        ROOM_SERVICE, LAUNDRY, CONCIERGE, BUSINESS_CENTER,
        PET_FRIENDLY, AIRPORT_SHUTTLE, BREAKFAST_INCLUDED,
        AIR_CONDITIONING, BEACHFRONT, CITY_VIEW, MOUNTAIN_VIEW,
        BALCONY, KITCHENETTE, MINI_BAR, SAFE, TV
    }
}