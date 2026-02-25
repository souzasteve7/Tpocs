package com.roamy.controller;

import com.roamy.dto.*;
import com.roamy.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody UserRegistrationDTO registrationRequest) {
        log.info("User registration attempt for email: {}", registrationRequest.getEmail());
        
        String result = userService.registerUser(registrationRequest);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", result));
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        log.info("User login attempt for email: {}", loginRequest.getEmail());
        
        LoginResponseDTO response = userService.authenticateUser(loginRequest);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refreshToken(
            @RequestHeader("Authorization") String refreshToken
    ) {
        log.info("Token refresh attempt");
        
        LoginResponseDTO response = userService.refreshToken(refreshToken);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(Authentication authentication) {
        try {
            if (authentication != null && authentication.getName() != null) {
                log.info("User logout for: {}", authentication.getName());
                userService.logoutUser(authentication.getName());
            } else {
                log.info("Anonymous user logout attempt");
            }
        } catch (Exception e) {
            log.warn("Error during logout: {}", e.getMessage());
            // Continue with logout even if there's an error
        }
        
        return ResponseEntity.ok(Map.of("message", "Successfully logged out"));
    }
    
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile(Authentication authentication) {
        log.info("Fetching profile for user: {}", authentication.getName());
        
        UserProfileDTO profile = userService.getUserProfile(authentication.getName());
        
        return ResponseEntity.ok(profile);
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(
            @Valid @RequestBody UserRegistrationDTO updateRequest,
            Authentication authentication
    ) {
        log.info("Updating profile for user: {}", authentication.getName());
        
        UserProfileDTO updatedProfile = userService.updateUserProfile(authentication.getName(), updateRequest);
        
        return ResponseEntity.ok(updatedProfile);
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody PasswordChangeRequestDTO passwordChangeRequest,
            Authentication authentication
    ) {
        log.info("Password change request for user: {}", authentication.getName());
        
        userService.changePassword(authentication.getName(), passwordChangeRequest);
        
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @Valid @RequestBody PasswordResetRequestDTO resetRequest
    ) {
        log.info("Password reset request for email: {}", resetRequest.getEmail());
        
        userService.initiatePasswordReset(resetRequest.getEmail());
        
        return ResponseEntity.ok(Map.of("message", "If the email exists, a reset link has been sent"));
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody PasswordResetConfirmDTO resetConfirm
    ) {
        log.info("Password reset confirmation attempt");
        
        userService.confirmPasswordReset(resetConfirm);
        
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }
    
    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(
            @RequestParam String token
    ) {
        log.info("Email verification attempt with token");
        
        userService.verifyEmail(token);
        
        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }
    
    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, String>> resendVerification(
            @RequestParam String email
    ) {
        log.info("Resend verification request for email: {}", email);
        
        userService.resendVerificationEmail(email);
        
        return ResponseEntity.ok(Map.of("message", "Verification email sent"));
    }
}