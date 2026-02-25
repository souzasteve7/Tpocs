package com.roamy.repository;

import com.roamy.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    
    List<Hotel> findByDestination_Id(Long destinationId);
    
    @Query("SELECT h FROM Hotel h WHERE h.destination.id = :destinationId " +
           "AND h.pricePerNight BETWEEN :minPrice AND :maxPrice")
    List<Hotel> findByDestinationAndPriceRange(
        @Param("destinationId") Long destinationId,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice
    );
    
    @Query("SELECT h FROM Hotel h WHERE h.destination.id = :destinationId " +
           "AND h.averageRating >= :minRating ORDER BY h.averageRating DESC")
    List<Hotel> findByDestinationAndMinRating(
        @Param("destinationId") Long destinationId,
        @Param("minRating") BigDecimal minRating
    );
    
    @Query("SELECT h FROM Hotel h WHERE UPPER(h.name) LIKE UPPER(CONCAT('%', :name, '%'))")
    List<Hotel> findByNameContainingIgnoreCase(@Param("name") String name);
    
    @Query("SELECT h FROM Hotel h WHERE h.destination.id = :destinationId " +
           "AND :amenity MEMBER OF h.amenities")
    List<Hotel> findByDestinationAndAmenity(
        @Param("destinationId") Long destinationId,
        @Param("amenity") Hotel.Amenity amenity
    );
    
    List<Hotel> findByStarRating(Hotel.StarRating starRating);
    
    @Query("SELECT h FROM Hotel h WHERE h.destination.id = :destinationId " +
           "AND h.available = true ORDER BY h.averageRating DESC, h.pricePerNight ASC")
    List<Hotel> findByDestinationOrderByRatingAndPrice(@Param("destinationId") Long destinationId);
}