import React from "react";
import { Pressable, PressableProps } from "react-native";
import { cn } from "../../utils/cn";
import { Icon } from "./Icon";

type Tone = "default" | "primary" | "inverse";

const toneClasses: Record<Tone, string> = {
  default: "bg-white border border-slate-200",
  primary: "bg-indigo-600 border border-indigo-600",
  inverse: "bg-black/20 border border-white/20",
};

export type IconButtonProps = PressableProps & {
  icon: React.ReactNode | string;
  size?: "sm" | "md" | "lg";
  variant?: Tone;
};

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

export function IconButton({ icon, size = "md", variant = "default", className, ...props }: IconButtonProps) {
  const iconElement = typeof icon === "string" ? (
    <Icon name={icon} size={size === "sm" ? 16 : size === "lg" ? 32 : 24} />
  ) : (
    icon
  );

  return (
    <Pressable
      className={cn(
        "items-center justify-center rounded-full",
        toneClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {iconElement}
    </Pressable>
  );
}
