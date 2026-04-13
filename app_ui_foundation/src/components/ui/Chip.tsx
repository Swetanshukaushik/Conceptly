import React from "react";
import { Pressable, PressableProps, View } from "react-native";
import { AppText } from "./AppText";
import { cn } from "../../utils/cn";

type Variant = "default" | "selected" | "soft";

const variantClasses: Record<Variant, string> = {
  default: "bg-white border border-slate-200",
  selected: "bg-indigo-600 border border-indigo-600",
  soft: "bg-indigo-50 border border-indigo-100",
};

export type ChipProps = PressableProps & {
  label: string;
  variant?: Variant;
  leftIcon?: React.ReactNode;
};

export function Chip({
  label,
  variant = "default",
  leftIcon,
  className,
  ...props
}: ChipProps) {
  const tone = variant === "selected" ? "inverse" : variant === "soft" ? "primary" : "default";

  return (
    <Pressable
      className={cn(
        "min-h-10 flex-row items-center gap-2 rounded-full px-4 py-2",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {leftIcon ? <View>{leftIcon}</View> : null}
      <AppText variant="caption" tone={tone}>
        {label}
      </AppText>
    </Pressable>
  );
}
