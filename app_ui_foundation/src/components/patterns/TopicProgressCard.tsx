import React from "react";
import { Pressable, PressableProps, View } from "react-native";
import { AppCard } from "../ui/AppCard";
import { AppButton } from "../ui/AppButton";
import { AppText } from "../ui/AppText";
import { ProgressBadge } from "../ui/ProgressBadge";
import { StatPill } from "../ui/StatPill";

export type TopicProgressCardProps = PressableProps & {
  title: string;
  subtitle?: string;
  progress: number;
  onPressWatch?: () => void;
  onPressQuiz?: () => void;
};

export function TopicProgressCard({
  title,
  subtitle,
  progress,
  onPressWatch,
  onPressQuiz,
  ...props
}: TopicProgressCardProps) {
  return (
    <Pressable {...props}>
      <AppCard className="p-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <AppText variant="title">{title}</AppText>
            {subtitle ? (
              <AppText variant="body" tone="secondary" className="mt-2">
                {subtitle}
              </AppText>
            ) : null}
          </View>
          <ProgressBadge value={progress} tone={progress >= 100 ? "success" : "primary"} />
        </View>

        <View className="mt-4 flex-row flex-wrap gap-2">
          <StatPill label="Mode" value="Reel + Quiz" />
          <StatPill label="Level" value="NCERT" />
        </View>

        <View className="mt-5 flex-row gap-3">
          <AppButton label="Watch" className="flex-1" onPress={onPressWatch} />
          <AppButton label="Quiz" variant="secondary" className="flex-1" onPress={onPressQuiz} />
        </View>
      </AppCard>
    </Pressable>
  );
}
