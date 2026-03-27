import { useTheme as useThemeContext } from '../context/ThemeContext';
import { getTheme } from '../theme/themeConfig';

/**
 * Hook to use the current theme colors and mode
 * Returns both the theme colors and mode
 */
export function useCurrentTheme() {
  const { mode } = useThemeContext();
  const theme = getTheme(mode);
  return { theme, mode };
}
