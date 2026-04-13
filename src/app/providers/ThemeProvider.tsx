import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme, View } from 'react-native';

export type ThemeMode = 'light' | 'dark';

const ThemeModeContext = createContext<ThemeMode>('light');

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const scheme = useColorScheme();
  const mode: ThemeMode = useMemo(() => {
    return scheme === 'dark' ? 'dark' : 'light';
  }, [scheme]);

  return (
    <ThemeModeContext.Provider value={mode}>
      <View className={mode === 'dark' ? 'dark flex-1 bg-bg-primary' : 'flex-1 bg-bg-primary'}>
        {children}
      </View>
    </ThemeModeContext.Provider>
  );
}

