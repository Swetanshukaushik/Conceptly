import React from "react";
import { View } from "react-native";
import { AppButton } from "../ui/AppButton";
import { AppCard } from "../ui/AppCard";
import { AppText } from "../ui/AppText";

export type HeroBannerProps = {
  eyebrow?: string;
  title: string;
  description: string;
  primaryActionLabel?: string;
  onPressPrimaryAction?: () => void;
};

export function HeroBanner({
  eyebrow = "Today’s learning",
  title,
  description,
  primaryActionLabel = "Start now",
  onPressPrimaryAction,
}: HeroBannerProps) {
  return (
    <AppCard tone="accentSoft" className="p-5">
      <AppText variant="caption" tone="primary">
        {eyebrow}
      </AppText>
      <AppText variant="hero" className="mt-2">
        {title}
      </AppText>
      <AppText variant="body" tone="secondary" className="mt-3">
        {description}
      </AppText>
      <AppButton
        label={primaryActionLabel}
        onPress={onPressPrimaryAction}
        className="mt-5 self-start"
      />
    </AppCard>
  );
}
