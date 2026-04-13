import React from "react";
import { Text, TextProps } from "react-native";
import { cn } from "../../utils/cn";

type Variant =
  | "hero"
  | "h1"
  | "h2"
  | "h3"
  | "title"
  | "body"
  | "bodyMedium"
  | "caption"
  | "micro";

type Tone = "default" | "secondary" | "muted" | "inverse" | "primary" | "success" | "danger";

const variantClasses: Record<Variant, string> = {
  hero: "text-[30px] leading-9 font-extrabold",
  h1: "text-[26px] leading-8 font-extrabold",
  h2: "text-[22px] leading-7 font-bold",
  h3: "text-[18px] leading-6 font-bold",
  title: "text-base leading-[22px] font-bold",
  body: "text-[15px] leading-[22px] font-normal",
  bodyMedium: "text-[15px] leading-[22px] font-medium",
  caption: "text-[13px] leading-[18px] font-medium",
  micro: "text-xs leading-4 font-medium",
};

const toneClasses: Record<Tone, string> = {
  default: "text-slate-900",
  secondary: "text-slate-600",
  muted: "text-slate-500",
  inverse: "text-white",
  primary: "text-indigo-600",
  success: "text-green-600",
  danger: "text-red-600",
};

export type AppTextProps = TextProps & {
  variant?: Variant;
  tone?: Tone;
};

export function AppText({
  variant = "body",
  tone = "default",
  className,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      className={cn(variantClasses[variant], toneClasses[tone], className)}
    />
  );
}
