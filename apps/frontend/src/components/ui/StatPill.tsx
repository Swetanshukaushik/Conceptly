import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { useTheme } from "@/app/providers/ThemeProvider";

export type StatPillProps = {
  label: string;
  value: string;
};

export function StatPill({ label, value }: StatPillProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
        },
      ]}
    >
      <AppText variant="micro" tone="secondary">
        {label}{" "}
        <AppText variant="micro" tone="primary" style={{ fontWeight: "700" }}>
          {value}
        </AppText>
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
