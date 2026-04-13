import React from "react";
import { Pressable, PressableProps } from "react-native";
import { cn } from "../../utils/cn";

type Tone = "default" | "primary" | "inverse";

const toneClasses: Record<Tone, string> = {
  default: "bg-white border border-slate-200",
  primary: "bg-indigo-600 border border-indigo-600",
  inverse: "bg-black/20 border border-white/20",
};

export type IconButtonProps = PressableProps & {
  icon: React.ReactNode;
};

export function IconButton({ icon, className, ...props }: IconButtonProps) {
  return (
    <Pressable
      className={cn("h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200", className)}
      {...props}
    >
      {icon}
    </Pressable>
  );
}
