import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { useTheme } from "@/app/providers/ThemeProvider";

export type ProgressTone = "primary" | "success" | "warning";

export type ProgressBadgeProps = {
  value: number;
  tone?: ProgressTone;
  label?: string;
};

export function ProgressBadge({
  value,
  tone = "primary",
  label = "Complete",
}: ProgressBadgeProps) {
  const { colors } = useTheme();

  const getStyle = () => {
    switch (tone) {
      case "success":
        return {
          backgroundColor: colors.successSoft,
          borderColor: colors.successText,
        };
      case "warning":
        return {
          backgroundColor: colors.warningSoft,
          borderColor: colors.warningText,
        };
      case "primary":
      default:
        return {
          backgroundColor: colors.primarySoft,
          borderColor: colors.primaryBorder,
        };
    }
  };

  const getTextTone = () => {
    switch (tone) {
      case "success":
        return "success" as const;
      case "warning":
        return "warning" as const;
      case "primary":
      default:
        return "primary" as const;
    }
  };

  return (
    <View style={[styles.badge, getStyle()]}>
      <AppText variant="micro" tone={getTextTone()} style={{ fontWeight: "700" }}>
        {value}% {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
