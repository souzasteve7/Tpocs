package com.roamy.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    
    private String accessToken;
    
    @Builder.Default
    private String tokenType = "Bearer";
    
    private Long expiresIn;
    
    private String refreshToken;
    
    private UserProfileDTO user;
}