import React from "react";
import { Pressable, View } from "react-native";
import { AppText } from "./AppText";

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
  return (
    <View className="mb-3 flex-row items-end justify-between gap-3">
      <View className="flex-1">
        <AppText variant="h3">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" tone="secondary" className="mt-1">
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {actionLabel ? (
        <Pressable onPress={onPressAction} className="rounded-full bg-slate-100 px-3 py-2">
          <AppText variant="caption" tone="primary">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
