import React from "react";
import { ActivityIndicator, Pressable, PressableProps, View, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { useTheme } from "@/app/providers/ThemeProvider";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type AppButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function AppButton({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  style,
  ...props
}: AppButtonProps) {
  const { colors, isDark } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case "secondary":
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
      case "danger":
        return {
          backgroundColor: colors.danger,
          borderColor: colors.danger,
          borderWidth: 1,
        };
      case "primary":
      default:
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          borderWidth: 1,
        };
    }
  };

  const getTextTone = () => {
    switch (variant) {
      case "primary":
      case "danger":
        return "inverse" as const;
      case "secondary":
        return "default" as const;
      case "ghost":
        return "secondary" as const;
    }
  };

  return (
    <Pressable
      disabled={disabled || loading}
      style={(state) => [
        styles.button,
        sizeStyles[size],
        getVariantStyle(),
        state.pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <View style={styles.contentRow}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === "primary" ? colors.textInverse : colors.primary}
          />
        ) : (
          leftIcon
        )}
        <AppText variant="bodyMedium" tone={getTextTone()} style={styles.buttonLabel}>
          {label}
        </AppText>
        {!loading ? rightIcon : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonLabel: {
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.5,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    minHeight: 36,
    paddingHorizontal: 12,
  },
  md: {
    minHeight: 44,
    paddingHorizontal: 18,
  },
  lg: {
    minHeight: 52,
    paddingHorizontal: 24,
  },
});
