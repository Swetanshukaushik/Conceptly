import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { ThemeColors, ThemeMode } from '@/theme/types';
import { getThemeColors, darkTheme } from '@/theme/tokens';

export interface ThemeContextValue {
  theme: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  colors: darkTheme,
  isDark: true,
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeMode(): 'light' | 'dark' {
  const { theme } = useContext(ThemeContext);
  return theme === 'light' ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const storeTheme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location) {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTheme = params.get('theme') as ThemeMode;
        if (urlTheme && (urlTheme === 'light' || urlTheme === 'dark' || urlTheme === 'grey')) {
          if (urlTheme !== storeTheme) {
            setTheme(urlTheme);
          }
        }
      } catch (e) {}
    }
  }, [storeTheme, setTheme]);

  const activeMode: ThemeMode = storeTheme || 'dark';

  const contextValue: ThemeContextValue = useMemo(() => {
    const colors = getThemeColors(activeMode);
    return {
      theme: activeMode,
      colors,
      isDark: colors.isDark,
      setTheme,
    };
  }, [activeMode, setTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <View
        style={{ flex: 1, backgroundColor: contextValue.colors.canvasBg }}
        className={contextValue.isDark ? 'dark flex-1' : 'flex-1'}
      >
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
