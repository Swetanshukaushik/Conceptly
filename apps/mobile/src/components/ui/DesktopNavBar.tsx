import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Icon } from './Icon';
import { ViewportToggle } from './ViewportToggle';

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

  return (
    <View style={styles.navBar}>
      <View style={styles.navInner}>
        {/* Brand / Logo */}
        <Pressable onPress={() => router.push('/feed')} style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>⚡</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>Conceptly</Text>
            <Text style={styles.brandTagline}>Atomic clarity for everything</Text>
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
                style={[styles.linkItem, isActive && styles.linkItemActive]}
              >
                <Icon
                  name={isActive ? item.activeIcon : item.icon}
                  size={16}
                  color={isActive ? '#4F46E5' : '#64748B'}
                />
                <Text style={[styles.linkText, isActive && styles.linkTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Viewport Switcher */}
        <View style={styles.actionsRow}>
          <ViewportToggle inline={true} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
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
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  logoIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  brandTagline: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6366F1',
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  linkItemActive: {
    backgroundColor: 'rgba(79, 70, 229, 0.08)',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  linkTextActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
