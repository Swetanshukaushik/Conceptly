# Frontend Architecture Plan

## Document purpose

This document is the frontend architecture reference for the Conceptly mobile app. It is intended to reflect the actual `apps/mobile` implementation, route and state design, and API integration patterns currently used in the repo.

The frontend is built as an Expo React Native app using Expo Router and must remain API-driven, modular, and easy to evolve.

---

## Product context

The mobile frontend enables students to:
- onboard into the learning experience
- select class and subject context
- explore NCERT-aligned chapters and topics
- view short educational reels by topic
- take quick topic quizzes
- save bookmarks
- track progress

This app is designed to feel mobile-native, student-friendly, and easy to extend.

---

## Current repo placement

The frontend lives in:

```txt
apps/mobile
```

### Hard boundary rules
- consume backend only through API endpoints
- do not import backend internals
- keep frontend config and package manifest independent
- share only minimal contract types when helpful

---

## Current frontend stack

### Primary stack
- Expo
- React Native
- TypeScript
- Expo Router
- Zustand for local app state
- TanStack Query for remote data fetching and mutation
- NativeWind for styling

### Support and runtime
- `apps/mobile/src/app` contains Expo Router entry points and layouts
- `apps/mobile/src/services/api` holds backend client shape and optional mock fallbacks
- `apps/mobile/src/store/useAppStore.ts` stores onboarding and selection state
- `apps/mobile/src/constants/runtimeConfig.ts` toggles between mock and real backend behavior

---

## Current structure

```txt
apps/mobile/
  app/
    _layout.tsx
    index.tsx
    (app)/
      _layout.tsx
      feed.tsx
      explore.tsx
      bookmarks.tsx
      progress.tsx
      profile.tsx
      topic/
        [id].tsx
      reel/
        [id].tsx
      quiz/
        [id].tsx
    (onboarding)/
      _layout.tsx
      welcome.tsx
      class-select.tsx
      subject-select.tsx
      chapter-select.tsx

  src/
    app/
      providers/
    components/
      constants/
      features/
      services/
      store/
      theme/
      types/
      utils/
```

### Structural philosophy
- `app/` defines route structure and high-level layout
- `src/components/ui` holds reusable primitives
- `src/features` holds feature-specific screens and hooks
- `src/services/api` owns backend integration and data adapters
- `src/store` holds app-level Zustand state

---

## Current routing architecture

### Active route groups
- onboarding
- selection flows
- main tab shell
- topic detail
- reel detail
- quiz detail

### Actual route map

```txt
/
  -> redirects into onboarding or main app flow
/onboarding/welcome
/(onboarding)/class-select
/(onboarding)/subject-select
/(onboarding)/chapter-select
/(app)/feed
/(app)/explore
/(app)/bookmarks
/(app)/progress
/(app)/profile
/(app)/topic/[id]
/(app)/reel/[id]
/(app)/quiz/[id]
```

### Routing principles
- use Expo Router nested layouts
- keep route screens focused
- separate shell layouts from feature screens
- use route params for topic/reel/quiz IDs

---

## Current state management

### Zustand responsibilities
Zustand stores:
- onboarding completion state
- selected class
- selected subject
- local UI/session flags

### TanStack Query responsibilities
TanStack Query handles:
- curriculum data
- home feed data
- topic and reel content
- quiz payloads
- progress and bookmark API operations

### Data ownership rules
- client session/app state -> Zustand
- remote content and business data -> Query cache
- component-specific UI state -> local state

---

## Current data flow

### API integration layer
- `apps/mobile/src/services/api/educationApi.ts` centralizes backend routes and fetch logic
- `apps/mobile/src/services/api/mockEducationApi.ts` holds mock fallback responses
- `apps/mobile/src/constants/runtimeConfig.ts` toggles mock vs real backend

### UI data flow
- onboarding writes selection into `useAppStore`
- selected class/subject drive feed and curriculum queries
- feed and topic screens call backend via service methods
- progress/bookmarks mutations update backend and refresh cached query state

---

## Current feature screens

### Onboarding
- `welcome.tsx`
- `class-select.tsx`
- `subject-select.tsx`
- `chapter-select.tsx`

### Main tab shell
- `feed.tsx`
- `explore.tsx`
- `bookmarks.tsx`
- `progress.tsx`
- `profile.tsx`

### Content detail
- `topic/[id].tsx`
- `reel/[id].tsx`
- `quiz/[id].tsx`

---

## Current UX architecture

### Mobile-first intent
- design for small screens first
- use tab-based navigation for main flows
- keep screen content readable and tap-friendly

### Learning-first intent
- show progress and bookmarks clearly
- allow quick return to recent topics
- tie quizzes directly to topic content

### Developer-first intent
- keep components reusable and small
- separate data fetching from presentation
- prefer clear layout wrappers

---

## Current implementation status

### Implemented
- Expo Router-based route structure
- onboarding flow
- tabbed app shell
- feed/explore/bookmarks/progress/profile screens
- topic/reel/quiz detail screens
- backend API client layer
- Zustand store for selection state
- TanStack Query for remote data
- mock/real runtime config support

### Next work
- advanced reel player and media handling
- richer feed personalization
- offline persistence for progress/bookmarks
- analytics instrumentation
- profile settings and preferences

---

## Development commands

From `apps/mobile`:

```bash
npm install
npm start
```

For web preview:

```bash
npm run web
```

For native device:

```bash
npm run android
npm run ios
```

---

## Architecture rules

1. keep `app/` routes thin and delegate UI to feature modules
2. keep backend integration inside `src/services/api`
3. do not import backend internals into mobile code
4. avoid storing fetched content in Zustand
5. keep reusable UI primitives separate from feature screens
6. keep analytics calls abstracted behind a service
7. keep mock-to-real migration straightforward

---

## Repo-specific notes

- `apps/mobile/src/app/index.tsx` redirects based on onboarding and app state
- `apps/mobile/src/app/(app)/_layout.tsx` defines the tab shell layout
- `apps/mobile/src/app/(onboarding)/_layout.tsx` defines onboarding layout
- `apps/mobile/src/services/api/educationApi.ts` is the main backend API client
- `apps/mobile/src/store/useAppStore.ts` stores onboarding and selection state
