import React from "react";
import { Pressable, PressableProps, View } from "react-native";
import { AppCard } from "../ui/AppCard";
import { AppText } from "../ui/AppText";
import { ProgressBadge } from "../ui/ProgressBadge";
import { cn } from "../../utils/cn";

export type FeatureListCardProps = PressableProps & {
  eyebrow?: string;
  title: string;
  description?: string;
  progress?: number;
  rightSlot?: React.ReactNode;
};

export function FeatureListCard({
  eyebrow,
  title,
  description,
  progress,
  rightSlot,
  className,
  ...props
}: FeatureListCardProps) {
  return (
    <Pressable {...props} className={className}>
      <AppCard className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          {eyebrow ? (
            <AppText variant="micro" tone="primary">
              {eyebrow}
            </AppText>
          ) : null}
          <AppText variant="title" className={cn(eyebrow ? "mt-1" : "")}>
            {title}
          </AppText>
          {description ? (
            <AppText variant="body" tone="secondary" className="mt-2">
              {description}
            </AppText>
          ) : null}
          {typeof progress === "number" ? (
            <View className="mt-3">
              <ProgressBadge value={progress} />
            </View>
          ) : null}
        </View>
        {rightSlot ? <View>{rightSlot}</View> : null}
      </AppCard>
    </Pressable>
  );
}
