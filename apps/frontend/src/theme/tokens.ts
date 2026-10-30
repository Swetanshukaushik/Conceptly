import { ThemeColors, ThemeMode } from "./types";

export const lightTheme: ThemeColors = {
  name: 'light',
  isDark: false,

  canvasBg: '#F0F3F8',
  screenBg: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#F1F5F9',
  surfaceSubtle: '#F1F4F9',

  border: '#E2E8F0',
  borderSubtle: '#EEF2F6',
  borderActive: '#1D4ED8',
  borderSpecular: '#FFFFFF',

  gridDot: 'rgba(15, 23, 42, 0.06)',
  ambientAura: 'rgba(29, 78, 216, 0.05)',
  telemetryMono: '#1D4ED8',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#8692A6',
  textInverse: '#FFFFFF',

  primary: '#1D4ED8',         // Precision Sapphire / Royal Cobalt
  primaryHover: '#1E40AF',
  primarySoft: '#EFF6FF',
  primaryBorder: '#BFDBFE',
  primaryText: '#1D4ED8',

  accent: '#0D9488',          // Refined Alpine Teal
  accentSoft: '#F0FDFA',
  accentText: '#0F766E',

  accentTeal: '#059669',      // Deep Malachite
  accentTealSoft: '#ECFDF5',
  accentTealText: '#047857',

  streak: '#EA580C',          // Flame Orange
  streakSoft: '#FFF7ED',

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
  navActive: '#1D4ED8',
  navInactive: '#64748B',

  tracks: {
    tech: {
      badgeBg: '#EFF6FF',
      badgeBorder: '#BFDBFE',
      badgeText: '#1D4ED8',
      iconBg: '#DBEAFE',
      iconColor: '#1E40AF',
    },
    pm: {
      badgeBg: '#F5F3FF',
      badgeBorder: '#DDD6FE',
      badgeText: '#6D28D9',
      iconBg: '#EDE9FE',
      iconColor: '#5B21B6',
    },
    finance: {
      badgeBg: '#ECFDF5',
      badgeBorder: '#A7F3D0',
      badgeText: '#047857',
      iconBg: '#D1FAE5',
      iconColor: '#065F46',
    },
    upsc: {
      badgeBg: '#FFFBEB',
      badgeBorder: '#FDE68A',
      badgeText: '#B45309',
      iconBg: '#FEF3C7',
      iconColor: '#92400E',
    },
    jee: {
      badgeBg: '#F0F9FF',
      badgeBorder: '#BAE6FD',
      badgeText: '#0369A1',
      iconBg: '#E0F2FE',
      iconColor: '#075985',
    },
    neet: {
      badgeBg: '#FFF1F2',
      badgeBorder: '#FECDD3',
      badgeText: '#BE123C',
      iconBg: '#FFE4E6',
      iconColor: '#9F1239',
    },
    school: {
      badgeBg: '#F0FDFA',
      badgeBorder: '#99F6E4',
      badgeText: '#0F766E',
      iconBg: '#CCFBF1',
      iconColor: '#115E59',
    },
  },
};

