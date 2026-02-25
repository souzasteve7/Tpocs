package com.roamy.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {
    
    private Long id;
    private String bookingReference;
    private String type;
    private String status;
    private String paymentStatus;
    
    // Hotel booking details
    private HotelBookingDetailsDTO hotelDetails;
    
    // Transport booking details
    private TransportBookingDetailsDTO transportDetails;
    
    // Financial information
    private BigDecimal totalAmount;
    private String currency;
    
    // Guest information
    private Integer numberOfGuests;
    private Integer numberOfAdults;
    private Integer numberOfChildren;
    
    // Contact information
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    
    // Special requests
    private String specialRequests;
    
    // Booking timeline
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime cancellationDeadline;
    
    // Cancellation policy
    private String cancellationPolicy;
    
    // External reference (for third-party bookings)
    private String externalBookingId;
    private String externalSource;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HotelBookingDetailsDTO {
        private Long hotelId;
        private String hotelName;
        private String hotelAddress;
        private Long roomId;
        private String roomType;
        private String roomNumber;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private Integer numberOfNights;
        private BigDecimal pricePerNight;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransportBookingDetailsDTO {
        private String transportType;
        private String provider;
        private String departureLocation;
        private String arrivalLocation;
        private LocalDateTime departureDate;
        private LocalDateTime arrivalDate;
        private String duration;
        private String seatNumbers;
        private String ticketNumbers;
    }
}