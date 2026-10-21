import React from "react";
import { Ionicons } from "@expo/vector-icons";

export type IconProps = {
  name: string;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 24, color = "black" }: IconProps) {
  return <Ionicons name={name as any} size={size} color={color} />;
}