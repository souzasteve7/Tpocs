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
@Table(name = "destinations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Destination {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String city;
    
    @Column(nullable = false)
    private String country;
    
    @Column(name = "country_code", length = 2)
    private String countryCode;
    
    // Geographic coordinates
    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;
    
    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "image_url", length = 1000)
    private String imageUrl;
    
    @Column(name = "time_zone")
    private String timeZone;
    
    // Popular activities/interests for this destination
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "destination_interests", joinColumns = @JoinColumn(name = "destination_id"))
    @Column(name = "interest")
    @Builder.Default
    private List<User.TravelInterest> popularInterests = new ArrayList<>();
    
    // Weather info
    private String climate;
    private String bestTimeToVisit;
    
    // Cost estimates (daily averages in USD)
    @Column(name = "budget_daily_cost")
    private BigDecimal budgetDailyCost;
    
    @Column(name = "mid_range_daily_cost")
    private BigDecimal midRangeDailyCost;
    
    @Column(name = "luxury_daily_cost")
    private BigDecimal luxuryDailyCost;
    
    // Relationships
    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Hotel> hotels = new ArrayList<>();
    
    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Attraction> attractions = new ArrayList<>();
    
    // Rating and popularity
    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating;
    
    @Column(name = "total_reviews")
    @Builder.Default
    private Integer totalReviews = 0;
    
    @Column(name = "popularity_score")
    @Builder.Default
    private Integer popularityScore = 0;
    
    @Builder.Default
    private Boolean active = true;
}