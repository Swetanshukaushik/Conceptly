import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';

export type ViewportToggleProps = {
  inline?: boolean;
};

export function ViewportToggle({ inline = false }: ViewportToggleProps) {
  if (Platform.OS !== 'web') {
    return null;
  }

  const viewMode = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.wrapper, inline ? styles.wrapperInline : styles.wrapperFloating]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surfaceSubtle,
            borderColor: colors.border,
            shadowColor: isDark ? '#000000' : '#0F172A',
          },
        ]}
      >
        <Pressable
          onPress={() => setViewMode('mobile')}
          style={[
            styles.segmentButton,
            viewMode === 'mobile' && [
              styles.segmentButtonActive,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
              },
            ],
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              {
                color: viewMode === 'mobile' ? colors.textInverse : colors.textMuted,
                fontWeight: viewMode === 'mobile' ? '700' : '500',
              },
            ]}
          >
            📱 Mobile
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setViewMode('desktop')}
          style={[
            styles.segmentButton,
            viewMode === 'desktop' && [
              styles.segmentButtonActive,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
              },
            ],
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              {
                color: viewMode === 'desktop' ? colors.textInverse : colors.textMuted,
                fontWeight: viewMode === 'desktop' ? '700' : '500',
              },
            ]}
          >
            💻 Desktop
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9999,
  },
  wrapperFloating: {
    position: 'absolute',
    top: 14,
    right: 20,
  },
  wrapperInline: {
    marginVertical: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    padding: 3,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  segmentButton: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  segmentText: {
    fontSize: 12,
  },
});
