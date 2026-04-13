import React from "react";
import { View } from "react-native";
import { AppText } from "./AppText";

export type StatPillProps = {
  label: string;
  value: string;
};

export function StatPill({ label, value }: StatPillProps) {
  return (
    <View className="rounded-full bg-slate-100 px-3 py-2">
      <AppText variant="micro" tone="secondary">
        {label}{" "}
        <AppText variant="micro" tone="default">
          {value}
        </AppText>
      </AppText>
    </View>
  );
}
