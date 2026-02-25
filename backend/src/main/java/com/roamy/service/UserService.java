package com.roamy.service;

import com.roamy.dto.*;
import com.roamy.entity.User;
import com.roamy.repository.UserRepository;
import com.roamy.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public String registerUser(UserRegistrationDTO registrationDTO) {
        log.info("Registering user with email: {}", registrationDTO.getEmail());
        
        if (userRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = User.builder()
                .email(registrationDTO.getEmail())
                .password(passwordEncoder.encode(registrationDTO.getPassword()))
                .firstName(registrationDTO.getFirstName())
                .lastName(registrationDTO.getLastName())
                .phoneNumber(registrationDTO.getPhoneNumber())
                .interests(registrationDTO.getInterests())
                .preferredCurrency(registrationDTO.getPreferredCurrency())
                .role(User.UserRole.USER)
                .enabled(true)
                .verified(false)
                .build();
        
        userRepository.save(user);
        
        return "User registered successfully. Please verify your email.";
    }
    
    public LoginResponseDTO authenticateUser(LoginRequestDTO loginRequest) {
        log.info("Authenticating user: {}", loginRequest.getEmail());
        
        // Authenticate user with Spring Security
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );
        
        // Generate JWT token
        String jwt = jwtUtil.generateJwtToken(authentication);
        
        // Get user details
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Return JWT response
        return LoginResponseDTO.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .expiresIn(86400L) // 24 hours
                .user(convertToUserProfileDTO(user))
                .build();
    }
    
    public LoginResponseDTO refreshToken(String refreshToken) {
        log.info("Refreshing token");
        throw new RuntimeException("Token refresh not implemented yet");
    }
    
    public void logoutUser(String userEmail) {
        log.info("Logging out user: {}", userEmail);
        
        if (userEmail == null || userEmail.trim().isEmpty()) {
            log.warn("Logout called with null or empty email");
            return;
        }
        
        try {
            // TODO: Implement token blacklisting if using JWT
            // For now, just log the successful logout
            log.info("User {} successfully logged out", userEmail);
        } catch (Exception e) {
            log.error("Error during logout for user {}: {}", userEmail, e.getMessage());
        }
    }
    
    public UserProfileDTO getUserProfile(String userEmail) {
        log.info("Getting profile for user: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return convertToUserProfileDTO(user);
    }
    
    public UserProfileDTO updateUserProfile(String userEmail, UserRegistrationDTO updateRequest) {
        log.info("Updating profile for user: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFirstName(updateRequest.getFirstName());
        user.setLastName(updateRequest.getLastName());
        user.setPhoneNumber(updateRequest.getPhoneNumber());
        user.setInterests(updateRequest.getInterests());
        user.setPreferredCurrency(updateRequest.getPreferredCurrency());
        
        userRepository.save(user);
        
        return convertToUserProfileDTO(user);
    }
    
    public void changePassword(String userEmail, PasswordChangeRequestDTO passwordChangeRequest) {
        log.info("Changing password for user: {}", userEmail);
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(passwordChangeRequest.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
        userRepository.save(user);
    }
    
    public void initiatePasswordReset(String email) {
        log.info("Initiating password reset for email: {}", email);
        // Implement password reset token generation and email sending
        throw new RuntimeException("Password reset not implemented yet");
    }
    
    public void confirmPasswordReset(PasswordResetConfirmDTO resetConfirm) {
        log.info("Confirming password reset");
        // Implement password reset confirmation
        throw new RuntimeException("Password reset confirmation not implemented yet");
    }
    
    public void verifyEmail(String token) {
        log.info("Verifying email with token");
        // Implement email verification
        throw new RuntimeException("Email verification not implemented yet");
    }
    
    public void resendVerificationEmail(String email) {
        log.info("Resending verification email for: {}", email);
        // Implement resend verification email
        throw new RuntimeException("Resend verification not implemented yet");
    }
    
    private UserProfileDTO convertToUserProfileDTO(User user) {
        return UserProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .enabled(user.getEnabled())
                .verified(user.getVerified())
                .interests(user.getInterests().stream()
                        .map(Enum::name)
                        .collect(Collectors.toList()))
                .preferredCurrency(user.getPreferredCurrency())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .totalBookings(0) // Calculate from booking repository
                .totalSpent(0.0)  // Calculate from booking repository
                .lastLoginAt(LocalDateTime.now())
                .build();
    }
}