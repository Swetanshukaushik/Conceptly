# UI Style Guide

## Purpose

This file is the styling source of truth for the mobile app. Any AI IDE, GitHub Copilot, Cursor, or human developer working on the frontend must read this file before creating or restyling screens.

This app is not a generic edtech app. It should feel like a **premium mobile-first consumer product for students**.

Primary product vibe:

- modern
- premium
- Gen Z friendly
- smooth
- visually rich
- mobile-native
- educational but not boring
- polished like a funded startup app

---

## Brand and product feel

The product should feel like:

- **Instagram Reels** for immersive content consumption
- **Spotify** for polish and layout rhythm
- **Duolingo** for clarity and progression
- **a premium startup app** for design quality

But it must not feel like a clone of any of them.

### Emotional goals
When a student opens the app, the UI should feel:

- exciting, not academic-heavy
- clear, not overwhelming
- premium, not toy-like
- focused, not cluttered
- smart, not childish
- energetic, not noisy

---

## What the design must avoid

Do not generate styling that feels like:

- a basic React Native starter app
- flat and boring enterprise UI
- childish cartoon-style education app
- cluttered dashboards
- low-contrast text on fancy backgrounds
- random gradients everywhere
- inconsistent paddings and radii
- one-off styling per screen
- overloaded “design for the sake of design”

Avoid:

- giant unreadable NativeWind class strings
- too many competing accent colors
- tiny tap targets
- weak visual hierarchy
- inconsistent card treatment
- too many border-heavy boxes
- hardcoded styling scattered everywhere

---

## Design language

### Core visual identity
The UI should use:

- rounded surfaces
- soft depth
- bold but tasteful hierarchy
- layered cards
- strong spacing rhythm
- high readability
- controlled use of accent color
- premium dark-on-light default palette
- subtle visual energy, not chaos

### Interface personality
Think:

- polished
- cinematic
- fast
- scroll-friendly
- tactile
- immersive
- study-friendly

---

## Color system

Use a premium, clean palette with strong readability.

### Base palette intent
- neutral-rich background system
- dark text
- high legibility
- one primary accent family
- one success family
- one warning family
- one error family
- muted surfaces for cards and chips

### Suggested token system

```ts
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
};
```

### Color usage rules
- Backgrounds should stay mostly clean and bright
- Accent color should be intentional, not everywhere
- Primary accent should drive CTA and selected states
- Soft accent surfaces can be used for pills, cards, tags, or highlighted blocks
- Error/success colors should remain semantic, not decorative

---

## Typography

Typography must feel modern, app-native, and clear.

### Typography intent
- strong hierarchy
- readable on mobile
- slightly bold headings
- clean body copy
- minimal long paragraph density
- high scanability

### Suggested scale

```ts
export const typography = {
  hero: { fontSize: 30, lineHeight: 36, fontWeight: "800" },
  h1: { fontSize: 26, lineHeight: 32, fontWeight: "800" },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: "700" },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: "700" },
  title: { fontSize: 16, lineHeight: 22, fontWeight: "700" },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400" },
  bodyMedium: { fontSize: 15, lineHeight: 22, fontWeight: "500" },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "500" },
  micro: { fontSize: 12, lineHeight: 16, fontWeight: "500" },
};
```

### Typography rules
- Headlines should feel confident, not timid
- Avoid using too many font weights in the same component
- Use textSecondary and textMuted for support copy
- Reel metadata should remain compact and readable
- Quiz and progress screens should emphasize clarity over decoration

---

## Spacing system

Spacing consistency matters more than fancy visuals.

### Suggested spacing scale

```ts
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
};
```

### Spacing rules
- Default screen horizontal padding should usually be 16 or 20
- Card internal padding should usually be 16 or 20
- Section-to-section spacing should feel deliberate and roomy
- Avoid cramping text and actions together
- Small UI elements like pills and chips can use tighter padding but must still feel tappable

---

## Radius system

Rounded corners are a major part of the product feel.

### Suggested radii

