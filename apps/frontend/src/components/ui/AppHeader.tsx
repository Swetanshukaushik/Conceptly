import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { AppText } from "./AppText";
import { IconButton } from "./IconButton";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/app/providers/ThemeProvider";

export type AppHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  fallbackRoute?: string;
  showThemeToggle?: boolean;
};

export function AppHeader({
  title,
  subtitle,
  onBack,
  fallbackRoute = "/feed",
  showThemeToggle = false,
}: AppHeaderProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const shouldShowToggle = showThemeToggle && Platform.OS !== "web";

  const handleBackPress = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (window.history.length > 1 && router.canGoBack()) {
        if (onBack) {
          onBack();
        } else {
          router.back();
        }
        return;
      }
      router.replace(fallbackRoute as any);
      return;
    }

    if (onBack) {
      if (router.canGoBack()) {
        onBack();
      } else {
        router.replace(fallbackRoute as any);
      }
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackRoute as any);
    }
  };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.leftGroup}>
        {onBack && (
          <IconButton
            icon="arrow-back"
            onPress={handleBackPress}
            size="sm"
            variant="inverse"
            accessibilityLabel="Go back"
            accessibilityRole="button"
          />
        )}
        <View style={styles.titleColumn}>
          <AppText variant="h3" numberOfLines={1} accessibilityRole="header">
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="caption" tone="secondary" numberOfLines={1}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
      </View>

      {shouldShowToggle && (
        <View style={styles.rightGroup}>
          <ThemeToggle compact={true} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 8,
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  titleColumn: {
    flex: 1,
  },
  rightGroup: {
    marginLeft: 8,
  },
});
