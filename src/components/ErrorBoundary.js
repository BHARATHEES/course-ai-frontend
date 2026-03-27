import React from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * ErrorBoundary Component
 * Catches React component errors and displays a fallback UI
 * Prevents the entire app from crashing due to a single component error
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      errorCount: this.state.errorCount + 1
    });

    // You can also log the error to an error reporting service here
    // E.g., Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Optionally reload the page
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ mt: 6, mb: 4 }}>
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: '10px',
              bgcolor: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid var(--theme-status-error)',
              background: 'var(--theme-surface-card)'
            }}
          >
            {/* Error Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <ErrorOutlineIcon sx={{ fontSize: 40, color: 'var(--theme-status-error)' }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--theme-status-error)', fontSize: 'var(--font-h3)' }}>
                Oops! Something went wrong
              </Typography>
            </Box>

            {/* Error Message */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ color: 'var(--theme-text-secondary)', mb: 2, fontSize: 'var(--font-body)' }}>
                We encountered an unexpected error. Don't worry, our team has been notified.
              </Typography>
              
              {/* Development: Show error details */}
              {process.env.NODE_ENV === "development" && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(239, 68, 68, 0.15)',
                    borderRadius: '8px',
                    border: '1px solid var(--theme-status-error)',
                    mb: 2
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: 'var(--font-caption)',
                      color: 'var(--theme-status-error)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      maxHeight: '200px',
                      overflow: 'auto'
                    }}
                  >
                    {this.state.error && this.state.error.toString()}
                  </Typography>
                </Box>
              )}

              {/* Error Count */}
              {this.state.errorCount > 2 && (
                <Typography variant="caption" sx={{ color: 'var(--theme-status-error)', display: 'block', fontSize: 'var(--font-small)' }}>
                  Multiple errors detected ({this.state.errorCount}). 
                  Consider refreshing the page if the issue persists.
                </Typography>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="error"
                onClick={this.handleReset}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                Go to Home
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => window.location.reload()}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                Refresh Page
              </Button>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
