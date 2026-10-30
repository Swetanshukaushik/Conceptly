import React from 'react';
import { View, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { DesktopNavBar } from '@/components/ui/DesktopNavBar';
import { MobileBottomNav } from '@/components/ui/MobileBottomNav';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';

export default function AppLayout() {
  const viewMode = useAppStore((s) => s.viewMode);
  const { colors } = useTheme();
  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && viewMode === 'desktop';

  return (
    <View style={{ flex: 1, backgroundColor: colors.canvasBg }}>
      {/* On desktop view, render top navigation bar */}
      {isDesktop && <DesktopNavBar />}

      <Tabs
        tabBar={() => (isDesktop ? null : <MobileBottomNav />)}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="feed" options={{ title: 'Home' }} />
        <Tabs.Screen name="trending" options={{ title: 'Trending' }} />
        <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
        <Tabs.Screen name="bookmarks" options={{ title: 'Saved' }} />
        <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    </View>
  );
}
