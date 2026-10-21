import React from "react";
import { View } from "react-native";
import { AppButton } from "../ui/AppButton";
import { AppText } from "../ui/AppText";
import { Chip } from "../ui/Chip";

export type ReelOverlayInfoProps = {
  title: string;
  topic: string;
  chapter?: string;
  onPressQuiz?: () => void;
};

export function ReelOverlayInfo({
  title,
  topic,
  chapter,
  onPressQuiz,
}: ReelOverlayInfoProps) {
  return (
    <View className="flex-1 justify-end p-4">
      <View className="rounded-[28px] bg-black/35 p-4">
        <View className="mb-3 flex-row flex-wrap gap-2">
          <Chip label={topic} variant="soft" />
          {chapter ? <Chip label={chapter} variant="default" /> : null}
        </View>
        <AppText variant="h3" tone="inverse">
          {title}
        </AppText>
        <AppText variant="body" tone="inverse" className="mt-2 opacity-90">
          Learn the concept quickly with visual explanation and then test yourself.
        </AppText>
        <AppButton
          label="Take quick quiz"
          variant="secondary"
          className="mt-4 self-start"
          onPress={onPressQuiz}
        />
      </View>
    </View>
  );
}
