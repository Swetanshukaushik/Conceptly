import React, { useMemo } from 'react';
import { Text, Pressable, View, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Icon } from './Icon';

export interface BionicTextProps {
  text: string;
  style?: StyleProp<TextStyle>;
  forceBionic?: boolean;
  numberOfLines?: number;
}

/**
 * 2040 Bionic Reading Engine:
 * Splits words into initial fixation anchors (bold high-contrast) and
 * trailing syllables (secondary contrast) so the human visual cortex
 * decodes technical prose at 2x velocity.
 */
export function BionicText({
  text,
  style,
  forceBionic,
  numberOfLines,
}: BionicTextProps) {
  const storeBionic = useAppStore((s) => s.bionicReading);
  const { colors } = useTheme();
  const isBionic = forceBionic ?? storeBionic;

  const tokens = useMemo(() => {
    if (!isBionic || !text) return null;
    return text.split(/(\s+)/);
  }, [isBionic, text]);

  if (!isBionic || !tokens) {
    return (
      <Text style={[{ color: colors.textSecondary }, style]} numberOfLines={numberOfLines}>
        {text}
      </Text>
    );
  }

  return (
    <Text style={[{ color: colors.textSecondary }, style]} numberOfLines={numberOfLines}>
      {tokens.map((token, idx) => {
        if (/^\s+$/.test(token)) {
          return token;
        }
        // Preserve leading punctuation
        const match = token.match(/^([^\w]*)([\w-]+)(.*)$/);
        if (!match) {
          return token;
        }
        const [, prefix, word, suffix] = match;
        const boldLen = Math.max(1, Math.ceil(word.length * 0.45));
        const head = word.slice(0, boldLen);
        const tail = word.slice(boldLen);

        return (
          <React.Fragment key={idx}>
            {prefix}
            <Text style={{ fontWeight: '800', color: colors.textPrimary }}>{head}</Text>
            <Text style={{ fontWeight: '400', color: colors.textSecondary }}>{tail}</Text>
            {suffix}
          </React.Fragment>
        );
      })}
    </Text>
  );
}

export function BionicToggle({ compact = false }: { compact?: boolean }) {
  const bionicReading = useAppStore((s) => s.bionicReading);
  const toggleBionicReading = useAppStore((s) => s.toggleBionicReading);
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={toggleBionicReading}
      style={[
        styles.pill,
        {
          backgroundColor: bionicReading ? colors.primarySoft : colors.surfaceSubtle,
          borderColor: bionicReading ? colors.primary : colors.border,
        },
      ]}
    >
      <Icon
        name={bionicReading ? 'eye' : 'eye-outline'}
        size={13}
        color={bionicReading ? colors.primaryText : colors.textMuted}
      />
      <Text
        style={[
          styles.label,
          {
            color: bionicReading ? colors.primaryText : colors.textSecondary,
            fontWeight: bionicReading ? '800' : '600',
          },
        ]}
      >
        {compact ? 'BIO' : `BIONIC: ${bionicReading ? 'ON' : 'OFF'}`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.6,
  },
});
