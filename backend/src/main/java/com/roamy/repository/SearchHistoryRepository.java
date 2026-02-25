package com.roamy.repository;

import com.roamy.entity.SearchHistory;
import com.roamy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    
    List<SearchHistory> findByUser(User user);
    
    List<SearchHistory> findByUserOrderBySearchDateDesc(User user);
    
    @Query("SELECT s FROM SearchHistory s WHERE s.user = :user ORDER BY s.searchDate DESC")
    List<SearchHistory> findRecentSearchesByUser(@Param("user") User user);
    
    @Query("SELECT s FROM SearchHistory s WHERE s.toLocation = :destination")
    List<SearchHistory> findByDestination(@Param("destination") String destination);
    
    @Query("SELECT s.toLocation, COUNT(s) as searchCount FROM SearchHistory s GROUP BY s.toLocation ORDER BY searchCount DESC")
    List<Object[]> findMostSearchedDestinations();
    
    @Query("SELECT s FROM SearchHistory s WHERE s.searchDate >= :since")
    List<SearchHistory> findRecentSearches(@Param("since") LocalDateTime since);
    
    @Query("SELECT s FROM SearchHistory s WHERE s.convertedToBooking = true")
    List<SearchHistory> findConvertedSearches();
    
    @Query("SELECT s FROM SearchHistory s WHERE s.user = :user AND s.convertedToBooking = true")
    List<SearchHistory> findConvertedSearchesByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(s) FROM SearchHistory s WHERE s.user = :user")
    long countSearchesByUser(@Param("user") User user);
    
    @Query("SELECT s FROM SearchHistory s WHERE s.sessionId = :sessionId ORDER BY s.searchDate DESC")
    List<SearchHistory> findBySessionId(@Param("sessionId") String sessionId);
    
    // Analytics queries
    @Query("SELECT FUNCTION('DATE', s.searchDate), COUNT(s) FROM SearchHistory s WHERE s.searchDate >= :since GROUP BY FUNCTION('DATE', s.searchDate) ORDER BY FUNCTION('DATE', s.searchDate)")
    List<Object[]> getSearchCountByDate(@Param("since") LocalDateTime since);
    
    @Query("SELECT s.toLocation, COUNT(s) FROM SearchHistory s WHERE s.searchDate >= :since GROUP BY s.toLocation ORDER BY COUNT(s) DESC")
    List<Object[]> getTrendingDestinations(@Param("since") LocalDateTime since);
    
    @Query("SELECT AVG(s.maxBudget - s.minBudget) FROM SearchHistory s WHERE s.minBudget IS NOT NULL AND s.maxBudget IS NOT NULL")
    Double getAverageBudgetRange();
}