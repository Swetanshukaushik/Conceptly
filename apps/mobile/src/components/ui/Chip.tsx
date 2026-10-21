import React from "react";
import { Pressable, PressableProps, View, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { useTheme } from "@/app/providers/ThemeProvider";

export type ChipVariant = "default" | "selected" | "soft";

export type ChipProps = PressableProps & {
  label: string;
  variant?: ChipVariant;
  leftIcon?: React.ReactNode;
};

export function Chip({
  label,
  variant = "default",
  leftIcon,
  style,
  ...props
}: ChipProps) {
  const { colors } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case "selected":
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        };
      case "soft":
        return {
          backgroundColor: colors.primarySoft,
          borderColor: colors.primaryBorder,
        };
      case "default":
      default:
        return {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
        };
    }
  };

  const getTone = () => {
    switch (variant) {
      case "selected":
        return "inverse" as const;
      case "soft":
        return "primary" as const;
      case "default":
      default:
        return "default" as const;
    }
  };

  return (
    <Pressable
      style={(state) => [
        styles.chip,
        getVariantStyle(),
        state.pressed && styles.pressed,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {leftIcon ? <View>{leftIcon}</View> : null}
      <AppText variant="caption" tone={getTone()} style={styles.chipText}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
  },
});
