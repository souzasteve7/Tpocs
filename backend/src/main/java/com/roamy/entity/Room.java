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
@Table(name = "rooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;
    
    @Column(name = "room_number")
    private String roomNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private RoomType roomType;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    // Room specifications
    @Column(name = "max_occupancy")
    private Integer maxOccupancy;
    
    @Column(name = "number_of_beds")
    private Integer numberOfBeds;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "bed_type")
    private BedType bedType;
    
    @Column(name = "room_size_sqm")
    private Integer roomSizeSquareMeters;
    
    // Pricing
    @Column(name = "base_price", precision = 10, scale = 2)
    private BigDecimal basePrice;
    
    @Column(name = "currency", length = 3)
    @Builder.Default
    private String currency = "USD";
    
    // Amenities specific to room
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "room_amenities", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "amenity")
    @Builder.Default
    private List<RoomAmenity> amenities = new ArrayList<>();
    
    // Images
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "room_images", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();
    
    @Builder.Default
    private Boolean available = true;
    
    @Builder.Default
    private Boolean smokingAllowed = false;
    
    @Builder.Default
    private Boolean petFriendly = false;
    
    public enum RoomType {
        STANDARD, DELUXE, SUITE, FAMILY, SINGLE, DOUBLE, 
        TWIN, TRIPLE, QUAD, STUDIO, APARTMENT, VILLA, 
        PRESIDENTIAL_SUITE, PENTHOUSE
    }
    
    public enum BedType {
        SINGLE, DOUBLE, QUEEN, KING, TWIN, SOFA_BED, BUNK_BED
    }
    
    public enum RoomAmenity {
        PRIVATE_BATHROOM, SHOWER, BATHTUB, HAIR_DRYER,
        AIR_CONDITIONING, HEATING, WIFI, TV, CABLE_TV,
        MINI_BAR, SAFE, BALCONY, SEA_VIEW, CITY_VIEW,
        MOUNTAIN_VIEW, GARDEN_VIEW, KITCHENETTE, MICROWAVE,
        REFRIGERATOR, COFFEE_MAKER, IRON, DESK, WARDROBE,
        SOUNDPROOF, BLACKOUT_CURTAINS, WAKE_UP_SERVICE
    }
}