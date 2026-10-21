import React from "react";
import { Pressable, View, ViewProps, StyleSheet } from "react-native";
import { useTheme } from "@/app/providers/ThemeProvider";

export type CardTone = "default" | "muted" | "primarySoft" | "accentSoft" | "successSoft";

export type AppCardProps = ViewProps & {
  tone?: CardTone;
  onPress?: () => void;
};

export function AppCard({
  tone = "default",
  onPress,
  style,
  children,
  ...props
}: AppCardProps) {
  const { colors, isDark } = useTheme();

  const getToneStyle = () => {
    switch (tone) {
      case "muted":
        return {
          backgroundColor: colors.surfaceSubtle,
          borderColor: colors.borderSubtle,
        };
      case "primarySoft":
        return {
          backgroundColor: colors.primarySoft,
          borderColor: colors.primaryBorder,
        };
      case "accentSoft":
        return {
          backgroundColor: colors.accentSoft,
          borderColor: colors.border,
        };
      case "successSoft":
        return {
          backgroundColor: colors.successSoft,
          borderColor: colors.border,
        };
      case "default":
      default:
        return {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        };
    }
  };

  const cardStyle = [
    styles.card,
    getToneStyle(),
    {
      shadowColor: isDark ? "#000000" : "#0F172A",
      shadowOpacity: isDark ? 0.25 : 0.04,
    },
    style,
  ];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={cardStyle}>
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
});
