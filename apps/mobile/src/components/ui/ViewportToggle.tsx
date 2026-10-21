import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { useAppStore } from '@/store/useAppStore';

export type ViewportToggleProps = {
  inline?: boolean;
};

export function ViewportToggle({ inline = false }: ViewportToggleProps) {
  if (Platform.OS !== 'web') {
    return null;
  }

  const viewMode = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);

  return (
    <View style={[styles.wrapper, inline ? styles.wrapperInline : styles.wrapperFloating]}>
      <View style={styles.container}>
        <Pressable
          onPress={() => setViewMode('mobile')}
          style={[
            styles.segmentButton,
            viewMode === 'mobile' && styles.segmentButtonActive,
          ]}
        >
          <Text style={[styles.segmentText, viewMode === 'mobile' && styles.segmentTextActive]}>
            📱 Mobile
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setViewMode('desktop')}
          style={[
            styles.segmentButton,
            viewMode === 'desktop' && styles.segmentButtonActive,
          ]}
        >
          <Text style={[styles.segmentText, viewMode === 'desktop' && styles.segmentTextActive]}>
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
    backgroundColor: '#0F172A', // Slate-900
    borderRadius: 24,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  segmentButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#4F46E5', // Indigo-600
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  segmentText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
