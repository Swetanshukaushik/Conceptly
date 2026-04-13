import React from "react";
import { View, ViewProps } from "react-native";
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
};

export function AppCard({
  tone = "default",
  className,
  children,
  ...props
}: AppCardProps) {
  return (
    <View
      className={cn("rounded-[24px] p-4 shadow-sm", toneClasses[tone], className)}
      {...props}
    >
      {children}
    </View>
  );
}
