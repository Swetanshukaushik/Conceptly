import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { useTheme } from "@/app/providers/ThemeProvider";

export type TextVariant =
  | "hero"
  | "h1"
  | "h2"
  | "h3"
  | "title"
  | "body"
  | "bodyMedium"
  | "caption"
  | "micro";

export type TextTone =
  | "default"
  | "secondary"
  | "muted"
  | "inverse"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger";

export type AppTextProps = TextProps & {
  variant?: TextVariant;
  tone?: TextTone;
};

export function AppText({
  variant = "body",
  tone = "default",
  style,
  children,
  ...props
}: AppTextProps) {
  const { colors } = useTheme();

  const getToneColor = (): string => {
    switch (tone) {
      case "secondary":
        return colors.textSecondary;
      case "muted":
        return colors.textMuted;
      case "inverse":
        return colors.textInverse;
      case "primary":
        return colors.primaryText;
      case "accent":
        return colors.accentText;
      case "success":
        return colors.successText;
      case "warning":
        return colors.warningText;
      case "danger":
        return colors.dangerText;
      case "default":
      default:
        return colors.textPrimary;
    }
  };

  return (
    <Text
      style={[
        variantStyles[variant],
        { color: getToneColor() },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const variantStyles = StyleSheet.create({
  hero: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "400",
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
  },
  caption: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "500",
  },
  micro: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
