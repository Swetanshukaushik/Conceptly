import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '@/app/providers/ThemeProvider';

export interface BionicTextProps {
  text: string;
  style?: StyleProp<TextStyle>;
  forceBionic?: boolean;
  numberOfLines?: number;
}

/**
 * Standard clean text renderer (Bionic Reading feature hidden per user preference).
 */
export function BionicText({
  text,
  style,
  numberOfLines,
}: BionicTextProps) {
  const { colors } = useTheme();

  return (
    <Text style={[{ color: colors.textSecondary }, style]} numberOfLines={numberOfLines}>
      {text}
    </Text>
  );
}

export function BionicToggle(_props: { compact?: boolean }) {
  return null;
}
