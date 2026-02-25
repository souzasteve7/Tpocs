package com.roamy.repository;

import com.roamy.entity.Booking;
import com.roamy.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    Optional<Booking> findByBookingReference(String bookingReference);
    
    List<Booking> findByUser(User user);
    
    List<Booking> findByUserOrderByCreatedAtDesc(User user);
    
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    List<Booking> findByUserAndStatus(User user, Booking.BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.user = :user AND b.type = :type ORDER BY b.createdAt DESC")
    List<Booking> findByUserAndType(@Param("user") User user, @Param("type") Booking.BookingType type);
    
    @Query("SELECT b FROM Booking b WHERE b.checkInDate >= :startDate AND b.checkInDate <= :endDate")
    List<Booking> findByCheckInDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT b FROM Booking b WHERE b.user = :user AND b.checkInDate >= :date")
    List<Booking> findUpcomingBookingsByUser(@Param("user") User user, @Param("date") LocalDate date);
    
    @Query("SELECT b FROM Booking b WHERE b.user = :user AND b.checkOutDate < :date")
    List<Booking> findPastBookingsByUser(@Param("user") User user, @Param("date") LocalDate date);
    
    @Query("SELECT b FROM Booking b WHERE b.cancellationDeadline < :now AND b.status = 'CONFIRMED'")
    List<Booking> findBookingsPastCancellationDeadline(@Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.user = :user")
    long countBookingsByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    long countBookingsByStatus(@Param("status") Booking.BookingStatus status);
    
    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.user = :user AND b.status = 'CONFIRMED'")
    Double getTotalSpentByUser(@Param("user") User user);
    
    // Pagination versions
    Page<Booking> findByUser(User user, Pageable pageable);
    
    Page<Booking> findByUserAndStatus(User user, Booking.BookingStatus status, Pageable pageable);
    
    // Recent bookings for analytics
    @Query("SELECT b FROM Booking b WHERE b.createdAt >= :since")
    List<Booking> findRecentBookings(@Param("since") LocalDateTime since);
    
    @Query("SELECT b FROM Booking b WHERE b.paymentStatus = :paymentStatus")
    List<Booking> findByPaymentStatus(@Param("paymentStatus") Booking.PaymentStatus paymentStatus);
}