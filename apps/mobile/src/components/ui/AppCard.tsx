import React from "react";
import { Pressable, View, ViewProps } from "react-native";
import { cn } from "../../utils/cn";

type Tone = "default" | "muted" | "primarySoft" | "accentSoft" | "successSoft";

const toneClasses: Record<Tone, string> = {
  default: "bg-white border border-slate-200",
  muted: "bg-slate-100 border border-slate-200",
  primarySoft: "bg-indigo-50 border border-indigo-100",
  accentSoft: "bg-violet-50 border border-violet-100",
  successSoft: "bg-green-50 border border-green-100",
};

export type AppCardProps = ViewProps & {
  tone?: Tone;
  onPress?: () => void;
};

export function AppCard({
  tone = "default",
  onPress,
  className,
  children,
  ...props
}: AppCardProps) {
  const cardClassName = cn("rounded-[24px] p-4 shadow-sm", toneClasses[tone], className);

  if (onPress) {
    return (
      <Pressable onPress={onPress} className={cardClassName}>
        {children}
      </Pressable>
    );
  }

  return (
    <View className={cardClassName} {...props}>
      {children}
    </View>
  );
}
