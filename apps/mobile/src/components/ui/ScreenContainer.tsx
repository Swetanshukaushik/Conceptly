import React from "react";
import { SafeAreaView, ScrollView, View, ViewProps } from "react-native";
import { cn } from "../../utils/cn";

export type ScreenContainerProps = ViewProps & {
  scroll?: boolean;
  contentClassName?: string;
};

export function ScreenContainer({
  children,
  className,
  contentClassName,
  scroll = false,
  ...props
}: ScreenContainerProps) {
  return (
    <SafeAreaView className={cn("flex-1 bg-slate-50", className)} {...props}>
      {scroll ? (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          contentContainerClassName={cn("px-4 pt-3", contentClassName)}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={cn("flex-1 px-4 pt-3", contentClassName)}>{children}</View>
      )}
    </SafeAreaView>
  );
}
