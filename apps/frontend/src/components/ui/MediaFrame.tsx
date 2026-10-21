import React from "react";
import { View } from "react-native";
import { AppText } from "./AppText";
import { cn } from "../../utils/cn";

export type MediaFrameProps = {
  title?: string;
  aspect?: "video" | "square" | "wide";
  className?: string;
  overlay?: React.ReactNode;
};

const aspectClasses = {
  video: "aspect-[9/16]",
  square: "aspect-square",
  wide: "aspect-[16/9]",
} as const;

export function MediaFrame({
  title = "Media preview",
  aspect = "video",
  className,
  overlay,
}: MediaFrameProps) {
  return (
    <View className={cn("overflow-hidden rounded-[28px] bg-slate-900", aspectClasses[aspect], className)}>
      <View className="flex-1 items-center justify-center bg-slate-900 p-6">
        <AppText variant="title" tone="inverse" className="text-center">
          {title}
        </AppText>
        <AppText variant="caption" tone="inverse" className="mt-2 text-center opacity-80">
          Replace with real video or thumbnail content
        </AppText>
      </View>
      {overlay ? <View className="absolute inset-0">{overlay}</View> : null}
    </View>
  );
}