```ts
export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  "2xl": 28,
  full: 999,
};
```

### Radius rules
- Cards: usually lg or xl
- Hero cards / premium surfaces: xl or 2xl
- Buttons: lg to xl
- Chips/pills: full or lg
- Reel overlays: rounded but not bubble-like

---

## Elevation and depth

The app should have soft depth, not harsh shadows.

### Elevation principles
- Use subtle layered shadows
- Avoid old Android-looking heavy drop shadows
- Let elevation separate important surfaces like hero cards, floating actions, or overlays
- Combine depth with clean spacing and contrast, not just shadow

### Suggested shadow categories
- `shadow-sm` for lightweight cards
- `shadow-md` for primary surfaces
- `shadow-lg` for featured cards or modal-like surfaces

Do not use large aggressive shadows on every element.

---

## Motion and interaction

The app should feel alive but not distracting.

### Motion rules
- transitions should feel smooth and fast
- use motion to support hierarchy and focus
- button press states should feel responsive
- reel overlays and sheets should animate cleanly
- answer selection in quizzes can use slightly richer motion
- do not overanimate basic list rows

### Good motion targets
- card press states
- bottom sheet appearance
- quiz option selection
- CTA emphasis
- reel metadata transitions
- progress micro-interactions

---

## Core reusable components

All styling should be built around reusable UI primitives.

Required components:

- `AppText`
- `AppButton`
- `ScreenContainer`
- `AppCard`
- `SectionHeader`
- `Chip`
- `IconButton`
- `Loader`
- `EmptyState`
- `ErrorState`
- `ProgressBadge`
- `StatPill`
- `MediaFrame`

### Rules
- Prefer building with these primitives instead of ad hoc styling
- Keep primitives flexible but not overabstracted
- Primitives should carry visual consistency across screens

---

## Screen-level style direction

## Home screen

### Desired feel
The home screen should feel like a polished content destination.

### Should include
- strong greeting or top context block
- continue-learning card with high visibility
- visually distinct section rhythm
- horizontally scrollable subject chips or quick filters
- layered content cards
- premium CTA treatment
- progress snippets

### Home must avoid
- plain stacked lists with no hierarchy
- too much text density
- identical-looking sections
- flat white-box overload

### Home prompt for AI
“Style the Home screen like a premium mobile startup app for students. Use strong spacing rhythm, layered cards, a high-visibility continue-learning block, visually distinct sections, and polished chips/progress surfaces. Keep it educational but exciting.”

---

## Reel screen

### Desired feel
Immersive, focused, slightly cinematic.

### Should include
- strong media area or placeholder
- gradient or depth overlay where appropriate
- clean metadata stack
- floating or anchored action controls
- bookmark button
- quiz CTA
- subtle progress indicator
- readable caption area

### Reel must avoid
- cluttered overlays
- poor contrast on text
- too many floating controls
- visually noisy stickers/badges

### Reel prompt for AI
“Design the Reel screen to feel immersive and premium, like a modern short-video app adapted for learning. Use elegant overlays, readable metadata, floating actions, and a clean CTA stack. Keep it focused and high-contrast.”

---

## Topic explorer screen

### Desired feel
Structured, motivating, easy to scan.

### Should include
- chapter banner or heading block
- progress-aware topic cards
- reels and quiz entry points
- completion badges
- visual grouping

### Topic explorer must avoid
- dense list-only academic look
- weak differentiation between completed and pending topics
- too many tiny metadata rows

### Topic prompt for AI
“Style this topic explorer like a premium structured learning view. Make progress, completion, and actionability visually clear. Use cards, spacing, and hierarchy to make the curriculum feel approachable and motivating.”

---

## Quiz screen

### Desired feel
Clear, focused, rewarding.

### Should include
- strong question card
- clean answer option cards
- selected/correct/incorrect states
- feedback area
- next CTA
- result summary card

### Quiz must avoid
- tiny radio-button style options
- bland form-like layout
- low-contrast answer states

