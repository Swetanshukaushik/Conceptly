import React from "react";
import { View } from "react-native";
import { AppText } from "./AppText";
import { AppButton } from "./AppButton";

export type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onPressAction?: () => void;
  icon?: React.ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onPressAction,
  icon,
}: EmptyStateProps) {
  return (
    <View className="items-center rounded-[28px] bg-white px-6 py-10">
      {icon ? <View className="mb-4">{icon}</View> : null}
      <AppText variant="h3" className="text-center">
        {title}
      </AppText>
      {description ? (
        <AppText variant="body" tone="secondary" className="mt-2 text-center">
          {description}
        </AppText>
      ) : null}
      {actionLabel ? (
        <AppButton label={actionLabel} onPress={onPressAction} className="mt-5 self-stretch" />
      ) : null}
    </View>
  );
}
