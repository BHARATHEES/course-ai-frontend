export const themeStyles = `
  :root {
    /* ── Typography ────────────────────────────────────────────────────────── */
    --font-h1: 32px; --font-h2: 24px; --font-h3: 18px;
    --font-body: 14px; --font-small: 13px; --font-caption: 12px;
    --font-weight-regular: 400; --font-weight-medium: 500; --font-weight-semibold: 600; --font-weight-bold: 700;
    --line-height-tight: 1.3; --line-height-normal: 1.5; --line-height-relaxed: 1.75;
    
    /* ── Spacing ───────────────────────────────────────────────────────────── */
    --space-xs: 4px; --space-sm: 8px; --space-md: 12px; --space-lg: 16px; --space-xl: 24px; --space-2xl: 32px;
    
    /* ── Border Radius ─────────────────────────────────────────────────────── */
    --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-xl: 16px; --radius-full: 9999px;
    
    /* ── Transitions ───────────────────────────────────────────────────────── */
    --transition-fast: 150ms ease; --transition-base: 250ms ease; --transition-slow: 350ms ease;
  }

  :root {
    --theme-bg-primary: #ffffff;
    --theme-bg-secondary: #f8fafc;
    --theme-bg-tertiary: #f1f5f9;
    --theme-bg-hover: #e8eef7;
    --theme-surface-paper: #ffffff;
    --theme-surface-card: #ffffff;
    --theme-surface-sidebar: #ffffff;
    --theme-surface-header: #ffffff;
    --theme-text-primary: #0f172a;
    --theme-text-secondary: #475569;
    --theme-text-tertiary: #64748b;
    --theme-text-disabled: #cbd5e1;
    --theme-border-primary: #e2e8f0;
    --theme-border-secondary: #cbd5e1;
    --theme-border-light: #f1f5f9;
    --theme-accent-primary: #3b82f6;
    --theme-accent-secondary: #2563eb;
    --theme-accent-tertiary: #60a5fa;
    --theme-accent-hover: #2d5ae8;
    --theme-status-success: #10b981;
    --theme-status-error: #ef4444;
    --theme-status-warning: #f59e0b;
    --theme-status-info: #3b82f6;
    --theme-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06);
    --theme-shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
    --theme-shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
    --theme-shadow-hover: 0 10px 25px rgba(59,130,246,0.15);
    --theme-divider: #e2e8f0;
    color-scheme: light;
  }

  [data-theme="dark"] {
    --theme-bg-primary: #0a0a0a;
    --theme-bg-secondary: #151b28;
    --theme-bg-tertiary: #1f2937;
    --theme-bg-hover: #2a3345;
    --theme-surface-paper: #151b28;
    --theme-surface-card: #1f2937;
    --theme-surface-sidebar: #0f1419;
    --theme-surface-header: #0f1419;
    --theme-text-primary: #f8fafc;
    --theme-text-secondary: #cbd5e1;
    --theme-text-tertiary: #94a3b8;
    --theme-text-disabled: #475569;
    --theme-border-primary: #2d3748;
    --theme-border-secondary: #1f2937;
    --theme-border-light: #151b28;
    --theme-accent-primary: #60a5fa;
    --theme-accent-secondary: #3b82f6;
    --theme-accent-tertiary: #93c5fd;
    --theme-accent-hover: #2563eb;
    --theme-status-success: #10b981;
    --theme-status-error: #f87171;
    --theme-status-warning: #fbbf24;
    --theme-status-info: #60a5fa;
    --theme-shadow: 0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px 0 rgba(0,0,0,0.3);
    --theme-shadow-md: 0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -1px rgba(0,0,0,0.3);
    --theme-shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -2px rgba(0,0,0,0.3);
    --theme-shadow-hover: 0 10px 25px rgba(96,165,250,0.25);
    --theme-divider: #2d3748;
    color-scheme: dark;
  }

  /* ── Global Transitions ────────────────────────────────────────────────── */
  * { transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important; }
  
  body { 
    background-color: var(--theme-bg-primary);
    color: var(--theme-text-primary);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-normal);
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-tight);
    letter-spacing: -0.5px;
  }

  h1 { font-size: var(--font-h1); }
  h2 { font-size: var(--font-h2); }
  h3 { font-size: var(--font-h3); }

  button, input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  button:focus, a:focus {
    outline: 2px solid var(--theme-accent-primary);
    outline-offset: 2px;
  }

  /* ── Keyframe Animations ───────────────────────────────────────────────── */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = themeStyles;
  document.head.appendChild(style);
}