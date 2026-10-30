import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  ViewProps,
  Platform,
  StyleSheet,
} from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';
import { ViewportToggle } from './ViewportToggle';
import { ThemeToggle } from './ThemeToggle';
import { AppErrorBoundary } from './AppErrorBoundary';

export type ScreenContainerProps = ViewProps & {
  scroll?: boolean;
  contentClassName?: string;
  hideToggle?: boolean;
};

export function ScreenContainer({
  children,
  className,
  contentClassName,
  scroll = false,
  hideToggle = false,
  style,
  ...props
}: ScreenContainerProps) {
  const viewMode = useAppStore((s) => s.viewMode);
  const { colors, isDark } = useTheme();
  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && viewMode === 'desktop';

  const containerBg = colors.screenBg;
  const outerBg = colors.canvasBg;

  const mobileTopUtilityBar =
    isWeb && !hideToggle && !isDesktop ? (
      <View
        style={[
          styles.mobileUtilityBar,
          {
            borderBottomColor: colors.border,
          },
        ]}
      >
        <ThemeToggle compact={true} />
        <ViewportToggle inline={true} />
      </View>
    ) : null;

  return (
    <View style={[styles.outerRoot, { backgroundColor: outerBg }]}>
      <SafeAreaView style={styles.safeArea}>
        {scroll ? (
          <ScrollView
            style={styles.scrollRoot}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={isDesktop}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={[
                styles.innerContent,
                isDesktop ? styles.desktopWidth : styles.mobileWidth,
                {
                  backgroundColor: containerBg,
                  borderColor: isDesktop ? 'transparent' : colors.border,
                  borderLeftWidth: isDesktop ? 0 : 1,
                  borderRightWidth: isDesktop ? 0 : 1,
                  shadowColor: isDark ? '#000000' : '#0F172A',
                },
                style,
              ]}
              {...props}
            >
              {mobileTopUtilityBar}
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingTop: 12,
                  paddingBottom: isDesktop ? 60 : 100,
                }}
              >
                <AppErrorBoundary>{children}</AppErrorBoundary>
              </View>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.nonScrollRoot}>
            <View
              style={[
                styles.innerContent,
                styles.flex1,
                isDesktop ? styles.desktopWidth : styles.mobileWidth,
                {
                  backgroundColor: containerBg,
                  borderColor: isDesktop ? 'transparent' : colors.border,
                  borderLeftWidth: isDesktop ? 0 : 1,
                  borderRightWidth: isDesktop ? 0 : 1,
                },
                style,
              ]}
              {...props}
            >
              {mobileTopUtilityBar}
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 16,
                  paddingTop: 12,
                  paddingBottom: 24,
                }}
              >
                <AppErrorBoundary>{children}</AppErrorBoundary>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContentContainer: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
  },
  nonScrollRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  innerContent: {
    width: '100%',
    minHeight: '100%',
  },
  mobileWidth: {
    maxWidth: 500,
  },
  desktopWidth: {
    maxWidth: 1200,
  },
  flex1: {
    flex: 1,
  },
  mobileUtilityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
});
