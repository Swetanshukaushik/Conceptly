import React from "react";
import { View } from "react-native";
import { SectionHeader } from "../ui/SectionHeader";

export type SectionBlockProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPressAction?: () => void;
  children: React.ReactNode;
};

export function SectionBlock({
  title,
  subtitle,
  actionLabel,
  onPressAction,
  children,
}: SectionBlockProps) {
  return (
    <View className="mb-6">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        actionLabel={actionLabel}
        onPressAction={onPressAction}
      />
      {children}
    </View>
  );
}
