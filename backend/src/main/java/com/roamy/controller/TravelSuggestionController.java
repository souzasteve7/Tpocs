package com.roamy.controller;

import com.roamy.dto.TravelSuggestionRequestDTO;
import com.roamy.dto.TravelSuggestionResponseDTO;
import com.roamy.service.TravelSuggestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/suggestions")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class TravelSuggestionController {
    
    private final TravelSuggestionService travelSuggestionService;
    
    @PostMapping("/comprehensive")
    public ResponseEntity<TravelSuggestionResponseDTO> getComprehensiveTravelSuggestions(
            @Valid @RequestBody TravelSuggestionRequestDTO request) {
        log.info("Getting comprehensive travel suggestions from {} to {} with interests: {}", 
                request.getFromLocation(), request.getToLocation(), request.getInterests());
        
        TravelSuggestionResponseDTO suggestions = travelSuggestionService.getComprehensiveSuggestions(request);
        
        return ResponseEntity.ok(suggestions);
    }
    
    @GetMapping("/quick")
    public ResponseEntity<TravelSuggestionResponseDTO> getQuickSuggestions(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam(required = false) String budget,
            @RequestParam(required = false) String[] interests) {
        
        log.info("Getting quick travel suggestions from {} to {}", from, to);
        
        TravelSuggestionRequestDTO request = TravelSuggestionRequestDTO.builder()
                .fromLocation(from)
                .toLocation(to)
                .budgetLevel(budget)
                .interests(interests != null ? java.util.Arrays.asList(interests) : null)
                .build();
        
        TravelSuggestionResponseDTO suggestions = travelSuggestionService.getComprehensiveSuggestions(request);
        
        return ResponseEntity.ok(suggestions);
    }
    
    @GetMapping("/destination/{destinationName}")
    public ResponseEntity<TravelSuggestionResponseDTO> getDestinationSuggestions(
            @PathVariable String destinationName,
            @RequestParam(required = false) String budget,
            @RequestParam(required = false) String[] interests,
            @RequestParam(required = false) Integer days) {
        
        log.info("Getting destination-specific suggestions for: {}", destinationName);
        
        TravelSuggestionRequestDTO request = TravelSuggestionRequestDTO.builder()
                .toLocation(destinationName)
                .budgetLevel(budget)
                .interests(interests != null ? java.util.Arrays.asList(interests) : null)
                .durationDays(days != null ? days : 7)
                .build();
        
        TravelSuggestionResponseDTO suggestions = travelSuggestionService.getDestinationSpecificSuggestions(request);
        
        return ResponseEntity.ok(suggestions);
    }
    
    @PostMapping("/itinerary")
    public ResponseEntity<TravelSuggestionResponseDTO> generateItinerary(
            @Valid @RequestBody TravelSuggestionRequestDTO request) {
        log.info("Generating travel itinerary for {} days from {} to {}", 
                request.getDurationDays(), request.getFromLocation(), request.getToLocation());
        
        TravelSuggestionResponseDTO itinerary = travelSuggestionService.generateTravelItinerary(request);
        
        return ResponseEntity.ok(itinerary);
    }
}