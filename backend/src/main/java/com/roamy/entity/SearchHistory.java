package com.roamy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "search_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class SearchHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    // Search parameters
    @Column(name = "from_location")
    private String fromLocation;
    
    @Column(name = "to_location", nullable = false)
    private String toLocation;
    
    @Column(name = "check_in_date")
    private LocalDate checkInDate;
    
    @Column(name = "check_out_date") 
    private LocalDate checkOutDate;
    
    @Column(name = "number_of_guests")
    @Builder.Default
    private Integer numberOfGuests = 1;
    
    @Column(name = "number_of_adults")
    @Builder.Default
    private Integer numberOfAdults = 1;
    
    @Column(name = "number_of_children")
    @Builder.Default
    private Integer numberOfChildren = 0;
    
    // Budget preference
    @Column(name = "min_budget")
    private Double minBudget;
    
    @Column(name = "max_budget")
    private Double maxBudget;
    
    @Column(name = "budget_currency", length = 3)
    @Builder.Default
    private String budgetCurrency = "USD";
    
    // Selected interests for this search
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "search_interests", joinColumns = @JoinColumn(name = "search_history_id"))
    @Column(name = "interest")
    @Builder.Default
    private List<User.TravelInterest> selectedInterests = new ArrayList<>();
    
    // Search filters
    @Column(name = "hotel_min_rating")
    private Integer hotelMinRating;
    
    @Column(name = "hotel_max_rating")
    private Integer hotelMaxRating;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "search_amenities", joinColumns = @JoinColumn(name = "search_history_id"))
    @Column(name = "amenity")
    @Builder.Default
    private List<Hotel.Amenity> requiredAmenities = new ArrayList<>();
    
    @Enumerated(EnumType.STRING)
    @Column(name = "room_type")
    private Room.RoomType preferredRoomType;
    
    // Transport preferences
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "search_transport_types", joinColumns = @JoinColumn(name = "search_history_id"))
    @Column(name = "transport_type")
    @Builder.Default
    private List<Booking.TransportType> preferredTransportTypes = new ArrayList<>();
    
    // Search results metadata
    @Column(name = "results_count")
    @Builder.Default
    private Integer resultsCount = 0;
    
    @Column(name = "clicked_results", columnDefinition = "TEXT")
    private String clickedResults; // JSON array of clicked hotel/attraction IDs
    
    // Session info
    @Column(name = "session_id")
    private String sessionId;
    
    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @CreatedDate
    @Column(name = "search_date", updatable = false)
    private LocalDateTime searchDate;
    
    // Whether the user made a booking from this search
    @Builder.Default
    private Boolean convertedToBooking = false;
    
    @Column(name = "booking_id")
    private Long bookingId;
}