export const darkTheme: ThemeColors = {
  name: 'dark',
  isDark: true,

  canvasBg: '#141518',
  screenBg: '#1B1D22',
  surface: '#24272F',
  surfaceElevated: '#2D313B',
  surfaceSubtle: '#282B33',

  border: '#373B45',
  borderSubtle: '#2D3038',
  borderActive: '#F59E0B',
  borderSpecular: 'rgba(253, 230, 138, 0.20)',

  gridDot: 'rgba(245, 158, 11, 0.10)',
  ambientAura: 'rgba(245, 158, 11, 0.07)',
  telemetryMono: '#FBBF24',

  textPrimary: '#F1F2F5',
  textSecondary: '#9DA1B0',
  textMuted: '#6B7080',
  textInverse: '#141518',

  primary: '#F59E0B',         // Warm Horology Amber / Industrial Brass
  primaryHover: '#D97706',
  primarySoft: 'rgba(245, 158, 11, 0.14)',
  primaryBorder: 'rgba(245, 158, 11, 0.32)',
  primaryText: '#FBBF24',

  accent: '#14B8A6',          // Scandinavian Studio Teal
  accentSoft: 'rgba(20, 184, 166, 0.12)',
  accentText: '#2DD4BF',

  accentTeal: '#10B981',      // Muted Emerald
  accentTealSoft: 'rgba(16, 185, 129, 0.12)',
  accentTealText: '#34D399',

  streak: '#F97316',          // Studio Tangerine
  streakSoft: 'rgba(249, 115, 22, 0.14)',

  success: '#10B981',
  successSoft: 'rgba(16, 185, 129, 0.14)',
  successText: '#34D399',

  warning: '#F59E0B',
  warningSoft: 'rgba(245, 158, 11, 0.14)',
  warningText: '#FBBF24',

  danger: '#EF4444',
  dangerSoft: 'rgba(239, 68, 68, 0.14)',
  dangerText: '#F87171',

  navBg: '#1B1D22',
  navBorder: '#373B45',
  navActive: '#F59E0B',
  navInactive: '#757A8A',

  tracks: {
    tech: {
      badgeBg: 'rgba(56, 189, 248, 0.12)',
      badgeBorder: 'rgba(56, 189, 248, 0.28)',
      badgeText: '#7DD3FC',
      iconBg: 'rgba(56, 189, 248, 0.16)',
      iconColor: '#38BDF8',
    },
    pm: {
      badgeBg: 'rgba(167, 139, 250, 0.12)',
      badgeBorder: 'rgba(167, 139, 250, 0.28)',
      badgeText: '#DDD6FE',
      iconBg: 'rgba(167, 139, 250, 0.16)',
      iconColor: '#C4B5FD',
    },
    finance: {
      badgeBg: 'rgba(52, 211, 153, 0.12)',
      badgeBorder: 'rgba(52, 211, 153, 0.28)',
      badgeText: '#A7F3D0',
      iconBg: 'rgba(52, 211, 153, 0.16)',
      iconColor: '#6EE7B7',
    },
    upsc: {
      badgeBg: 'rgba(245, 158, 11, 0.14)',
      badgeBorder: 'rgba(245, 158, 11, 0.32)',
      badgeText: '#FDE68A',
      iconBg: 'rgba(245, 158, 11, 0.18)',
      iconColor: '#FBBF24',
    },
    jee: {
      badgeBg: 'rgba(96, 165, 250, 0.12)',
      badgeBorder: 'rgba(96, 165, 250, 0.28)',
      badgeText: '#BFDBFE',
      iconBg: 'rgba(96, 165, 250, 0.16)',
      iconColor: '#93C5FD',
    },
    neet: {
      badgeBg: 'rgba(251, 113, 133, 0.12)',
      badgeBorder: 'rgba(251, 113, 133, 0.28)',
      badgeText: '#FECDD3',
      iconBg: 'rgba(251, 113, 133, 0.16)',
      iconColor: '#FDA4AF',
    },
    school: {
      badgeBg: 'rgba(45, 212, 191, 0.12)',
      badgeBorder: 'rgba(45, 212, 191, 0.28)',
      badgeText: '#99F6E4',
      iconBg: 'rgba(45, 212, 191, 0.16)',
      iconColor: '#5EEAD4',
    },
  },
};

export const themeMap: Record<ThemeMode, ThemeColors> = {
  light: lightTheme,
  dark: darkTheme,
};

export function getThemeColors(mode: ThemeMode | string): ThemeColors {
  if (mode === 'light') return lightTheme;
  return darkTheme;
}

// Backward compatibility alias
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
  hero: { fontSize: 28, lineHeight: 34, fontWeight: "800" as const, letterSpacing: -0.5 },
  h1: { fontSize: 24, lineHeight: 30, fontWeight: "800" as const, letterSpacing: -0.4 },
  h2: { fontSize: 20, lineHeight: 26, fontWeight: "700" as const, letterSpacing: -0.3 },
  h3: { fontSize: 17, lineHeight: 23, fontWeight: "700" as const, letterSpacing: -0.2 },
  title: { fontSize: 15, lineHeight: 21, fontWeight: "600" as const },
  body: { fontSize: 14, lineHeight: 21, fontWeight: "400" as const },
  bodyMedium: { fontSize: 14, lineHeight: 21, fontWeight: "500" as const },
  caption: { fontSize: 12, lineHeight: 17, fontWeight: "500" as const },
  micro: { fontSize: 11, lineHeight: 15, fontWeight: "600" as const, letterSpacing: 0.2 },
} as const;
