package com.roamy.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.InvalidDataAccessApiUsageException;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        log.error("Runtime exception occurred: ", e);
        
        Map<String, String> errorResponse = new HashMap<>();
        String message = e.getMessage();
        
        // Handle specific error messages
        if (message != null) {
            if (message.contains("Email already exists") || message.contains("email already exists")) {
                errorResponse.put("message", "An account with this email address already exists. Please try logging in instead.");
                errorResponse.put("error", "EMAIL_ALREADY_EXISTS");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }
            
            if (message.contains("User not found") || message.contains("user not found")) {
                errorResponse.put("message", "No account found with this email address. Please check your email or create a new account.");
                errorResponse.put("error", "USER_NOT_FOUND");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            if (message.contains("Invalid credentials") || message.contains("invalid credentials")) {
                errorResponse.put("message", "Invalid email or password. Please check your credentials and try again.");
                errorResponse.put("error", "INVALID_CREDENTIALS");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
            if (message.contains("Account not verified") || message.contains("account not verified")) {
                errorResponse.put("message", "Please verify your email address before logging in. Check your inbox for a verification email.");
                errorResponse.put("error", "ACCOUNT_NOT_VERIFIED");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            }
            
            if (message.contains("Account disabled") || message.contains("account disabled")) {
                errorResponse.put("message", "Your account has been disabled. Please contact support for assistance.");
                errorResponse.put("error", "ACCOUNT_DISABLED");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            }
        }
        
        // Default error message for other runtime exceptions
        errorResponse.put("message", message != null ? message : "An internal server error occurred. Please try again later.");
        errorResponse.put("error", "INTERNAL_ERROR");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(BadCredentialsException e) {
        log.error("Bad credentials exception: ", e);
        
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Invalid email or password. Please check your credentials and try again.");
        errorResponse.put("error", "INVALID_CREDENTIALS");
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationException(AuthenticationException e) {
        log.error("Authentication exception: ", e);
        
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Authentication failed. Please check your credentials and try again.");
        errorResponse.put("error", "AUTHENTICATION_FAILED");
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException e) {
        log.error("Validation exception: ", e);
        
        Map<String, Object> errorResponse = new HashMap<>();
        
        // Get field-specific validation errors
        Map<String, String> fieldErrors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                    FieldError::getField,
                    fieldError -> fieldError.getDefaultMessage() != null ? fieldError.getDefaultMessage() : "Invalid value"
                ));
        
        // Get general validation errors
        String generalErrors = e.getBindingResult()
                .getGlobalErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining(", "));
        
        errorResponse.put("message", "Please check your input and try again.");
        errorResponse.put("error", "VALIDATION_ERROR");
        errorResponse.put("fieldErrors", fieldErrors);
        
        if (!generalErrors.isEmpty()) {
            errorResponse.put("generalErrors", generalErrors);
        }
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException e) {
        log.error("Illegal argument exception: ", e);
        
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", e.getMessage() != null ? e.getMessage() : "Invalid request data provided.");
        errorResponse.put("error", "INVALID_ARGUMENT");
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception e) {
        log.error("Unexpected exception occurred: ", e);
        
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "An unexpected error occurred. Please try again later or contact support if the issue persists.");
        errorResponse.put("error", "UNEXPECTED_ERROR");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFoundException(UserNotFoundException e) {
        log.error("User not found: ", e);
        
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "No account found with this email address. Please check your email or create a new account.");
        errorResponse.put("error", "USER_NOT_FOUND");
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleBookingNotFoundException(BookingNotFoundException e) {
        log.error("Booking not found: ", e);
        
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Booking not found or you don't have permission to access it.");
        errorResponse.put("error", "BOOKING_NOT_FOUND");
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(InvalidDataAccessApiUsageException.class)
    public ResponseEntity<Map<String, String>> handleInvalidDataAccessApiUsageException(InvalidDataAccessApiUsageException e) {
        log.error("Database error occurred: ", e);
        
        Map<String, String> errorResponse = new HashMap<>();
        
        // Check for specific Hibernate TransientPropertyValueException
        if (e.getCause() != null && e.getCause().getMessage() != null) {
            String causeMessage = e.getCause().getMessage();
            if (causeMessage.contains("TransientPropertyValueException") || 
                causeMessage.contains("object references an unsaved transient instance")) {
                errorResponse.put("message", "Unable to complete booking due to data validation error. Please try again.");
                errorResponse.put("error", "BOOKING_DATA_ERROR");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
        }
        
        // Default database error message
        errorResponse.put("message", "A database error occurred. Please try again or contact support if the problem persists.");
        errorResponse.put("error", "DATABASE_ERROR");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}