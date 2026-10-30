export type ThemeMode = 'light' | 'dark';

export interface TrackPalette {
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
}

export interface ThemeColors {
  name: ThemeMode;
  isDark: boolean;

  // Backgrounds
  canvasBg: string;        // Outer desktop / canvas wrapper
  screenBg: string;        // Screen container background
  surface: string;         // Primary card / panel surface
  surfaceElevated: string; // Elevated popover / active card surface
  surfaceSubtle: string;   // Input / badge / subtle pill background

  // Borders
  border: string;          // Standard hairline divider
  borderSubtle: string;    // Soft interior divider
  borderActive: string;    // Focused or selected border
  borderSpecular: string;  // 2040 top-edge overhead light highlight

  // Spatial 2040 Optics
  gridDot: string;         // CAD blueprint dot-matrix reticle color
  ambientAura: string;     // Sub-surface radial ambient glow
  telemetryMono: string;   // Tabular monospace HUD readout color

  // Text
  textPrimary: string;     // Highest contrast text
  textSecondary: string;   // Supporting text / descriptions
  textMuted: string;       // Captions / timestamps / quiet labels
  textInverse: string;     // Contrast text for solid buttons

  // Brand / Focus Accent
  primary: string;         // Main action / brand color
  primaryHover: string;    // Button hover / active press
  primarySoft: string;     // Tinted pill / badge background
  primaryBorder: string;   // Subtle border around primary soft cards
  primaryText: string;     // Contrast text on primarySoft

  // Secondary Accents (Adds subtle, elegant life to the UI)
  accent: string;          // Secondary highlight (Cyan / Sapphire / Amber)
  accentSoft: string;
  accentText: string;

  accentTeal: string;      // Fresh mint / teal highlight
  accentTealSoft: string;
  accentTealText: string;

  streak: string;          // Fire flame orange for streaks
  streakSoft: string;

  // Semantic Status
  success: string;         // Completed / mastery / correct
  successSoft: string;
  successText: string;

  warning: string;         // Review needed / note
  warningSoft: string;
  warningText: string;

  danger: string;          // Error / critical mistake
  dangerSoft: string;
  dangerText: string;

  // Navigation
  navBg: string;
  navBorder: string;
  navActive: string;
  navInactive: string;

  // Track Specific Accent Maps
  tracks: {
    tech: TrackPalette;
    pm: TrackPalette;
    finance: TrackPalette;
    upsc: TrackPalette;
    jee: TrackPalette;
    neet: TrackPalette;
    school: TrackPalette;
  };
}
