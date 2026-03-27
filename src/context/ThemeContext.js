import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react';

// Create the theme context
export const ThemeContext = createContext();

// Theme Provider Component
export function ThemeProvider({ children }) {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = () => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // Default to light
    return 'light';
  };

  const [mode, setMode] = useState(getInitialTheme());

  // Apply theme to document root on mount and when mode changes
  useEffect(() => {
    if (document.documentElement) {
      document.documentElement.setAttribute('data-theme', mode);
    }
  }, [mode]);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    setMode(prevMode => {
      const newMode = prevMode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  }, []);

  // Set theme mode
  const setTheme = useCallback((newMode) => {
    if (newMode === 'light' || newMode === 'dark') {
      setMode(newMode);
      localStorage.setItem('theme-mode', newMode);
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ mode, toggleTheme, setTheme }),
    [mode, toggleTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme context
export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
