import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { useTheme } from "@/app/providers/ThemeProvider";

export type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onPressAction,
}: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <AppText variant="h3">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" tone="secondary" style={{ marginTop: 2 }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {actionLabel ? (
        <Pressable
          onPress={onPressAction}
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.primarySoft,
              borderColor: colors.primaryBorder,
            },
          ]}
        >
          <AppText variant="caption" tone="primary" style={{ fontWeight: "600" }}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
});
