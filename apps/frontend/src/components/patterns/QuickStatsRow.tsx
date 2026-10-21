import React from "react";
import { ScrollView } from "react-native";
import { StatPill } from "../ui/StatPill";

export type QuickStatsRowProps = {
  stats: Array<{ label: string; value: string }>;
};

export function QuickStatsRow({ stats }: QuickStatsRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2"
    >
      {stats.map((stat) => (
        <StatPill key={`${stat.label}-${stat.value}`} label={stat.label} value={stat.value} />
      ))}
    </ScrollView>
  );
}
