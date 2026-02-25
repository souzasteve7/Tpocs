package com.roamy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String bookingReference;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingType type;
    
    // Hotel booking details
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;
    
    // Transport booking details  
    @Column(name = "transport_type")
    @Enumerated(EnumType.STRING)
    private TransportType transportType;
    
    @Column(name = "departure_location")
    private String departureLocation;
    
    @Column(name = "arrival_location")
    private String arrivalLocation;
    
    // Booking dates
    @Column(name = "check_in_date")
    private LocalDate checkInDate;
    
    @Column(name = "check_out_date")
    private LocalDate checkOutDate;
    
    @Column(name = "departure_date")
    private LocalDateTime departureDate;
    
    @Column(name = "arrival_date")
    private LocalDateTime arrivalDate;
    
    // Guest details
    @Column(name = "number_of_guests")
    @Builder.Default
    private Integer numberOfGuests = 1;
    
    @Column(name = "number_of_adults")
    @Builder.Default
    private Integer numberOfAdults = 1;
    
    @Column(name = "number_of_children")
    @Builder.Default
    private Integer numberOfChildren = 0;
    
    // Financial details
    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;
    
    @Column(name = "currency", length = 3)
    @Builder.Default
    private String currency = "USD";
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
    
    // Special requests
    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;
    
    // Contact details for booking
    @Column(name = "contact_name")
    private String contactName;
    
    @Column(name = "contact_email")
    private String contactEmail;
    
    @Column(name = "contact_phone")
    private String contactPhone;
    
    // External booking reference (for third-party APIs)
    @Column(name = "external_booking_id")
    private String externalBookingId;
    
    @Column(name = "external_source")
    private String externalSource;
    
    // Cancellation
    @Column(name = "cancellation_deadline")
    private LocalDateTime cancellationDeadline;
    
    @Column(name = "cancellation_policy", columnDefinition = "TEXT")
    private String cancellationPolicy;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum BookingType {
        HOTEL, TRANSPORT, PACKAGE, ATTRACTION
    }
    
    public enum BookingStatus {
        PENDING, CONFIRMED, CANCELLED, COMPLETED, FAILED
    }
    
    public enum PaymentStatus {
        PENDING, PAID, FAILED, REFUNDED, PARTIAL_REFUND
    }
    
    public enum TransportType {
        FLIGHT, TRAIN, BUS, CAR_RENTAL, TAXI, FERRY
    }
}