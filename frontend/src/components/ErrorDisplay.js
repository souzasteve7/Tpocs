import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Typography,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const ErrorDisplay = ({ 
  error, 
  success, 
  warning, 
  info, 
  onClose, 
  title,
  severity,
  sx = {} 
}) => {
  // Determine the message and severity
  let message, alertSeverity, icon;
  
  if (error) {
    message = error;
    alertSeverity = 'error';
    icon = <ErrorIcon />;
  } else if (success) {
    message = success;
    alertSeverity = 'success';
    icon = <SuccessIcon />;
  } else if (warning) {
    message = warning;
    alertSeverity = 'warning';
    icon = <WarningIcon />;
  } else if (info) {
    message = info;
    alertSeverity = 'info';
    icon = <InfoIcon />;
  } else {
    return null;
  }

  // Override severity if provided
  if (severity) {
    alertSeverity = severity;
  }

  // Don't render if no message
  if (!message) {
    return null;
  }

  return (
    <Collapse in={!!message}>
      <Alert 
        severity={alertSeverity}
        icon={icon}
        action={
          onClose && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )
        }
        sx={{
          mb: 2,
          borderRadius: 2,
          '& .MuiAlert-message': {
            width: '100%'
          },
          ...sx
        }}
      >
        {title && (
          <AlertTitle sx={{ fontWeight: 600 }}>
            {title}
          </AlertTitle>
        )}
        <Typography variant="body2" component="div">
          {message}
        </Typography>
      </Alert>
    </Collapse>
  );
};

// Specific error type components for common use cases
export const AuthError = ({ error, onClose }) => {
  if (!error) return null;
  
  let title, severity = 'error';
  
  // Customize based on error type
  if (error.includes('email already exists') || error.includes('EMAIL_ALREADY_EXISTS')) {
    title = "Account Already Exists";
  } else if (error.includes('Invalid email or password') || error.includes('INVALID_CREDENTIALS')) {
    title = "Login Failed";
  } else if (error.includes('No account found') || error.includes('USER_NOT_FOUND')) {
    title = "Account Not Found";
  } else if (error.includes('verify your email') || error.includes('ACCOUNT_NOT_VERIFIED')) {
    title = "Email Verification Required";
    severity = 'warning';
  } else if (error.includes('account has been disabled') || error.includes('ACCOUNT_DISABLED')) {
    title = "Account Disabled";
  } else {
    title = "Authentication Error";
  }
  
  return (
    <ErrorDisplay 
      error={error}
      title={title}
      severity={severity}
      onClose={onClose}
    />
  );
};

export const BookingError = ({ error, onClose }) => {
  if (!error) return null;
  
  let title = "Booking Error";
  
  if (error.includes('Authentication') || error.includes('login')) {
    title = "Login Required";
  } else if (error.includes('not found') || error.includes('NOT_FOUND')) {
    title = "Booking Not Found";
  } else if (error.includes('Session expired')) {
    title = "Session Expired";
  }
  
  return (
    <ErrorDisplay 
      error={error}
      title={title}
      onClose={onClose}
    />
  );
};

export const ValidationError = ({ errors, onClose }) => {
  if (!errors || (Array.isArray(errors) && errors.length === 0)) return null;
  
  const errorList = Array.isArray(errors) ? errors : [errors];
  
  return (
    <ErrorDisplay 
      error={
        <Box>
          {errorList.map((error, index) => (
            <Typography key={index} variant="body2" component="div">
              • {error}
            </Typography>
          ))}
        </Box>
      }
      title="Please Fix the Following"
      severity="warning"
      onClose={onClose}
    />
  );
};

export default ErrorDisplay;