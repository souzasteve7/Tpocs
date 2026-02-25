package com.roamy.controller;

import com.roamy.dto.BookingRequestDTO;
import com.roamy.dto.BookingResponseDTO;
import com.roamy.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookingController {
    
    private final BookingService bookingService;
    
    @PostMapping("/hotel")
    public ResponseEntity<BookingResponseDTO> bookHotel(
            @Valid @RequestBody BookingRequestDTO bookingRequest,
            Authentication authentication
    ) {
        try {
            log.info("Creating hotel booking for user: {}", authentication.getName());
            log.info("Booking request details: {}", bookingRequest);
            
            BookingResponseDTO response = bookingService.createHotelBooking(bookingRequest, authentication.getName());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error creating hotel booking for user: {}", authentication.getName(), e);
            throw e; // Let the global exception handler deal with it
        }
    }
    
    @PostMapping("/transport")
    public ResponseEntity<BookingResponseDTO> bookTransport(
            @Valid @RequestBody BookingRequestDTO bookingRequest,
            Authentication authentication
    ) {
        try {
            log.info("Creating transport booking for user: {}", authentication.getName());
            log.info("Booking request details: {}", bookingRequest);
            
            BookingResponseDTO response = bookingService.createTransportBooking(bookingRequest, authentication.getName());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error creating transport booking for user: {}", authentication.getName(), e);
            throw e; // Let the global exception handler deal with it
        }
    }
    
    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getUserBookings(Authentication authentication) {
        log.info("Fetching bookings for user: {}", authentication.getName());
        
        List<BookingResponseDTO> bookings = bookingService.getUserBookings(authentication.getName());
        
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponseDTO> getBookingById(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {
        log.info("Fetching booking {} for user: {}", bookingId, authentication.getName());
        
        BookingResponseDTO booking = bookingService.getBookingById(bookingId, authentication.getName());
        
        return ResponseEntity.ok(booking);
    }
    
    @GetMapping("/reference/{bookingReference}")
    public ResponseEntity<BookingResponseDTO> getBookingByReference(
            @PathVariable String bookingReference,
            Authentication authentication
    ) {
        log.info("Fetching booking with reference {} for user: {}", bookingReference, authentication.getName());
        
        BookingResponseDTO booking = bookingService.getBookingByReference(bookingReference, authentication.getName());
        
        return ResponseEntity.ok(booking);
    }
    
    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long bookingId,
            @RequestParam(required = false) String reason,
            Authentication authentication
    ) {
        log.info("Cancelling booking {} for user: {} with reason: {}", bookingId, authentication.getName(), reason);
        
        BookingResponseDTO response = bookingService.cancelBooking(bookingId, authentication.getName(), reason);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<BookingResponseDTO>> getUpcomingBookings(Authentication authentication) {
        log.info("Fetching upcoming bookings for user: {}", authentication.getName());
        
        List<BookingResponseDTO> upcomingBookings = bookingService.getUpcomingBookings(authentication.getName());
        
        return ResponseEntity.ok(upcomingBookings);
    }
    
    @GetMapping("/past")
    public ResponseEntity<List<BookingResponseDTO>> getPastBookings(Authentication authentication) {
        log.info("Fetching past bookings for user: {}", authentication.getName());
        
        List<BookingResponseDTO> pastBookings = bookingService.getPastBookings(authentication.getName());
        
        return ResponseEntity.ok(pastBookings);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getUserBookingStats(Authentication authentication) {
        log.info("Fetching booking statistics for user: {}", authentication.getName());
        
        var stats = bookingService.getUserBookingStats(authentication.getName());
        
        return ResponseEntity.ok(stats);
    }
}