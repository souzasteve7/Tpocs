package com.roamy.repository;

import com.roamy.entity.Destination;
import com.roamy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
    
    List<Destination> findByActiveTrue();
    
    Optional<Destination> findByNameIgnoreCase(String name);
    
    List<Destination> findByCityIgnoreCase(String city);
    
    List<Destination> findByCountryIgnoreCase(String country);
    
    List<Destination> findByCountryCodeIgnoreCase(String countryCode);
    
    @Query("SELECT d FROM Destination d WHERE d.name LIKE %:searchTerm% OR d.city LIKE %:searchTerm% OR d.country LIKE %:searchTerm%")
    List<Destination> searchByNameCityOrCountry(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT d FROM Destination d JOIN d.popularInterests i WHERE i IN :interests AND d.active = true")
    List<Destination> findByInterestsIn(@Param("interests") List<User.TravelInterest> interests);
    
    @Query("SELECT d FROM Destination d WHERE d.budgetDailyCost <= :maxBudget AND d.active = true ORDER BY d.budgetDailyCost ASC")
    List<Destination> findByBudgetRange(@Param("maxBudget") BigDecimal maxBudget);
    
    @Query("SELECT d FROM Destination d WHERE d.averageRating >= :minRating AND d.active = true ORDER BY d.averageRating DESC")
    List<Destination> findByMinimumRating(@Param("minRating") BigDecimal minRating);
    
    @Query("SELECT d FROM Destination d WHERE d.active = true ORDER BY d.popularityScore DESC")
    List<Destination> findTopDestinationsByPopularity();
    
    @Query("SELECT d FROM Destination d WHERE d.active = true ORDER BY d.averageRating DESC, d.totalReviews DESC")
    List<Destination> findTopRatedDestinations();
    
    // Geolocation-based queries
    @Query(value = "SELECT *, " +
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(latitude)) * " +
            "cos(radians(longitude) - radians(:longitude)) + sin(radians(:latitude)) * " +
            "sin(radians(latitude)))) AS distance " +
            "FROM destinations d WHERE d.active = true " +
            "HAVING distance < :radiusKm ORDER BY distance",
            nativeQuery = true)
    List<Destination> findNearbyDestinations(@Param("latitude") BigDecimal latitude, 
                                           @Param("longitude") BigDecimal longitude, 
                                           @Param("radiusKm") double radiusKm);
}