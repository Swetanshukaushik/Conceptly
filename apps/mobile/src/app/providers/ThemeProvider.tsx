import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme, View } from 'react-native';

import type { ThemeMode } from '@/theme/types';

const ThemeContext = createContext<ThemeMode>('dark');

export function useThemeMode() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const mode: ThemeMode = useMemo(
    () => (scheme === 'light' ? 'light' : 'dark'),
    [scheme]
  );

  return (
    <ThemeContext.Provider value={mode}>
      <View className={mode === 'dark' ? 'dark flex-1 bg-slate-50' : 'flex-1 bg-slate-50'}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

