export type ThemeMode = 'light' | 'dark' | 'grey';

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

  // Secondary Accents
  accent: string;          // Secondary highlight
  accentSoft: string;
  accentText: string;

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
}
