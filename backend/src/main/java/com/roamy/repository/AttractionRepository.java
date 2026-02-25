package com.roamy.repository;

import com.roamy.entity.Attraction;
import com.roamy.entity.Destination;
import com.roamy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AttractionRepository extends JpaRepository<Attraction, Long> {
    
    List<Attraction> findByActiveTrue();
    
    List<Attraction> findByDestination(Destination destination);
    
    List<Attraction> findByDestinationAndActiveTrue(Destination destination);
    
    @Query("SELECT a FROM Attraction a WHERE a.destination = :destination AND a.active = true ORDER BY a.averageRating DESC")
    List<Attraction> findByDestinationOrderByRating(@Param("destination") Destination destination);
    
    @Query("SELECT a FROM Attraction a WHERE a.destination = :destination AND a.active = true ORDER BY a.popularityScore DESC")
    List<Attraction> findByDestinationOrderByPopularity(@Param("destination") Destination destination);
    
    @Query("SELECT a FROM Attraction a JOIN a.matchingInterests i WHERE i IN :interests AND a.active = true")
    List<Attraction> findByInterestsIn(@Param("interests") List<User.TravelInterest> interests);
    
    @Query("SELECT a FROM Attraction a WHERE a.destination = :destination AND a.type = :type AND a.active = true")
    List<Attraction> findByDestinationAndType(@Param("destination") Destination destination,
                                              @Param("type") Attraction.AttractionType type);
    
    @Query("SELECT a FROM Attraction a WHERE a.freeEntry = true AND a.active = true")
    List<Attraction> findFreeAttractions();
    
    @Query("SELECT a FROM Attraction a WHERE a.destination = :destination AND a.freeEntry = true AND a.active = true")
    List<Attraction> findFreeAttractionsByDestination(@Param("destination") Destination destination);
    
    @Query("SELECT a FROM Attraction a WHERE a.entryFee <= :maxFee AND a.active = true ORDER BY a.entryFee ASC")
    List<Attraction> findByMaxEntryFee(@Param("maxFee") BigDecimal maxFee);
    
    @Query("SELECT a FROM Attraction a WHERE a.kidsFriendly = true AND a.active = true")
    List<Attraction> findKidsFriendlyAttractions();
    
    @Query("SELECT a FROM Attraction a WHERE a.wheelchairAccessible = true AND a.active = true")
    List<Attraction> findAccessibleAttractions();
    
    @Query("SELECT a FROM Attraction a WHERE a.name LIKE %:searchTerm% OR a.description LIKE %:searchTerm% AND a.active = true")
    List<Attraction> searchByNameOrDescription(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT a FROM Attraction a WHERE a.featured = true AND a.active = true ORDER BY a.popularityScore DESC")
    List<Attraction> findFeaturedAttractions();
    
    @Query("SELECT a FROM Attraction a WHERE a.averageRating >= :minRating AND a.active = true ORDER BY a.averageRating DESC")
    List<Attraction> findByMinimumRating(@Param("minRating") BigDecimal minRating);
    
    // Geolocation-based queries
    @Query(value = "SELECT *, " +
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(latitude)) * " +
            "cos(radians(longitude) - radians(:longitude)) + sin(radians(:latitude)) * " +
            "sin(radians(latitude)))) AS distance " +
            "FROM attractions a WHERE a.active = true " +
            "HAVING distance < :radiusKm ORDER BY distance",
            nativeQuery = true)
    List<Attraction> findNearbyAttractions(@Param("latitude") BigDecimal latitude,
                                           @Param("longitude") BigDecimal longitude,
                                           @Param("radiusKm") double radiusKm);
    
    @Query("SELECT a FROM Attraction a JOIN a.matchingInterests i WHERE a.destination = :destination AND i IN :interests AND a.active = true")
    List<Attraction> findByDestinationAndInterests(@Param("destination") Destination destination,
                                                   @Param("interests") List<User.TravelInterest> interests);
}