import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Icon } from './Icon';
import { AppText } from './AppText';
import { useTheme } from '@/app/providers/ThemeProvider';

const MOBILE_NAV_ITEMS = [
  { label: 'Home', path: '/feed', icon: 'home-outline', activeIcon: 'home' },
  { label: 'Trending', path: '/trending', icon: 'flame-outline', activeIcon: 'flame' },
  { label: 'Explore', path: '/explore', icon: 'compass-outline', activeIcon: 'compass' },
  { label: 'Saved', path: '/bookmarks', icon: 'bookmark-outline', activeIcon: 'bookmark' },
  { label: 'Progress', path: '/progress', icon: 'stats-chart-outline', activeIcon: 'stats-chart' },
  { label: 'Profile', path: '/profile', icon: 'person-outline', activeIcon: 'person' },
] as const;

export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();

  return (
    <View style={[styles.outerWrapper, { backgroundColor: colors.canvasBg }]}>
      <View
        role="tablist"
        style={[
          styles.navBar,
          {
            backgroundColor: colors.navBg,
            borderTopColor: colors.navBorder,
            borderLeftColor: colors.border,
            borderRightColor: colors.border,
          },
        ]}
      >
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          const tintColor = isActive ? colors.navActive : colors.navInactive;

          return (
            <Pressable
              key={item.path}
              role="tab"
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={item.label}
              onPress={() => {
                if (!isActive) {
                  router.push(item.path as any);
                }
              }}
              style={({ pressed }) => [
                styles.tabItem,
                pressed && { opacity: 0.75 },
              ]}
            >
              {isActive && (
                <View
                  style={[
                    styles.activeIndicator,
                    { backgroundColor: colors.navActive },
                  ]}
                />
              )}
              <View
                style={[
                  styles.iconPill,
                  isActive && { backgroundColor: colors.primarySoft },
                ]}
              >
                <Icon
                  name={isActive ? item.activeIcon : item.icon}
                  size={20}
                  color={tintColor}
                />
              </View>
              <AppText
                variant="micro"
                numberOfLines={1}
                style={[
                  styles.tabLabel,
                  {
                    color: tintColor,
                    fontWeight: isActive ? '700' : '600',
                  },
                ]}
              >
                {item.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  navBar: {
    width: '100%',
    maxWidth: 500,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 4,
    paddingTop: 4,
    paddingBottom: 6,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    gap: 2,
  },
  activeIndicator: {
    position: 'absolute',
    top: -4,
    width: 24,
    height: 3,
    borderRadius: 999,
  },
  iconPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10.5,
    lineHeight: 13,
    textAlign: 'center',
  },
});
