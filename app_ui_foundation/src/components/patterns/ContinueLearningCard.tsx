import React from "react";
import { View } from "react-native";
import { AppButton } from "../ui/AppButton";
import { AppCard } from "../ui/AppCard";
import { AppText } from "../ui/AppText";
import { ProgressBadge } from "../ui/ProgressBadge";
import { StatPill } from "../ui/StatPill";

export type ContinueLearningCardProps = {
  title: string;
  subtitle: string;
  progress: number;
  duration?: string;
  chapter?: string;
  onPressContinue?: () => void;
};

export function ContinueLearningCard({
  title,
  subtitle,
  progress,
  duration = "6 min",
  chapter,
  onPressContinue,
}: ContinueLearningCardProps) {
  return (
    <AppCard tone="primarySoft" className="p-5">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <AppText variant="caption" tone="primary">
            Continue learning
          </AppText>
          <AppText variant="h2" className="mt-2">
            {title}
          </AppText>
          <AppText variant="body" tone="secondary" className="mt-2">
            {subtitle}
          </AppText>
        </View>
        <ProgressBadge value={progress} />
      </View>

      <View className="mt-4 flex-row flex-wrap gap-2">
        <StatPill label="Duration" value={duration} />
        {chapter ? <StatPill label="Chapter" value={chapter} /> : null}
      </View>

      <AppButton label="Resume" className="mt-5" onPress={onPressContinue} />
    </AppCard>
  );
}
