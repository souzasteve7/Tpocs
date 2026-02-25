package com.roamy.controller;

import com.roamy.dto.SearchRequestDTO;
import com.roamy.dto.SearchResponseDTO;
import com.roamy.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class SearchController {
    
    private final SearchService searchService;
    
    @PostMapping("/places")
    public ResponseEntity<SearchResponseDTO> searchPlaces(@Valid @RequestBody SearchRequestDTO searchRequest) {
        log.info("Searching places with request: {}", searchRequest);
        
        SearchResponseDTO response = searchService.searchPlaces(searchRequest);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/destinations")
    public ResponseEntity<List<SearchResponseDTO.DestinationDTO>> getAllDestinations() {
        log.info("Fetching all destinations");
        
        List<SearchResponseDTO.DestinationDTO> destinations = searchService.getAllDestinations();
        
        return ResponseEntity.ok(destinations);
    }
    
    @GetMapping("/destinations/search")
    public ResponseEntity<List<SearchResponseDTO.DestinationDTO>> searchDestinations(@RequestParam String query) {
        log.info("Searching destinations with query: {}", query);
        
        List<SearchResponseDTO.DestinationDTO> destinations = searchService.searchDestinations(query);
        
        return ResponseEntity.ok(destinations);
    }
    
    @GetMapping("/destinations/{destinationId}/hotels")
    public ResponseEntity<List<SearchResponseDTO.HotelDTO>> getHotelsByDestination(
            @PathVariable Long destinationId,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer minRating
    ) {
        log.info("Fetching hotels for destination ID: {}", destinationId);
        
        List<SearchResponseDTO.HotelDTO> hotels = searchService.getHotelsByDestination(
                destinationId, sortBy, sortOrder, minPrice, maxPrice, minRating
        );
        
        return ResponseEntity.ok(hotels);
    }
    
    @GetMapping("/destinations/{destinationId}/attractions")
    public ResponseEntity<List<SearchResponseDTO.AttractionDTO>> getAttractionsByDestination(
            @PathVariable Long destinationId,
            @RequestParam(required = false) List<String> interests
    ) {
        log.info("Fetching attractions for destination ID: {} with interests: {}", destinationId, interests);
        
        List<SearchResponseDTO.AttractionDTO> attractions = searchService.getAttractionsByDestination(destinationId, interests);
        
        return ResponseEntity.ok(attractions);
    }
    
    @GetMapping("/transport")
    public ResponseEntity<List<SearchResponseDTO.TransportOptionDTO>> searchTransport(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam String date,
            @RequestParam(required = false) List<String> transportTypes
    ) {
        log.info("Searching transport from {} to {} on {}", from, to, date);
        
        List<SearchResponseDTO.TransportOptionDTO> transportOptions = 
                searchService.searchTransport(from, to, date, transportTypes);
        
        return ResponseEntity.ok(transportOptions);
    }
    
    @GetMapping("/recommendations")
    public ResponseEntity<SearchResponseDTO> getRecommendations(
            @RequestParam String destination,
            @RequestParam(required = false) List<String> interests,
            @RequestParam(required = false) String budgetLevel
    ) {
        log.info("Getting recommendations for destination: {} with interests: {} and budget: {}", 
                destination, interests, budgetLevel);
        
        SearchResponseDTO recommendations = searchService.getRecommendations(destination, interests, budgetLevel);
        
        return ResponseEntity.ok(recommendations);
    }
    
    @GetMapping("/trending")
    public ResponseEntity<List<SearchResponseDTO.DestinationDTO>> getTrendingDestinations() {
        log.info("Fetching trending destinations");
        
        List<SearchResponseDTO.DestinationDTO> trendingDestinations = searchService.getTrendingDestinations();
        
        return ResponseEntity.ok(trendingDestinations);
    }
}