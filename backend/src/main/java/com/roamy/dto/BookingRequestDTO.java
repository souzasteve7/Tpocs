package com.roamy.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingRequestDTO {
    
    private String type; // hotel, transport, package, attraction
    
    // Hotel booking
    private Long hotelId;
    private String hotelName;
    private String hotelAddress;
    private String hotelCategory; // luxury, mid-range, budget
    private String hotelAvailability;
    private Double hotelRating;
    private String hotelImageUrl;
    private String hotelDescription;
    private Long roomId;
    private String roomType;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    
    // Transport booking
    private String transportType;
    private String departureLocation;
    private String arrivalLocation;
    private LocalDateTime departureDate;
    private LocalDateTime arrivalDate;
    private String transportProviderId;
    
    // Guest information
    private Integer numberOfGuests = 1;
    private Integer numberOfAdults = 1;
    private Integer numberOfChildren = 0;
    
    // Contact information
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    
    // Special requests
    private String specialRequests;
    
    // Pricing
    private BigDecimal totalAmount;
    private String currency = "USD";
    private Integer nights;
    
    // Payment information (this would be handled by payment gateway)
    private String paymentMethod;
    private String paymentToken;
    
    // Guest details (for multiple guests)
    private List<GuestDTO> guests;
    
    @Data
    public static class GuestDTO {
        private String firstName;
        private String lastName;
        private String email;
        private String phoneNumber;
        private String dateOfBirth; // String in ISO format
        private String passportNumber;
        private String nationality;
        private Boolean isChild = false;
    }
}