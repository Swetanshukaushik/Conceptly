import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Icon } from './Icon';
import { ViewportToggle } from './ViewportToggle';
import { ThemeToggle } from './ThemeToggle';
import { BionicToggle } from './BionicText';
import { useTheme } from '@/app/providers/ThemeProvider';
import { useAppStore } from '@/store/useAppStore';

const NAV_ITEMS = [
  { label: 'Home', path: '/feed', icon: 'home-outline', activeIcon: 'home' },
  { label: 'Explore', path: '/explore', icon: 'compass-outline', activeIcon: 'compass' },
  { label: 'Saved Lessons', path: '/bookmarks', icon: 'bookmark-outline', activeIcon: 'bookmark' },
  { label: 'Mastery Progress', path: '/progress', icon: 'stats-chart-outline', activeIcon: 'stats-chart' },
  { label: 'Profile', path: '/profile', icon: 'person-outline', activeIcon: 'person' },
];

export function DesktopNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors, isDark } = useTheme();
  const setCommandPaletteOpen = useAppStore((s) => s.setCommandPaletteOpen);

  return (
    <View
      style={[
        styles.navBar,
        {
          backgroundColor: colors.navBg,
          borderBottomColor: colors.navBorder,
          shadowColor: isDark ? '#000000' : '#0F172A',
        },
      ]}
    >
      <View style={styles.navInner}>
        {/* Brand / Logo */}
        <Pressable onPress={() => router.push('/feed')} style={styles.brandRow}>
          <View
            style={[
              styles.logoBadge,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.border,
                shadowColor: colors.primary,
              },
            ]}
          >
            <Text style={styles.logoIcon}>⚡</Text>
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>Conceptly</Text>
            <Text style={[styles.brandTagline, { color: colors.textMuted }]}>
              Atomic clarity for everything
            </Text>
          </View>
        </Pressable>

        {/* Links */}
        <View style={styles.linksRow}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Pressable
                key={item.path}
                onPress={() => router.push(item.path as any)}
                style={[
                  styles.linkItem,
                  isActive && {
                    backgroundColor: colors.primarySoft,
                    borderWidth: 1,
                    borderColor: colors.primaryBorder,
                  },
                ]}
              >
                <Icon
                  name={isActive ? item.activeIcon : item.icon}
                  size={16}
                  color={isActive ? colors.primaryText : colors.textMuted}
                />
                <Text
                  style={[
                    styles.linkText,
                    {
                      color: isActive ? colors.primaryText : colors.textSecondary,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Action Controls: Omnibar + Bionic + Theme Switcher + Viewport Switcher */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => setCommandPaletteOpen(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 10,
              borderWidth: 1,
              backgroundColor: colors.surfaceSubtle,
              borderColor: colors.primaryBorder,
            }}
          >
            <Icon name="search" size={13} color={colors.primaryText} />
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textPrimary }}>
              Omnibar
            </Text>
            <View
              style={{
                paddingHorizontal: 5,
                paddingVertical: 1,
                borderRadius: 4,
                backgroundColor: colors.primarySoft,
                borderWidth: 1,
                borderColor: colors.primaryBorder,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '800', color: colors.primaryText }}>
                ⌘K
              </Text>
            </View>
          </Pressable>
          <BionicToggle compact={true} />
          <ThemeToggle compact={false} />
          <ViewportToggle inline={true} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    width: '100%',
    borderBottomWidth: 1,
    zIndex: 100,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  navInner: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoIcon: {
    fontSize: 18,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  brandTagline: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  linkText: {
    fontSize: 13,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
