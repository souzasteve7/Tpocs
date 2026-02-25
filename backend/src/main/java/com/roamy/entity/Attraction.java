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
@Table(name = "attractions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attraction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id")
    private Destination destination;
    
    @Column(nullable = false)
    private String address;
    
    // Geographic coordinates
    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;
    
    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "attraction_type")
    private AttractionType type;
    
    // What interests this attraction matches
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "attraction_interests", joinColumns = @JoinColumn(name = "attraction_id"))
    @Column(name = "interest")
    @Builder.Default
    private List<User.TravelInterest> matchingInterests = new ArrayList<>();
    
    // Images
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "attraction_images", joinColumns = @JoinColumn(name = "attraction_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();
    
    // Pricing
    @Column(name = "entry_fee", precision = 10, scale = 2)
    private BigDecimal entryFee;
    
    @Column(name = "currency", length = 3)
    @Builder.Default
    private String currency = "USD";
    
    @Builder.Default
    private Boolean freeEntry = false;
    
    // Operating hours
    @Column(name = "opening_hours")
    private String openingHours;
    
    @Column(name = "operating_days")
    private String operatingDays; // e.g., "Mon-Sun" or "Mon-Fri"
    
    // Contact and web presence
    private String phoneNumber;
    private String email;
    private String website;
    
    // Ratings and popularity
    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating;
    
    @Column(name = "total_reviews")
    @Builder.Default
    private Integer totalReviews = 0;
    
    @Column(name = "popularity_score")
    @Builder.Default
    private Integer popularityScore = 0;
    
    // External references
    @Column(name = "external_id")
    private String externalId; // Google Places ID, Foursquare ID, etc.
    
    @Column(name = "external_source")
    private String externalSource;
    
    // Accessibility and other info
    @Builder.Default
    private Boolean wheelchairAccessible = false;
    
    @Builder.Default
    private Boolean kidsFriendly = true;
    
    @Column(name = "recommended_duration_hours")
    private Integer recommendedDurationHours;
    
    @Column(name = "best_time_to_visit")
    private String bestTimeToVisit;
    
    @Builder.Default
    private Boolean active = true;
    
    @Builder.Default
    private Boolean featured = false;
    
    public enum AttractionType {
        MUSEUM, PARK, MONUMENT, CHURCH, TEMPLE, CASTLE, PALACE,
        BEACH, MOUNTAIN, LAKE, WATERFALL, GARDEN, ZOO, AQUARIUM,
        THEATER, CONCERT_HALL, SHOPPING_CENTER, MARKET, RESTAURANT,
        BAR, CLUB, CASINO, SPA, SPORTS_VENUE, ADVENTURE_PARK,
        HISTORICAL_SITE, ARCHAEOLOGICAL_SITE, VIEWPOINT, BRIDGE,
        BUILDING, SQUARE, STREET, NEIGHBORHOOD, ISLAND
    }
}