### Quiz prompt for AI
“Design the Quiz screen with strong focus and clarity. Use a premium question card, animated option states, bold feedback surfaces, and a polished progression feel. It should feel rewarding, not like a dull exam form.”

---

## Bookmarks screen

### Desired feel
Useful, clean, revision-friendly.

### Should include
- saved content cards
- clear labels for chapter/topic
- resume CTA
- clean empty state

### Bookmarks prompt for AI
“Style Bookmarks as a premium saved-learning space. It should feel organized, useful, and motivating for revision.”

---

## Progress screen

### Desired feel
Encouraging, data-light, meaningful.

### Should include
- completed vs in-progress sections
- small progress visuals
- achievement-style cards later
- motivating tone

### Progress prompt for AI
“Design the Progress screen to feel motivating and premium. Show progress clearly without making it look like a dense analytics dashboard.”

---

## Profile screen

### Desired feel
Simple, premium, light utility.

### Should include
- student context summary
- selected class/subject
- settings rows
- support/help placeholders

### Profile prompt for AI
“Style Profile with clean premium utility patterns. Keep it light, organized, and consistent with the rest of the design system.”

---

## Empty, loading, and error states

These states must feel designed, not forgotten.

### Empty states
- clean illustration placeholder area or icon treatment
- concise headline
- supportive body copy
- clear CTA

### Loading states
- skeletons for cards and feed sections
- no flashing jumpy placeholders
- preserve layout rhythm during load

### Error states
- friendly tone
- retry CTA
- avoid harsh technical language in UI

---

## NativeWind usage rules

NativeWind should be used cleanly.

### Do
- use utility classes for straightforward styling
- extract repeated combinations into components
- keep className readable
- maintain token consistency

### Do not
- create giant unreadable className strings
- hardcode random colors everywhere
- mix too many one-off styles inline
- let each screen invent its own visual system

### Rule of thumb
If styling is repeated more than a couple of times, move it into a reusable component or style helper.

---

## Copilot and AI IDE instruction block

Any AI assistant working on styling should follow this exactly:

1. Read this file before styling or restyling screens
2. Use the design system and reusable primitives first
3. Make screens feel premium, mobile-first, and consumer-grade
4. Keep the app Gen Z friendly but not childish
5. Avoid generic React Native demo-app styling
6. Avoid flat boring layouts
7. Use strong spacing rhythm and visual hierarchy
8. Use rounded surfaces and soft depth
9. Preserve readability and mobile ergonomics
10. Keep styles consistent across screens

---

## Strong master prompt for GitHub Copilot or any AI IDE

Use this when asking an AI to style a screen:

```text
Read UI_STYLE_GUIDE.md and FRONTEND_ARCHITECTURE.md first.

Refactor this screen to match the app’s premium mobile-first design language.

Requirements:
- Gen Z friendly, premium, polished visual style
- strong visual hierarchy
- modern typography
- layered cards and rounded surfaces
- tasteful depth and elevation
- clear section rhythm and spacing
- thumb-friendly interactions
- reusable UI primitives where appropriate
- NativeWind used cleanly and readably
- educational but exciting, not childish
- no generic tutorial-app styling
- no inconsistent one-off colors or spacing
- code must remain modular, scalable, and production-grade

Push the design quality hard while keeping the UI clean and coherent.
```

---

## 3-pass styling workflow for Copilot

When Copilot gives mediocre results, do this in sequence.

### Pass 1
“Improve the layout, hierarchy, spacing, and card structure to make this feel like a premium startup mobile app.”

### Pass 2
“Push the styling further. Add richer visual depth, stronger typography hierarchy, better CTAs, more polished surfaces, and more intentional spacing.”

### Pass 3
“Now refine this for coherence. Reduce clutter, align it to the design system, improve readability, and make it feel intentional and production-grade.”

---

## Final styling rule

This app should look like something students want to open daily.

That means the styling should be:

- premium
- smooth
- confident
- modern
- engaging
- clear
- structured
- reusable
- scalable

Build for long-term visual consistency, not one-screen beauty.
