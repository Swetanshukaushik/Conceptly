export const colors = {
  bg: "#F7F8FC",
  bgSecondary: "#EEF1F7",
  surface: "#FFFFFF",
  surfaceMuted: "#F3F5FA",
  surfaceStrong: "#E9EEF8",

  text: "#111827",
  textSecondary: "#4B5563",
  textMuted: "#6B7280",
  textInverse: "#FFFFFF",

  border: "#E5E7EB",
  borderSoft: "#EEF2F7",

  primary: "#5B5CF0",
  primarySoft: "#E9E7FF",
  primaryStrong: "#4647D9",

  accent: "#7C3AED",
  accentSoft: "#F1E8FF",

  success: "#16A34A",
  successSoft: "#DCFCE7",

  warning: "#F59E0B",
  warningSoft: "#FEF3C7",

  danger: "#DC2626",
  dangerSoft: "#FEE2E2",

  info: "#2563EB",
  infoSoft: "#DBEAFE",
} as const;

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
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  "2xl": 28,
  full: 999,
} as const;

export const typography = {
  hero: { fontSize: 30, lineHeight: 36, fontWeight: "800" as const },
  h1: { fontSize: 26, lineHeight: 32, fontWeight: "800" as const },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: "700" as const },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: "700" as const },
  title: { fontSize: 16, lineHeight: 22, fontWeight: "700" as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400" as const },
  bodyMedium: { fontSize: 15, lineHeight: 22, fontWeight: "500" as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "500" as const },
  micro: { fontSize: 12, lineHeight: 16, fontWeight: "500" as const },
} as const;
