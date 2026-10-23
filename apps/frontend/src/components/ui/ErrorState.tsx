import React from "react";
import { View } from "react-native";
import { useTheme } from "@/app/providers/ThemeProvider";
import { AppText } from "./AppText";
import { AppButton } from "./AppButton";

export type ErrorStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again.",
  actionLabel = "Retry",
  onPressAction,
}: ErrorStateProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.dangerSoft,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingVertical: 28,
      }}
    >
      <AppText variant="h3" tone="danger">
        {title}
      </AppText>
      <AppText variant="body" tone="secondary" style={{ marginTop: 8 }}>
        {description}
      </AppText>
      {onPressAction && (
        <AppButton
          label={actionLabel}
          onPress={onPressAction}
          variant="danger"
          style={{ marginTop: 20, alignSelf: 'flex-start' }}
        />
      )}
    </View>
  );
}
