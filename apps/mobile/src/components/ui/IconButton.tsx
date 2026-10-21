import React from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import { Icon } from "./Icon";
import { useTheme } from "@/app/providers/ThemeProvider";

export type IconTone = "default" | "primary" | "inverse" | "ghost";
export type IconSize = "sm" | "md" | "lg";

export type IconButtonProps = PressableProps & {
  icon: React.ReactNode | string;
  size?: IconSize;
  variant?: IconTone;
};

const sizeStyles = StyleSheet.create({
  sm: { width: 32, height: 32, borderRadius: 16 },
  md: { width: 40, height: 40, borderRadius: 20 },
  lg: { width: 48, height: 48, borderRadius: 24 },
});

export function IconButton({
  icon,
  size = "md",
  variant = "default",
  style,
  ...props
}: IconButtonProps) {
  const { colors } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1,
        };
      case "inverse":
        return {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.border,
          borderWidth: 1,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          borderColor: "transparent",
          borderWidth: 0,
        };
      case "default":
      default:
        return {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
        };
    }
  };

  const iconColor =
    variant === "primary"
      ? colors.textInverse
      : variant === "ghost"
      ? colors.textSecondary
      : colors.textPrimary;

  const iconElement =
    typeof icon === "string" ? (
      <Icon
        name={icon}
        size={size === "sm" ? 16 : size === "lg" ? 24 : 18}
        color={iconColor}
      />
    ) : (
      icon
    );

  return (
    <Pressable
      style={(state) => [
        styles.button,
        sizeStyles[size],
        getVariantStyle(),
        state.pressed && styles.pressed,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {iconElement}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
