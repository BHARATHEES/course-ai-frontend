// Light Theme Color Palette
//frontend/src/theme/themeConfig.js
export const lightTheme = {
  mode: 'light',
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    hover: '#e2e8f0'
  },
  surface: {
    paper: '#ffffff',
    card: '#ffffff',
    sidebar: '#ffffff',
    header: '#ffffff'
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#64748b',
    disabled: '#cbd5e1'
  },
  border: {
    primary: '#e2e8f0',
    secondary: '#cbd5e1',
    light: '#f1f5f9'
  },
  accent: {
    primary: '#3b82f6',
    secondary: '#2563eb',
    tertiary: '#60a5fa'
  },
  status: {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  },
  icon: '#64748b',
  shadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  shadowHover: '0 4px 12px rgba(59, 130, 246, 0.15)',
  divider: '#e2e8f0'
};

// Dark Theme Color Palette
export const darkTheme = {
  mode: 'dark',
  background: {
    primary: '#0e0e0e',
    secondary: '#1a1a1a',
    tertiary: '#252a33',
    hover: '#333333'
  },
  surface: {
    paper: '#1a1a1a',
    card: '#1a1a1a',
    sidebar: '#1a1a1a',
    header: '#1a1a1a'
  },
  text: {
    primary: '#e2e8f0',
    secondary: '#a0a0a0',
    tertiary: '#666666',
    disabled: '#4a4a4a'
  },
  border: {
    primary: '#333333',
    secondary: '#2a2a2a',
    light: '#1a1a1a'
  },
  accent: {
    primary: '#3b82f6',
    secondary: '#2563eb',
    tertiary: '#60a5fa'
  },
  status: {
    success: '#22c55e',
    error: '#dc2626',
    warning: '#f59e0b',
    info: '#3b82f6'
  },
  icon: '#a0a0a0',
  shadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  shadowHover: '0 4px 12px rgba(59, 130, 246, 0.3)',
  divider: '#333333'
};

// Function to get current theme
export const getTheme = (mode) => {
  return mode === 'dark' ? darkTheme : lightTheme;
};
