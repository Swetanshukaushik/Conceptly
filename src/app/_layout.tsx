import 'react-native-gesture-handler';

import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AppProviders } from '@/app/providers/AppProviders';

// NativeWind (v4) uses a root CSS file for Tailwind directives.
// This is required for consistent className styling (web + RN).
import '../../global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProviders>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }} />
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

