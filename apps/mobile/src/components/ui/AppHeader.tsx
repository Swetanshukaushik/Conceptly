import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { IconButton } from "./IconButton";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "@/app/providers/ThemeProvider";

export type AppHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showThemeToggle?: boolean;
};

export function AppHeader({
  title,
  subtitle,
  onBack,
  showThemeToggle = true,
}: AppHeaderProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.leftGroup}>
        {onBack && (
          <IconButton
            icon="arrow-back"
            onPress={onBack}
            size="sm"
            variant="ghost"
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

      {showThemeToggle && (
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
    borderBottomWidth: 1,
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
