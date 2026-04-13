import React from "react";
import { View } from "react-native";
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
  return (
    <View className="rounded-[28px] border border-red-100 bg-red-50 px-6 py-8">
      <AppText variant="h3" tone="danger">
        {title}
      </AppText>
      <AppText variant="body" tone="secondary" className="mt-2">
        {description}
      </AppText>
      <AppButton label={actionLabel} onPress={onPressAction} variant="danger" className="mt-5 self-start" />
    </View>
  );
}
