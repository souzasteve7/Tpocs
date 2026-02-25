package com.roamy.dto;

import com.roamy.entity.User;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class SearchRequestDTO {
    
    private String fromLocation;
    private String toLocation;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    
    private Integer numberOfGuests = 1;
    private Integer numberOfAdults = 1;
    private Integer numberOfChildren = 0;
    
    // Budget preferences
    private Double minBudget;
    private Double maxBudget;
    private String budgetCurrency = "USD";
    
    // Travel interests
    private List<User.TravelInterest> interests;
    
    // Hotel preferences
    private Integer minHotelRating;
    private Integer maxHotelRating;
    private List<String> requiredAmenities;
    private String preferredRoomType;
    
    // Transport preferences
    private List<String> preferredTransportTypes;
    
    // Filters
    private String sortBy = "price"; // price, rating, distance, popularity
    private String sortOrder = "asc"; // asc, desc
    
    private Integer page = 0;
    private Integer size = 20;
}