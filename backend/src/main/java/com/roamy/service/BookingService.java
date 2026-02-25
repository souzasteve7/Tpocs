package com.roamy.service;

import com.roamy.dto.BookingRequestDTO;
import com.roamy.dto.BookingResponseDTO;
import com.roamy.entity.*;
import com.roamy.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    
    public BookingResponseDTO createHotelBooking(BookingRequestDTO request, String userEmail) {
        log.info("Creating hotel booking for user: {}", userEmail);
        log.info("Hotel booking request: {}", request);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Look for existing hotel or create new one from request data
        Hotel hotel = null;
        
        // Check if hotel ID is provided and try to find existing hotel
        if (request.getHotelId() != null) {
            hotel = hotelRepository.findById(request.getHotelId()).orElse(null);
            log.info("Looked up hotel by ID: {} - Found: {}", request.getHotelId(), hotel != null);
        }
        
        // If no hotel found by ID but hotel name provided, check if hotel exists by name
        if (hotel == null && request.getHotelName() != null && !request.getHotelName().trim().isEmpty()) {
            List<Hotel> existingHotels = hotelRepository.findByNameContainingIgnoreCase(request.getHotelName());
            if (!existingHotels.isEmpty()) {
                hotel = existingHotels.get(0); // Use the first matching hotel
                log.info("Found existing hotel by name: {}", hotel.getName());
            }
        }

        // Create or update hotel from request payload
        if (hotel == null && request.getHotelName() != null) {
            log.info("Creating new hotel from request data: {}", request.getHotelName());
            
            // Determine star rating from category
            Hotel.StarRating starRating = Hotel.StarRating.THREE; // default
            if ("luxury".equalsIgnoreCase(request.getHotelCategory())) {
                starRating = Hotel.StarRating.FIVE;
            } else if ("mid-range".equalsIgnoreCase(request.getHotelCategory())) {
                starRating = Hotel.StarRating.FOUR;
            } else if ("budget".equalsIgnoreCase(request.getHotelCategory())) {
                starRating = Hotel.StarRating.TWO;
            }
            
            hotel = Hotel.builder()
                    .name(request.getHotelName())
                    .address(request.getHotelAddress() != null ? request.getHotelAddress() : "Address not provided")
                    .description(request.getHotelDescription())
                    .pricePerNight(request.getTotalAmount() != null && request.getNights() != null && request.getNights() > 0 ? 
                        request.getTotalAmount().divide(BigDecimal.valueOf(request.getNights()), 2, java.math.RoundingMode.HALF_UP) : 
                        new BigDecimal("150.00"))
                    .starRating(starRating)
                    .averageRating(request.getHotelRating() != null ? BigDecimal.valueOf(request.getHotelRating()) : null)
                    .available("available".equalsIgnoreCase(request.getHotelAvailability()))
                    .externalId(request.getHotelId() != null ? request.getHotelId().toString() : null)
                    .externalSource("Frontend_Request")
                    .build();
            
            // Add image URL if provided
            if (request.getHotelImageUrl() != null) {
                hotel.getImageUrls().add(request.getHotelImageUrl());
            }
            
            // IMPORTANT: Save the hotel to the database BEFORE using it in booking
            hotel = hotelRepository.save(hotel);
            log.info("Created and saved new hotel: {} with ID: {}", hotel.getName(), hotel.getId());
        }
        
        // Ensure we have a hotel entity
        if (hotel == null) {
            throw new RuntimeException("Unable to create or find hotel: " + request.getHotelName());
        }
        
        log.info("Using hotel for booking: {} with ID: {}", hotel.getName(), hotel.getId());
        
        // Calculate total amount - use request amount if provided
        long numberOfNights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        BigDecimal totalAmount = request.getTotalAmount() != null ? 
            request.getTotalAmount() : 
            (hotel != null ? hotel.getPricePerNight() : new BigDecimal("150.00")).multiply(BigDecimal.valueOf(numberOfNights));
        
        String currency = request.getCurrency() != null ? request.getCurrency() : "USD";
        
        // Create booking with hotel reference
        Booking booking = Booking.builder()
                .bookingReference(generateBookingReference())
                .user(user)
                .type(Booking.BookingType.HOTEL)
                .hotel(hotel) // Now we have a proper hotel entity
                .room(null) // Room handling can be added later
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .numberOfGuests(request.getNumberOfGuests())
                .numberOfAdults(request.getNumberOfAdults())
                .numberOfChildren(request.getNumberOfChildren())
                .totalAmount(totalAmount)
                .currency(currency)
                .status(Booking.BookingStatus.PENDING)
                .paymentStatus(Booking.PaymentStatus.PENDING)
                .contactName(request.getContactName())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .specialRequests(request.getSpecialRequests())
                .externalBookingId(request.getHotelId() != null ? request.getHotelId().toString() : null)
                .externalSource(request.getHotelName())
                .cancellationDeadline(LocalDateTime.now().plusDays(1)) // 24 hours to cancel
                .build();
        
        booking = bookingRepository.save(booking);
        
        log.info("Hotel booking created successfully with reference: {} for hotel: {} (DB ID: {})", 
                booking.getBookingReference(), request.getHotelName(), hotel != null ? hotel.getId() : "N/A");
        
        return convertToBookingResponseDTO(booking, request);
    }
    
    public BookingResponseDTO createTransportBooking(BookingRequestDTO request, String userEmail) {
        log.info("Creating transport booking for user: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Mock transport booking - in production, integrate with transport APIs
        Booking booking = Booking.builder()
                .bookingReference(generateBookingReference())
                .user(user)
                .type(Booking.BookingType.TRANSPORT)
                .transportType(Booking.TransportType.valueOf(request.getTransportType()))
                .departureLocation(request.getDepartureLocation())
                .arrivalLocation(request.getArrivalLocation())
                .departureDate(request.getDepartureDate())
                .arrivalDate(request.getArrivalDate())
                .numberOfGuests(request.getNumberOfGuests())
                .numberOfAdults(request.getNumberOfAdults())
                .numberOfChildren(request.getNumberOfChildren())
                .totalAmount(new BigDecimal("150.00")) // Mock price
                .currency("USD")
                .status(Booking.BookingStatus.PENDING)
                .paymentStatus(Booking.PaymentStatus.PENDING)
                .contactName(request.getContactName())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .specialRequests(request.getSpecialRequests())
                .externalBookingId("TRANS-" + UUID.randomUUID().toString().substring(0, 8))
                .externalSource("MockTransportAPI")
                .build();
        
        booking = bookingRepository.save(booking);
        
        return convertToBookingResponseDTO(booking);
    }
    
    public List<BookingResponseDTO> getUserBookings(String userEmail) {
        log.info("Getting bookings for user: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Booking> bookings = bookingRepository.findByUserOrderByCreatedAtDesc(user);
        
        return bookings.stream()
                .map(this::convertToBookingResponseDTO)
                .collect(Collectors.toList());
    }
    
    public BookingResponseDTO getBookingById(Long bookingId, String userEmail) {
        log.info("Getting booking {} for user: {}", bookingId, userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to booking");
        }
        
        return convertToBookingResponseDTO(booking);
    }
    
    public BookingResponseDTO getBookingByReference(String bookingReference, String userEmail) {
        log.info("Getting booking with reference {} for user: {}", bookingReference, userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to booking");
        }
        
        return convertToBookingResponseDTO(booking);
    }
    
    public BookingResponseDTO cancelBooking(Long bookingId, String userEmail, String reason) {
        log.info("Cancelling booking {} for user: {}", bookingId, userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to booking");
        }
        
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }
        
        if (booking.getCancellationDeadline() != null && 
            LocalDateTime.now().isAfter(booking.getCancellationDeadline())) {
            throw new RuntimeException("Cancellation deadline has passed");
        }
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        // In production, also handle refund processing
        
        booking = bookingRepository.save(booking);
        
        return convertToBookingResponseDTO(booking);
    }
    
    public List<BookingResponseDTO> getUpcomingBookings(String userEmail) {
        log.info("Getting upcoming bookings for user: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Booking> upcomingBookings = bookingRepository.findUpcomingBookingsByUser(user, LocalDate.now());
        
        return upcomingBookings.stream()
                .map(this::convertToBookingResponseDTO)
                .collect(Collectors.toList());
    }
    
    public List<BookingResponseDTO> getPastBookings(String userEmail) {
        log.info("Getting past bookings for user: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Booking> pastBookings = bookingRepository.findPastBookingsByUser(user, LocalDate.now());
        
        return pastBookings.stream()
                .map(this::convertToBookingResponseDTO)
                .collect(Collectors.toList());
    }
    
    public Map<String, Object> getUserBookingStats(String userEmail) {
        log.info("Getting booking statistics for user: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        long totalBookings = bookingRepository.countBookingsByUser(user);
        Double totalSpent = bookingRepository.getTotalSpentByUser(user);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", totalBookings);
        stats.put("totalSpent", totalSpent != null ? totalSpent : 0.0);
        stats.put("currency", user.getPreferredCurrency());
        
        return stats;
    }
    
    private String generateBookingReference() {
        return "RMY" + System.currentTimeMillis();
    }
    
    private BookingResponseDTO convertToBookingResponseDTO(Booking booking) {
        return convertToBookingResponseDTO(booking, null);
    }
    
    private BookingResponseDTO convertToBookingResponseDTO(Booking booking, BookingRequestDTO request) {
        BookingResponseDTO.BookingResponseDTOBuilder builder = BookingResponseDTO.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .type(booking.getType().name())
                .status(booking.getStatus().name())
                .paymentStatus(booking.getPaymentStatus() != null ? booking.getPaymentStatus().name() : null)
                .totalAmount(booking.getTotalAmount())
                .currency(booking.getCurrency())
                .numberOfGuests(booking.getNumberOfGuests())
                .numberOfAdults(booking.getNumberOfAdults())
                .numberOfChildren(booking.getNumberOfChildren())
                .contactName(booking.getContactName())
                .contactEmail(booking.getContactEmail())
                .contactPhone(booking.getContactPhone())
                .specialRequests(booking.getSpecialRequests())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .cancellationDeadline(booking.getCancellationDeadline())
                .cancellationPolicy(booking.getCancellationPolicy())
                .externalBookingId(booking.getExternalBookingId())
                .externalSource(booking.getExternalSource());
        
        if (booking.getType() == Booking.BookingType.HOTEL) {
            long numberOfNights = booking.getCheckInDate() != null && booking.getCheckOutDate() != null ?
                    ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate()) : 0;
            
            // Use hotel entity data if available, otherwise use request payload data
            if (booking.getHotel() != null) {
                builder.hotelDetails(BookingResponseDTO.HotelBookingDetailsDTO.builder()
                        .hotelId(booking.getHotel().getId())
                        .hotelName(booking.getHotel().getName())
                        .hotelAddress(booking.getHotel().getAddress())
                        .roomId(booking.getRoom() != null ? booking.getRoom().getId() : null)
                        .roomType(booking.getRoom() != null ? booking.getRoom().getRoomType().name() : (request != null ? request.getRoomType() : null))
                        .roomNumber(booking.getRoom() != null ? booking.getRoom().getRoomNumber() : null)
                        .checkInDate(booking.getCheckInDate())
                        .checkOutDate(booking.getCheckOutDate())
                        .numberOfNights((int) numberOfNights)
                        .pricePerNight(booking.getRoom() != null ? booking.getRoom().getBasePrice() : booking.getHotel().getPricePerNight())
                        .build());
            } else if (request != null) {
                // Use data from the request payload when hotel entity doesn't exist
                BigDecimal estimatedPricePerNight = numberOfNights > 0 ? 
                    booking.getTotalAmount().divide(BigDecimal.valueOf(numberOfNights), 2, java.math.RoundingMode.HALF_UP) : 
                    booking.getTotalAmount();
                    
                builder.hotelDetails(BookingResponseDTO.HotelBookingDetailsDTO.builder()
                        .hotelId(request.getHotelId())
                        .hotelName(request.getHotelName())
                        .hotelAddress("External Hotel Address") // Default since not in payload
                        .roomId(request.getRoomId())
                        .roomType(request.getRoomType())
                        .roomNumber(null) // Not available in payload
                        .checkInDate(booking.getCheckInDate())
                        .checkOutDate(booking.getCheckOutDate())
                        .numberOfNights((int) numberOfNights)
                        .pricePerNight(estimatedPricePerNight)
                        .build());
            }
        }
        
        if (booking.getType() == Booking.BookingType.TRANSPORT) {
            builder.transportDetails(BookingResponseDTO.TransportBookingDetailsDTO.builder()
                    .transportType(booking.getTransportType() != null ? booking.getTransportType().name() : null)
                    .provider(booking.getExternalSource())
                    .departureLocation(booking.getDepartureLocation())
                    .arrivalLocation(booking.getArrivalLocation())
                    .departureDate(booking.getDepartureDate())
                    .arrivalDate(booking.getArrivalDate())
                    .duration(calculateDuration(booking.getDepartureDate(), booking.getArrivalDate()))
                    .build());
        }
        
        return builder.build();
    }
    
    private String calculateDuration(LocalDateTime departure, LocalDateTime arrival) {
        if (departure == null || arrival == null) return null;
        
        long minutes = ChronoUnit.MINUTES.between(departure, arrival);
        long hours = minutes / 60;
        long remainingMinutes = minutes % 60;
        
        return hours + "h " + remainingMinutes + "m";
    }
}