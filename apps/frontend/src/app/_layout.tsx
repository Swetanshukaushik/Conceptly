import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AppProviders } from './providers/AppProviders';
import { AppErrorBoundary } from '@/components/ui/AppErrorBoundary';
import { NeuralOmnibar } from '@/components/ui/NeuralOmnibar';
import { useAppStore, hydrateAppStore } from '@/store/useAppStore';
import { educationApi } from '@/services/api/educationApi';

import '../../global.css';

export default function RootLayout() {
  const apiDataSource = useAppStore((s) => s.apiDataSource);
  const authToken = useAppStore((s) => s.authToken);
  const setAuthToken = useAppStore((s) => s.setAuthToken);

  useEffect(() => {
    hydrateAppStore();

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.title = 'Conceptly — Atomic clarity for everything';
    }

    async function bootstrapSession() {
      if (apiDataSource === 'live' && !authToken) {
        try {
          const res = await educationApi.createGuestSession();
          if (res?.accessToken) {
            setAuthToken(res.accessToken);
          }
        } catch (e) {
          console.warn('[RootLayout] Guest session bootstrap failed:', e);
        }
      }
    }
    bootstrapSession();
  }, [apiDataSource, authToken, setAuthToken]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProviders>
          <StatusBar style="light" />
          <AppErrorBoundary>
            <Stack screenOptions={{ headerShown: false }} />
            <NeuralOmnibar />
          </AppErrorBoundary>
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

