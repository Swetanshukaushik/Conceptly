import React from "react";
import { ActivityIndicator, View } from "react-native";
import { AppText } from "./AppText";

export type LoaderProps = {
  label?: string;
};

export function Loader({ label = "Loading..." }: LoaderProps) {
  return (
    <View className="items-center justify-center py-10">
      <ActivityIndicator size="large" color="#5B5CF0" />
      <AppText variant="caption" tone="secondary" className="mt-3">
        {label}
      </AppText>
    </View>
  );
}
