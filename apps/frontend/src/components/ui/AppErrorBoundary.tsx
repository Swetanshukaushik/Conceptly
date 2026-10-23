import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Icon } from './Icon';

export interface AppErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
  showHomeButton?: boolean;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

function ErrorBoundaryPresenter({
  error,
  errorInfo,
  title,
  message,
  onReset,
  showHomeButton = true,
}: {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  title?: string;
  message?: string;
  onReset: () => void;
  showHomeButton?: boolean;
}) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [showDetails, setShowDetails] = React.useState(__DEV__);

  const handleGoHome = () => {
    onReset();
    try {
      router.replace('/(app)/feed');
    } catch {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  const handleReload = () => {
    onReset();
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <View
      style={[
        styles.outerContainer,
        { backgroundColor: colors.canvasBg },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: isDark ? '#000000' : '#0F172A',
          },
        ]}
      >
        {/* Warning Icon Badge */}
        <View
          style={[
            styles.iconBadge,
            { backgroundColor: colors.dangerSoft, borderColor: colors.danger },
          ]}
        >
          <Icon name="alert-circle" size={32} color={colors.danger} />
        </View>

        {/* Title & Description */}
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title ?? 'Something went wrong'}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {message ??
            'An unexpected error occurred while rendering this view. Your progress and data are safely preserved.'}
        </Text>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Pressable
            onPress={onReset}
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          >
            <Icon name="refresh" size={16} color={colors.textInverse} />
            <Text style={[styles.primaryButtonText, { color: colors.textInverse }]}>
              Try Again
            </Text>
          </Pressable>

          {showHomeButton && (
            <Pressable
              onPress={handleGoHome}
              style={[
                styles.secondaryButton,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                },
              ]}
            >
              <Icon name="home" size={16} color={colors.textPrimary} />
              <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>
                Home Feed
              </Text>
            </Pressable>
          )}

          {Platform.OS === 'web' && (
            <Pressable
              onPress={handleReload}
              style={[
                styles.secondaryButton,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.textMuted }]}>
                Reload Page
              </Text>
            </Pressable>
          )}
        </View>

        {/* Technical Diagnostics (Developer & Debug View) */}
        {error && (
          <View style={styles.debugSection}>
            <Pressable
              onPress={() => setShowDetails((prev) => !prev)}
              style={styles.detailsToggle}
            >
              <Text style={[styles.detailsToggleText, { color: colors.textMuted }]}>
                {showDetails ? 'Hide Error Details ▴' : 'Show Error Diagnostics ▾'}
              </Text>
            </Pressable>

            {showDetails && (
              <ScrollView
                style={[
                  styles.debugScrollView,
                  { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.debugErrorName, { color: colors.dangerText }]}>
                  {error.name}: {error.message}
                </Text>
                {error.stack && (
                  <Text style={[styles.debugStackTrace, { color: colors.textMuted }]}>
                    {error.stack}
                  </Text>
                )}
                {errorInfo?.componentStack && (
                  <Text style={[styles.debugStackTrace, { color: colors.textMuted }]}>
                    {errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<AppErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // In production, log to analytics or crash reporting service
    console.error('[AppErrorBoundary] Unhandled render error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryPresenter
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          title={this.props.fallbackTitle}
          message={this.props.fallbackMessage}
          onReset={this.handleReset}
          showHomeButton={this.props.showHomeButton}
        />
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 420,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    width: '100%',
    marginBottom: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  debugSection: {
    width: '100%',
    marginTop: 12,
  },
  detailsToggle: {
    paddingVertical: 6,
    alignSelf: 'center',
  },
  detailsToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  debugScrollView: {
    maxHeight: 180,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginTop: 6,
  },
  debugErrorName: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  debugStackTrace: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
