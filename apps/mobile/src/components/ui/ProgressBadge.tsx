import React from "react";
import { View } from "react-native";
import { AppText } from "./AppText";
import { cn } from "../../utils/cn";

type Tone = "primary" | "success" | "warning";

const toneClasses: Record<Tone, string> = {
  primary: "bg-indigo-50",
  success: "bg-green-50",
  warning: "bg-amber-50",
};

const textTones: Record<Tone, "primary" | "success" | "default"> = {
  primary: "primary",
  success: "success",
  warning: "default",
};

export type ProgressBadgeProps = {
  value: number;
  tone?: Tone;
  label?: string;
};

export function ProgressBadge({
  value,
  tone = "primary",
  label = "Complete",
}: ProgressBadgeProps) {
  return (
    <View className={cn("self-start rounded-full px-3 py-2", toneClasses[tone])}>
      <AppText variant="micro" tone={textTones[tone]}>
        {value}% {label}
      </AppText>
    </View>
  );
}
