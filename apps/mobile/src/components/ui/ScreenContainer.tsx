import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  ViewProps,
  Platform,
  StyleSheet,
} from 'react-native';
import { cn } from '../../utils/cn';
import { useAppStore } from '@/store/useAppStore';
import { ViewportToggle } from './ViewportToggle';

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
  const isWeb = Platform.OS === 'web';
  const isDesktop = isWeb && viewMode === 'desktop';

  return (
    <View
      style={[
        styles.outerRoot,
        { backgroundColor: isDesktop ? '#F8FAFC' : '#F1F5F9' },
      ]}
    >
      {/* Floating Viewport Toggle on Web when in mobile view */}
      {isWeb && !hideToggle && !isDesktop && <ViewportToggle />}

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
                style,
              ]}
              className={cn(
                "w-full transition-all duration-300 min-h-full",
                isDesktop
                  ? "bg-slate-50 shadow-none px-4"
                  : "bg-slate-50 shadow-sm border-x border-slate-200/50",
                className
              )}
              {...props}
            >
              <View
                className={cn("px-4 pt-3 flex-1", contentClassName)}
                style={{ paddingBottom: isDesktop ? 60 : 100 }}
              >
                {children}
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
                style,
              ]}
              className={cn(
                "w-full transition-all duration-300",
                isDesktop
                  ? "bg-slate-50 shadow-none px-4"
                  : "bg-slate-50 shadow-sm border-x border-slate-200/50",
                className
              )}
              {...props}
            >
              <View className={cn("flex-1 px-4 pt-3 pb-6", contentClassName)}>
                {children}
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
});
