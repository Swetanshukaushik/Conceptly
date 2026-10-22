import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { AppButton } from "./AppButton";
import { useTheme } from "@/app/providers/ThemeProvider";

export type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onPressAction?: () => void;
  icon?: React.ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onPressAction,
  icon,
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
      <AppText variant="h3" style={styles.title}>
        {title}
      </AppText>
      {description ? (
        <AppText variant="body" tone="secondary" style={styles.description}>
          {description}
        </AppText>
      ) : null}
      {actionLabel ? (
        <AppButton label={actionLabel} onPress={onPressAction} style={styles.actionButton} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
  },
  description: {
    marginTop: 8,
    textAlign: "center",
    maxWidth: 360,
  },
  actionButton: {
    marginTop: 20,
    alignSelf: "stretch",
  },
});
