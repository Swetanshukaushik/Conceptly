import React from 'react';
import { View, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Icon } from '@/components/ui/Icon';
import { DesktopNavBar } from '@/components/ui/DesktopNavBar';
import { useAppStore } from '@/store/useAppStore';

export default function AppLayout() {
  const viewMode = useAppStore((s) => s.viewMode);
  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && viewMode === 'desktop';

  return (
    <View style={{ flex: 1, backgroundColor: isDesktop ? '#F8FAFC' : '#F1F5F9' }}>
      {/* On desktop view, render top navigation bar */}
      {isDesktop && <DesktopNavBar />}

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#4F46E5', // Indigo-600
          tabBarInactiveTintColor: '#64748B', // Slate-500
          tabBarStyle: isDesktop
            ? { display: 'none' }
            : {
                backgroundColor: '#FFFFFF',
                borderTopColor: '#E2E8F0',
                height: 64,
                paddingBottom: 8,
                paddingTop: 6,
                maxWidth: 500,
                marginHorizontal: 'auto',
                width: '100%',
              },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="feed"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? 'home' : 'home-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? 'compass' : 'compass-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmarks"
          options={{
            title: 'Saved',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? 'stats-chart' : 'stats-chart-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
