import React from 'react';
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/app/providers/ThemeProvider';
import { ThemeMode } from '@/theme/types';

export interface ThemeToggleProps {
  compact?: boolean;
  overlay?: boolean;
  style?: StyleProp<ViewStyle>;
}

const THEMES: Array<{
  key: ThemeMode;
  label: string;
  icon: string;
  accent: string;
}> = [
  { key: 'light', label: 'Light', icon: '☀️', accent: '#1D4ED8' },
  { key: 'dark', label: 'Dark', icon: '🌙', accent: '#38BDF8' },
  { key: 'grey', label: 'Grey', icon: '🔘', accent: '#F59E0B' },
];

export function ThemeToggle({ compact = false, overlay = false, style }: ThemeToggleProps) {
  const { theme, setTheme, colors, isDark } = useTheme();

  const containerBg = overlay
    ? isDark
      ? 'rgba(11, 15, 25, 0.78)'
      : 'rgba(255, 255, 255, 0.88)'
    : colors.surfaceSubtle;

  const activeBg = overlay
    ? isDark
      ? 'rgba(30, 41, 59, 0.9)'
      : 'rgba(255, 255, 255, 0.98)'
    : colors.surface;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: containerBg,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {THEMES.map((item) => {
        const isActive = theme === item.key;
        return (
          <Pressable
            key={item.key}
            onPress={() => setTheme(item.key)}
            style={[
              styles.option,
              compact && styles.optionCompact,
              isActive && [
                styles.optionActive,
                {
                  backgroundColor: activeBg,
                  borderColor: colors.borderActive,
                  shadowColor: isDark ? '#000000' : '#0F172A',
                },
              ],
            ]}
          >
            <Text style={[styles.icon, isActive && { transform: [{ scale: 1.1 }] }]}>
              {item.icon}
            </Text>
            {!compact && (
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? colors.textPrimary : colors.textMuted,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {item.label}
              </Text>
            )}
            {isActive && (
              <View
                style={[
                  styles.activeDot,
                  { backgroundColor: item.accent },
                ]}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    borderRadius: 14,
    borderWidth: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  optionCompact: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 3,
  },
  optionActive: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
  },
  icon: {
    fontSize: 13,
  },
  label: {
    fontSize: 12,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginLeft: 2,
  },
});
