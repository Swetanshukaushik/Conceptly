import { ThemeColors, ThemeMode } from "./types";

export const lightTheme: ThemeColors = {
  name: 'light',
  isDark: false,

  canvasBg: '#F1F3F7',
  screenBg: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#F1F5F9',
  surfaceSubtle: '#F1F4F9',

  border: '#E2E8F0',
  borderSubtle: '#EDF2F7',
  borderActive: '#0F172A',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  primary: '#0F172A',         // High-focus obsidian primary action
  primaryHover: '#1E293B',
  primarySoft: '#F1F5F9',
  primaryBorder: '#CBD5E1',
  primaryText: '#0F172A',

  accent: '#2563EB',          // Precision Royal Cobalt
  accentSoft: '#EFF6FF',
  accentText: '#1D4ED8',

  success: '#059669',         // Deep Emerald
  successSoft: '#ECFDF5',
  successText: '#065F46',

  warning: '#D97706',         // Warm Amber
  warningSoft: '#FFFBEB',
  warningText: '#92400E',

  danger: '#DC2626',          // Crimson
  dangerSoft: '#FEF2F2',
  dangerText: '#991B1B',

  navBg: '#FFFFFF',
  navBorder: '#E2E8F0',
  navActive: '#0F172A',
  navInactive: '#64748B',
};

export const darkTheme: ThemeColors = {
  name: 'dark',
  isDark: true,

  canvasBg: '#070A0F',
  screenBg: '#0B0F17',
  surface: '#111722',
  surfaceElevated: '#172030',
  surfaceSubtle: '#151D2A',

  border: '#1E293B',
  borderSubtle: '#141D2B',
  borderActive: '#38BDF8',

  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0B0F17',

  primary: '#38BDF8',         // Luminescent Ice Azure
  primaryHover: '#0EA5E9',
  primarySoft: 'rgba(56, 189, 248, 0.10)',
  primaryBorder: 'rgba(56, 189, 248, 0.25)',
  primaryText: '#38BDF8',

  accent: '#60A5FA',          // Tech Blue
  accentSoft: 'rgba(96, 165, 250, 0.10)',
  accentText: '#93C5FD',

  success: '#10B981',         // Emerald
  successSoft: 'rgba(16, 185, 129, 0.12)',
  successText: '#34D399',

  warning: '#F59E0B',         // Amber
  warningSoft: 'rgba(245, 158, 11, 0.12)',
  warningText: '#FBBF24',

  danger: '#EF4444',          // Crimson
  dangerSoft: 'rgba(239, 68, 68, 0.12)',
  dangerText: '#F87171',

  navBg: '#0B0F17',
  navBorder: '#1E293B',
  navActive: '#38BDF8',
  navInactive: '#64748B',
};

export const greyTheme: ThemeColors = {
  name: 'grey',
  isDark: true,

  canvasBg: '#151618',
  screenBg: '#1B1C20',
  surface: '#23252A',
  surfaceElevated: '#2C2E34',
  surfaceSubtle: '#27292F',

  border: '#33363E',
  borderSubtle: '#2A2C33',
  borderActive: '#F59E0B',

  textPrimary: '#EDEDEF',
  textSecondary: '#A2A5B1',
  textMuted: '#6E7280',
  textInverse: '#1B1C20',

  primary: '#F59E0B',         // Warm Executive Amber / Industrial Titanium
  primaryHover: '#D97706',
  primarySoft: 'rgba(245, 158, 11, 0.12)',
  primaryBorder: 'rgba(245, 158, 11, 0.28)',
  primaryText: '#FBBF24',

  accent: '#38BDF8',          // Calming Teal-Cyan
  accentSoft: 'rgba(56, 189, 248, 0.10)',
  accentText: '#7DD3FC',

  success: '#10B981',
  successSoft: 'rgba(16, 185, 129, 0.12)',
  successText: '#34D399',

  warning: '#F59E0B',
  warningSoft: 'rgba(245, 158, 11, 0.12)',
  warningText: '#FBBF24',

  danger: '#EF4444',
  dangerSoft: 'rgba(239, 68, 68, 0.12)',
  dangerText: '#F87171',

  navBg: '#1B1C20',
  navBorder: '#33363E',
  navActive: '#F59E0B',
  navInactive: '#70737F',
};

export const themeMap: Record<ThemeMode, ThemeColors> = {
  light: lightTheme,
  dark: darkTheme,
  grey: greyTheme,
};

export function getThemeColors(mode: ThemeMode): ThemeColors {
  return themeMap[mode] || darkTheme;
}

// Backward compatibility alias for any existing code
export const colors = lightTheme;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 999,
} as const;

export const typography = {
  hero: { fontSize: 30, lineHeight: 36, fontWeight: "800" as const, letterSpacing: -0.5 },
  h1: { fontSize: 24, lineHeight: 30, fontWeight: "800" as const, letterSpacing: -0.4 },
  h2: { fontSize: 20, lineHeight: 26, fontWeight: "700" as const, letterSpacing: -0.3 },
  h3: { fontSize: 17, lineHeight: 23, fontWeight: "700" as const, letterSpacing: -0.2 },
  title: { fontSize: 15, lineHeight: 21, fontWeight: "600" as const },
  body: { fontSize: 14, lineHeight: 21, fontWeight: "400" as const },
  bodyMedium: { fontSize: 14, lineHeight: 21, fontWeight: "500" as const },
  caption: { fontSize: 12, lineHeight: 17, fontWeight: "500" as const },
  micro: { fontSize: 11, lineHeight: 15, fontWeight: "600" as const, letterSpacing: 0.2 },
} as const;
