import React from "react";
import { View } from "react-native";
import { AppText } from "./AppText";
import { IconButton } from "./IconButton";

export type AppHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

export function AppHeader({ title, subtitle, onBack }: AppHeaderProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <View className="flex-row items-center gap-3 flex-1">
        {onBack && (
          <IconButton
            icon="arrow-back"
            onPress={onBack}
            size="sm"
            variant="ghost"
            accessibilityLabel="Go back"
            accessibilityRole="button"
          />
        )}
        <View className="flex-1">
          <AppText
            variant="h2"
            numberOfLines={1}
            accessibilityRole="header"
          >
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="caption" tone="secondary" numberOfLines={1}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
      </View>
    </View>
  );
}
