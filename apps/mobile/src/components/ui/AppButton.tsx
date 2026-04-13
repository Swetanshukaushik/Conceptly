import React from "react";
import { ActivityIndicator, Pressable, PressableProps, View } from "react-native";
import { AppText } from "./AppText";
import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export type AppButtonProps = PressableProps & {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-indigo-600 active:bg-indigo-700",
  secondary: "bg-indigo-50 border border-indigo-100 active:bg-indigo-100",
  ghost: "bg-transparent active:bg-slate-100",
  danger: "bg-red-600 active:bg-red-700",
};

const labelTone: Record<Variant, "inverse" | "primary" | "default"> = {
  primary: "inverse",
  secondary: "primary",
  ghost: "default",
  danger: "inverse",
};

const sizeClasses: Record<Size, string> = {
  sm: "min-h-10 px-4 rounded-2xl",
  md: "min-h-12 px-5 rounded-2xl",
  lg: "min-h-14 px-6 rounded-[24px]",
};

export function AppButton({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  className,
  ...props
}: AppButtonProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      className={cn(
        "items-center justify-center",
        variantClasses[variant],
        sizeClasses[size],
        disabled || loading ? "opacity-60" : "",
        className,
      )}
      {...props}
    >
      <View className="flex-row items-center justify-center gap-2">
        {loading ? <ActivityIndicator color={variant === "secondary" ? "#5B5CF0" : "#FFFFFF"} /> : leftIcon}
        <AppText variant="bodyMedium" tone={labelTone[variant]}>
          {label}
        </AppText>
        {!loading ? rightIcon : null}
      </View>
    </Pressable>
  );
}
